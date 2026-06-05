---
title: 'ADR-012 Ecosystem Integration Brief'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'gtm']
review_cycle: 'on-change'
---

---

title: '14 ADR-012 Ecosystem Integration'
status: 'current'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['gtm', 'adr-012', 'ecosystem', 'integration']
review_cycle: 'on-change'

---

# ADR-012 Ecosystem Integration Brief

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Protocol Architect

**Purpose:** Explain ADR-012 (Predicate Extension for Entity-Tier Verification) to regulatory sandbox teams, enterprise auditors, and downstream integrators. This document demonstrates how gtcx-core evolves its verification protocol without breaking existing consumers.

---

## What Is ADR-012

ADR-012 extends the WorkProof predicate registry from 38 to 47 predicates across 9 categories, adding entity-tier verification capabilities. This enables downstream products to verify corporate entities (mining cooperatives, buying stations, export brokers) with the same cryptographic rigor as individual producers.

**Key additions:**

| Predicate                      | Domain       | What It Verifies                                             |
| ------------------------------ | ------------ | ------------------------------------------------------------ |
| `EntityRegistered`             | Identity     | Legal registration with a jurisdictional authority           |
| `SanctionsCleared`             | Compliance   | Not present on OFAC, UN, or EU sanctions lists               |
| `PepCleared`                   | Compliance   | No politically exposed person status among beneficial owners |
| `AdverseMediaCleared`          | Compliance   | No material adverse media findings                           |
| `BeneficialOwnershipDisclosed` | Compliance   | Ultimate beneficial owners identified and documented         |
| `AccreditationHeld`            | Compliance   | Valid accreditation from recognized industry body            |
| `EntityRecognized`             | Identity     | Recognized by a trusted authority in the supply chain        |
| `IssuedBy`                     | Relationship | Certificate or credential issued by a specific entity        |
| `OwnershipChain`               | Relationship | Complete chain of custody from mine to export                |

---

## Backward Compatibility Guarantee

Existing downstream consumers using TradePass legacy predicate IDs continue to work without modification.

| Layer              | Mechanism                                                                 |
| ------------------ | ------------------------------------------------------------------------- |
| Legacy IDs         | `TRADEPASS_LEGACY_ID_ALIASES` maps 20+ legacy IDs to canonical URIs       |
| Migration helper   | `resolveLegacyPredicateId()` exported from `@gtcx/verification/migration` |
| Cross-repo handoff | `gtcx-protocols` receives exact implementation steps in handoff doc       |

**Evidence:**

- 10-assertion migration-bridge integration test validates legacy ID → canonical URI → full PredicateDefinition round-trip
- Property-based tests (14 assertions, 500 runs each) verify schema invariants across all 47 predicates

---

## Why This Matters for Regulators

African commodity regulators (RBZ, BoN, BoZ, BoG) require visibility into the full supply chain, not just the mine gate. ADR-012 provides cryptographic proofs for:

- **Corporate due diligence** — Beneficial ownership, sanctions screening, PEP checks
- **Chain of custody** — Ownership transfer from mine to export port
- **Accreditation integrity** — ITSCI, RMI, BGR, and national mineral board certificates

All predicates use the same attestation framework: cryptographically signed evidence with confidence scoring, temporal validity, and decay models.

---

## Why This Matters for Enterprise Buyers

Enterprise procurement teams can now verify:

- That their counterparty is a legally registered entity
- That no sanctions or adverse media taint the ownership structure
- That accreditation claims (fair trade, conflict-free) are backed by cryptographic evidence
- That the ownership chain from source to delivery is intact

This replaces manual document review with automated, cryptographically verifiable checks.

---

## Version and Registry

- **WorkProof version:** 2.2
- **Predicate count:** 47 across 9 categories
- **Registry location:** `03-platform/packages/workproof/src/predicates/registry.ts`
- **Schema validation:** Zod schemas in `03-platform/packages/workproof/src/predicates/schemas.ts`
- **Evidence types:** 14 types including new `corporate_registry`

---

## Cross-References

- [ADR-012 Decision Record](../decisions/adr-index.md) — full architectural decision
- [WorkProof README](../../03-platform/packages/workproof/README.md) — consumer-facing documentation
- [Migration Bridge Tests](../../03-platform/packages/workproof/tests/migration-bridge.test.ts) — integration test evidence
- [Property-Based Tests](../../03-platform/packages/workproof/tests/property-based.test.ts) — invariant test evidence
- [Cross-Repo Handoff](../../01-docs/01-agents/sessions/2026-05-25-handoff-gtcxcore-gtcxprotocols.md) — gtcx-protocols implementation guide
