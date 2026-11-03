import { describe, expect, it } from 'vitest';
import { encodeQuery } from '../../src/core/query';

describe('encodeQuery', () => {
  it('returns an empty string for nothing', () => {
    expect(encodeQuery(undefined)).toBe('');
    expect(encodeQuery({})).toBe('');
    expect(encodeQuery({ a: undefined, b: null })).toBe('');
  });

  it('encodes scalars, dates, arrays and nested objects', () => {
    const q = encodeQuery({
      limit: 10,
      ok: true,
      q: 'a b&c',
      created: { gte: new Date('2026-01-01T00:00:00Z'), lt: '2026-02-01T00:00:00Z', gt: undefined },
      expand: ['customer', 'x'],
      deep: { a: { b: 1 } },
    });
    expect(q).toBe(
      '?limit=10&ok=true&q=a+b%26c&created%5Bgte%5D=2026-01-01T00%3A00%3A00.000Z&created%5Blt%5D=2026-02-01T00%3A00%3A00Z&expand%5B%5D=customer&expand%5B%5D=x&deep%5Ba%5D%5Bb%5D=1',
    );
    expect(decodeURIComponent(q)).toBe(
      '?limit=10&ok=true&q=a+b&c&created[gte]=2026-01-01T00:00:00.000Z&created[lt]=2026-02-01T00:00:00Z&expand[]=customer&expand[]=x&deep[a][b]=1',
    );
  });
});
