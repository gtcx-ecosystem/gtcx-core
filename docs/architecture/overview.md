---
title: 'System Architecture Overview — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'architecture']
review_cycle: 'on-change'
---

---

title: 'Overview'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# System Architecture Overview — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

The canonical high-level view of the `gtcx-core` architecture. Read this before making any cross-package or structural change.

---

## Scope

- `gtcx-core` monorepo: 18 TypeScript packages, 6 Rust crates, tooling, and documentation
- Core flows: identity, verification, offline sync, network transport, and ZKP proofs
- Non-functional requirements: security, auditability, and performance under constrained environments

---

## Architecture Principles

1. **Security-first defaults** — cryptographic integrity, strong key management, and explicit trust boundaries
2. **Offline-first operation** — deterministic conflict resolution and resilient sync under intermittent connectivity
3. **Composable primitives** — small packages independently importable and reusable across GTCX products
4. **Rust where it matters** — performance-critical crypto and ZKP paths in Rust; TypeScript fallback for portability
5. **Commodity-agnostic** — new trade verticals added via configuration, not core code changes
6. **Managed Lifecycle** — explicit revocation registry and certificate expiration for infrastructure-grade trust management

---

## Layer Map

| Layer                   | Components                                                           | Direction    |
| ----------------------- | -------------------------------------------------------------------- | ------------ |
| Client & Service Layer  | Downstream apps and services consuming `@gtcx/*`                     | Consumes ↓   |
| TypeScript Core Layer   | `packages/*` — domain, crypto, identity, verification, sync, network | Depends on ↓ |
| Rust Core Layer         | `rust/gtcx-crypto`, `rust/gtcx-zkp`                                  | Depends on ↓ |
| Integration & Transport | P2P mesh, TCP/QUIC transport, edge runtime adapters                  | Foundation   |

---

## Package Dependency Rules

Dependencies must flow in one direction only. No circular dependencies:

```
@gtcx/types, @gtcx/events          (no internal deps — foundation)
      ↓
@gtcx/crypto, @gtcx/schemas        (types only)
      ↓
@gtcx/identity, @gtcx/security,    (depend on crypto, types)
@gtcx/verification, @gtcx/workproof
      ↓
@gtcx/domain                       (depends on events, utils)
      ↓
@gtcx/services                     (depends on crypto, domain, events)
      ↓
@gtcx/api-client                   (no internal deps — standalone)
```

`@gtcx/utils`, `@gtcx/logging`, `@gtcx/ai`, `@gtcx/connectivity`, `@gtcx/sync`, `@gtcx/network` are cross-cutting packages usable at any layer.

Enforced by: `pnpm architecture:check` via `tools/check-package-boundaries.mjs`

---

## Trust Boundaries

- Key material is generated and held client-side where possible
- Proof generation occurs in Rust for performance and security; TypeScript `HashCommitmentZkpEngine` is a development fallback only
- Transport sessions are encrypted; auth and integrity are enforced end-to-end
- `GTCX_REQUIRE_NATIVE=true` must be set in production — fails hard if native module unavailable

---

## Security-Sensitive Packages

Changes to these packages require Cryptographic Security Engineer review and human approval before merge:

| Package               | Area                                          |
| --------------------- | --------------------------------------------- |
| `@gtcx/crypto`        | Signing, hashing, ZKP engine                  |
| `@gtcx/crypto-native` | Native binding loader                         |
| `@gtcx/security`      | Auth, validation, secure storage              |
| `@gtcx/verification`  | Certificate chains, proof bundle verification |
| `@gtcx/identity`      | DID, credentials, key management              |
| `rust/gtcx-crypto`    | Ed25519, SHA-256, Blake3                      |
| `rust/gtcx-zkp`       | Groth16, Bulletproofs, Schnorr                |

---

## Cross-Repo Consumption

Downstream GTCX repos import `@gtcx/*` packages as external npm dependencies. They do not fork or vendor this code. Any breaking change here requires a coordinated downstream update.

Before making a change that could break the API surface, run `pnpm api:check` and review the diff against `quality/api-surface-baseline.json`.

---

## Reference

- [`docs/specs/core-spec.md`](../specs/core-spec.md) — system specification
- [`docs/decisions/`](../decisions/) — all ADRs
- [`docs/security/security-framework.md`](../security/security-framework.md) — security framework
- [`docs/agents/workflows/safety-rules.md`](../agents/workflows/safety-rules.md) — what requires approval
