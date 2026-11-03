import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PletopayConnectionError,
  PletopayRateLimitError,
  PletopayServerError,
  PletopayTimeoutError,
} from '../../src/errors';
import { isRetryableStatus, retryDelayMs } from '../../src/core/retry';
import { apiError, client, created, fetchMock, ok } from './helpers';

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
    expect(retryDelayMs(0, { random: () => 0, status: 409, code: 'idempotency_request_in_progress' })).toBe(1000);
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
