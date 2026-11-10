import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { lastResponseOf } from '../../src/client';
import {
  PletopayApiError,
  PletopayConnectionError,
  PletopayIdempotencyError,
  PletopayInvalidRequestError,
  PletopayRateLimitError,
  PletopayServerError,
  PletopayTimeoutError,
} from '../../src/errors';
import {
  IN_PROGRESS_POLL_MS,
  IN_PROGRESS_WAIT_MS,
  MONEY_OUT_TIMEOUT_MS,
  inProgressDelayMs,
  isRetryableStatus,
  retryDelayMs,
} from '../../src/core/retry';
import { OPERATIONS } from '../../src/operations';
import { apiError, client, created, fetchMock, json, ok } from './helpers';

describe('retry policy', () => {
  it('retries 429, 500, 502, 503 and 409 in-progress only', () => {
    expect(isRetryableStatus(429, 'rate_limited')).toBe(true);
    expect(isRetryableStatus(500, undefined)).toBe(true);
    expect(isRetryableStatus(502, undefined)).toBe(true);
    expect(isRetryableStatus(503, 'service_unavailable')).toBe(true);
    expect(isRetryableStatus(409, 'idempotency_request_in_progress')).toBe(true);
    expect(isRetryableStatus(409, 'duplicate_reference')).toBe(false);
    expect(isRetryableStatus(422, 'idempotency_key_reused')).toBe(false);
    expect(isRetryableStatus(400, 'parameter_invalid')).toBe(false);
    expect(isRetryableStatus(504, undefined)).toBe(false);
  });

  it('backs off exponentially with jitter, capped at 8 s, and honours Retry-After', () => {
    expect(retryDelayMs(0, { random: () => 0 })).toBe(250);
    expect(retryDelayMs(0, { random: () => 1 })).toBe(500);
    expect(retryDelayMs(1, { random: () => 1 })).toBe(1000);
    expect(retryDelayMs(10, { random: () => 1 })).toBe(8000);
    expect(retryDelayMs(0, { retryAfterMs: 2500 })).toBe(2500);
    expect(retryDelayMs(0, { retryAfterMs: 120000 })).toBe(60000);
  });

  it('asks again every 2 s while a request is in progress, until 90 s after the call started', () => {
    expect(IN_PROGRESS_POLL_MS).toBe(2000);
    expect(IN_PROGRESS_WAIT_MS).toBe(90000);
    expect(inProgressDelayMs(1000, { now: 31000 })).toBe(2000);
    expect(inProgressDelayMs(1000, { now: 31000, retryAfterMs: 5000 })).toBe(5000);
    expect(inProgressDelayMs(1000, { now: 31000, retryAfterMs: 0 })).toBe(2000);
    expect(inProgressDelayMs(1000, { now: 90500 })).toBe(500);
    expect(inProgressDelayMs(1000, { now: 90500, retryAfterMs: 5000 })).toBe(500);
    expect(inProgressDelayMs(1000, { now: 91000 })).toBeUndefined();
  });
});

describe('automatic retries', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  async function settle(promise: Promise<unknown>): Promise<unknown> {
    const guarded = promise.catch((e: unknown) => e);
    await vi.runAllTimersAsync();
    return guarded;
  }

  it('retries GET on 5xx and succeeds', async () => {
    const { fetch, calls } = fetchMock([
      apiError(503, 'api_error', 'service_unavailable'),
      apiError(500, 'api_error', 'internal_error'),
      ok({ x: 1 }),
    ]);
    const result = await settle(client(fetch, { maxRetries: 2 }).balance.retrieve());
    expect(result).toEqual({ x: 1 });
    expect(calls).toHaveLength(3);
  });

  it('gives up after maxRetries with the last error', async () => {
    const { fetch, calls } = fetchMock([
      apiError(500, 'api_error', 'internal_error'),
      apiError(500, 'api_error', 'internal_error'),
    ]);
    const error = await settle(client(fetch, { maxRetries: 1 }).balance.retrieve());
    expect(error).toBeInstanceOf(PletopayServerError);
    expect(calls).toHaveLength(2);
  });

  it('retries a POST that carries an Idempotency-Key, reusing the same key', async () => {
    const { fetch, calls } = fetchMock([apiError(503, 'api_error', 'service_unavailable'), created({ id: 'pay_1' })]);
    const result = await settle(
      client(fetch, { maxRetries: 2 }).payments.create({ amount: 1, currency: 'NGN', reference: 'r' }),
    );
    expect(result).toEqual({ id: 'pay_1' });
    expect(calls).toHaveLength(2);
    expect(calls[0]!.headers['idempotency-key']).toBe(calls[1]!.headers['idempotency-key']);
  });

  it('does not retry a POST without an Idempotency-Key', async () => {
    const { fetch, calls } = fetchMock([apiError(503, 'api_error', 'service_unavailable')]);
    const error = await settle(
      client(fetch, { maxRetries: 2 }).transfers.resolveAccount({ bank_code: '058', account_number: '0123456789' }),
    );
    expect(error).toBeInstanceOf(PletopayServerError);
    expect(calls).toHaveLength(1);
  });

  it('honours Retry-After on 429 and reports the delay to onRetry', async () => {
    const onRetry = vi.fn();
    const { fetch, calls } = fetchMock([
      apiError(429, 'rate_limit_error', 'rate_limited', { headers: { 'retry-after': '2' } }),
      ok({}),
    ]);
    const promise = client(fetch, { maxRetries: 1, hooks: { onRetry } }).balance.retrieve();
    await vi.advanceTimersByTimeAsync(1999);
    expect(calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toEqual({});
    expect(calls).toHaveLength(2);
    expect(onRetry).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'status', status: 429, code: 'rate_limited', delayMs: 2000 }),
    );
  });

  it('surfaces the 429 when retries are exhausted', async () => {
    const { fetch } = fetchMock([
      apiError(429, 'rate_limit_error', 'rate_limited', { headers: { 'retry-after': '1' } }),
    ]);
    const error = await settle(client(fetch, { maxRetries: 0 }).balance.retrieve());
    expect(error).toBeInstanceOf(PletopayRateLimitError);
    expect((error as PletopayRateLimitError).retryAfter).toBe(1);
  });

  it('retries 409 idempotency_request_in_progress but not other conflicts', async () => {
    const { fetch, calls } = fetchMock([
      apiError(409, 'idempotency_error', 'idempotency_request_in_progress'),
      created({ id: 'trf_1' }),
    ]);
    const result = await settle(
      client(fetch, { maxRetries: 1 }).transfers.create({} as never, { idempotencyKey: 'k' }),
    );
    expect(result).toEqual({ id: 'trf_1' });
    expect(calls).toHaveLength(2);

    const second = fetchMock([apiError(409, 'conflict', 'duplicate_reference')]);
    const error = await settle(
      client(second.fetch, { maxRetries: 1 }).transfers.create({} as never, { idempotencyKey: 'k' }),
    );
    expect(error).toMatchObject({ code: 'duplicate_reference' });
    expect(second.calls).toHaveLength(1);
  });

  it('retries connection errors and wraps the final one', async () => {
    const { fetch, calls } = fetchMock([new TypeError('fetch failed'), new TypeError('fetch failed')]);
    const error = await settle(client(fetch, { maxRetries: 1 }).balance.retrieve());
    expect(error).toBeInstanceOf(PletopayConnectionError);
    expect((error as Error).message).toContain('fetch failed');
    expect((error as Error).cause).toBeInstanceOf(TypeError);
    expect(calls).toHaveLength(2);
  });

  it('per-call maxRetries overrides the client default', async () => {
    const { fetch, calls } = fetchMock([apiError(500, 'api_error', 'internal_error')]);
    const error = await settle(client(fetch, { maxRetries: 3 }).balance.retrieve({ maxRetries: 0 }));
    expect(error).toBeInstanceOf(PletopayServerError);
    expect(calls).toHaveLength(1);
  });
});

const TRANSFER = { id: 'trf_1', object: 'transfer', status: 'succeeded' };

/**
 * A `fetch` double with the API's idempotency behaviour on a slow money-out: the first request with
 * a key runs for `runsForMs`, requests with the same key meanwhile get
 * `409 idempotency_request_in_progress`, and once it has finished they get its stored response
 * with `Idempotent-Replayed: true`. The API stores it even when the first caller has gone away.
 */
function slowApi(runsForMs: number, inProgressHeaders: Record<string, string> = {}) {
  const startedAt = Date.now();
  const finishesAt = new Map<string, number>();
  const calls: { at: number; key: string }[] = [];
  const fetch = (async (_input: unknown, init?: RequestInit) => {
    const key = new Headers(init?.headers).get('idempotency-key') ?? '';
    calls.push({ at: Date.now() - startedAt, key });
    const done = finishesAt.get(key);
    if (done === undefined) {
      finishesAt.set(key, Date.now() + runsForMs);
      return new Promise<Response>((resolve, reject) => {
        const timer = setTimeout(() => resolve(created(TRANSFER)), runsForMs);
        init?.signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(init.signal?.reason as Error);
        });
      });
    }
    if (Date.now() < done) {
      return apiError(409, 'idempotency_error', 'idempotency_request_in_progress', { headers: inProgressHeaders });
    }
    return json(201, { status: true, message: 'Created', data: TRANSFER }, { 'idempotent-replayed': 'true' });
  }) as typeof globalThis.fetch;
  return { fetch, calls };
}

describe('a money-out call the API is still processing', () => {
  let timeout: MockInstance<typeof AbortSignal.timeout>;

  beforeEach(() => {
    vi.useFakeTimers();
    // `AbortSignal.timeout` runs on a clock that fake timers do not move: rebuild it on setTimeout.
    timeout = vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms) => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException('The operation timed out', 'TimeoutError')), ms);
      return controller.signal;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  async function settle(promise: Promise<unknown>): Promise<unknown> {
    const guarded = promise.catch((e: unknown) => e);
    await vi.runAllTimersAsync();
    return guarded;
  }

  it('gives transfers and refunds 90 s by default, and lets an explicit timeout win', async () => {
    expect(MONEY_OUT_TIMEOUT_MS).toBe(90000);
    const moneyOut = Object.values(OPERATIONS).filter((def) => 'moneyOut' in def);
    expect(moneyOut.map((def) => def.sdk)).toEqual(['transfers.create', 'refunds.create']);

    const { fetch } = fetchMock(Array.from({ length: 6 }, () => created({})));
    const defaults = client(fetch);
    await defaults.transfers.create({} as never);
    await defaults.refunds.create({} as never);
    await defaults.payments.create({} as never);
    await defaults.transfers.create({} as never, { timeoutMs: 5000 });
    await client(fetch, { timeoutMs: 45000 }).transfers.create({} as never);
    await client(fetch, { timeoutMs: 45000 }).refunds.create({} as never, { timeoutMs: 120000 });
    expect(timeout.mock.calls.map(([ms]) => ms)).toEqual([90000, 90000, 30000, 5000, 45000, 120000]);
  });

  it('waits out a bank that takes 75 s without a second request', async () => {
    const { fetch, calls } = slowApi(75000);
    const result = await settle(client(fetch, { maxRetries: 2 }).transfers.create({} as never));
    expect(result).toEqual(TRANSFER);
    expect(calls).toHaveLength(1);
  });

  it('keeps asking with the same key after a timeout and resolves with the real result', async () => {
    const onRetry = vi.fn();
    const { fetch, calls } = slowApi(60000);
    const result = await settle(
      client(fetch, { timeoutMs: 30000, maxRetries: 2, hooks: { onRetry } }).transfers.create({} as never),
    );
    expect(result).toEqual(TRANSFER);
    expect(lastResponseOf(result)?.idempotentReplayed).toBe(true);
    // One timeout, then a 409 every 2 s until the first attempt has finished: far more requests
    // than maxRetries allows, all with the key of the first.
    expect(calls.length).toBeGreaterThan(10);
    expect(new Set(calls.map((call) => call.key))).toEqual(new Set([calls[0]!.key]));
    expect(calls[0]!.key).toMatch(/^[0-9a-f-]{36}$/);
    expect(lastResponseOf(result)?.idempotencyKey).toBe(calls[0]!.key);
    expect(calls[2]!.at - calls[1]!.at).toBe(2000);
    expect(calls.at(-1)!.at).toBeGreaterThanOrEqual(60000);
    expect(calls.at(-1)!.at).toBeLessThan(62500);
    expect(onRetry.mock.calls.map(([context]) => (context as { reason: string }).reason)).toEqual([
      'timeout',
      ...calls.slice(2).map(() => 'status'),
    ]);
  });

  it('gives up 90 s after the call started, with an error that carries the key', async () => {
    const { fetch, calls } = slowApi(200000);
    const startedAt = Date.now();
    let failedAfter = 0;
    const error = await settle(
      client(fetch, { timeoutMs: 30000, maxRetries: 2 })
        .refunds.create({} as never, { idempotencyKey: 'refund-R-1' })
        .catch((e: unknown) => {
          failedAfter = Date.now() - startedAt;
          throw e;
        }),
    );
    expect(error).toBeInstanceOf(PletopayIdempotencyError);
    expect(error).toMatchObject({ status: 409, code: 'idempotency_request_in_progress', idempotencyKey: 'refund-R-1' });
    expect(failedAfter).toBe(IN_PROGRESS_WAIT_MS);
    expect(calls.at(-1)!.at).toBe(IN_PROGRESS_WAIT_MS);
    expect(calls.every((call) => call.key === 'refund-R-1')).toBe(true);
  });

  it('honours Retry-After on the in-progress answer', async () => {
    const { fetch, calls } = slowApi(60000, { 'retry-after': '10' });
    const result = await settle(client(fetch, { timeoutMs: 30000, maxRetries: 1 }).transfers.create({} as never));
    expect(result).toEqual(TRANSFER);
    expect(calls).toHaveLength(5);
    expect(calls[2]!.at - calls[1]!.at).toBe(10000);
  });

  it('does not wait when retries are off: the timeout error carries the key', async () => {
    const { fetch, calls } = slowApi(60000);
    const error = await settle(client(fetch, { timeoutMs: 30000, maxRetries: 0 }).transfers.create({} as never));
    expect(error).toBeInstanceOf(PletopayTimeoutError);
    expect((error as PletopayTimeoutError).idempotencyKey).toBe(calls[0]!.key);
    expect(calls).toHaveLength(1);

    const inProgress = fetchMock([apiError(409, 'idempotency_error', 'idempotency_request_in_progress')]);
    const conflict = await settle(
      client(inProgress.fetch, { maxRetries: 0 }).transfers.create({} as never, { idempotencyKey: 'k' }),
    );
    expect(conflict).toBeInstanceOf(PletopayIdempotencyError);
    expect(inProgress.calls).toHaveLength(1);
  });

  it('stops waiting when the caller aborts', async () => {
    const controller = new AbortController();
    const { fetch, calls } = slowApi(60000);
    const promise = client(fetch, { timeoutMs: 30000, maxRetries: 2 })
      .transfers.create({} as never, { signal: controller.signal })
      .catch((e: unknown) => e);
    await vi.advanceTimersByTimeAsync(40000);
    const sent = calls.length;
    controller.abort(new Error('shutting down'));
    await vi.runAllTimersAsync();
    expect(((await promise) as Error).message).toBe('shutting down');
    expect(calls).toHaveLength(sent);
  });
});

describe('the Idempotency-Key on errors', () => {
  it('is on API, connection and unexpected-body errors of a request that carried one', async () => {
    const { fetch, calls } = fetchMock([
      apiError(400, 'invalid_request', 'parameter_missing', { param: 'amount' }),
      new TypeError('fetch failed'),
      new Response('<html>bad gateway</html>', { status: 200 }),
      apiError(404, 'not_found', 'resource_missing'),
    ]);
    const c = client(fetch);
    const invalid: unknown = await c.payments.create({} as never).catch((e: unknown) => e);
    expect(invalid).toBeInstanceOf(PletopayInvalidRequestError);
    expect((invalid as PletopayApiError).idempotencyKey).toBe(calls[0]!.headers['idempotency-key']);
    expect((invalid as PletopayApiError).idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);

    const refused: unknown = await c.transfers
      .create({} as never, { idempotencyKey: 'payout-1' })
      .catch((e: unknown) => e);
    expect(refused).toBeInstanceOf(PletopayConnectionError);
    expect((refused as PletopayConnectionError).idempotencyKey).toBe('payout-1');

    const garbled: unknown = await c.refunds
      .create({} as never, { idempotencyKey: 'refund-1' })
      .catch((e: unknown) => e);
    expect(garbled).toBeInstanceOf(PletopayApiError);
    expect((garbled as PletopayApiError).idempotencyKey).toBe('refund-1');

    const missing: unknown = await c.payments.retrieve('pay_x').catch((e: unknown) => e);
    expect((missing as PletopayApiError).idempotencyKey).toBeUndefined();
    expect('idempotencyKey' in (missing as object)).toBe(false);
  });
});

/** Answers with the headers and the start of a body, then stalls until the request is aborted. */
function stalledBody(init: RequestInit | undefined): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"status":true,'));
      init?.signal?.addEventListener('abort', () => controller.error(init.signal?.reason));
    },
  });
  return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } });
}

describe('timeouts and cancellation', () => {
  it('turns a timeout into PletopayTimeoutError', async () => {
    const fetch = (async (_url: unknown, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason as Error));
      })) as typeof globalThis.fetch;
    const error: unknown = await client(fetch, { timeoutMs: 20 })
      .balance.retrieve()
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PletopayTimeoutError);
    expect((error as Error).message).toContain('timed out after 20 ms');
  });

  it('treats a timeout while the body is arriving like any other timeout, and retries it', async () => {
    const stalled = (async (_url: unknown, init?: RequestInit) => stalledBody(init)) as typeof globalThis.fetch;
    const error: unknown = await client(stalled, { timeoutMs: 20 })
      .balance.retrieve()
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PletopayTimeoutError);
    expect((error as Error).message).toContain('timed out after 20 ms');

    let attempts = 0;
    const recovers = (async (_url: unknown, init?: RequestInit) =>
      ++attempts === 1 ? stalledBody(init) : ok({ object: 'balance' })) as typeof globalThis.fetch;
    await expect(client(recovers, { timeoutMs: 20, maxRetries: 1 }).balance.retrieve()).resolves.toEqual({
      object: 'balance',
    });
    expect(attempts).toBe(2);
  });

  it('rethrows the caller abort unchanged when it lands while the body is arriving', async () => {
    const controller = new AbortController();
    const fetch = (async (_url: unknown, init?: RequestInit) => {
      setTimeout(() => controller.abort(new Error('user cancelled')), 5);
      return stalledBody(init);
    }) as typeof globalThis.fetch;
    const error: unknown = await client(fetch, { maxRetries: 3 })
      .balance.retrieve({ signal: controller.signal })
      .catch((e: unknown) => e);
    expect((error as Error).message).toBe('user cancelled');
  });

  it('rethrows the caller abort reason unchanged and stops retrying', async () => {
    const controller = new AbortController();
    let attempts = 0;
    const fetch = (async (_url: unknown, init?: RequestInit) => {
      attempts++;
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason as Error));
        setTimeout(() => controller.abort(new Error('user cancelled')), 5);
      });
    }) as typeof globalThis.fetch;
    const error: unknown = await client(fetch, { maxRetries: 3 })
      .balance.retrieve({ signal: controller.signal })
      .catch((e: unknown) => e);
    expect((error as Error).message).toBe('user cancelled');
    expect(attempts).toBe(1);
  });
});
