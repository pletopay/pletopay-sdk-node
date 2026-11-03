# Examples

Each file is a small, runnable script. They import `@pletopay/node` as a published package; inside this repository, link it first (`pnpm build && pnpm link --global` then `pnpm link --global @pletopay/node` in your project) or replace the import with `../src`.

- `create-checkout-session.ts`: server-created session for the hosted page or the popup.
- `payout.ts`: name enquiry, then a transfer with a deterministic idempotency key and error handling.
- `express-webhook.ts`: raw-body signature verification, fast 200, de-duplication and typed event handling (needs `express`).
