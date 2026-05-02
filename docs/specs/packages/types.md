# Package Spec — `@gtcx/types`

**Classification:** Standard — changes follow normal PR review process. API surface changes require Protocol Architect review (any removed or renamed type is a breaking change for all 17 downstream consumers).

---

## Purpose

Shared TypeScript interfaces for the entire GTCX ecosystem. The single source of truth for all cross-package data shapes. Every `@gtcx/*` package and every downstream repo imports base types from here — never defines them locally.

---

## Public API

### Modules

| Module      | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `protocols` | Protocol-level types — TradePass, GeoTag, GCI, VaultMark, PvP, PANX       |
| `models`    | Domain model types — identities, asset lots, commodities, certificates    |
| `api`       | API request/response shapes — shared across all service boundaries        |
| `common`    | Primitive utilities — `Result<T, E>`, `Option<T>`, pagination, timestamps |

All modules re-exported from the package root.

---

## Dependencies

No runtime dependencies. This is a type-only package — it contains zero runtime code and zero npm dependencies.

---

## API Surface Policy

This package is the most depended-on package in the monorepo. Every type change is a potential breaking change:

- **Removing a type or field**: breaking — requires a major version bump
- **Renaming a type or field**: breaking — requires a major version bump
- **Adding an optional field**: non-breaking — minor version bump
- **Adding a new type**: non-breaking — minor version bump

All type removals or renames require Protocol Architect approval and an updated API surface baseline (`pnpm api:update-baseline`).

---

## Non-Goals

- Does not contain runtime logic — no functions, no classes, no Zod schemas
- Does not depend on any other `@gtcx/*` package
- Does not contain package-specific types — each package owns its internal types

---

## Implementation

`packages/types/src/`

---

## Reference

- [`docs/specs/core-spec.md`](../core-spec.md) — dependency rules (all packages may depend on `@gtcx/types`)
- [`docs/devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md) — API surface gate
