# Shared Infrastructure Architecture

| Attribute | Value                  |
| --------- | ---------------------- |
| Scope     | gtcx-core architecture |
| Status    | Active                 |

## Overview

The shared infrastructure layer provides the foundational packages and crates that every downstream GTCX repo depends on. Core concerns — identity, cryptography, validation, networking, and sync — are centralized in composable `@gtcx/*` packages and Rust crates.

## Design Principles

| Principle                  | Application                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| Modular package boundaries | Each package has a single responsibility and explicit dependency rules |
| Runtime validation         | Zod schemas validate all external boundaries                           |
| Composable primitives      | Packages are independently importable and DI-friendly                  |
| Security-first defaults    | Validation, auditing, and key handling are enforced by default         |
| Offline-first readiness    | Sync and event layers are designed for intermittent connectivity       |

## Dependency Rules

- `@gtcx/crypto` has no hard internal dependencies.
- `@gtcx/identity`, `@gtcx/security`, and `@gtcx/verification` build on `@gtcx/crypto`.
- `@gtcx/domain` provides foundational types and events; `@gtcx/services` builds on it.
- Circular dependencies are disallowed.
- Rust crates are consumed only through their TypeScript binding packages — not directly.

## Performance and Evidence

- Performance budgets and results are tracked in `benchmarks/`.
- Quality and API baselines are tracked in `quality/`.
- UAT evidence is in `SOP/3-agile/` (sprint UAT evidence log).

## References

- `components.md`
- `integration-patterns.md`
- `SOP/2-docs/2-specs/data-models.md`
- `SOP/2-docs/2-specs/packages/`
