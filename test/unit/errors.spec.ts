import { describe, expect, it } from 'vitest';
import {
  PletopayApiError,
  PletopayAuthenticationError,
  PletopayConflictError,
  PletopayIdempotencyError,
  PletopayInvalidRequestError,
  PletopayNotFoundError,
  PletopayPermissionError,
  PletopayRateLimitError,
  PletopayServerError,
  rateLimitFromHeaders,
  retryAfterMs,
} from '../../src/errors';

function body(type: string, code = 'c') {
  return { status: false, message: 'm', error: { type, code }, request_id: 'req_1' };
}

describe('PletopayApiError.fromResponse', () => {
  it.each([
    ['invalid_request', PletopayInvalidRequestError],
    ['authentication_error', PletopayAuthenticationError],
    ['permission_error', PletopayPermissionError],
    ['not_found', PletopayNotFoundError],
    ['conflict', PletopayConflictError],
    ['idempotency_error', PletopayIdempotencyError],
    ['rate_limit_error', PletopayRateLimitError],
    ['api_error', PletopayServerError],
  ])('maps error.type %s', (type, cls) => {
    const error = PletopayApiError.fromResponse(400, body(type), new Headers());
    expect(error).toBeInstanceOf(cls);
    expect(error.type).toBe(type);
    expect(error.requestId).toBe('req_1');
  });

  it.each([
    [401, PletopayAuthenticationError],
    [403, PletopayPermissionError],
    [404, PletopayNotFoundError],
    [409, PletopayConflictError],
    [429, PletopayRateLimitError],
    [500, PletopayServerError],
    [503, PletopayServerError],
    [400, PletopayInvalidRequestError],
    [418, PletopayInvalidRequestError],
  ])('falls back to the status for unknown bodies (%s)', (status, cls) => {
    const error = PletopayApiError.fromResponse(status, 'oops', new Headers({ 'x-request-id': 'req_h' }));
    expect(error).toBeInstanceOf(cls);
    expect(error.requestId).toBe('req_h');
    expect(error.code).toBeUndefined();
    expect(error.body).toBe('oops');
  });

  it('keeps details and the rate limit headers', () => {
    const headers = new Headers({
      'retry-after': '3',
      'ratelimit-limit': '10',
      'ratelimit-remaining': '0',
      'ratelimit-reset': '3',
    });
    const error = PletopayApiError.fromResponse(
      429,
      {
        ...body('rate_limit_error', 'rate_limited'),
        error: { type: 'rate_limit_error', code: 'rate_limited', details: { bucket: 'money' } },
      },
      headers,
    );
    expect(error).toBeInstanceOf(PletopayRateLimitError);
    expect((error as PletopayRateLimitError).retryAfter).toBe(3);
    expect(error.details).toEqual({ bucket: 'money' });
    expect(error.rateLimit).toEqual({ limit: 10, remaining: 0, reset: 3 });
    expect(error.name).toBe('PletopayRateLimitError');
    expect(error instanceof Error).toBe(true);
  });
});

describe('header helpers', () => {
  it('parses Retry-After as seconds or an HTTP date', () => {
    expect(retryAfterMs(new Headers())).toBeUndefined();
    expect(retryAfterMs(new Headers({ 'retry-after': '2' }))).toBe(2000);
    const now = Date.parse('2026-01-01T00:00:00Z');
    expect(retryAfterMs(new Headers({ 'retry-after': 'Thu, 01 Jan 2026 00:00:05 GMT' }), now)).toBe(5000);
    expect(retryAfterMs(new Headers({ 'retry-after': 'garbage' }))).toBeUndefined();
  });

  it('reads RateLimit-* headers only when present', () => {
    expect(rateLimitFromHeaders(new Headers())).toBeUndefined();
    expect(rateLimitFromHeaders(new Headers({ 'ratelimit-remaining': '5' }))).toEqual({
      limit: undefined,
      remaining: 5,
      reset: undefined,
    });
  });
});
