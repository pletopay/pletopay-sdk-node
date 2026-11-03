import { afterEach, describe, expect, it, vi } from 'vitest';
import { Pletopay, lastResponseOf } from '../../src/client';
import { PletopayApiError, PletopayError } from '../../src/errors';
import { IDEMPOTENCY_KEY_PATTERN } from '../../src/core/idempotency';
import { LIVE_KEY, TEST_KEY, apiError, client, created, fetchMock, json, ok } from './helpers';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('constructor', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('requires a secret key', () => {
    vi.stubEnv('PLETOPAY_SECRET_KEY', '');
    expect(() => new Pletopay({})).toThrow(/No secret key/);
  });

  it('reads the key and base URL from the environment', () => {
    vi.stubEnv('PLETOPAY_SECRET_KEY', LIVE_KEY);
    vi.stubEnv('PLETOPAY_API_URL', 'https://api.example.test/');
    const c = new Pletopay();
    expect(c.mode).toBe('live');
    expect(c.baseUrl).toBe('https://api.example.test');
  });

  it('refuses publishable keys with a pointer to the secret key', () => {
    expect(() => new Pletopay({ secretKey: 'pk_test_abc_def' })).toThrow(/publishable key/);
  });

  it('refuses keys that are not sk_test_ or sk_live_', () => {
    expect(() => new Pletopay({ secretKey: 'whsec_abc' })).toThrow(/sk_test_/);
  });

  it('derives the mode from the key prefix and defaults the base URL', () => {
    expect(new Pletopay({ secretKey: TEST_KEY }).mode).toBe('test');
    expect(new Pletopay({ secretKey: TEST_KEY }).baseUrl).toBe('https://api.pletopay.com');
    expect(Pletopay.API_VERSION).toBe('2026-09-25');
  });

  it('validates numeric options', () => {
    expect(() => new Pletopay({ secretKey: TEST_KEY, maxRetries: -1 })).toThrow(/maxRetries/);
    expect(() => new Pletopay({ secretKey: TEST_KEY, timeoutMs: 0 })).toThrow(/timeoutMs/);
  });
});

describe('request building', () => {
  it('never follows redirects (a redirect would re-send the secret key elsewhere)', async () => {
    const { fetch, calls } = fetchMock([ok({ object: 'balance' }), created({ object: 'customer' })]);
    const c = client(fetch);
    await c.balance.retrieve();
    await c.customers.create({ email: 'a@example.com' });
    expect(calls.map((call) => call.redirect)).toEqual(['error', 'error']);
  });

  it('sends the standard headers and the pinned API version', async () => {
    const { fetch, calls } = fetchMock([ok({ object: 'balance' })]);
    await client(fetch).balance.retrieve();
    const call = calls[0]!;
    expect(call.url).toBe('http://api.test/api/v1/balance');
    expect(call.method).toBe('GET');
    expect(call.headers.authorization).toBe(`Bearer ${TEST_KEY}`);
    expect(call.headers.accept).toBe('application/json');
    expect(call.headers['pletopay-version']).toBe('2026-09-25');
    expect(call.headers['user-agent']).toMatch(/^pletopay-node\/\d+\.\d+\.\d+ node\/\d+/);
    expect(call.headers['idempotency-key']).toBeUndefined();
    expect(call.headers['content-type']).toBeUndefined();
    expect(call.body).toBeUndefined();
  });

  it('can omit or override the API version, and adds app info and a correlation id', async () => {
    const { fetch, calls } = fetchMock([ok({}), ok({}), ok({})]);
    await client(fetch, {
      apiVersion: null,
      appInfo: { name: 'my-shop', version: '2.1', url: 'https://shop.test' },
    }).balance.retrieve();
    expect(calls[0]!.headers['pletopay-version']).toBeUndefined();
    expect(calls[0]!.headers['user-agent']).toContain(' my-shop/2.1 (https://shop.test)');
    await client(fetch, { apiVersion: '2026-09-24', correlationId: () => 'corr-1' }).balance.retrieve();
    expect(calls[1]!.headers['pletopay-version']).toBe('2026-09-24');
    expect(calls[1]!.headers['x-correlation-id']).toBe('corr-1');
    await client(fetch).balance.retrieve({
      apiVersion: '2026-09-24',
      correlationId: 'corr-2',
      headers: { 'x-extra': '1', authorization: 'Bearer nope' },
    });
    expect(calls[2]!.headers['pletopay-version']).toBe('2026-09-24');
    expect(calls[2]!.headers['x-correlation-id']).toBe('corr-2');
    expect(calls[2]!.headers['x-extra']).toBe('1');
    expect(calls[2]!.headers.authorization).toBe(`Bearer ${TEST_KEY}`);
  });

  it('serialises JSON bodies and generates an Idempotency-Key on idempotent operations', async () => {
    const { fetch, calls } = fetchMock([created({ id: 'pay_1' })]);
    await client(fetch).payments.create({ amount: 5000, currency: 'NGN', reference: 'ORDER-1' });
    const call = calls[0]!;
    expect(call.method).toBe('POST');
    expect(call.headers['content-type']).toBe('application/json');
    expect(JSON.parse(call.body!)).toEqual({ amount: 5000, currency: 'NGN', reference: 'ORDER-1' });
    expect(call.headers['idempotency-key']).toMatch(UUID);
    expect(call.headers['idempotency-key']).toMatch(IDEMPOTENCY_KEY_PATTERN);
  });

  it('uses the caller idempotency key and validates it locally', async () => {
    const { fetch, calls } = fetchMock([created({ id: 'trf_1' })]);
    const c = client(fetch);
    await c.transfers.create(
      {
        amount: 100000,
        currency: 'NGN',
        reference: 'P-1',
        narration: 'x',
        beneficiary: { bank_code: '058', account_number: '0123456789' },
      },
      { idempotencyKey: 'payout-P-1' },
    );
    expect(calls[0]!.headers['idempotency-key']).toBe('payout-P-1');
    await expect(c.transfers.create({} as never, { idempotencyKey: 'has space' })).rejects.toThrow(/printable ASCII/);
    await expect(c.transfers.create({} as never, { idempotencyKey: 'x'.repeat(256) })).rejects.toThrow(PletopayError);
    expect(calls).toHaveLength(1);
  });

  it('never sends Idempotency-Key on operations that do not accept it', async () => {
    const { fetch, calls } = fetchMock([ok({ account_name: 'A' })]);
    await client(fetch).transfers.resolveAccount({ bank_code: '058', account_number: '0123456789' });
    expect(calls[0]!.headers['idempotency-key']).toBeUndefined();
  });

  it('encodes path parameters and refuses empty ids before any request', async () => {
    const { fetch, calls } = fetchMock([ok({ id: 'pay_1' })]);
    const c = client(fetch);
    await c.payments.retrieveByReference('ORDER/1 2');
    expect(calls[0]!.url).toBe('http://api.test/api/v1/payments/reference/ORDER%2F1%202');
    await expect(c.payments.retrieve('')).rejects.toThrow(/id is required/);
    await expect(c.payments.retrieve(undefined as unknown as string)).rejects.toThrow(/id is required/);
    expect(calls).toHaveLength(1);
  });

  it('encodes query filters with brackets, arrays and dates, and splits expand off the payment body', async () => {
    const { fetch, calls } = fetchMock([ok([]), created({ id: 'pay_1' })]);
    const c = client(fetch);
    await c.payments.list({
      limit: 5,
      status: 'succeeded',
      created: { gte: new Date('2026-09-01T00:00:00Z') },
      amount: { lte: 100 },
      expand: ['customer'],
      q: undefined,
    });
    expect(decodeURIComponent(calls[0]!.url)).toBe(
      'http://api.test/api/v1/payments?limit=5&status=succeeded&created[gte]=2026-09-01T00:00:00.000Z&amount[lte]=100&expand[]=customer',
    );
    await c.payments.create({ amount: 1, currency: 'NGN', reference: 'R', expand: ['customer'] });
    expect(decodeURIComponent(calls[1]!.url)).toBe('http://api.test/api/v1/payments?expand[]=customer');
    expect(JSON.parse(calls[1]!.body!)).toEqual({ amount: 1, currency: 'NGN', reference: 'R' });
  });
});

describe('responses', () => {
  it('unwraps the envelope and keeps the response metadata reachable', async () => {
    const { fetch } = fetchMock([
      ok({ id: 'pay_1', object: 'payment' }, 'Payment retrieved', {
        'ratelimit-limit': '200',
        'ratelimit-remaining': '199',
        'ratelimit-reset': '7',
        'idempotent-replayed': 'true',
      }),
    ]);
    const payment = await client(fetch).payments.retrieve('pay_1');
    expect(payment).toEqual({ id: 'pay_1', object: 'payment' });
    expect(JSON.stringify(payment)).toBe('{"id":"pay_1","object":"payment"}');
    const response = lastResponseOf(payment)!;
    expect(response.message).toBe('Payment retrieved');
    expect(response.requestId).toBe('req_test');
    expect(response.apiVersion).toBe('2026-09-25');
    expect(response.status).toBe(200);
    expect(response.idempotentReplayed).toBe(true);
    expect(response.rateLimit).toEqual({ limit: 200, remaining: 199, reset: 7 });
    expect(lastResponseOf(null)).toBeUndefined();
    expect(lastResponseOf('x')).toBeUndefined();
  });

  it('exposes the raw request() with the full envelope', async () => {
    const { fetch, calls } = fetchMock([
      ok({ ok: true }, 'Done', { deprecation: 'true', sunset: 'Sat, 01 Jan 2028 00:00:00 GMT' }),
    ]);
    const res = await client(fetch).request<{ ok: boolean }>('POST', '/api/v1/anything', {
      body: { a: 1 },
      query: { b: [1, 2] },
      idempotency: 'optional',
      options: { idempotencyKey: 'k1' },
    });
    expect(res.data).toEqual({ ok: true });
    expect(res.message).toBe('Done');
    expect(res.idempotencyKey).toBe('k1');
    expect(res.deprecation).toBe('true');
    expect(res.sunset).toContain('2028');
    expect(decodeURIComponent(calls[0]!.url)).toBe('http://api.test/api/v1/anything?b[]=1&b[]=2');
  });

  it('returns text for CSV downloads', async () => {
    const { fetch, calls } = fetchMock([
      new Response('id,amount\npay_1,100\n', { status: 200, headers: { 'content-type': 'text/csv' } }),
    ]);
    const csv = await client(fetch).reports.download('rpt_1');
    expect(csv).toBe('id,amount\npay_1,100\n');
    expect(calls[0]!.headers.accept).toBe('text/csv');
  });

  it('rejects a 2xx body that is not the envelope', async () => {
    const { fetch } = fetchMock([new Response('<html>proxy</html>', { status: 200 })]);
    await expect(client(fetch).balance.retrieve()).rejects.toThrow(/unexpected response body/);
  });

  it('refuses test-mode-only operations with a live key before any request', async () => {
    const { fetch, calls } = fetchMock([]);
    await expect(
      client(fetch, { secretKey: LIVE_KEY }).sandbox.simulateTransfer({ account_number: '1', amount: 1 }),
    ).rejects.toThrow(/only available in test mode/);
    expect(calls).toHaveLength(0);
  });

  it('throws typed errors for error envelopes', async () => {
    const { fetch } = fetchMock([
      apiError(400, 'invalid_request', 'parameter_invalid', { param: 'amount', message: 'amount must be an integer' }),
    ]);
    const error = await client(fetch)
      .balance.retrieve()
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PletopayApiError);
    const api = error as PletopayApiError;
    expect(api.status).toBe(400);
    expect(api.code).toBe('parameter_invalid');
    expect(api.type).toBe('invalid_request');
    expect(api.param).toBe('amount');
    expect(api.requestId).toBe('req_err');
    expect(api.message).toBe('amount must be an integer (request_id: req_err)');
  });

  it('wraps non-JSON error bodies from proxies', async () => {
    const { fetch } = fetchMock([new Response('Bad gateway', { status: 502 })]);
    const error = (await client(fetch)
      .balance.retrieve()
      .catch((e: unknown) => e)) as PletopayApiError;
    expect(error.name).toBe('PletopayServerError');
    expect(error.status).toBe(502);
    expect(error.code).toBeUndefined();
    expect(error.body).toBe('Bad gateway');
    expect(error.message).toBe('Request failed with HTTP 502');
  });

  it('calls the request and response hooks with redacted headers', async () => {
    const onRequest = vi.fn();
    const onResponse = vi.fn();
    const { fetch } = fetchMock([json(200, { status: true, message: 'x', data: null })]);
    await client(fetch, { hooks: { onRequest, onResponse } }).balance.retrieve();
    expect(onRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        attempt: 0,
        headers: expect.objectContaining({ authorization: 'Bearer sk_***' }) as Record<string, string>,
      }),
    );
    expect(onResponse).toHaveBeenCalledWith(expect.objectContaining({ status: 200, requestId: 'req_test' }));
  });
});
