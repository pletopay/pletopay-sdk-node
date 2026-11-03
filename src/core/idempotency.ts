import { randomUUID } from 'node:crypto';
import { PletopayError } from '../errors';

/** 1–255 printable ASCII characters (what the API accepts). */
export const IDEMPOTENCY_KEY_PATTERN = /^[\x21-\x7e]{1,255}$/;

/** A fresh random key (UUID v4). */
export function generateIdempotencyKey(): string {
  return randomUUID();
}

/** Throws locally, before any request, when a key would be rejected by the API. */
export function assertIdempotencyKey(key: unknown): asserts key is string {
  if (typeof key !== 'string' || !IDEMPOTENCY_KEY_PATTERN.test(key)) {
    throw new PletopayError('idempotencyKey must be 1–255 printable ASCII characters (no spaces)');
  }
}
