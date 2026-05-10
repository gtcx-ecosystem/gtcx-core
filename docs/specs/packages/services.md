# Package Spec — `@gtcx/services`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Application-level business service implementations for the GTCX protocol. Extracted from `@gtcx/domain` to maintain a clean separation between domain model types (stable, broadly depended upon) and service logic (higher-churn, platform-facing). All services use dependency injection for testability and offline compatibility.

---

## Public API

### Asset Lot Registration Service

| Export                        | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `AssetLotRegistrationService` | Class: commodity-agnostic asset registration orchestration |
| `RegistrationConfig`          | Type: service configuration                                |
| `ValidationError`             | Error: registration input validation failed                |

Orchestrates: input validation → identity verification → certificate generation → event emission → sync queue.

### Trading Service

| Export                   | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| `TradingService`         | Class: market pricing, opportunity detection, trade execution    |
| `TradingConfig`          | Type: service configuration — rate limits, compliance thresholds |
| `LicenseValidationError` | Error: actor not licensed for this trade                         |
| `ComplianceError`        | Error: trade blocked by compliance rule                          |
| `MaxValueError`          | Error: trade exceeds value limit                                 |

### Unified Compliance Service

| Export                     | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `UnifiedComplianceService` | Class: multi-protocol compliance monitoring and reporting |
| Compliance event types     | Typed compliance check results                            |

---

## Dependencies

| Dependency                   | Role                                      |
| ---------------------------- | ----------------------------------------- |
| `@gtcx/crypto` `workspace:*` | Hashing for audit trail integrity         |
| `@gtcx/domain` `workspace:*` | Domain model types and service interfaces |

---

## Dependency Injection

All services accept their dependencies at construction time. Required injections:

- `AssetLotRegistrationService`: event emitter, sync queue, identity verifier, certificate generator
- `TradingService`: pricing oracle, compliance checker, event emitter, license registry
- `UnifiedComplianceService`: compliance rules source, event emitter, report store

No service holds a direct reference to a database, network client, or platform API — those are injected adapters.

---

## Non-Goals

- Does not define domain model types — that is `@gtcx/domain`
- Does not manage cryptographic operations directly — delegates to `@gtcx/crypto` via injected adapters
- Does not contain platform-specific code (mobile, web, server) — services are environment-agnostic

---

## Implementation

`packages/services/src/`

---

## Reference

- [`docs/specs/packages/domain.md`](./domain.md) — domain models and service interfaces
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
