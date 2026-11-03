#!/usr/bin/env node
/**
 * Generates src/generated/* from spec/public.v1.yaml:
 *   schema.ts        TypeScript types for every path, operation, schema and webhook (openapi-typescript)
 *   event-types.ts   the runtime list of webhook event types
 *
 *   node scripts/generate.mjs           write the files
 *   node scripts/generate.mjs --check   fail when the committed files are stale
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = resolve(root, 'spec', 'public.v1.yaml');
const outDir = resolve(root, 'src', 'generated');
const check = process.argv.includes('--check');
const header =
  '/* eslint-disable */\n/* prettier-ignore */\n// Generated from spec/public.v1.yaml by scripts/generate.mjs. Do not edit by hand.\n\n';

const specText = readFileSync(specPath, 'utf8');
const spec = parse(specText);

const ast = await openapiTS(specText, {
  // Fields with a `default` stay optional in request types (the API applies the default).
  alphabetize: false,
  defaultNonNullable: false,
  // Keep `const` discriminators (event.type) as literal types.
  exportType: false,
});
const schema = header + astToString(ast);

const eventTypes = Object.keys(spec.webhooks ?? {}).sort();
const eventTypesSource =
  header +
  '/** Every webhook event type the API can send. New types may be added at any time; ignore ones you do not handle. */\n' +
  'export const EVENT_TYPES = [\n' +
  eventTypes.map((t) => `  '${t}',`).join('\n') +
  '\n] as const;\n' +
  'export type GeneratedEventType = (typeof EVENT_TYPES)[number];\n' +
  `\n/** The dated API version the committed contract describes (\`info.version\`). */\nexport const SPEC_API_VERSION = '${spec.info.version}';\n`;

const files = {
  'schema.ts': schema,
  'event-types.ts': eventTypesSource,
};

let stale = [];
for (const [name, content] of Object.entries(files)) {
  const path = resolve(outDir, name);
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (check) {
    if (current !== content) stale.push(`src/generated/${name}`);
  } else if (current !== content) {
    writeFileSync(path, content);
    console.log(`generate: wrote src/generated/${name}`);
  } else {
    console.log(`generate: src/generated/${name} unchanged`);
  }
}
if (stale.length) {
  console.error(`generate: stale ${stale.join(', ')}. Run \`pnpm generate\` and commit the result.`);
  process.exit(1);
}
if (check) console.log('generate: up to date');
