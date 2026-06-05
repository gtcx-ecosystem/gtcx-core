---
title: 'Repository overview — technical'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['overview', 'technical']
review_cycle: on-change
---

# Repository overview — technical

> **Parent:** [overview/README.md](./README.md)

## 6. Technical Overview

### 6.1 Technology Stack

| Layer               | Technology                               | Version           | Purpose                                  |
| ------------------- | ---------------------------------------- | ----------------- | ---------------------------------------- |
| Primary Language    | TypeScript                               | 5.7+              | Business logic, APIs, domain models      |
| Secondary Language  | Rust                                     | 1.91+             | Cryptography, ZKP, consensus, networking |
| Runtime             | Node.js                                  | >= 20.0.0         | TypeScript execution                     |
| Package Manager     | pnpm                                     | 9.15.0            | Workspace monorepo (22 packages)         |
| Build Tool          | tsup                                     | 8.x               | TypeScript compilation                   |
| Rust Build          | cargo                                    | 1.91+             | Rust crate compilation                   |
| Testing (TS)        | vitest                                   | 2.x               | Unit + integration tests                 |
| Testing (Rust)      | cargo test                               | 1.91+             | Rust unit tests                          |
| Cryptography (TS)   | @noble/curves, @noble/hashes             | 1.x               | Ed25519, Secp256k1, SHA-256, BLAKE3      |
| Cryptography (Rust) | arkworks, bulletproofs, curve25519-dalek | 0.4.x / 5.x / 4.x | Groth16, Bulletproofs, Schnorr           |
| FIPS Backend        | aws-lc-fips-sys                          | CMVP #4816        | FIPS 140-3 validated crypto              |
| Schema Validation   | zod                                      | 3.24+             | Runtime type validation                  |
| NAPI Bindings       | napi-rs                                  | 2.x               | Rust → Node.js bindings                  |

### 6.2 Architecture at a Glance

```text
┌─────────────────────────────────────────────────────────────┐
│  Downstream Products: gtcx-markets, gtcx-protocols,         │
│  gtcx-infrastructure, gtcx-intelligence                     │
│                         ↓ npm dependency                    │
├─────────────────────────────────────────────────────────────┤
│  TypeScript Core Layer (03-platform/packages/*)                         │
│  ├─ @gtcx/types, @gtcx/events      (foundation)            │
│  ├─ @gtcx/crypto, @gtcx/schemas    (crypto + types)        │
│  ├─ @gtcx/identity, @gtcx/security, @gtcx/verification    │
│  ├─ @gtcx/domain, @gtcx/services                           │
│  ├─ @gtcx/api-client, @gtcx/connectivity, @gtcx/sync       │
│  └─ @gtcx/runtime                 (batteries-included)     │
│                         ↓                                   │
├─────────────────────────────────────────────────────────────┤
│  Rust Core Layer (rust/*)                                   │
│  ├─ gtcx-crypto    (Ed25519, SHA-256, Blake3)              │
│  ├─ gtcx-zkp       (Groth16, Bulletproofs, Schnorr)        │
│  ├─ gtcx-consensus (PBFT foundations)                      │
│  ├─ gtcx-network   (libp2p transport)                      │
│  ├─ gtcx-node      (NAPI bindings)                         │
│  └─ gtcx-edge      (edge runtime)                          │
│                         ↓                                   │
├─────────────────────────────────────────────────────────────┤
│  Platform: OpenSSL 3.x FIPS (CMVP #4282) / AWS-LC          │
│            (CMVP #4816)                                    │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Package / Crate Inventory

| Name                    | Purpose                          | Maturity                | Coverage                     | Key Consumer          |
| ----------------------- | -------------------------------- | ----------------------- | ---------------------------- | --------------------- |
| `@gtcx/crypto`          | Signing, hashing, ZKP engine     | **Production-hardened** | 97.86% stmts / 86.48% branch | All downstream        |
| `@gtcx/crypto-native`   | NAPI bindings loader             | **Beta**                | —                            | `@gtcx/crypto`        |
| `@gtcx/verification`    | Certificates, QR, proofs         | **Production-hardened** | 94.79% stmts / 89.11% branch | `gtcx-markets`        |
| `@gtcx/identity`        | DID, credentials, keys           | **Beta**                | 85%+                         | `gtcx-markets`        |
| `@gtcx/security`        | Auth, validation, audit log      | **Production-hardened** | 83%+                         | All downstream        |
| `@gtcx/domain`          | Commodity-agnostic domain        | **Production-hardened** | 81%+                         | All downstream        |
| `@gtcx/sync`            | Offline-first sync engine        | **Production-hardened** | 88%+                         | Mobile clients        |
| `@gtcx/connectivity`    | Network detection, profiles      | **Production-hardened** | 95%+                         | Mobile clients        |
| `@gtcx/api-client`      | Resilient HTTP client            | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/resilience`      | Circuit breaker, retry, bulkhead | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/telemetry`       | OpenTelemetry instrumentation    | **Production-hardened** | 85%+                         | All downstream        |
| `@gtcx/runtime`         | Batteries-included substrate     | **Beta**                | 80%+                         | App developers        |
| `@gtcx/workproof`       | W3C VC attestation schemas       | **Beta**                | 75%+                         | Export brokers        |
| `@gtcx/services`        | Business services                | **Functional**          | 88%+                         | `gtcx-markets`        |
| `@gtcx/schemas`         | Zod validation schemas           | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/types`           | Canonical type definitions       | **Production-hardened** | 100%                         | All downstream        |
| `@gtcx/events`          | Typed event bus                  | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/network`         | P2P networking primitives        | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `@gtcx/ai`              | AI integration hooks             | **Scaffolding**         | 50%+                         | `gtcx-intelligence`   |
| `@gtcx/logging`         | Structured logging               | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/utils`           | Common utilities                 | **Production-hardened** | 95%+                         | All downstream        |
| `gtcx-crypto` (Rust)    | Native crypto primitives         | **Production-hardened** | 85%+                         | `gtcx-zkp`, NAPI      |
| `gtcx-zkp` (Rust)       | ZKP circuits                     | **Production-hardened** | 85%+                         | `@gtcx/crypto-native` |
| `gtcx-consensus` (Rust) | PBFT foundations                 | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `gtcx-network` (Rust)   | libp2p transport                 | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `gtcx-node` (Rust)      | NAPI bindings target             | **Functional**          | 70%+                         | `@gtcx/crypto-native` |
| `gtcx-edge` (Rust)      | Edge runtime                     | **Scaffolding**         | 50%+                         | Edge deployments      |

### 6.4 Ecosystem Integration Map

| Downstream Repo       | What It Consumes                                                                            | Integration Pattern |
| --------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| `gtcx-markets`        | `@gtcx/crypto`, `@gtcx/verification`, `@gtcx/identity`, `@gtcx/sync`, `@gtcx/services`      | npm dependency      |
| `gtcx-protocols`      | `@gtcx/schemas`, `@gtcx/types`, `@gtcx/crypto`                                              | npm dependency      |
| `gtcx-infrastructure` | `@gtcx/network`, `@gtcx/connectivity`, `@gtcx/resilience`, `gtcx-consensus`, `gtcx-network` | npm + cargo         |
| `gtcx-intelligence`   | `@gtcx/ai`, `@gtcx/telemetry`, `@gtcx/events`                                               | npm dependency      |
| External apps         | `@gtcx/api-client`, `@gtcx/runtime`                                                         | npm dependency      |

---
