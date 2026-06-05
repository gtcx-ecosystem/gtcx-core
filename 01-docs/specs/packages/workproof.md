---
title: 'Package Spec — `@gtcx/workproof`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Workproof'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/workproof`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

TradeCV/WorkProof v2.2 — types, Zod schemas, and validation for W3C Verifiable Credential (VC)-based employment and professional skill attestations. Provides the data layer for portable professional identity in the GTCX protocol. 47 predicates across 9 categories.

---

## Public API

### Modules

| Module       | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `evidence`   | Evidence types and schemas for attestation backing            |
| `predicates` | Selective disclosure predicate definitions                    |
| `workproof`  | Core WorkProof VC structure and validation                    |
| `ai`         | AI-native operation wrappers for traced attestation workflows |
| `tradecv`    | TradeCV identity profile types                                |
| `disclosure` | Selective disclosure presentation logic                       |
| `offline`    | Offline credential caching and queuing                        |
| `trust`      | Trust chain and issuer registry types                         |

All modules re-exported from the package root.

---

## Dependencies

| Dependency                         | Role                                          |
| ---------------------------------- | --------------------------------------------- |
| `@gtcx/crypto` `workspace:*`       | Cryptographic primitives (Ed25519 signing)    |
| `@gtcx/types` `workspace:*`        | Shared protocol types                         |
| `@gtcx/verification` `workspace:*` | Proof bundling and certificate infrastructure |
| `zod` `^3.23.0`                    | Schema validation for VC data structures      |

---

## W3C VC Compliance

WorkProof credentials conform to the W3C Verifiable Credentials Data Model v1.1. Key structural requirements:

- `@context` must include the W3C VC context and the GTCX WorkProof context extension
- `type` must include `VerifiableCredential` and `WorkProofCredential`
- `issuer` must be a valid `did:gtcx:...` identifier
- `proof` must use Ed25519 signature via `@gtcx/crypto`

---

## Non-Goals

- Does not issue or sign credentials — signing is performed by the platform layer using `@gtcx/identity` and `@gtcx/crypto`
- Does not manage issuer registry on-chain — that is a protocol-layer concern
- Does not implement selective disclosure cryptography — uses predicate definitions that consuming services implement

---

## Implementation

`03-platform/packages/workproof/src/`

---

## Reference

- [`01-docs/specs/packages/verification.md`](./verification.md) — proof bundling dependency
- [`01-docs/specs/core-spec.md`](../core-spec.md) — system overview
