/**
 * Live tests run against a real API (normally a local one) with a test-mode key:
 *   PLETOPAY_API_URL=http://localhost:8080 PLETOPAY_SECRET_KEY=sk_test_… pnpm test:live
 * They are skipped when PLETOPAY_SECRET_KEY is not set.
 */
import { Pletopay } from '../../src/client';
import { PletopayApiError } from '../../src/errors';

export const SECRET_KEY = process.env.PLETOPAY_SECRET_KEY;
export const API_URL = process.env.PLETOPAY_API_URL ?? 'http://localhost:8080';
export const enabled = Boolean(SECRET_KEY?.startsWith('sk_test_'));

export function liveClient(): Pletopay {
  if (!SECRET_KEY) throw new Error('PLETOPAY_SECRET_KEY is not set');
  return new Pletopay({
    secretKey: SECRET_KEY,
    baseUrl: API_URL,
    logger: process.env.PLETOPAY_DEBUG ? console : undefined,
  });
}

export const unique = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function poll<T>(
  fn: () => Promise<T>,
  until: (value: T) => boolean,
  { timeoutMs = 45000, intervalMs = 1000 } = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let last = await fn();
  while (!until(last)) {
    if (Date.now() > deadline) throw new Error(`timed out waiting; last value: ${JSON.stringify(last).slice(0, 500)}`);
    await new Promise((r) => setTimeout(r, intervalMs));
    last = await fn();
  }
  return last;
}

/** The bank side of the sandbox can be unavailable; those tests report instead of failing. */
export function isBankUnavailable(error: unknown): boolean {
  return error instanceof PletopayApiError && (error.code === 'service_unavailable' || error.code === 'service_paused');
}
