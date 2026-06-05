---
title: 'Backend Architecture — gtcx-core'
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

title: 'Backend Architecture'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# Backend Architecture — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Repo type:** Library monorepo (22 public TypeScript packages, 4 shared config workspace packages, 6 Rust crates)
**Primary language:** TypeScript 6.0.x + Rust 1.91+
**Framework:** None — pure library; no HTTP server, no database
**Last updated:** 2026-05-06

---

## Architecture Overview

`gtcx-core` is not a service — it is the foundational layer consumed by all GTCX services. There is no API gateway, no message queue, and no database. The architecture is a layered package dependency graph with a strict one-directional flow.

### Package layers

```
┌──────────────────────────────────────────────────────────────┐
│   Consumer Layer (downstream GTCX repos)                     │
│   gtcx-protocols, gtcx-platforms, gtcx-app, etc.             │
├──────────────────────────────────────────────────────────────┤
│   Service / Application Layer                                │
│   @gtcx/services, @gtcx/api-client                           │
├──────────────────────────────────────────────────────────────┤
│   Domain Layer                                               │
│   @gtcx/domain                                               │
├──────────────────────────────────────────────────────────────┤
│   Trust / Workflow Layer                                     │
│   @gtcx/identity, @gtcx/security, @gtcx/verification,        │
│   @gtcx/workproof                                            │
├──────────────────────────────────────────────────────────────┤
│   Foundation / Primitive Layer                               │
│   @gtcx/types, @gtcx/events, @gtcx/schemas, @gtcx/crypto,   │
│   @gtcx/crypto-native, @gtcx/utils, @gtcx/logging,          │
│   @gtcx/ai, @gtcx/connectivity, @gtcx/network, @gtcx/sync   │
├──────────────────────────────────────────────────────────────┤
│   Rust Native Layer                                          │
│   gtcx-crypto, gtcx-zkp, gtcx-consensus, gtcx-network        │
│   gtcx-edge, gtcx-node (NAPI-RS)                             │
└──────────────────────────────────────────────────────────────┘
```

Cross-cutting runtime packages usable at multiple layers: `@gtcx/types`, `@gtcx/schemas`, `@gtcx/utils`, `@gtcx/logging`, `@gtcx/ai`, `@gtcx/connectivity`, `@gtcx/network`, `@gtcx/sync`

Shared config workspace packages: `@gtcx/eslint-config`, `@gtcx/typescript-config`, `@gtcx/tsup-config`, `@gtcx/jurisdiction-config`

---

## Package Dependency Rules

Dependencies flow strictly downward and all workspace imports must be declared. No circular imports. The most important constraints are enforced by `pnpm architecture:check`:

```
@gtcx/types, @gtcx/events         (foundation)
      ↓
@gtcx/crypto, @gtcx/schemas
      ↓
@gtcx/identity, @gtcx/security, @gtcx/verification, @gtcx/workproof
      ↓
@gtcx/domain
      ↓
@gtcx/services

Standalone / cross-cutting:
- @gtcx/api-client
- @gtcx/connectivity
- @gtcx/network
- @gtcx/sync
- @gtcx/utils
- @gtcx/logging
- @gtcx/ai
```

Practical boundary rules:

- `@gtcx/types` is foundational and may not import other workspace packages.
- `@gtcx/crypto` must not depend on higher-level business, sync, or client packages.
- `@gtcx/security` and `@gtcx/verification` may depend downward on crypto/types but never upward on domain/services/sync/client packages.
- `@gtcx/domain` must not depend on services, api-client, connectivity, sync, or workproof.

Violations are CI-blocking.

---

## TypeScript Package Responsibilities

### Cryptographic layer

| Package               | Responsibility                                                                     |
| --------------------- | ---------------------------------------------------------------------------------- |
| `@gtcx/crypto`        | Ed25519/Secp256k1 signing, SHA-256/512, Merkle tree build/verify, hash commitments |
| `@gtcx/crypto-native` | NAPI-RS binding loader — loads Rust module or falls back to TypeScript engine      |

### Identity and trust

| Package              | Responsibility                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `@gtcx/identity`     | DID (`did:gtcx:*`) creation, credential management, key lifecycle, resolution             |
| `@gtcx/security`     | Auth, AES-256-GCM encrypted storage, offline credential management, audit logging         |
| `@gtcx/verification` | Certificate generation, traced signing/verification workflows, QR payloads, proof bundles |

### Domain and data

| Package           | Responsibility                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `@gtcx/types`     | All shared TypeScript types for the GTCX ecosystem                                                            |
| `@gtcx/schemas`   | Zod schemas for all Core12 compliance entities; runtime validation                                            |
| `@gtcx/domain`    | Commodity-agnostic domain services with DI container, offline queues, observability hooks                     |
| `@gtcx/workproof` | TradeCV/WorkProof v2.2 — W3C VC work attestations with 47 predicates across 9 categories, AI validation hooks |

### Infrastructure

| Package                     | Responsibility                                                             |
| --------------------------- | -------------------------------------------------------------------------- |
| `@gtcx/events`              | Type-safe event bus with offline buffering and replay                      |
| `@gtcx/sync`                | Offline-first sync engine with pluggable conflict resolution strategies    |
| `@gtcx/api-client`          | Resilient HTTP client: retry, offline queue, request signing, auth headers |
| `@gtcx/connectivity`        | Network connectivity detection and profiling for offline-first behavior    |
| `@gtcx/network`             | Networking primitives and transport utilities                              |
| `@gtcx/services`            | Business-level services: registration, trading, compliance workflows       |
| `@gtcx/ai`                  | AI integration hooks and tracing utilities for downstream AI-native apps   |
| `@gtcx/logging`             | Structured JSON logging with log levels and correlation IDs                |
| `@gtcx/utils`               | Shared utility functions (date, string, collection)                        |
| `@gtcx/eslint-config`       | Shared ESLint flat config (internal workspace package)                     |
| `@gtcx/typescript-config`   | Shared TypeScript config presets (internal workspace package)              |
| `@gtcx/tsup-config`         | Shared `tsup` build presets (internal workspace package)                   |
| `@gtcx/jurisdiction-config` | Shared jurisdiction schemas and build config                               |

---

## Rust Crate Responsibilities

| Crate            | Responsibility                                                                      |
| ---------------- | ----------------------------------------------------------------------------------- |
| `gtcx-crypto`    | Ed25519 (ed25519-dalek), SHA-256/512 (sha2), Blake3 — production-grade impls        |
| `gtcx-zkp`       | Groth16 (bellman), Bulletproofs, Schnorr (k256) — ZKP proof generation/verification |
| `gtcx-consensus` | Weighted PBFT consensus engine for multi-stakeholder verification scenarios         |
| `gtcx-network`   | P2P networking types with topic-based pub/sub messaging                             |
| `gtcx-edge`      | Edge runtime with resource-constrained device profiles and verification caching     |
| `gtcx-node`      | NAPI-RS bindings — exposes Rust ops to Node.js; compiled per platform               |

---

## Native Binding Architecture

`@gtcx/crypto-native` loads the appropriate compiled Rust artifact at runtime:

```
@gtcx/crypto-native
  ├── Checks GTCX_REQUIRE_NATIVE env var
  ├── Tries to load platform-specific .node artifact (compiled by gtcx-node)
  │     Linux x86_64 / Linux aarch64 / macOS x86_64 / macOS aarch64
  └── If GTCX_REQUIRE_NATIVE=true and native unavailable → hard fail
      If GTCX_REQUIRE_NATIVE unset → falls back to TypeScript engine (dev/test only)
```

CI runs a 4-platform matrix build to produce and cache artifacts for each target before integration tests.

---

## API Surface

`gtcx-core` exports TypeScript symbols tracked in `quality/api-surface-baseline.json`. This is the contract with all downstream consumers.

- Check for breaking changes: `pnpm api:check`
- Changes require human review before baseline update: `pnpm api:update-baseline`
- Semver determination (major/minor/patch) is a human decision based on the diff

---

## Performance Architecture

Performance budgets are tracked in `benchmarks/`. Key benchmarks:

- Ed25519 sign/verify throughput (Rust vs TypeScript fallback)
- SHA-256 hashing throughput
- ZKP proof generation time (Groth16, Bulletproofs)
- Merkle tree construction for large verification batches

Budget enforcement: `pnpm perf:check-budgets`
Budget regression: `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`

Do not raise performance budgets when a regression is detected — investigate and fix.

---

## Testing Strategy

**Framework:** Vitest (TypeScript packages), cargo test (Rust crates)
**Coverage targets:** Critical packages (`@gtcx/crypto`, `@gtcx/domain`, `@gtcx/security`, `@gtcx/services`, `@gtcx/verification`) require documented coverage minimums

```
03-platform/packages/{name}/
├── 03-platform/src/           # Package source
└── __tests__/     # Package unit tests (co-located)

tests/
└── integration/   # Cross-package integration tests
```

Run critical coverage: `pnpm test:coverage:critical`
Run Rust tests: `cargo test --workspace --lib`
Run ZKP heavy proofs (CI weekly only): `cargo test -p gtcx-zkp --release -- --ignored`

---

## Build System

**Turborepo** orchestrates the build pipeline across all packages. Build order is inferred from the dependency graph.

```bash
pnpm build      # All packages via Turborepo
pnpm test       # All tests via Turborepo
pnpm lint       # All linting via Turborepo
pnpm typecheck  # All type checks via Turborepo
```

Packages use shared build/config presets from `@gtcx/tsup-config` and `@gtcx/typescript-config`.

---

## Reference

- [Architecture Overview](overview.md) — layer map and trust boundaries
- [`01-docs/decisions/`](../decisions/) — all 17 ADRs
- [`01-docs/specs/packages/`](../specs/03-platform/packages/) — per-package specs
- [`01-docs/09-security/security-framework.md`](../security/security-framework.md) — security controls
