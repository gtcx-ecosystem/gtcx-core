---
title: "Executive Summary — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agile"]
review_cycle: "on-change"
---

---
title: 'Executive Summary'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agile']
review_cycle: 'on-change'
---

# Executive Summary — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Last reviewed:** 2026-05-06

---

## Product Vision

`gtcx-core` is the shared cryptographic and type foundation for the entire GTCX ecosystem — 18 TypeScript packages and 6 Rust crates providing the primitives that every other GTCX service depends on. It is not a user-facing product; it is the load-bearing layer beneath all of them. Its purpose is to ensure that every GTCX service signs with the same keys, validates with the same schemas, and speaks the same domain types — so that proofs issued on one service can be verified on any other without translation or trust assumptions.

---

## Problem Statement

- **Crypto divergence:** without a shared signing library, each GTCX service would independently implement Ed25519, creating key format incompatibilities and signature verification failures across service boundaries
- **Schema drift:** Zod schemas defined independently in each repo diverge over time, causing subtle runtime failures when data crosses service boundaries (e.g., a proof issued by `gtcx-platforms` that fails validation in `compliance-os`)
- **DID management fragmentation:** decentralized identity management implemented ad hoc across repos creates incompatible DID document formats and key rotation patterns
- **Performance bottlenecks in TS:** ZKP circuit evaluation and batch signature verification are too slow in pure TypeScript; without native Rust bindings these operations cannot meet latency targets at field scale

---

## Solution

`gtcx-core` publishes a versioned API surface across 18 public `@gtcx/*` packages: `@gtcx/crypto` for cryptographic operations, `@gtcx/schemas` for validation schemas, `@gtcx/domain` for core domain types and offline queue semantics, and `@gtcx/identity` for DID document management. Performance-critical operations are backed by Rust via NAPI-RS with explicit native/fallback behavior. Every downstream GTCX repo pins to package versions from this workspace; `pnpm architecture:check` blocks import patterns that violate the published boundary model.

| Package          | Provides                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `@gtcx/crypto`   | Ed25519 sign/verify, SHA-256, HMAC, key derivation, ZKP engine        |
| `@gtcx/schemas`  | Zod schemas for all GTCX domain objects (TS + Python codegen)         |
| `@gtcx/domain`   | Core domain types (EntityId, CommodityGrade, TradeCorridorCode, etc.) |
| `@gtcx/identity` | DID document CRUD, key rotation, verification method resolution       |
| Rust crates      | WASM/napi-rs bindings for ZKP, batch Ed25519, hash-to-curve           |

---

## Current Status

**Phase**: Stable library — active maintenance, trust-path hardening complete, API governed by architecture and API baseline gates

**What is live:**

- 18 TypeScript packages published under `@gtcx/*` scope
- 6 Rust crates with WASM and napi-rs build targets
- `pnpm architecture:check` CI gate — blocks circular deps and direct imports bypassing API surface
- Schema codegen pipeline (Zod → Python Pydantic models)
- All GTCX repos pinned to versioned `@gtcx/core` releases

**Current readiness focus:**

- external security review / pen test
- downstream consumer validation against the release artifact pack
- final human signoff for release posture

---

## Key Metrics / Gates

| Gate                                                        | Target                                                   |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| `pnpm architecture:check` pass (no direct internal imports) | Required for every merge                                 |
| Ed25519 sign latency (napi-rs, single op)                   | < 0.5 ms                                                 |
| Ed25519 batch verify (1000 signatures, WASM)                | < 100 ms                                                 |
| Zod schema test coverage                                    | 100%                                                     |
| Breaking change approval                                    | Requires explicit sign-off — breaks all downstream repos |
| Python Pydantic codegen parity with Zod schemas             | 100%                                                     |

---

## References

- [Roadmap](./roadmap/roadmap.md)
- [10/10 Readiness Sprint Roadmap](./roadmap/10-10-readiness-sprint-roadmap.md)
- [Definition of Done](./sprints/gtcx-core-definition-of-done.md)
