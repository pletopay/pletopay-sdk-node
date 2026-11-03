# Contributing

Thanks for helping improve the Pletopay Node.js SDK.

## Setup

```bash
pnpm install
pnpm verify
```

Node.js 24 and pnpm 10 are used for development (the published package supports Node.js 24+).

## How the SDK is built

- `spec/public.v1.yaml` is a committed copy of the merchant API contract. `pnpm spec:sync` refreshes it from a sibling `pletopay-api` checkout (or `PLETOPAY_SPEC_PATH`).
- `pnpm generate` writes `src/generated/schema.ts` (types) and `src/generated/event-types.ts` from the spec; `pnpm generate:docs` writes `docs/api-reference.md`. Never edit generated files; CI runs `pnpm generate:check` and `pnpm docs:check`.
- `src/operations.ts` lists every operation (method, path, idempotency, query parameters). `test/spec-conformance.spec.ts` checks it against the spec and checks that each operation has exactly one resource method.
- Resource classes in `src/resources/` are thin: they pass typed params to `client.call()` / `client.list()`.

## Adding or changing an operation

1. `pnpm spec:sync && pnpm generate && pnpm generate:docs`.
2. Add the entry to `src/operations.ts` and the method to the resource class. Hand-write any new query parameter type in `src/types.ts` and extend `test/unit/types.spec.ts`.
3. Add unit tests (mock `fetch` with `test/unit/helpers.ts`) and, where it matters, a live test.
4. Add a line to `CHANGELOG.md` under _Unreleased_.
5. `pnpm verify`.

## Style

Prettier and ESLint are enforced (`pnpm format`, `pnpm lint`). The brand is spelled "Pletopay"; only the protocol headers (`X-PletoPay-Signature`, `PletoPay-Version`) keep the capital P, and `pnpm check:brand` enforces this.

## Releasing

1. Bump `version` in `package.json` and `src/version.ts`, move the _Unreleased_ changelog entries under the new version and date.
2. Tag `vX.Y.Z` and push the tag. The release workflow runs `pnpm verify` and publishes to npm with provenance.
