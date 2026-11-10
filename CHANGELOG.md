# Changelog

All notable changes to `@pletopay/node` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org).

## [1.1.0] - 2026-11-10

### Fixed

- Auto-pagination of a list started with `ending_before` walked the wrong way: the second request used `starting_after`, so it returned the cursor object and everything older, and the newer objects past the first page were never returned. Such a list now continues with `ending_before` set to the first id of the current page until `meta.has_more` is false. `for await` and `autoPagingToArray()` yield oldest to newest across pages, `page.nextCursor` is the id to pass as `ending_before`, and `page.data` keeps the API's order. Lists without `ending_before` are unchanged.
- `transfers.create` and `refunds.create` were reported as failed while the API went on to pay out: the request timed out after 30 s although the API can wait up to 75 s for the bank, the retries got `409 idempotency_request_in_progress` and the SDK threw about a second later. These two calls now default to a 90 s timeout (a `timeoutMs` set on the client or the call still wins), and `409 idempotency_request_in_progress` is retried with the same key about every 2 s (or after `Retry-After`) without using up `maxRetries`, until the first attempt answers or 90 s have passed since the call started.
- A timeout or a connection reset while the response body was arriving escaped as a raw `TimeoutError` / `TypeError` and was not retried. It is now a `PletopayTimeoutError` / `PletopayConnectionError` and retried like any other. The `onResponse` hook now runs once the body has been read.

### Added

- `idempotencyKey` on every error thrown for a request that carried an `Idempotency-Key` (API errors of any status, `PletopayTimeoutError`, `PletopayConnectionError`), whether the key was yours or generated, so a caller can retry or reconcile with it.
- `defaultTimeoutMs` on `pletopay.request()` and `moneyOut` on the entries of `OPERATIONS`.

## [1.0.0] - 2026-11-03

### Security

- Requests are sent with `redirect: 'error'`: the API never redirects, and following one could re-send the secret key (or replay a POST) to wherever a misconfigured proxy or hijacked name points.

### Added

- `Pletopay` client covering all 82 operations of the merchant API (`PletoPay-Version: 2026-09-25`), with types generated from the OpenAPI contract.
- Automatic `Idempotency-Key` generation on idempotent writes, client-side key validation, and automatic retries with exponential backoff that honour `Retry-After`.
- Cursor pagination with async iteration (`for await`), `nextPage()`, `pages()` and `autoPagingToArray()`.
- Typed errors: one class per API error type, plus connection, timeout and signature-verification errors. Every API error carries `code`, `param`, `details`, `requestId` and the rate-limit headers.
- Webhook helpers: `constructEvent`, `verifySignature`, `generateTestHeaderString`, `isEvent`, `isKnownEventType`, a typed `Event` union and the `EVENT_TYPES` list.
- Request hooks, logger, `AbortSignal` and timeout support, custom `fetch` and undici `dispatcher` injection, `X-Correlation-Id`, `appInfo` in the `User-Agent`.
- `lastResponseOf()` and `pletopay.request()` for access to the full response envelope and headers.
