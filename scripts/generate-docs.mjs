#!/usr/bin/env node
/**
 * Writes docs/api-reference.md: one section per operation with the SDK call, every request field
 * (type, required, description), the query parameters, the response type and the contract's own
 * example. Generated from spec/public.v1.yaml and src/operations.ts; never edit it by hand.
 *
 *   node scripts/generate-docs.mjs           write
 *   node scripts/generate-docs.mjs --check   fail when stale
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const spec = parse(readFileSync(resolve(root, 'spec', 'public.v1.yaml'), 'utf8'));
const operationsSource = readFileSync(resolve(root, 'src', 'operations.ts'), 'utf8');
const check = process.argv.includes('--check');

// operationId -> sdk method, from the operation table.
const sdkOf = {};
for (const m of operationsSource.matchAll(/id: '(\w+)'[\s\S]*?sdk: '([\w.]+)'/g)) sdkOf[m[1]] = m[2];

const schemas = spec.components.schemas;
const deref = (s) => (s && s.$ref ? schemas[s.$ref.split('/').pop()] : s);
const refName = (s) => (s && s.$ref ? s.$ref.split('/').pop() : undefined);

function typeOf(schema, depth = 0) {
  const s = deref(schema);
  if (!s) return 'unknown';
  const name = refName(schema);
  if (name && depth > 0 && !name.endsWith('Dto')) return `[${name}](#${name.toLowerCase()})`;
  if (s.enum) return s.enum.map((v) => `\`${v}\``).join(' · ');
  if (s.const !== undefined) return `\`${s.const}\``;
  if (s.oneOf) return s.oneOf.map((o) => typeOf(o, depth + 1)).join(' or ');
  if (s.anyOf) return s.anyOf.map((o) => typeOf(o, depth + 1)).join(' or ');
  if (Array.isArray(s.type)) return s.type.map((t) => (t === 'null' ? 'null' : t)).join(' or ');
  if (s.type === 'array') return `array of ${typeOf(s.items, depth + 1)}`;
  if (s.type === 'object') {
    if (s.additionalProperties && !s.properties) return `map of string to ${typeOf(s.additionalProperties, depth + 1)}`;
    return name && depth > 0 ? name : 'object';
  }
  return (s.format ? `${s.type} (${s.format})` : s.type) ?? 'unknown';
}

function constraints(s) {
  const out = [];
  if (s.minimum !== undefined) out.push(`min ${s.minimum}`);
  if (s.maximum !== undefined) out.push(`max ${s.maximum}`);
  if (s.minLength !== undefined) out.push(`min length ${s.minLength}`);
  if (s.maxLength !== undefined) out.push(`max length ${s.maxLength}`);
  if (s.pattern) out.push(`pattern \`${s.pattern}\``);
  if (s.default !== undefined) out.push(`default \`${JSON.stringify(s.default)}\``);
  return out.join(', ');
}

const cell = (text) =>
  String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n+/g, ' ')
    .trim();

function fieldsTable(schema, path = '') {
  const s = deref(schema);
  if (!s || !s.properties) return '';
  const required = new Set(s.required ?? []);
  const rows = [];
  const nested = [];
  for (const [name, prop] of Object.entries(s.properties)) {
    const p = deref(prop);
    const full = path ? `${path}.${name}` : name;
    rows.push(
      `| \`${full}\` | ${typeOf(prop, 1)} | ${required.has(name) ? '**yes**' : 'no'} | ${cell([p.description, constraints(p)].filter(Boolean).join('. '))} |`,
    );
    if (p.type === 'object' && p.properties && !p.additionalProperties) nested.push([full, prop]);
    if (p.type === 'array' && deref(p.items)?.properties) nested.push([`${full}[]`, p.items]);
  }
  let out = `| Field | Type | Required | Description |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n`;
  for (const [full, sub] of nested) out += `\n${fieldsTable(sub, full)}`;
  return out;
}

function example(op) {
  const body = op.requestBody?.content?.['application/json'];
  const ex = body?.example ?? Object.values(body?.examples ?? {})[0]?.value;
  return ex ? JSON.stringify(ex, null, 2) : undefined;
}

function responseInfo(op) {
  const [code, res] = Object.entries(op.responses).find(([c]) => c.startsWith('2')) ?? [];
  if (!res) return { code, text: '' };
  const content = res.content?.['application/json']?.schema;
  if (!content) return { code, text: `${Object.keys(res.content ?? {})[0] ?? 'nothing'} (${cell(res.description)})` };
  const data = content.properties?.data;
  const name = refName(data) ?? (data?.type === 'array' ? `${refName(data.items)}[]` : data?.type);
  const link = refName(data) ?? refName(data?.items);
  return { code, text: `${link ? `[${name}](#${link.toLowerCase()})` : name} — ${cell(res.description)}` };
}

const sdkCall = (op, method) => {
  const sdk = sdkOf[op.operationId];
  const args = [];
  for (const p of op.parameters ?? []) if (p.in === 'path') args.push(p.name);
  if (op.requestBody) args.push('params');
  else if (
    (op.parameters ?? []).some(
      (p) =>
        p.in === 'query' &&
        !['limit', 'starting_after', 'ending_before', 'created'].includes(p.name.replace('[]', '')) &&
        method === 'get',
    )
  )
    args.push('params?');
  else if (method === 'get' && (op.parameters ?? []).some((p) => p.in === 'query')) args.push('params?');
  args.push('options?');
  return `pletopay.${sdk}(${args.join(', ')})`;
};

const tagGroups = spec['x-tagGroups'] ?? [];
const byTag = {};
for (const [path, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!op.operationId) continue;
    (byTag[op.tags?.[0] ?? 'Other'] ??= []).push({ path, method, op });
  }
}

let md = `# @pletopay/node API reference

Generated from the Pletopay OpenAPI contract (\`${spec.info.title}\`, version \`${spec.info.version}\`) by \`pnpm generate:docs\`. One section per operation: the SDK call, the request fields with their types and whether they are required, the query parameters, the response, and the contract's own example. Amounts are integers in kobo. Every method also accepts per-call \`options\` (\`idempotencyKey\`, \`timeoutMs\`, \`maxRetries\`, \`signal\`, \`correlationId\`, \`apiVersion\`, \`headers\`).

`;
md += '## Contents\n\n';
for (const group of tagGroups) {
  md += `- **${group.name}**: ${group.tags
    .map(
      (t) =>
        `[${t}](#${t
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')})`,
    )
    .join(' · ')}\n`;
}
md += '- [Object schemas](#object-schemas)\n\n';

for (const group of tagGroups) {
  for (const tag of group.tags) {
    const ops = byTag[tag] ?? [];
    if (!ops.length) continue;
    const tagDoc = (spec.tags ?? []).find((t) => t.name === tag);
    md += `## ${tag}\n\n${tagDoc?.description ? `${tagDoc.description.trim()}\n\n` : ''}`;
    for (const { path, method, op } of ops) {
      const idem = (op.parameters ?? []).find((p) => p.in === 'header' && p.name === 'Idempotency-Key');
      md += `### \`${sdkCall(op, method)}\`\n\n`;
      md += `\`${method.toUpperCase()} ${path}\` · operation \`${op.operationId}\``;
      if (idem)
        md += idem.required
          ? ' · **Idempotency-Key required** (pass `options.idempotencyKey`; generated when omitted)'
          : ' · Idempotency-Key accepted (generated when omitted)';
      if (op['x-test-mode-only']) md += ' · **test mode only**';
      md += `\n\n${(op.description ?? op.summary ?? '').trim()}\n\n`;
      const pathParams = (op.parameters ?? []).filter((p) => p.in === 'path');
      const query = (op.parameters ?? []).filter((p) => p.in === 'query');
      if (pathParams.length)
        md += `**Path arguments:** ${pathParams.map((p) => `\`${p.name}\` (${cell(p.description) || 'string'})`).join(', ')}\n\n`;
      if (op.requestBody) {
        const schema = op.requestBody.content['application/json'].schema;
        md += `**Request fields** (\`${refName(schema)?.replace(/Dto$/, '') ?? 'params'}\`):\n\n${fieldsTable(schema)}\n`;
      }
      if (query.length) {
        md +=
          '**Query parameters** (`params`):\n\n| Parameter | Type | Required | Description |\n| --- | --- | --- | --- |\n';
        for (const p of query) {
          const name = p.name.replace(/\[\]$/, '');
          const s = deref(p.schema);
          const type =
            refName(p.schema) === 'DateRangeFilter'
              ? '`{ gt?, gte?, lt?, lte? }` (ISO-8601 or Date)'
              : refName(p.schema) === 'AmountRangeFilter'
                ? '`{ gte?, lte? }` (kobo)'
                : typeOf(p.schema, 1);
          md += `| \`${name}\` | ${type} | ${p.required ? '**yes**' : 'no'} | ${cell([p.description, s && constraints(s)].filter(Boolean).join('. '))} |\n`;
        }
        md += '\n';
      }
      const { code, text } = responseInfo(op);
      md += `**Returns** (HTTP ${code}): ${text}\n\n`;
      const ex = example(op);
      if (ex)
        md += `**Example**\n\n\`\`\`ts\nconst result = await ${sdkCall(op, method)
          .replace(/params\??/, ex.replace(/\n/g, '\n  '))
          .replace(/, options\?\)$/, ')')
          .replace(/\(options\?\)$/, '()')};\n\`\`\`\n\n`;
    }
  }
}

md +=
  '## Object schemas\n\nThe response objects, as returned in `data`. Unknown fields may be added at any time; ignore what you do not use.\n\n';
for (const [name, schema] of Object.entries(schemas)) {
  if (name.endsWith('Dto') || name.startsWith('Event_') || !schema.properties) continue;
  md += `### ${name}\n\n${schema.description ? `${schema.description.trim()}\n\n` : ''}${fieldsTable(schema)}\n`;
}

md +=
  '## Webhook events\n\nEach event is `{ id, object: "event", type, api_version, livemode, created_at, data: { object } }` where `data.object` is the resource below. Verify with `constructEvent` and narrow on `type`.\n\n| Event type | `data.object` | When |\n| --- | --- | --- |\n';
for (const [type, hook] of Object.entries(spec.webhooks ?? {})) {
  const body = hook.post?.requestBody?.content?.['application/json']?.schema;
  const obj = deref(body)?.properties?.data?.properties?.object;
  const name = refName(obj) ?? 'object';
  md += `| \`${type}\` | [${name}](#${name.toLowerCase()}) | ${cell((hook.post?.description ?? '').split('\n')[0])} |\n`;
}

const target = resolve(root, 'docs', 'api-reference.md');
const current = existsSync(target) ? readFileSync(target, 'utf8') : null;
if (check) {
  if (current !== md) {
    console.error('docs: docs/api-reference.md is stale. Run `pnpm generate:docs` and commit the result.');
    process.exit(1);
  }
  console.log('docs: up to date');
} else {
  writeFileSync(target, md);
  console.log(`docs: wrote docs/api-reference.md (${Object.values(byTag).flat().length} operations)`);
}
