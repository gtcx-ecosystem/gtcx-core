---
title: 'Package Spec — `@gtcx/security`'
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

title: 'Security'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/security`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Non-cryptographic security utilities for the GTCX protocol. Complements `@gtcx/crypto` by covering the application-layer security concerns: input validation, authentication tokens and sessions, offline credential caching and tamper detection, and audit event logging.

This package does not implement cryptographic primitives — it orchestrates them via `@gtcx/crypto`.

---

## Module Structure

| Module       | Path                          | Responsibility                                             |
| ------------ | ----------------------------- | ---------------------------------------------------------- |
| `validation` | `03-platform/src/validation/` | Input sanitization and Zod-based schema validation         |
| `auth`       | `03-platform/src/auth/`       | Authentication tokens, sessions, permissions               |
| `offline`    | `03-platform/src/offline/`    | Secure local storage, credential caching, tamper detection |
| `audit`      | `03-platform/src/audit/`      | Security event logging, audit trails                       |

All modules are re-exported from the package root (`03-platform/src/index.ts`).

---

## Public API

### Validation (`03-platform/src/validation/`)

Input sanitization and protocol-level schema validation using Zod. Validates all data at external boundaries (user input, external APIs, QR code scans) before it reaches cryptographic or business logic.

Key patterns:

- Validate before processing — never pass unvalidated external data to signing or hashing functions
- Zod schemas define the canonical shape for all protocol data structures

### Auth (`03-platform/src/auth/`)

Token issuance, session management, and permission checks for protocol participants.

Key patterns:

- Tokens are signed using `@gtcx/crypto` — this module does not implement signing itself
- Sessions have explicit expiry; expired sessions must be rejected at every authorization point
- Permission checks are additive — deny by default, grant by explicit capability

### Offline (`03-platform/src/offline/`)

Secure credential caching for field agents operating without network connectivity. Includes tamper detection via hash-chained storage.

Key patterns:

- Cached credentials are encrypted at rest — plaintext never written to disk
- Tamper detection uses Blake3 hash chains; any modification to a cached record is detectable
- Cache expiry is enforced on read — stale credentials are rejected even if structurally valid

### Audit (`03-platform/src/audit/`)

Structured security event logging for compliance and forensic purposes.

Key patterns:

- Every security event (login, token issue, permission check, tamper attempt) is logged
- Audit log entries are immutable once written
- Log format is structured JSON for machine consumption

---

## Dependencies

| Dependency            | Role                           |
| --------------------- | ------------------------------ |
| `zod` `^3.23.0`       | Schema validation              |
| `@gtcx/crypto` (peer) | Signing, hashing, `secureWipe` |
| `@gtcx/types` (peer)  | Shared protocol types          |

---

## Non-Goals

- Does not implement cryptographic primitives — delegates entirely to `@gtcx/crypto`
- Does not manage DID or identity creation — that is `@gtcx/identity`
- Does not generate certificates or verification proofs — that is `@gtcx/verification`
- Does not define network transport security (TLS, mTLS) — that is `@gtcx/network`

---

## Security Constraints

- All cached credentials must use `secureWipe()` from `@gtcx/crypto` before buffer release
- Validation must occur at every external boundary — never skip schema validation on the assumption that data "came from a trusted source"
- Audit log entries must not contain raw key material or plaintext secrets
- Tamper detection checks must run on every offline cache read, not just on write

---

## Implementation

`03-platform/packages/security/src/`

---

## Reference

- [`01-docs/specs/03-platform/packages/crypto.md`](./crypto.md) — cryptographic primitives
- [`01-docs/09-security/security-framework.md`](../../security/security-framework.md) — security architecture and threat model
- [`01-docs/specs/core-spec.md`](../core-spec.md) — system overview
