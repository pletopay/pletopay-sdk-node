# Pletopay Node.js SDK

`@pletopay/node` is the official Node.js client for the [Pletopay API](https://docs.pletopay.com): bank-transfer payments, virtual accounts, checkout, invoices, transfers, settlements and signed webhooks for Nigeria.

- Every endpoint of the merchant API, typed from the published OpenAPI contract.
- Idempotency keys, automatic retries, cursor pagination, typed errors and webhook signature verification built in.
- Zero runtime dependencies. Node.js 24 or newer (uses the global `fetch`). ESM and CommonJS. TypeScript types included.

## Install

```bash
npm install @pletopay/node
# or: pnpm add @pletopay/node · yarn add @pletopay/node
```

## Quick start

```ts
import { Pletopay } from '@pletopay/node';

const pletopay = new Pletopay({ secretKey: process.env.PLETOPAY_SECRET_KEY });

// 1. Create a payment: the customer transfers to the account in `bank_transfer`.
const payment = await pletopay.payments.create(
  { amount: 5000000, currency: 'NGN', reference: 'ORDER-123', customer: { email: 'ada@example.com' } },
  { idempotencyKey: 'create-payment-ORDER-123' },
);
console.log(payment.bank_transfer); // { account_number, account_name, bank_name, expires_at, … }

// 2. Confirm from the server: the payment is paid only when `status` is `succeeded`.
const latest = await pletopay.payments.retrieve(payment.id);
if (latest.status === 'succeeded') {
  // fulfil ORDER-123, once
}
```

Amounts are integers in kobo (₦50,000.00 is `5000000`). Test and live data are separate: the key prefix (`sk_test_` / `sk_live_`) selects the mode and there is no separate sandbox host.

The secret key must stay on your server. Browsers use the publishable key with [pletopay.js](https://docs.pletopay.com/checkout/popup); this SDK refuses `pk_` keys.

## Configuration

```ts
const pletopay = new Pletopay({
  secretKey: 'sk_test_…', // default: process.env.PLETOPAY_SECRET_KEY
  baseUrl: 'https://api.pletopay.com', // default: process.env.PLETOPAY_API_URL, then this
  apiVersion: '2026-09-25', // the dated version this SDK's types describe (default); null to use your organization's pin
  timeoutMs: 30000, // per request; when omitted: 30 s, and 90 s for transfers.create and refunds.create
  maxRetries: 2, // see Retries
  webhookSecret: process.env.PLETOPAY_WEBHOOK_SECRET, // for pletopay.webhooks.constructEvent
  correlationId: () => requestContext.id, // sent as X-Correlation-Id
  appInfo: { name: 'my-shop-plugin', version: '1.2.0' }, // appended to User-Agent
  fetch: customFetch, // e.g. for instrumentation
  dispatcher: new EnvHttpProxyAgent(), // undici dispatcher: proxies, keep-alive tuning
  hooks: { onRetry: (ctx) => metrics.increment('pletopay.retry', { reason: ctx.reason }) },
  logger: console,
});
```

Every method also takes per-call options: `{ idempotencyKey, timeoutMs, maxRetries, signal, correlationId, apiVersion, headers }`.

## Resources

Method names follow the API's operation ids. All 82 operations are covered:

| Resource            | Methods                                                                              |
| ------------------- | ------------------------------------------------------------------------------------ |
| `customers`         | `create` `list` `retrieve` `update` `setRiskStatus`                                  |
| `payments`          | `create` `list` `retrieve` `retrieveByReference` (all accept `expand: ['customer']`) |
| `virtualAccounts`   | `create` `list` `retrieve` `retrieveByReference` `close`                             |
| `subaccounts`       | `create` `list` `retrieve` `update` `retrieveBalance`                                |
| `splitRules`        | `create` `list` `retrieve` `update`                                                  |
| `transfers`         | `create` `list` `retrieve` `retrieveByReference` `resolveAccount`                    |
| `banks`             | `list`                                                                               |
| `settlements`       | `list` `retrieve` `listItems`                                                        |
| `refunds`           | `create` `list` `retrieve` `retrieveByReference`                                     |
| `checkout.sessions` | `create` `list` `retrieve` `retrieveByReference` `expire`                            |
| `paymentLinks`      | `create` `list` `retrieve` `update`                                                  |
| `invoices`          | `create` `list` `retrieve` `update` `finalize` `void` `markUncollectible`            |
| `plans`             | `create` `list` `retrieve` `update`                                                  |
| `subscriptions`     | `create` `list` `retrieve` `cancel`                                                  |
| `risk`              | `listEvents` `retrieveLimits`                                                        |
| `reports`           | `create` `list` `retrieve` `download` (CSV text) `statement`                         |
| `webhookEndpoints`  | `create` `list` `retrieve` `update` `delete` `rotateSecret` `test` `listDeliveries`  |
| `events`            | `list` `retrieve` `listDeliveries` `replay`                                          |
| `balance`           | `retrieve`                                                                           |
| `transactions`      | `list`                                                                               |
| `sandbox`           | `simulateTransfer` (test mode only; refused locally with a live key)                 |

Request and response shapes are the API's own `snake_case` JSON, typed from the contract: `PaymentCreateParams`, `Payment`, `Transfer`, `CheckoutSession`, … are all exported, so your editor completes every field. **[docs/api-reference.md](docs/api-reference.md)** documents all 82 operations: each request field with its type and whether it is required, the query parameters, the response object and an example. The [developer portal](https://docs.pletopay.com) has the guides.

### Checkout

```ts
const session = await pletopay.checkout.sessions.create(
  { amount: 250000, currency: 'NGN', reference: 'ORDER-124', success_url: 'https://shop.test/thanks' },
  { idempotencyKey: 'checkout-ORDER-124' },
);
// Hosted page: redirect to session.url. Popup: hand session.token to pletopay.js in the browser.
// Later, on your server:
const done = await pletopay.checkout.sessions.retrieve(session.id);
if (done.status === 'complete') {
  /* fulfil */
}
```

### Transfers (payouts)

```ts
const who = await pletopay.transfers.resolveAccount({ bank_code: '058', account_number: '0123456789' });
const transfer = await pletopay.transfers.create(
  {
    amount: 2500000,
    currency: 'NGN',
    reference: 'PAYOUT-2026-0001',
    narration: 'Vendor payout',
    beneficiary: { bank_code: '058', account_number: '0123456789' },
  },
  { idempotencyKey: 'payout-PAYOUT-2026-0001' },
);
```

The API requires an `Idempotency-Key` on transfers and refunds. Pass your own, deterministic key (your payout id) so a retry from a crashed process can never pay twice. The SDK generates a random key only when you omit it.

## Pagination

List methods return the first page, and the result is also an async iterable over every item:

```ts
for await (const payment of pletopay.payments.list({ status: 'succeeded', created: { gte: '2026-09-01T00:00:00Z' } })) {
  console.log(payment.id);
}

const page = await pletopay.payments.list({ limit: 50 });
page.data;
page.hasMore;
page.nextCursor;
const next = await page.nextPage(); // null on the last page
const firstHundred = await pletopay.transfers.list().autoPagingToArray({ limit: 100 });
```

Lists are newest first, and iterating walks towards older objects. Start a list with `ending_before` to go the other way, for example to pick up everything created since the last object you processed:

```ts
for await (const payment of pletopay.payments.list({ ending_before: lastSeenPaymentId })) {
  // every payment newer than lastSeenPaymentId, oldest first
}
```

On such a list, iteration and `autoPagingToArray()` yield oldest to newest across all pages, `nextPage()` / `pages()` move to the next newer page, and `page.nextCursor` is the id to pass as `ending_before` (not `starting_after`). Each `page.data` stays in the order the API returned it: newest first.

Filters use the API's bracket syntax under the hood (`created[gte]`, `amount[lte]`, `expand[]`); pass plain objects and arrays.

## Errors

Every failed request throws a subclass of `PletopayApiError` chosen from the API's `error.type`. Branch on `code`, which is stable; `message` is for people.

```ts
import { PletopayApiError, PletopayConflictError, PletopayRateLimitError } from '@pletopay/node';

try {
  await pletopay.payments.create({ amount: 100, currency: 'NGN', reference: 'ORDER-1' });
} catch (error) {
  if (error instanceof PletopayConflictError && error.code === 'duplicate_reference') {
    return pletopay.payments.retrieveByReference('ORDER-1');
  }
  if (error instanceof PletopayRateLimitError) console.log('retry after', error.retryAfter, 's');
  if (error instanceof PletopayApiError) console.log(error.status, error.code, error.param, error.requestId);
  throw error;
}
```

| Class                                              | When                                                            |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `PletopayInvalidRequestError`                      | 400: a field is missing, invalid or unknown (`param` names it)  |
| `PletopayAuthenticationError`                      | 401: bad or missing key                                         |
| `PletopayPermissionError`                          | 403: not allowed in this mode or for this account               |
| `PletopayNotFoundError`                            | 404                                                             |
| `PletopayConflictError`                            | 409: wrong state, duplicate reference                           |
| `PletopayIdempotencyError`                         | 409/422: key reused with a different body, or still in progress |
| `PletopayRateLimitError`                           | 429, with `retryAfter`                                          |
| `PletopayServerError`                              | 5xx                                                             |
| `PletopayConnectionError` / `PletopayTimeoutError` | no response / `timeoutMs` exceeded                              |
| `PletopaySignatureVerificationError`               | a webhook did not verify                                        |

All of them extend `PletopayError`. `requestId` is on every API error: quote it to support. `idempotencyKey` is on every error from a request that carried an `Idempotency-Key`, including timeouts and connection errors (see below). The full catalogue of codes is in the [API reference](https://docs.pletopay.com/reference/errors).

## Retries and idempotency

Network errors, timeouts, `429`, `500`, `502`, `503` and `409 idempotency_request_in_progress` are retried up to `maxRetries` times (default 2) with exponential backoff and jitter, honouring `Retry-After`. A request is retried only when that is safe: `GET`/`DELETE`, or a write that carries an `Idempotency-Key`. Writes to endpoints that accept the header get a generated UUID key when you do not pass one, so the retry replays the same request instead of acting twice.

`transfers.create` and `refunds.create` answer only once the bank has, which can take up to 75 seconds. Their default timeout is therefore 90 seconds instead of 30; a `timeoutMs` you set on the client or on the call still wins.

`409 idempotency_request_in_progress` means the first attempt with that key is still running. When retries are on (`maxRetries` > 0), the SDK asks again with the same key about every 2 seconds (or after `Retry-After`) without using up `maxRetries`, until the first attempt answers or 90 seconds have passed since the call started. Then it throws the `PletopayIdempotencyError`.

**A timeout or a connection error on a transfer or refund does not mean it failed.** The API may have received the request and may still pay out. Every error thrown for a request that carried an `Idempotency-Key` exposes it as `error.idempotencyKey`, whether you passed the key or the SDK generated it. Use it before you tell anyone the money did not move:

```ts
import { PletopayError } from '@pletopay/node';

try {
  await pletopay.transfers.create(params, { idempotencyKey: 'payout-PAYOUT-2026-0001' });
} catch (error) {
  if (error instanceof PletopayError && error.idempotencyKey) {
    // Same key and same body: the API replays the first outcome instead of paying twice.
    await pletopay.transfers.create(params, { idempotencyKey: error.idempotencyKey });
    // Or look it up: pletopay.transfers.retrieveByReference(params.reference)
  }
}
```

## Webhooks

Verify every delivery against the raw request body, then act on `event.type`. Deliveries are at least once and unordered: de-duplicate on `event.id`.

```ts
import express from 'express';
import { Pletopay, PletopaySignatureVerificationError } from '@pletopay/node';

const pletopay = new Pletopay({ webhookSecret: process.env.PLETOPAY_WEBHOOK_SECRET });
const app = express();

app.post('/webhooks/pletopay', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = pletopay.webhooks.constructEvent(req.body, req.headers['x-pletopay-signature']);
  } catch (error) {
    if (error instanceof PletopaySignatureVerificationError) return res.status(400).send(error.message);
    throw error;
  }
  res.sendStatus(200); // answer within 10 s, then do the work

  switch (event.type) {
    case 'payment.succeeded':
      fulfil(event.data.object.reference, event.data.object.amount_received); // typed as Payment
      break;
    case 'transfer.failed':
      alert(event.data.object);
      break;
  }
});
```

`constructEvent` throws `PletopaySignatureVerificationError` for a missing, malformed, stale (more than 300 s old) or wrong signature. `verifySignature` returns a boolean instead. To test your handler, sign a payload with `generateTestHeaderString({ payload, secret })`.

The `Event` type is a discriminated union of every documented event, so `event.data.object` narrows after `switch (event.type)`. New event types may appear at any time; `isKnownEventType` tells you whether this SDK version knows one.

## Lower-level access

```ts
import { lastResponseOf } from '@pletopay/node';

const balance = await pletopay.balance.retrieve();
lastResponseOf(balance)?.requestId; // and rateLimit, apiVersion, idempotentReplayed, headers

// Any endpoint, with the full envelope back:
const { data, meta, requestId } = await pletopay.request('GET', '/api/v1/payments', { query: { limit: 5 } });
```

## Versioning

The SDK follows [semantic versioning](https://semver.org). It sends `PletoPay-Version: 2026-09-25` (`Pletopay.API_VERSION`) so responses always match its types; set `apiVersion` to pin a different dated version. New fields, parameters, event types and enum values can appear at any time without a major release, so treat unknown values as data. See [CHANGELOG.md](CHANGELOG.md).

## Development

```bash
pnpm install
pnpm spec:sync && pnpm generate && pnpm generate:docs   # refresh the spec copy, src/generated and docs/api-reference.md
pnpm verify                       # lint, format, typecheck, generated-code and brand checks, unit tests, build, publint, attw
PLETOPAY_API_URL=http://localhost:8080 PLETOPAY_SECRET_KEY=sk_test_… pnpm test:live   # against a running API
```

`test/spec-conformance.spec.ts` fails whenever the contract gains or changes an operation that the SDK does not implement.

## License

[MIT](LICENSE)
