import type { ApiErrorBody } from './types';

/** Base class of every error this SDK throws. */
export class PletopayError extends Error {
  override name = 'PletopayError';
  /**
   * The `Idempotency-Key` the failed request carried (yours or generated), on every error from such
   * a request: timeouts, connection errors and API errors alike. Retry with it, or look the object
   * up by your `reference`, before treating the call as failed.
   */
  declare readonly idempotencyKey?: string;
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}

/** Records the request's `Idempotency-Key` on an error the client is about to throw. */
export function withIdempotencyKey<E extends PletopayError>(error: E, idempotencyKey: string | undefined): E {
  if (idempotencyKey !== undefined) (error as { idempotencyKey?: string }).idempotencyKey = idempotencyKey;
  return error;
}

export interface RateLimitInfo {
  /** Requests allowed in the current window. */
  limit: number | undefined;
  /** Requests left in the current window. */
  remaining: number | undefined;
  /** Seconds until the window resets. */
  reset: number | undefined;
}

function num(value: string | null): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Reads the `RateLimit-*` headers of a response. */
export function rateLimitFromHeaders(headers: Headers): RateLimitInfo | undefined {
  const info: RateLimitInfo = {
    limit: num(headers.get('ratelimit-limit')),
    remaining: num(headers.get('ratelimit-remaining')),
    reset: num(headers.get('ratelimit-reset')),
  };
  return info.limit === undefined && info.remaining === undefined && info.reset === undefined ? undefined : info;
}

/**
 * `Retry-After` as milliseconds: either delay-seconds or an HTTP date. Undefined when absent or unreadable.
 */
export function retryAfterMs(headers: Headers, now = Date.now()): number | undefined {
  const value = headers.get('retry-after');
  if (value === null || value.trim() === '') return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - now) : undefined;
}

function isErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof body.error === 'object' &&
    body.error !== null
  );
}

/**
 * The API answered with an error envelope (`status: false`). Branch on `code` (stable) or on the
 * subclass; `message` is for people and may change. Quote `requestId` to support.
 */
export class PletopayApiError extends PletopayError {
  override name = 'PletopayApiError';
  /** HTTP status code. */
  readonly status: number;
  /** `error.type`: the error family. */
  readonly type: string | undefined;
  /** `error.code`: the stable machine-readable code (see the error catalogue). */
  readonly code: string | undefined;
  /** `error.param`: the offending field, when there is one. */
  readonly param: string | undefined;
  /** `error.details`: structured extras, e.g. the refundable amount. */
  readonly details: Record<string, unknown> | undefined;
  /** `X-Request-Id` / `request_id`. */
  readonly requestId: string | undefined;
  /** The response headers. */
  readonly headers: Headers;
  /** The parsed response body (the error envelope, or whatever a proxy returned). */
  readonly body: unknown;
  /** `RateLimit-*` headers, when present. */
  readonly rateLimit: RateLimitInfo | undefined;

  constructor(status: number, body: unknown, headers: Headers, message?: string) {
    const envelope = isErrorBody(body) ? body : undefined;
    const requestId = envelope?.request_id ?? headers.get('x-request-id') ?? undefined;
    const base = message ?? envelope?.message ?? `Request failed with HTTP ${status}`;
    super(requestId ? `${base} (request_id: ${requestId})` : base);
    this.status = status;
    this.type = envelope?.error.type;
    this.code = envelope?.error.code;
    this.param = envelope?.error.param;
    this.details = envelope?.error.details;
    this.requestId = requestId;
    this.headers = headers;
    this.body = body;
    this.rateLimit = rateLimitFromHeaders(headers);
  }

  /** Builds the right subclass for a failed response, from `error.type` first and the status otherwise. */
  static fromResponse(status: number, body: unknown, headers: Headers): PletopayApiError {
    const type = isErrorBody(body) ? body.error.type : undefined;
    switch (type) {
      case 'invalid_request':
        return new PletopayInvalidRequestError(status, body, headers);
      case 'authentication_error':
        return new PletopayAuthenticationError(status, body, headers);
      case 'permission_error':
        return new PletopayPermissionError(status, body, headers);
      case 'not_found':
        return new PletopayNotFoundError(status, body, headers);
      case 'conflict':
        return new PletopayConflictError(status, body, headers);
      case 'idempotency_error':
        return new PletopayIdempotencyError(status, body, headers);
      case 'rate_limit_error':
        return new PletopayRateLimitError(status, body, headers);
      case 'api_error':
        return new PletopayServerError(status, body, headers);
      default:
        break;
    }
    if (status === 401) return new PletopayAuthenticationError(status, body, headers);
    if (status === 403) return new PletopayPermissionError(status, body, headers);
    if (status === 404) return new PletopayNotFoundError(status, body, headers);
    if (status === 409) return new PletopayConflictError(status, body, headers);
    if (status === 429) return new PletopayRateLimitError(status, body, headers);
    if (status >= 500) return new PletopayServerError(status, body, headers);
    if (status >= 400) return new PletopayInvalidRequestError(status, body, headers);
    return new PletopayApiError(status, body, headers);
  }
}

/** 400: a field is missing, invalid or unknown (`param` names it), or the request is malformed. */
export class PletopayInvalidRequestError extends PletopayApiError {
  override name = 'PletopayInvalidRequestError';
}
/** 401: missing or invalid secret key, or a publishable key used as a bearer. */
export class PletopayAuthenticationError extends PletopayApiError {
  override name = 'PletopayAuthenticationError';
}
/** 403: the key, mode or account is not allowed to do this (e.g. `test_mode_only`, `transfers_disabled`). */
export class PletopayPermissionError extends PletopayApiError {
  override name = 'PletopayPermissionError';
}
/** 404: no such resource for this organization and mode. */
export class PletopayNotFoundError extends PletopayApiError {
  override name = 'PletopayNotFoundError';
}
/** 409: the resource is in the wrong state (e.g. `duplicate_reference`, `invoice_not_draft`). */
export class PletopayConflictError extends PletopayApiError {
  override name = 'PletopayConflictError';
}
/** 409/422: an `Idempotency-Key` problem (`idempotency_key_reused`, `idempotency_request_in_progress`). */
export class PletopayIdempotencyError extends PletopayApiError {
  override name = 'PletopayIdempotencyError';
}
/** 429: too many requests; wait `retryAfter` seconds. The SDK already retried when it was safe to. */
export class PletopayRateLimitError extends PletopayApiError {
  override name = 'PletopayRateLimitError';
  /** Seconds to wait before retrying, from `Retry-After`. */
  readonly retryAfter: number | undefined;
  constructor(status: number, body: unknown, headers: Headers, message?: string) {
    super(status, body, headers, message);
    const ms = retryAfterMs(headers);
    this.retryAfter = ms === undefined ? undefined : Math.ceil(ms / 1000);
  }
}
/** 5xx: Pletopay could not complete the request. Retry with the same `Idempotency-Key`. */
export class PletopayServerError extends PletopayApiError {
  override name = 'PletopayServerError';
}

/** The request never reached the API or no response arrived (DNS, TLS, reset, …). */
export class PletopayConnectionError extends PletopayError {
  override name = 'PletopayConnectionError';
}
/**
 * The request exceeded `timeoutMs`. The API may still have received it: a timed-out transfer or
 * refund has not failed. Retry with `idempotencyKey`, or retrieve it by your `reference`.
 */
export class PletopayTimeoutError extends PletopayError {
  override name = 'PletopayTimeoutError';
}
/** A webhook's `X-PletoPay-Signature` did not verify. Reject the delivery. */
export class PletopaySignatureVerificationError extends PletopayError {
  override name = 'PletopaySignatureVerificationError';
}
