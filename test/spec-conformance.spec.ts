/**
 * The operation table (src/operations.ts) and the resource methods must match the committed
 * OpenAPI contract exactly: every operation, its method and path, whether Idempotency-Key is
 * accepted or required, its query parameters, list-ness, and the test-mode-only flag.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { Pletopay } from '../src/client';
import { OPERATIONS } from '../src/operations';
import type { OperationDef } from '../src/operations';
import { TEST_KEY } from './unit/helpers';

interface Parameter {
  name: string;
  in: string;
  required?: boolean;
}
interface Operation {
  operationId: string;
  parameters?: Parameter[];
  responses: Record<string, { content?: Record<string, { schema?: { properties?: { data?: { type?: string } } } }> }>;
  'x-test-mode-only'?: boolean;
}
interface Spec {
  paths: Record<string, Record<string, Operation>>;
  webhooks: Record<string, unknown>;
}

const spec = parse(readFileSync(new URL('../spec/public.v1.yaml', import.meta.url), 'utf8')) as Spec;

interface Expected {
  method: string;
  path: string;
  idempotency: 'none' | 'optional' | 'required';
  query: string[];
  list: boolean;
  accept: string;
  testModeOnly: boolean;
}

const expected = new Map<string, Expected>();
for (const [path, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!['get', 'post', 'patch', 'delete', 'put'].includes(method)) continue;
    const params = op.parameters ?? [];
    const idem = params.find((p) => p.in === 'header' && p.name === 'Idempotency-Key');
    const success = Object.entries(op.responses).find(([code]) => code.startsWith('2'))?.[1];
    const content = Object.keys(success?.content ?? {})[0] ?? '';
    expected.set(op.operationId, {
      method: method.toUpperCase(),
      path: path.replace(/^\/api\/v1/, ''),
      idempotency: idem ? (idem.required ? 'required' : 'optional') : 'none',
      query: params.filter((p) => p.in === 'query').map((p) => p.name.replace(/\[\]$/, '')),
      list: success?.content?.['application/json']?.schema?.properties?.data?.type === 'array',
      accept: content,
      testModeOnly: op['x-test-mode-only'] === true,
    });
  }
}

function resolve(client: Pletopay, dotted: string): unknown {
  return dotted.split('.').reduce<unknown>((obj, key) => (obj as Record<string, unknown> | undefined)?.[key], client);
}

describe('spec conformance', () => {
  const table: Record<string, OperationDef> = OPERATIONS;
  const client = new Pletopay({
    secretKey: TEST_KEY,
    fetch: () => Promise.reject(new Error('no network')),
  });

  it('covers every operation in the spec and nothing else', () => {
    expect([...expected.keys()].sort()).toEqual(Object.keys(table).sort());
    expect(expected.size).toBeGreaterThanOrEqual(82);
  });

  for (const [id, exp] of expected) {
    it(`${id}: ${exp.method} ${exp.path}`, () => {
      const def = table[id]!;
      expect(def.id).toBe(id);
      expect(def.method).toBe(exp.method);
      expect(def.path).toBe(exp.path);
      expect(def.idempotency).toBe(exp.idempotency);
      expect([...(def.query ?? [])]).toEqual(exp.query);
      expect(def.list === true).toBe(exp.list);
      expect(def.accept ?? 'application/json').toBe(exp.accept || 'application/json');
      expect(def.testModeOnly === true).toBe(exp.testModeOnly);
      expect(typeof resolve(client, def.sdk)).toBe('function');
    });
  }

  it('maps every SDK method to exactly one operation', () => {
    const methods = Object.values(table).map((d) => d.sdk);
    expect(new Set(methods).size).toBe(methods.length);
  });

  it('knows every webhook event type in the spec', async () => {
    const { EVENT_TYPES } = await import('../src/generated/event-types');
    expect([...EVENT_TYPES]).toEqual(Object.keys(spec.webhooks).sort());
  });
});
