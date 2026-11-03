#!/usr/bin/env node
/**
 * Registers a throwaway merchant on a local API and prints its test secret key, for the live
 * suite and the examples. Development only: it uses the dashboard registration endpoints.
 *
 *   node scripts/create-test-merchant.mjs [http://localhost:8080]
 *   export PLETOPAY_SECRET_KEY=$(node scripts/create-test-merchant.mjs | tail -1)
 */
const apiUrl = (process.argv[2] ?? process.env.PLETOPAY_API_URL ?? 'http://localhost:8080').replace(/\/+$/, '');
const password = 'sdk-live-tests-correct-horse-2026';
const email = `sdk-${Date.now()}@example.com`;

async function post(path, body, headers = {}) {
  const res = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path} failed: HTTP ${res.status} ${JSON.stringify(json)}`);
  return json.data ?? json;
}

const reg = await post('/dashboard/v1/auth/register', {
  email,
  password,
  name: 'SDK Tests',
  organization_name: `SDK Live ${new Date().toISOString().slice(0, 16)}`,
});
const org = reg.organizations[0].id;
const key = await post(
  '/dashboard/v1/api-keys/reveal',
  { password },
  { authorization: `Bearer ${reg.access_token}`, 'x-organization-id': org, 'x-mode': 'test' },
);
console.error(`merchant ${email} (${org}) on ${apiUrl}`);
console.log(key.secret);
