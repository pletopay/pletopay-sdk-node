export const DEFAULT_MAX_RETRIES = 2;
export const DEFAULT_TIMEOUT_MS = 30000;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 8000;
/** `idempotency_request_in_progress` means the first attempt is still running: wait at least this long. */
const IN_PROGRESS_FLOOR_MS = 1000;

/** Statuses the API documents as safe to retry (with the same `Idempotency-Key`). */
export function isRetryableStatus(status: number, code: string | undefined): boolean {
  if (status === 429 || status === 500 || status === 502 || status === 503) return true;
  return status === 409 && code === 'idempotency_request_in_progress';
}

/**
 * Delay before the next attempt: `Retry-After` when the API sent one, otherwise exponential
 * backoff (500 ms × 2^attempt, full jitter, capped at 8 s).
 */
export function retryDelayMs(
  attempt: number,
  opts: { retryAfterMs?: number | undefined; status?: number; code?: string | undefined; random?: () => number } = {},
): number {
  if (opts.retryAfterMs !== undefined) return Math.min(opts.retryAfterMs, 60000);
  const random = opts.random ?? Math.random;
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  const delay = Math.round(ceiling * (0.5 + random() * 0.5));
  const floor = opts.status === 409 && opts.code === 'idempotency_request_in_progress' ? IN_PROGRESS_FLOOR_MS : 0;
  return Math.max(delay, floor);
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
