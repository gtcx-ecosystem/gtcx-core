# Package Spec — `@gtcx/domain`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Commodity-agnostic domain services for the GTCX protocol. Provides the foundational data models, service interfaces, event types, and domain logic shared across all platform services. Extracted from business service implementations to give consuming packages a stable, dependency-injection-friendly interface layer.

---

## Design Principles

This package enforces 10/10 architectural compliance across 12 dimensions:

| Principle            | Implementation                                                    |
| -------------------- | ----------------------------------------------------------------- |
| P1 Package structure | Clean `src/` + `internal/` separation                             |
| P2 Type safety       | Zod schemas at all boundaries                                     |
| P3 Modularity        | Independent services with granular exports                        |
| P4 Composability     | Full dependency injection                                         |
| P5 AI-Native         | AI integration interfaces + operation logging                     |
| P6 Asset abstraction | `commodityType: string` throughout — no hardcoded commodity types |
| P7 Documentation     | Complete API reference + threat model                             |
| P8 Offline-first     | Offline queue with conflict resolution                            |
| P9 Security          | Input sanitization, rate limiting hooks                           |
| P10 API stability    | Versioning, deprecation markers, changelog                        |
| P11 Data evolution   | Schema versioning + migrations                                    |
| P12 Observability    | Events + metrics + AI logging                                     |

---

## Public API

### Domain Models and Types

Commodity-agnostic data models for asset lots, registrations, trades, compliance records, and all protocol entities. Types follow `commodityType: string` — commodity identity is an attribute, not a type branch.

### Service Interfaces

Dependency-injected interfaces for:

- Asset lot registration
- Trading and market operations
- Compliance monitoring
- Provenance tracking

Concrete implementations live in `@gtcx/services`.

### Event Types

All domain events — registration, trade, compliance, provenance — with typed payload shapes. Consumed by `@gtcx/events`.

### API Versioning

| Export                               | Description                                       |
| ------------------------------------ | ------------------------------------------------- |
| `API_VERSION`                        | Current API version string                        |
| `MIN_SUPPORTED_VERSION`              | Minimum version downstream consumers must support |
| `DEPRECATIONS`                       | Map of deprecated exports with removal versions   |
| `API_STABILITY`                      | Stability tier for each export                    |
| `CHANGELOG`                          | Programmatic changelog                            |
| `checkVersionCompatibility(version)` | Verify version compatibility at runtime           |

---

## Dependencies

| Dependency                   | Role                               |
| ---------------------------- | ---------------------------------- |
| `@gtcx/types` `workspace:*`  | Base protocol types                |
| `@gtcx/crypto` `workspace:*` | Hashing for domain object identity |
| `@gtcx/utils` `workspace:*`  | Shared utilities                   |
| `zod` `^3.23.0`              | Schema validation                  |

---

## Non-Goals

- Does not contain service implementations — those are in `@gtcx/services`
- Does not manage network or sync — `@gtcx/network` and `@gtcx/sync`
- Does not contain platform-specific code (mobile, web, server)

---

## Implementation

`packages/domain/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/services.md`](./services.md) — concrete service implementations
- [`_sop/2-docs/5-specs/4-backend/packages/events.md`](./events.md) — event bus consuming domain event types
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview and dependency rules
