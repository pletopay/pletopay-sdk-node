import { createHmac, timingSafeEqual } from 'node:crypto';
import { PletopayError, PletopaySignatureVerificationError } from './errors';
import { EVENT_TYPES } from './generated/event-types';
import type { Event, EventType, UnknownEvent } from './types';

export { EVENT_TYPES };

/** Reject signatures whose timestamp is further than this from now. */
export const DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 300;
export const SIGNATURE_HEADER = 'X-PletoPay-Signature';

/** The raw request body, exactly as received. Never a re-serialised object. */
export type WebhookPayload = string | Uint8Array;
/** The `X-PletoPay-Signature` header value (Node may give an array for repeated headers). */
export type SignatureHeader = string | string[] | null | undefined;

export interface SignatureVerificationOptions {
  /** Seconds. Default 300. */
  tolerance?: number;
  /** Unix seconds "now", for tests. */
  now?: number;
}

export interface ParsedSignature {
  timestamp: number;
  /** Every `v1` signature in the header (more than one during a secret rotation). */
  signatures: string[];
}

/** Parses `t=<unix seconds>,v1=<hex>[,v1=<hex>]`. */
export function parseSignatureHeader(header: SignatureHeader): ParsedSignature {
  const value = Array.isArray(header) ? header[0] : header;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PletopaySignatureVerificationError(`Missing ${SIGNATURE_HEADER} header`);
  }
  let timestamp: number | undefined;
  const signatures: string[] = [];
  for (const part of value.split(',')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    if (key === 't') timestamp = Number(val);
    else if (key === 'v1' && val) signatures.push(val);
  }
  if (timestamp === undefined || !Number.isFinite(timestamp)) {
    throw new PletopaySignatureVerificationError(`Malformed ${SIGNATURE_HEADER} header: no timestamp`);
  }
  if (signatures.length === 0) {
    throw new PletopaySignatureVerificationError(`Malformed ${SIGNATURE_HEADER} header: no v1 signature`);
  }
  return { timestamp, signatures };
}

/** hex HMAC-SHA256(secret, `${timestamp}.${payload}`). */
export function computeSignature(secret: string, timestamp: number, payload: WebhookPayload): string {
  return createHmac('sha256', secret).update(`${timestamp}.`).update(payload).digest('hex');
}

function secureEqualHex(expectedHex: string, givenHex: string): boolean {
  if (!/^[0-9a-fA-F]+$/.test(givenHex)) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const given = Buffer.from(givenHex, 'hex');
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function assertSecret(secret: unknown): asserts secret is string {
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new PletopayError('A webhook signing secret (whsec_…) is required to verify signatures');
  }
}

function assertPayload(payload: unknown): asserts payload is WebhookPayload {
  if (typeof payload !== 'string' && !(payload instanceof Uint8Array)) {
    throw new PletopayError(
      'The webhook payload must be the raw request body (string or Buffer), not a parsed object: re-serialised JSON does not verify',
    );
  }
}

/**
 * Verifies a delivery and throws `PletopaySignatureVerificationError` when it does not check out.
 * Use `verifySignature` for a boolean.
 */
export function assertSignature(
  payload: WebhookPayload,
  header: SignatureHeader,
  secret: string,
  options: SignatureVerificationOptions = {},
): ParsedSignature {
  assertSecret(secret);
  assertPayload(payload);
  const parsed = parseSignatureHeader(header);
  const tolerance = options.tolerance ?? DEFAULT_SIGNATURE_TOLERANCE_SECONDS;
  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - parsed.timestamp) > tolerance) {
    throw new PletopaySignatureVerificationError(
      `Timestamp outside the tolerance zone (${Math.abs(now - parsed.timestamp)} s > ${tolerance} s)`,
    );
  }
  const expected = computeSignature(secret, parsed.timestamp, payload);
  if (!parsed.signatures.some((given) => secureEqualHex(expected, given))) {
    throw new PletopaySignatureVerificationError('No signature found matching the expected signature for the payload');
  }
  return parsed;
}

/** True when the delivery is authentic and fresh. Never throws for a bad header or payload. */
export function verifySignature(
  payload: WebhookPayload,
  header: SignatureHeader,
  secret: string,
  options: SignatureVerificationOptions = {},
): boolean {
  try {
    assertSignature(payload, header, secret, options);
    return true;
  } catch (error) {
    if (error instanceof PletopaySignatureVerificationError) return false;
    throw error;
  }
}

/**
 * Verifies the signature and returns the parsed event. Throws
 * `PletopaySignatureVerificationError` for a bad or stale signature, or an unparsable body.
 *
 * Call it with the raw body (`express.raw({ type: 'application/json' })`, Nest's `rawBody: true`,
 * Fastify's `rawBody`, …): a body that was parsed and re-serialised will not verify.
 */
export function constructEvent(
  payload: WebhookPayload,
  header: SignatureHeader,
  secret: string,
  options: SignatureVerificationOptions = {},
): Event {
  assertSignature(payload, header, secret, options);
  let parsed: unknown;
  try {
    parsed = JSON.parse(typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8')) as unknown;
  } catch (cause) {
    throw new PletopaySignatureVerificationError('The webhook payload is not valid JSON', { cause });
  }
  if (typeof parsed !== 'object' || parsed === null || (parsed as { object?: unknown }).object !== 'event') {
    throw new PletopaySignatureVerificationError('The webhook payload is not an event object');
  }
  return parsed as Event;
}

/** Whether this SDK version knows the event type (narrowing helper for `switch` defaults). */
export function isKnownEventType(type: string): type is EventType {
  return (EVENT_TYPES as readonly string[]).includes(type);
}

/** Narrows an event to one type, e.g. `if (isEvent(event, 'payment.succeeded')) event.data.object.amount_received`. */
export function isEvent<T extends EventType>(
  event: Event | UnknownEvent,
  type: T,
): event is Extract<Event, { type: T }> {
  return event.type === type;
}

export interface TestHeaderOptions {
  payload: WebhookPayload;
  secret: string;
  /** Unix seconds. Default: now. */
  timestamp?: number;
}

/** Builds a valid `X-PletoPay-Signature` for `payload`, to test your own handler. */
export function generateTestHeaderString(options: TestHeaderOptions): string {
  assertSecret(options.secret);
  assertPayload(options.payload);
  const timestamp = options.timestamp ?? Math.floor(Date.now() / 1000);
  return `t=${timestamp},v1=${computeSignature(options.secret, timestamp, options.payload)}`;
}

/** Signature verification bound to a configured secret (`new Pletopay({ webhookSecret })` → `pletopay.webhooks`). */
export class Webhooks {
  private readonly secret: string | undefined;
  private readonly tolerance: number | undefined;

  constructor(options: { secret?: string | undefined; tolerance?: number | undefined } = {}) {
    this.secret = options.secret;
    this.tolerance = options.tolerance;
  }

  constructEvent(
    payload: WebhookPayload,
    header: SignatureHeader,
    secret?: string,
    options?: SignatureVerificationOptions,
  ): Event {
    return constructEvent(payload, header, this.resolveSecret(secret), this.resolveOptions(options));
  }

  verifySignature(
    payload: WebhookPayload,
    header: SignatureHeader,
    secret?: string,
    options?: SignatureVerificationOptions,
  ): boolean {
    return verifySignature(payload, header, this.resolveSecret(secret), this.resolveOptions(options));
  }

  generateTestHeaderString(options: Omit<TestHeaderOptions, 'secret'> & { secret?: string }): string {
    return generateTestHeaderString({ ...options, secret: this.resolveSecret(options.secret) });
  }

  private resolveSecret(secret: string | undefined): string {
    const value = secret ?? this.secret;
    if (!value) throw new PletopayError('No webhook secret: pass one here or set `webhookSecret` on the client');
    return value;
  }

  private resolveOptions(options: SignatureVerificationOptions | undefined): SignatureVerificationOptions {
    return { tolerance: this.tolerance, ...options };
  }
}
