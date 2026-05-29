---
title: "ADR-001: Use Rust for All Cryptographic Operations"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "decisions"]
review_cycle: "on-change"
---

---
title: '001 Rust For Cryptography'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-001: Use Rust for All Cryptographic Operations

## Status

Accepted

## Date

2025-01-15

## Context

GTCX requires high-performance cryptographic operations for digital signatures (Ed25519), hashing (SHA-256, Blake3), zero-knowledge proofs, and hash-chain audit logs. These operations run on every transaction — signing, verification, and proof generation are on the critical path.

Pure TypeScript/JavaScript crypto libraries suffer from:

- GC pauses during signing operations (unpredictable latency)
- 15x–120x slower execution compared to native code (benchmarked: Ed25519 sign 2ms JS vs 0.13ms Rust, SHA-256 0.5ms JS vs 0.004ms Rust)
- No memory safety guarantees for key material handling
- Limited ability to zeroize secrets from memory on drop

The target deployment includes edge devices (mobile, IoT) and server-side validators processing thousands of transactions per second.

## Decision

Implement all cryptographic primitives in Rust, exposed to Node.js via NAPI-RS (`gtcx-node` crate) and to browsers/React Native via WASM (`gtcx-edge` crate). Six Rust crates compose the foundation:

- `gtcx-crypto` — Ed25519/secp256k1 signing, SHA-256/SHA-512/Blake3 hashing, key generation/derivation, hash-chain audit logs
- `gtcx-zkp` — Zero-knowledge proof circuits (Groth16, Bulletproofs, Schnorr)
- `gtcx-consensus` — Weighted PBFT consensus engine
- `gtcx-network` — P2P networking (libp2p)
- `gtcx-edge` — WASM/edge device runtime
- `gtcx-node` — NAPI-RS bindings for Node.js

TypeScript packages (`@gtcx/crypto`) provide the developer-facing API and fall back to pure-JS implementations when native bindings are unavailable.

## Consequences

### Positive

- 15x–120x performance improvement on crypto operations (benchmarked)
- Memory safety guaranteed by Rust's ownership model — no use-after-free, no buffer overflows
- Private keys automatically zeroized on drop via `zeroize` crate
- `#![deny(unsafe_code)]` enforced across all crates
- Single source of truth for crypto — TypeScript packages are thin wrappers

### Negative

- Dual build toolchain: Cargo (Rust) + pnpm (TypeScript) increases CI complexity
- Developers need Rust toolchain installed for native builds
- NAPI-RS bindings add a maintenance surface between Rust and Node.js
- Cross-compilation matrix: macOS/Linux/Windows × x86_64/aarch64 + WASM

### Neutral

- TypeScript fallback ensures the system works without Rust bindings (development, testing, CI environments that lack native builds)
- Benchmark suite (`criterion`) runs alongside unit tests to catch performance regressions
