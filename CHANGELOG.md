# Changelog

All notable changes to `@pletopay/node` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

### Security

- Requests are sent with `redirect: 'error'`: the API never redirects, and following one could re-send the secret key (or replay a POST) to wherever a misconfigured proxy or hijacked name points.

## [1.0.0] - 2026-10-23

### Added

- `Pletopay` client covering all 82 operations of the merchant API (`PletoPay-Version: 2026-09-25`), with types generated from the OpenAPI contract.
- Automatic `Idempotency-Key` generation on idempotent writes, client-side key validation, and automatic retries with exponential backoff that honour `Retry-After`.
- Cursor pagination with async iteration (`for await`), `nextPage()`, `pages()` and `autoPagingToArray()`.
- Typed errors: one class per API error type, plus connection, timeout and signature-verification errors. Every API error carries `code`, `param`, `details`, `requestId` and the rate-limit headers.
- Webhook helpers: `constructEvent`, `verifySignature`, `generateTestHeaderString`, `isEvent`, `isKnownEventType`, a typed `Event` union and the `EVENT_TYPES` list.
- Request hooks, logger, `AbortSignal` and timeout support, custom `fetch` and undici `dispatcher` injection, `X-Correlation-Id`, `appInfo` in the `User-Agent`.
- `lastResponseOf()` and `pletopay.request()` for access to the full response envelope and headers.
