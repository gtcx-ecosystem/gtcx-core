# Core System Specification — gtcx-core

**Status:** Active
**Last reviewed:** 2026-03-07

Canonical top-level specification for `gtcx-core`. Defines purpose, scope, and non-functional requirements. Points to deeper specs for implementation detail.

---

## Purpose

- Provide secure identity, verification, and cryptographic proof primitives for the GTCX ecosystem.
- Support offline-first workflows with deterministic sync and event buffering.
- Enable secure P2P networking and proof exchange across untrusted environments.

This repo has no product surface, no UI, and no users. Its output is primitives consumed by downstream GTCX repos. Breaking changes here break everything downstream.

---

## Scope

### TypeScript Packages (18)

| Group         | Packages                                                   |
| ------------- | ---------------------------------------------------------- |
| Cryptography  | `@gtcx/crypto`, `@gtcx/crypto-native`                      |
| Identity      | `@gtcx/identity`                                           |
| Verification  | `@gtcx/verification`, `@gtcx/workproof`                    |
| Security      | `@gtcx/security`                                           |
| Domain        | `@gtcx/domain`, `@gtcx/schemas`, `@gtcx/types`             |
| Events & Sync | `@gtcx/events`, `@gtcx/sync`                               |
| Networking    | `@gtcx/network`, `@gtcx/connectivity`                      |
| Services      | `@gtcx/services`, `@gtcx/api-client`                       |
| Utilities     | `@gtcx/utils`, `@gtcx/logging`, `@gtcx/ai`, `@gtcx/config` |

Note: `packages/config/` is a shared config directory (eslint, tailwind, tsup, typescript presets) — not a published package.

### Rust Crates (6)

| Crate            | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `gtcx-crypto`    | Ed25519, SHA-256/512, Blake3, key derivation           |
| `gtcx-zkp`       | Groth16, Bulletproofs, Schnorr ZKP circuits            |
| `gtcx-node`      | NAPI-RS native bindings for `@gtcx/crypto-native`      |
| `gtcx-network`   | libp2p transport primitives                            |
| `gtcx-consensus` | Weighted PBFT consensus foundations                    |
| `gtcx-edge`      | Edge runtime with resource-constrained device profiles |

---

## Non-Functional Requirements

| Requirement | Standard                                                                     |
| ----------- | ---------------------------------------------------------------------------- |
| Security    | Authenticated transport, cryptographic integrity, least-privilege boundaries |
| Reliability | Predictable failure modes, retry behavior, rate limiting                     |
| Performance | Proof generation and verification within defined budgets (see `benchmarks/`) |
| Operability | Explicit runbooks, SLOs, and telemetry schema                                |
| Portability | JS fallback for all native paths; offline-first by default                   |

---

## Design Principles

1. **Security-first defaults** — cryptographic integrity and explicit trust boundaries throughout.
2. **Offline-first operation** — deterministic conflict resolution and resilient sync.
3. **Composable primitives** — small, independently importable packages with no circular dependencies.
4. **Rust where it matters** — performance-critical crypto and ZKP paths in Rust; JS for portability.
5. **Commodity-agnostic** — new verticals added via configuration, not core code changes.

---

## Non-Goals

- No platform-specific storage backends (injected by runtime adapters).
- No on-chain resolution or global registry (resolved by downstream services).
- No commodity-specific business logic.
- No product UI or end-user surface.

---

## Dependency Rules

- `@gtcx/crypto` has no hard internal dependencies — enforced by architecture check.
- `@gtcx/identity`, `@gtcx/security`, `@gtcx/verification` build on `@gtcx/crypto`.
- `@gtcx/domain` is the foundational domain layer; `@gtcx/services` builds on it.
- Circular dependencies are prohibited — enforced by `pnpm architecture:check`.
- All dependencies must be declared; phantom dependencies are a CI failure.

---

## Reference

- [`_sop/2-docs/3-engineering/2-system-design/overview.md`](../../3-engineering/2-system-design/overview.md) — layer map and trust boundaries
- [`_sop/2-docs/3-engineering/6-decisions/`](../../3-engineering/6-decisions/) — all ADRs
- [`_sop/2-docs/3-engineering/7-security/security-framework.md`](../../3-engineering/7-security/security-framework.md) — security framework
- [`_sop/2-docs/5-specs/4-backend/packages/`](./packages/) — per-package specifications
- [`_sop/2-docs/4-devops/2-runbooks/quality-runbook.md`](../../4-devops/2-runbooks/quality-runbook.md) — quality gates
