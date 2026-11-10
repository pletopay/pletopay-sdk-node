import { describe, expect, it } from 'vitest';
import { lastResponseOf } from '../../src/client';
import { Page } from '../../src/core/pagination';
import { client, fetchMock, list } from './helpers';

/**
 * A `fetch` double with the API's list semantics over pay_1 (oldest) … pay_<count> (newest):
 * `starting_after` returns the older objects, `ending_before` the newer ones nearest the cursor,
 * both newest first within the page, and `meta.next_cursor` is the id of the page's last object
 * while there are more. `backwardCursor: false` answers `ending_before` pages with a null cursor.
 */
function listApi(count: number, options: { backwardCursor?: boolean } = {}) {
  const queries: URLSearchParams[] = [];
  const fetch = (async (input: string | URL | Request) => {
    const query = new URL(input instanceof Request ? input.url : input).searchParams;
    queries.push(query);
    const limit = Number(query.get('limit') ?? 10);
    const number = (name: string): number | undefined => {
      const cursor = query.get(name);
      return cursor === null ? undefined : Number(cursor.slice('pay_'.length));
    };
    const after = number('starting_after');
    const before = number('ending_before');
    const all = Array.from({ length: count }, (_, i) => i + 1);
    const rows =
      before === undefined
        ? all.filter((n) => after === undefined || n < after).reverse()
        : all.filter((n) => n > before);
    const hasMore = rows.length > limit;
    const page = rows.slice(0, limit);
    if (before !== undefined) page.reverse();
    const data = page.map((n) => ({ id: `pay_${n}`, object: 'payment' }));
    const withCursor = hasMore && (before === undefined || options.backwardCursor !== false);
    return list(data, { has_more: hasMore, next_cursor: withCursor ? data.at(-1)!.id : null });
  }) as typeof globalThis.fetch;
  return { fetch, queries };
}

const range = (from: number, to: number): string[] =>
  Array.from({ length: Math.abs(to - from) + 1 }, (_, i) => `pay_${from + (to > from ? i : -i)}`);

describe('pagination', () => {
  it('walks every page with for await and passes next_cursor as starting_after', async () => {
    const { fetch, calls } = fetchMock([
      list([{ id: 'pay_3' }, { id: 'pay_2' }], { has_more: true, next_cursor: 'pay_2' }),
      list([{ id: 'pay_1' }], { has_more: false, next_cursor: null }),
    ]);
    const ids: string[] = [];
    for await (const payment of client(fetch).payments.list({ limit: 2, status: 'succeeded' })) ids.push(payment.id);
    expect(ids).toEqual(['pay_3', 'pay_2', 'pay_1']);
    expect(decodeURIComponent(calls[0]!.url)).toBe('http://api.test/api/v1/payments?limit=2&status=succeeded');
    expect(decodeURIComponent(calls[1]!.url)).toBe(
      'http://api.test/api/v1/payments?limit=2&status=succeeded&starting_after=pay_2',
    );
  });

  it('walks a list started with ending_before towards newer items, oldest first, each exactly once', async () => {
    const { fetch, queries } = listApi(20);
    const ids: string[] = [];
    for await (const payment of client(fetch).payments.list({ limit: 3, ending_before: 'pay_9' })) ids.push(payment.id);
    expect(ids).toEqual(range(10, 20));
    expect(queries.map((q) => q.get('ending_before'))).toEqual(['pay_9', 'pay_12', 'pay_15', 'pay_18']);
    expect(queries.some((q) => q.has('starting_after'))).toBe(false);
  });

  it('keeps page.data newest first on a backward list and continues from its first item', async () => {
    const { fetch } = listApi(20);
    const first = await client(fetch).payments.list({ limit: 3, ending_before: 'pay_9' });
    expect(first.data.map((p) => p.id)).toEqual(['pay_12', 'pay_11', 'pay_10']);
    expect(first.hasMore).toBe(true);
    expect(first.nextCursor).toBe('pay_12');
    const second = await first.nextPage();
    expect(second?.data.map((p) => p.id)).toEqual(['pay_15', 'pay_14', 'pay_13']);
    const pages: string[][] = [];
    for await (const page of first.pages()) pages.push(page.data.map((p) => p.id));
    expect(pages).toEqual([range(12, 10), range(15, 13), range(18, 16), range(20, 19)]);
    const last = await (await second!.nextPage())!.nextPage();
    expect(last?.hasMore).toBe(false);
    expect(last?.nextCursor).toBeNull();
    expect(await last?.nextPage()).toBeNull();
    expect(await first.autoPagingToArray({ limit: 4 })).toEqual(range(10, 13).map((id) => ({ id, object: 'payment' })));
  });

  it('does not need meta.next_cursor on a backward list', async () => {
    const { fetch } = listApi(20, { backwardCursor: false });
    const items = await client(fetch).payments.list({ limit: 3, ending_before: 'pay_9' }).autoPagingToArray();
    expect(items.map((p) => p.id)).toEqual(range(10, 20));
  });

  it('pages forward against the same API exactly as before', async () => {
    const { fetch, queries } = listApi(20);
    const all = await client(fetch).payments.list({ limit: 6 }).autoPagingToArray();
    expect(all.map((p) => p.id)).toEqual(range(20, 1));
    const older = await client(fetch).payments.list({ limit: 3, starting_after: 'pay_9' }).autoPagingToArray();
    expect(older.map((p) => p.id)).toEqual(range(8, 1));
    expect(queries.some((q) => q.has('ending_before'))).toBe(false);
  });

  it('exposes the first page with meta, nextPage() and the response', async () => {
    const { fetch } = fetchMock([
      list([{ id: 'a' }], { has_more: true, next_cursor: 'a' }),
      list([{ id: 'b' }], { has_more: false, next_cursor: null }),
    ]);
    const page = await client(fetch).customers.list();
    expect(page).toBeInstanceOf(Page);
    expect(page.data).toEqual([{ id: 'a' }]);
    expect(page.hasMore).toBe(true);
    expect(page.nextCursor).toBe('a');
    expect(page.response.requestId).toBe('req_test');
    expect(lastResponseOf(page.data)?.message).toBe('Listed');
    const next = await page.nextPage();
    expect(next?.data).toEqual([{ id: 'b' }]);
    expect(next?.hasMore).toBe(false);
    expect(await next?.nextPage()).toBeNull();
  });

  it('pages() yields each page and autoPagingToArray stops at the limit', async () => {
    const { fetch, calls } = fetchMock([
      list([1, 2], { has_more: true, next_cursor: 'c1' }),
      list([3, 4], { has_more: true, next_cursor: 'c2' }),
      list([5], { has_more: false, next_cursor: null }),
    ]);
    const c = client(fetch);
    const first = await c.transactions.list();
    const sizes: number[] = [];
    for await (const page of first.pages()) sizes.push(page.data.length);
    expect(sizes).toEqual([2, 2, 1]);

    const { fetch: fetch2, calls: calls2 } = fetchMock([
      list([1, 2], { has_more: true, next_cursor: 'c1' }),
      list([3, 4], { has_more: true, next_cursor: 'c2' }),
    ]);
    const items = await client(fetch2).transactions.list().autoPagingToArray({ limit: 3 });
    expect(items).toEqual([1, 2, 3]);
    expect(calls2).toHaveLength(2);
    expect(calls).toHaveLength(3);
  });

  it('treats a missing meta as a single page (banks, settlement items)', async () => {
    const { fetch } = fetchMock([
      new Response(JSON.stringify({ status: true, message: 'ok', data: [{ code: '058' }] }), { status: 200 }),
    ]);
    const page = await client(fetch).banks.list();
    expect(page.data).toEqual([{ code: '058' }]);
    expect(page.hasMore).toBe(false);
    expect(await page.autoPagingToArray()).toEqual([{ code: '058' }]);
  });
});
