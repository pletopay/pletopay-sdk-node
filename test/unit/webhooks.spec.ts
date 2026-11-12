import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PletopayError, PletopaySignatureVerificationError } from '../../src/errors';
import {
  EVENT_TYPES,
  Webhooks,
  computeSignature,
  constructEvent,
  generateTestHeaderString,
  isEvent,
  isKnownEventType,
  parseSignatureHeader,
  verifySignature,
} from '../../src/webhooks';
import { Pletopay } from '../../src/client';
import { TEST_KEY } from './helpers';

interface Fixture {
  payload_file: string;
  secret: string;
  timestamp: number;
  header: string;
  header_rotated: string;
  header_wrong: string;
  tolerance_seconds: number;
  now_inside: number;
  now_outside: number;
  event_id: string;
  event_type: string;
}

const dir = new URL('../../fixtures/', import.meta.url);
const fixture = JSON.parse(readFileSync(new URL('webhook-signature.json', dir), 'utf8')) as Fixture;
const payloadBytes = readFileSync(new URL(fixture.payload_file, dir));
const payload = payloadBytes.toString('utf8');
const now = fixture.now_inside;

describe('signature header parsing', () => {
  it('parses t and every v1', () => {
    expect(parseSignatureHeader(fixture.header_rotated)).toEqual({
      timestamp: fixture.timestamp,
      signatures: ['deadbeef'.repeat(8), expect.any(String)],
    });
    expect(parseSignatureHeader([fixture.header])).toEqual({
      timestamp: fixture.timestamp,
      signatures: [expect.any(String)],
    });
  });

  it.each([undefined, null, '', 'v1=abc', 't=abc,v1=def', 't=1', 'garbage'])('rejects %s', (header) => {
    expect(() => parseSignatureHeader(header as string)).toThrow(PletopaySignatureVerificationError);
  });
});

describe('verification against the shared fixture', () => {
  it('accepts the fixture header with a string or Buffer payload', () => {
    expect(verifySignature(payload, fixture.header, fixture.secret, { now })).toBe(true);
    expect(verifySignature(payloadBytes, fixture.header, fixture.secret, { now })).toBe(true);
    expect(computeSignature(fixture.secret, fixture.timestamp, payload)).toBe(fixture.header.split('v1=')[1]);
  });

  it('accepts a rotated header where only the second signature matches', () => {
    expect(verifySignature(payload, fixture.header_rotated, fixture.secret, { now })).toBe(true);
  });

  it('rejects a wrong signature, wrong secret or altered payload', () => {
    expect(verifySignature(payload, fixture.header_wrong, fixture.secret, { now })).toBe(false);
    expect(verifySignature(payload, fixture.header, 'whsec_other', { now })).toBe(false);
    expect(verifySignature(payload.replace('5000000', '5000001'), fixture.header, fixture.secret, { now })).toBe(false);
    expect(verifySignature(`${payload}\n`, fixture.header, fixture.secret, { now })).toBe(false);
  });

  it('enforces the timestamp tolerance (default 300 s) in both directions', () => {
    expect(verifySignature(payload, fixture.header, fixture.secret, { now: fixture.now_inside })).toBe(true);
    expect(verifySignature(payload, fixture.header, fixture.secret, { now: fixture.now_outside })).toBe(false);
    expect(verifySignature(payload, fixture.header, fixture.secret, { now: fixture.timestamp - 301 })).toBe(false);
    expect(verifySignature(payload, fixture.header, fixture.secret, { now: fixture.now_outside, tolerance: 600 })).toBe(
      true,
    );
    expect(verifySignature(payload, fixture.header, fixture.secret)).toBe(false); // real "now" is far away
  });

  it('constructEvent returns the typed event and throws on failure', () => {
    const event = constructEvent(payloadBytes, fixture.header, fixture.secret, { now });
    expect(event.id).toBe(fixture.event_id);
    expect(event.type).toBe(fixture.event_type);
    if (event.type === 'payment.succeeded') expect(event.data.object.amount_received).toBe(5000000);
    expect(isEvent(event, 'payment.succeeded')).toBe(true);
    expect(isEvent(event, 'payment.failed')).toBe(false);

    const error = (() => {
      try {
        constructEvent(payload, fixture.header, fixture.secret, { now: fixture.now_outside });
        return undefined;
      } catch (e) {
        return e;
      }
    })();
    expect(error).toBeInstanceOf(PletopaySignatureVerificationError);
    expect((error as Error).message).toMatch(/tolerance/);
    expect(() => constructEvent(payload, fixture.header_wrong, fixture.secret, { now })).toThrow(/No signature found/);
  });

  it('rejects a payload that verifies but is not an event', () => {
    const header = generateTestHeaderString({ payload: '{"hello":1}', secret: fixture.secret });
    expect(() => constructEvent('{"hello":1}', header, fixture.secret)).toThrow(/not an event object/);
    const bad = generateTestHeaderString({ payload: 'nope', secret: fixture.secret });
    expect(() => constructEvent('nope', bad, fixture.secret)).toThrow(/not valid JSON/);
  });

  it('refuses non-raw payloads and missing secrets with a configuration error, not false', () => {
    expect(() => verifySignature({ parsed: true } as unknown as string, fixture.header, fixture.secret)).toThrow(
      PletopayError,
    );
    expect(() => verifySignature(payload, fixture.header, '')).toThrow(/signing secret/);
  });
});

describe('test header generation', () => {
  it('round-trips with the verifier', () => {
    const header = generateTestHeaderString({ payload, secret: 'whsec_x', timestamp: 1700000000 });
    expect(header).toBe(`t=1700000000,v1=${computeSignature('whsec_x', 1700000000, payload)}`);
    expect(verifySignature(payload, header, 'whsec_x', { now: 1700000010 })).toBe(true);
    expect(generateTestHeaderString({ payload, secret: 'whsec_x' })).toMatch(/^t=\d{10},v1=[0-9a-f]{64}$/);
  });
});

describe('Webhooks class and client integration', () => {
  it('uses the configured secret and tolerance', () => {
    const webhooks = new Webhooks({ secret: fixture.secret, tolerance: 1000 });
    expect(webhooks.verifySignature(payload, fixture.header, undefined, { now: fixture.now_outside })).toBe(true);
    expect(webhooks.constructEvent(payload, fixture.header, undefined, { now }).type).toBe('payment.succeeded');
    expect(webhooks.generateTestHeaderString({ payload, timestamp: 5 })).toBe(
      `t=5,v1=${computeSignature(fixture.secret, 5, payload)}`,
    );
    expect(() => new Webhooks().constructEvent(payload, fixture.header)).toThrow(/No webhook secret/);
  });

  it('is reachable as pletopay.webhooks', () => {
    const pletopay = new Pletopay({ secretKey: TEST_KEY, webhookSecret: fixture.secret });
    expect(pletopay.webhooks.verifySignature(payload, fixture.header, undefined, { now })).toBe(true);
  });

  it('knows the event types', () => {
    expect(EVENT_TYPES).toContain('payment.succeeded');
    expect(EVENT_TYPES).toHaveLength(41);
    expect(isKnownEventType('payment.succeeded')).toBe(true);
    expect(isKnownEventType('payment.teleported')).toBe(false);
  });
});
