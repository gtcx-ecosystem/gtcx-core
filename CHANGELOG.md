# Changelog — @gtcx/core

All notable changes to the GTCX Core monorepo.

## [1.0.0] — 2026-03-19

### Packages

- `@gtcx/crypto` — Cryptographic primitives (BBS+, Ed25519, hashing, key management)
- `@gtcx/domain` — Domain models and business logic types
- `@gtcx/schemas` — Zod validation schemas for all domain boundaries
- `@gtcx/audit` — Audit trail generation and verification
- `@gtcx/auth` — Authentication and authorization primitives
- `@gtcx/validators` — Cross-package validation utilities
- `@gtcx/security` — Security policy enforcement

### Quality

- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESLint with `@typescript-eslint/recommended-type-checked` + `eslint-plugin-security`
- Husky + lint-staged pre-commit hooks
- 96% statement coverage with CI-enforced thresholds
- Conventional commits enforced via commitlint

### Infrastructure

- pnpm workspaces with Turborepo orchestration
- Vitest test runner with v8 coverage
- CI pipeline: lint → typecheck → test → build (no continue-on-error)
