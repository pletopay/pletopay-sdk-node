export const DEFAULT_MAX_RETRIES = 2;
export const DEFAULT_TIMEOUT_MS = 30000;
/**
 * Default timeout of the calls that pay out inline (transfers, refunds): the API answers only once
 * the bank has, which can take up to 75 s.
 */
export const MONEY_OUT_TIMEOUT_MS = 90000;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 8000;
/** `idempotency_request_in_progress` means the first attempt is still running: ask again this often. */
export const IN_PROGRESS_POLL_MS = 2000;
/** …and stop asking once this long has passed since the first attempt of the call started. */
export const IN_PROGRESS_WAIT_MS = 90000;

/** Statuses the API documents as safe to retry (with the same `Idempotency-Key`). */
export function isRetryableStatus(status: number, code: string | undefined): boolean {
  if (status === 429 || status === 500 || status === 502 || status === 503) return true;
  return isInProgress(status, code);
}

/** The first request with this `Idempotency-Key` is still being processed. */
export function isInProgress(status: number, code: string | undefined): boolean {
  return status === 409 && code === 'idempotency_request_in_progress';
}

/**
 * Delay before the next attempt: `Retry-After` when the API sent one, otherwise exponential
 * backoff (500 ms × 2^attempt, full jitter, capped at 8 s).
 */
export function retryDelayMs(
  attempt: number,
  opts: { retryAfterMs?: number | undefined; random?: () => number } = {},
): number {
  if (opts.retryAfterMs !== undefined) return Math.min(opts.retryAfterMs, 60000);
  const random = opts.random ?? Math.random;
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  return Math.round(ceiling * (0.5 + random() * 0.5));
}

/**
 * How long to wait before asking again after `idempotency_request_in_progress` (`Retry-After` when
 * the API sent one, capped at the time left), or undefined once `IN_PROGRESS_WAIT_MS` has passed
 * since `startedAt`, the start of the call's first attempt.
 */
export function inProgressDelayMs(
  startedAt: number,
  opts: { retryAfterMs?: number | undefined; now?: number } = {},
): number | undefined {
  const remaining = startedAt + IN_PROGRESS_WAIT_MS - (opts.now ?? Date.now());
  if (remaining <= 0) return undefined;
  const wait = opts.retryAfterMs !== undefined && opts.retryAfterMs > 0 ? opts.retryAfterMs : IN_PROGRESS_POLL_MS;
  return Math.min(wait, remaining);
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason instanceof Error ? signal.reason : new Error('aborted'));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason instanceof Error ? signal.reason : new Error('aborted'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
