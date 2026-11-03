import type { PletopayResponse } from '../client';
import type { ListMeta } from '../types';

/**
 * One page of a list. Iterate it with `for await` to walk every page transparently, or call
 * `nextPage()` yourself. The API returns newest first and `meta.next_cursor` is null on the last page.
 */
export class Page<T> implements AsyncIterable<T> {
  readonly data: T[];
  readonly meta: ListMeta;
  readonly response: PletopayResponse<T[]>;

  constructor(
    response: PletopayResponse<T[]>,
    private readonly fetchNext: (cursor: string) => Promise<Page<T>>,
  ) {
    this.response = response;
    this.data = response.data;
    this.meta = response.meta ?? { has_more: false, next_cursor: null, url: '' };
  }

  get hasMore(): boolean {
    return this.meta.has_more && this.meta.next_cursor !== null;
  }

  get nextCursor(): string | null {
    return this.meta.next_cursor;
  }

  /** The next page, or null on the last one. */
  nextPage(): Promise<Page<T> | null> {
    if (!this.hasMore || this.meta.next_cursor === null) return Promise.resolve(null);
    return this.fetchNext(this.meta.next_cursor);
  }

  /** Every page from this one on. */
  async *pages(): AsyncGenerator<Page<T>, void, undefined> {
    yield this;
    let page = await this.nextPage();
    while (page) {
      yield page;
      page = await page.nextPage();
    }
  }

  /** Every item from this page on. */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, undefined> {
    for await (const page of this.pages()) {
      for (const item of page.data) yield item;
    }
  }

  /** Collects items across pages, up to `limit` (there is no default limit: pass one for large lists). */
  async autoPagingToArray(options: { limit?: number } = {}): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
      if (options.limit !== undefined && items.length >= options.limit) break;
    }
    return items;
  }
}

/**
 * What list methods return: a promise of the first page that is itself async-iterable over every
 * item, so `for await (const payment of pletopay.payments.list())` just works.
 */
export interface PagePromise<T> extends Promise<Page<T>>, AsyncIterable<T> {
  autoPagingToArray(options?: { limit?: number }): Promise<T[]>;
}

export function toPagePromise<T>(promise: Promise<Page<T>>): PagePromise<T> {
  const result = promise as PagePromise<T>;
  result[Symbol.asyncIterator] = async function* () {
    const page = await promise;
    yield* page;
  };
  result.autoPagingToArray = async (options) => (await promise).autoPagingToArray(options);
  return result;
}
