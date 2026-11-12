import { describe, expect, it } from 'vitest';
import { LIVE_KEY, client, created, fetchMock, list, ok } from './helpers';

const API = 'http://api.test/api/v1';

describe('transferBatches', () => {
  it('creates, adds rows, validates and submits with the documented methods, paths and keys', async () => {
    const { fetch, calls } = fetchMock([
      created({ id: 'tb_1' }),
      ok({ id: 'tb_1' }),
      ok({ id: 'tb_1' }),
      ok({ id: 'tb_1' }),
    ]);
    const c = client(fetch);
    const row = { bank_code: '058', account_number: '0123456789', amount: 2_500_000 };
    await c.transferBatches.create({ name: 'Payroll', items: [row] }, { idempotencyKey: 'payroll-2026-11' });
    await c.transferBatches.addItems('tb_1', [row, row], { idempotencyKey: 'payroll-2026-11-chunk-2' });
    await c.transferBatches.validate('tb_1');
    await c.transferBatches.submit('tb_1', { idempotencyKey: 'payroll-2026-11-submit' });

    expect(calls.map((x) => `${x.method} ${x.url}`)).toEqual([
      `POST ${API}/transfer-batches`,
      `POST ${API}/transfer-batches/tb_1/items`,
      `POST ${API}/transfer-batches/tb_1/validate`,
      `POST ${API}/transfer-batches/tb_1/submit`,
    ]);
    expect(JSON.parse(calls[1]!.body!)).toEqual({ items: [row, row] });
    expect(calls.map((x) => x.headers['idempotency-key'])).toEqual([
      'payroll-2026-11',
      'payroll-2026-11-chunk-2',
      expect.any(String),
      'payroll-2026-11-submit',
    ]);
  });

  it('edits and removes a row by its id, and cancels', async () => {
    const { fetch, calls } = fetchMock([ok({ id: 'tbi_2' }), ok({ id: 'tb_1' }), ok({ id: 'tb_1' })]);
    const c = client(fetch);
    await c.transferBatches.updateItem('tb_1', 'tbi_2', { amount: 1_000_000 });
    await c.transferBatches.removeItem('tb_1', 'tbi_2');
    await c.transferBatches.cancel('tb_1');
    expect(calls.map((x) => `${x.method} ${x.url}`)).toEqual([
      `PATCH ${API}/transfer-batches/tb_1/items/tbi_2`,
      `DELETE ${API}/transfer-batches/tb_1/items/tbi_2`,
      `POST ${API}/transfer-batches/tb_1/cancel`,
    ]);
    expect(calls[1]!.headers['idempotency-key']).toBeUndefined();
    await expect(c.transferBatches.updateItem('tb_1', '', {})).rejects.toThrow(/itemId is required/);
  });

  it('pages through rows forwards with a status filter', async () => {
    const { fetch, calls } = fetchMock([
      list([{ id: 'tbi_1' }, { id: 'tbi_2' }], { has_more: true, next_cursor: 'tbi_2' }),
      list([{ id: 'tbi_3' }], { has_more: false, next_cursor: null }),
    ]);
    const rows = await client(fetch)
      .transferBatches.listItems('tb_1', { limit: 2, status: 'invalid' })
      .autoPagingToArray();
    expect(rows.map((r) => r.id)).toEqual(['tbi_1', 'tbi_2', 'tbi_3']);
    expect(calls[0]!.url).toBe(`${API}/transfer-batches/tb_1/items?limit=2&status=invalid`);
    expect(calls[1]!.url).toContain('starting_after=tbi_2');
  });
});

describe('beneficiaries', () => {
  it('saves, searches, renames and deletes', async () => {
    const { fetch, calls } = fetchMock([
      created({ id: 'ben_1' }),
      list([{ id: 'ben_1' }], { has_more: false, next_cursor: null }),
      ok({ id: 'ben_1' }),
      ok({ id: 'ben_1' }),
      ok({ id: 'ben_1', object: 'beneficiary', deleted: true }),
    ]);
    const c = client(fetch);
    await c.beneficiaries.create({ bank_code: '058', account_number: '0123456789', nickname: 'Rent' });
    await c.beneficiaries.list({ q: 'rent' });
    await c.beneficiaries.retrieve('ben_1');
    await c.beneficiaries.update('ben_1', { nickname: null });
    const deleted = await c.beneficiaries.delete('ben_1');
    expect(calls.map((x) => `${x.method} ${x.url}`)).toEqual([
      `POST ${API}/beneficiaries`,
      `GET ${API}/beneficiaries?q=rent`,
      `GET ${API}/beneficiaries/ben_1`,
      `PATCH ${API}/beneficiaries/ben_1`,
      `DELETE ${API}/beneficiaries/ben_1`,
    ]);
    expect(calls[0]!.headers['idempotency-key']).toBeDefined();
    expect(JSON.parse(calls[3]!.body!)).toEqual({ nickname: null });
    expect(deleted.deleted).toBe(true);
  });

  it('pays a saved beneficiary by id', async () => {
    const { fetch, calls } = fetchMock([created({ id: 'trf_1' })]);
    await client(fetch).transfers.create(
      { amount: 100_000, currency: 'NGN', reference: 'P-2', narration: 'Rent', beneficiary_id: 'ben_1' },
      { idempotencyKey: 'payout-P-2' },
    );
    expect(JSON.parse(calls[0]!.body!)).toMatchObject({ beneficiary_id: 'ben_1' });
    expect(JSON.parse(calls[0]!.body!)).not.toHaveProperty('beneficiary');
  });
});

describe('transfers.list and sandbox.testValues', () => {
  it('passes the search filter', async () => {
    const { fetch, calls } = fetchMock([list([], { has_more: false, next_cursor: null })]);
    await client(fetch).transfers.list({ q: 'PAYOUT-2026', status: 'succeeded' });
    expect(calls[0]!.url).toBe(`${API}/transfers?q=PAYOUT-2026&status=succeeded`);
  });

  it('reads the test values, and refuses them with a live key before any request', async () => {
    const { fetch, calls } = fetchMock([
      ok({ object: 'sandbox_test_values', not_found_prefix: '000', recipient_accounts: [] }),
    ]);
    expect((await client(fetch).sandbox.testValues()).not_found_prefix).toBe('000');
    expect(calls[0]!.url).toBe(`${API}/sandbox/test-values`);
    await expect(client(fetch, { secretKey: LIVE_KEY }).sandbox.testValues()).rejects.toThrow(
      /only available in test mode/,
    );
    expect(calls).toHaveLength(1);
  });
});
