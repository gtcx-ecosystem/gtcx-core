# Executive Summary — gtcx-core

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

`gtcx-core` publishes a single versioned API surface: `@gtcx/crypto` for all cryptographic operations (Ed25519, SHA-256, HMAC, key derivation, ZKP engine), `@gtcx/schemas` for Zod schemas shared across TypeScript and Python via codegen, `@gtcx/domain` for core domain types, and `@gtcx/identity` for DID document management. Performance-critical operations (ZKP, batch verification) are backed by Rust via WASM/napi-rs. Every GTCX repo pins to a specific `@gtcx/core` version; the `check:architecture` CI gate blocks any import that bypasses the published API.

| Package          | Provides                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `@gtcx/crypto`   | Ed25519 sign/verify, SHA-256, HMAC, key derivation, ZKP engine        |
| `@gtcx/schemas`  | Zod schemas for all GTCX domain objects (TS + Python codegen)         |
| `@gtcx/domain`   | Core domain types (EntityId, CommodityGrade, TradeCorridorCode, etc.) |
| `@gtcx/identity` | DID document CRUD, key rotation, verification method resolution       |
| Rust crates      | WASM/napi-rs bindings for ZKP, batch Ed25519, hash-to-curve           |

---

## Current Status

**Phase**: Stable library — active maintenance and API governed by architecture gate

**What is live:**

- 18 TypeScript packages published under `@gtcx/*` scope
- 6 Rust crates with WASM and napi-rs build targets
- `check:architecture` CI gate — blocks circular deps and direct imports bypassing API surface
- Schema codegen pipeline (Zod → Python Pydantic models)
- All GTCX repos pinned to versioned `@gtcx/core` releases

**In progress:**

- ZKP circuit expansion for GCI continuous scoring
- Key rotation automation for `@gtcx/identity`
- Performance benchmarks for Rust binding ops (target: < 1 ms Ed25519 verify)

---

## Key Metrics / Gates

| Gate                                                   | Target                                                   |
| ------------------------------------------------------ | -------------------------------------------------------- |
| `check:architecture` pass (no direct internal imports) | Required for every merge                                 |
| Ed25519 sign latency (napi-rs, single op)              | < 0.5 ms                                                 |
| Ed25519 batch verify (1000 signatures, WASM)           | < 100 ms                                                 |
| Zod schema test coverage                               | 100%                                                     |
| Breaking change approval                               | Requires explicit sign-off — breaks all downstream repos |
| Python Pydantic codegen parity with Zod schemas        | 100%                                                     |

---

## References

- [Phased Roadmap](./phased-roadmap.md)
- [Product Backlog](../2-scrum-board/8-backlog/backlog.md)
- [Sprint Planning](../2-scrum-board/5-sprints/sprint-planning.md)
