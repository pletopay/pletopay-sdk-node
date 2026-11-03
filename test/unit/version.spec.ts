import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { Pletopay } from '../../src/client';
import { VERSION } from '../../src/version';

describe('version constants', () => {
  it('VERSION matches package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as { version: string };
    expect(VERSION).toBe(pkg.version);
    expect(Pletopay.VERSION).toBe(pkg.version);
  });

  it('API_VERSION matches the committed spec', () => {
    const spec = parse(readFileSync(new URL('../../spec/public.v1.yaml', import.meta.url), 'utf8')) as {
      info: { version: string };
    };
    expect(Pletopay.API_VERSION).toBe(spec.info.version);
  });
});
