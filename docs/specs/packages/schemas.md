---
title: "Package Spec — `@gtcx/schemas`"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

---
title: 'Schemas'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/schemas`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Centralized Zod schema definitions for the GTCX ecosystem. Provides runtime-validated schemas for protocol data structures, including the Core12 compliance framework. Consuming packages import schemas from here rather than defining their own, ensuring consistent validation rules across services.

---

## Public API

### Core12 Framework (`src/core12/`)

The Universal Compliance Framework — 12-dimension compliance schema for commodity trade and verification.

| Export            | Description                                       |
| ----------------- | ------------------------------------------------- |
| Core12 schema     | Zod schema for the 12-dimension compliance record |
| Core12 types      | TypeScript types inferred from the Zod schema     |
| Core12 validators | Pre-composed validation functions                 |

### Planned Additions (not yet implemented)

| Schema                     | Protocol  |
| -------------------------- | --------- |
| TradePass identity schemas | TradePass |
| GeoTag provenance schemas  | GeoTag    |
| GCI compliance schemas     | GCI       |
| VaultMark custody schemas  | VaultMark |

---

## Dependencies

| Dependency                  | Role                                     |
| --------------------------- | ---------------------------------------- |
| `@gtcx/types` `workspace:*` | Base types that schemas validate against |
| `zod` `^3.23.0`             | Schema definition and runtime validation |

---

## Schema Versioning

Schema changes that add required fields or change validation rules are breaking for existing data. All schema changes must:

1. Be backward compatible or bump schema version
2. Include migration guidance in the commit message
3. Update any affected validation tests

---

## Non-Goals

- Does not contain runtime business logic — schemas validate, they do not compute
- Does not define application-specific schemas — those belong in the consuming package

---

## Implementation

`packages/schemas/src/`

---

## Reference

- [`docs/specs/packages/types.md`](./types.md) — base types
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
