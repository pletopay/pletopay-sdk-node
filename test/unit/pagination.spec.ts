import { describe, expect, it } from 'vitest';
import { lastResponseOf } from '../../src/client';
import { Page } from '../../src/core/pagination';
import { client, fetchMock, list } from './helpers';

describe('pagination', () => {
  it('walks every page with for await and passes next_cursor as starting_after', async () => {
    const { fetch, calls } = fetchMock([
      list([{ id: 'pay_3' }, { id: 'pay_2' }], { has_more: true, next_cursor: 'pay_2' }),
      list([{ id: 'pay_1' }], { has_more: false, next_cursor: null }),
    ]);
    const ids: string[] = [];
    for await (const payment of client(fetch).payments.list({ limit: 2, status: 'succeeded', ending_before: 'pay_9' }))
      ids.push(payment.id);
    expect(ids).toEqual(['pay_3', 'pay_2', 'pay_1']);
    expect(decodeURIComponent(calls[0]!.url)).toBe(
      'http://api.test/api/v1/payments?limit=2&status=succeeded&ending_before=pay_9',
    );
    expect(decodeURIComponent(calls[1]!.url)).toBe(
      'http://api.test/api/v1/payments?limit=2&status=succeeded&starting_after=pay_2',
    );
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
