import type { PletopayResponse } from '../client';
import type { ListMeta } from '../types';

/**
 * One page of a list. Iterate it with `for await` to walk every page transparently, or call
 * `nextPage()` yourself. The API returns newest first and `meta.next_cursor` is null on the last page.
 *
 * A list started with `ending_before` is `backward`: it walks from that object towards newer ones.
 * Each page's `data` is still newest first, the next page is the one newer than this page's first
 * item, and iteration yields oldest to newest so the order is the same across pages.
 */
export class Page<T> implements AsyncIterable<T> {
  readonly data: T[];
  readonly meta: ListMeta;
  readonly response: PletopayResponse<T[]>;

  constructor(
    response: PletopayResponse<T[]>,
    private readonly fetchNext: (cursor: string) => Promise<Page<T>>,
    private readonly direction: 'forward' | 'backward' = 'forward',
  ) {
    this.response = response;
    this.data = response.data;
    this.meta = response.meta ?? { has_more: false, next_cursor: null, url: '' };
  }

  get hasMore(): boolean {
    return this.meta.has_more && this.nextCursor !== null;
  }

  /**
   * The cursor `nextPage()` continues from, or null on the last page: `meta.next_cursor` (pass it as
   * `starting_after`), or on a backward list the id of this page's first item (pass it as
   * `ending_before`; `meta.next_cursor` means nothing in that direction).
   */
  get nextCursor(): string | null {
    if (this.direction === 'forward') return this.meta.next_cursor;
    const newest = (this.data[0] as { id?: unknown } | undefined)?.id;
    return this.meta.has_more && typeof newest === 'string' ? newest : null;
  }

  /** The next page, or null on the last one. */
  nextPage(): Promise<Page<T> | null> {
    const cursor = this.nextCursor;
    if (!this.hasMore || cursor === null) return Promise.resolve(null);
    return this.fetchNext(cursor);
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

  /** Every item from this page on (oldest to newest on a backward list, newest to oldest otherwise). */
  async *[Symbol.asyncIterator](): AsyncGenerator<T, void, undefined> {
    for await (const page of this.pages()) {
      for (const item of this.direction === 'backward' ? page.data.toReversed() : page.data) yield item;
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
