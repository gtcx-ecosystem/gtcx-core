---
title: 'Service Overview'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Service Overview — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

> Understand this repo in 5 minutes.

**Last reviewed:** 2026-05-06

---

## What It Does

`gtcx-core` is the shared foundation for the entire GTCX ecosystem. It provides cryptographic primitives, shared TypeScript types, Zod validation schemas, domain models, identity and verification infrastructure, and offline-first sync — all packaged as independently importable npm packages. Every other GTCX repo depends on it; it depends on nothing.

---

## Architecture

**Where it fits:** The lowest layer of the GTCX dependency graph. All downstream repos (`gtcx-protocols`, `gtcx-platforms`, `gtcx-intelligence`, `gtcx-app`, etc.) import `@gtcx/*` packages from this repo as external dependencies.

```
  ┌──────────────────────────────────────────────────┐
  │   Downstream GTCX Repos                          │
  │   gtcx-protocols / gtcx-platforms / gtcx-app     │
  └──────────────────────┬───────────────────────────┘
                         │ imports @gtcx/* packages
  ┌──────────────────────▼───────────────────────────┐
  │   gtcx-core (this repo)                          │
  │   18 public TS packages + 4 config packages + 6 Rust crates │
  └──────────────────────────────────────────────────┘
                  (no external dependencies)
```

---

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Primary language | TypeScript 6.0.x                        |
| Rust layer       | Rust >= 1.91 (crypto + ZKP primitives)  |
| Runtime          | Node.js >= 20                           |
| Package manager  | pnpm 9.15 (workspaces)                  |
| Build            | Turborepo + tsup                        |
| Native bindings  | NAPI-RS                                 |
| Testing          | Vitest                                  |
| Database         | None — library, no persistence          |
| Deployment       | npm registry (consumed as a dependency) |

---

## Key Concepts

| Term               | Definition                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Core12             | The 12 compliance entity types (trade parties, documents, etc.) defined in `@gtcx/schemas`               |
| WorkProof          | W3C VC-based work attestation standard with 40 predicates — implemented in `@gtcx/workproof`             |
| TradeCV            | The GTCX trade credential format built on WorkProof v2.1                                                 |
| ZKP engine         | Zero-knowledge proof system: Groth16 + Bulletproofs + Schnorr in Rust; TypeScript dev fallback           |
| Package boundaries | Strict one-directional dependency graph enforced by `pnpm architecture:check`                            |
| Native bindings    | NAPI-RS compiled Rust modules exposed to Node.js; required in production via `GTCX_REQUIRE_NATIVE=true`  |
| API surface        | The set of exported symbols tracked in `quality/api-surface-baseline.json`; changes require human review |

---

## Directory Structure

```
gtcx-core/
├── packages/               # 18 public packages + shared config workspace packages
│   ├── types/              #   Shared type definitions
│   ├── schemas/            #   Zod validation schemas
│   ├── crypto/             #   Cryptographic primitives
│   ├── crypto-native/      #   NAPI-RS binding loader
│   ├── identity/           #   DID and credential management
│   ├── security/           #   Auth, AES-256-GCM storage, audit
│   ├── verification/       #   Certificate and proof bundle generation
│   ├── workproof/          #   WorkProof/TradeCV attestations
│   ├── domain/             #   Commodity-agnostic domain services
│   ├── events/             #   Type-safe event bus
│   ├── sync/               #   Offline-first sync engine
│   ├── services/           #   Business services
│   ├── api-client/         #   Resilient HTTP client
│   ├── connectivity/       #   Network profiling
│   ├── logging/            #   Structured logging
│   ├── ai/                 #   AI integration hooks
│   ├── utils/              #   Shared utilities
│   ├── config/eslint/      #   Shared ESLint workspace config
│   ├── config/typescript/  #   Shared TS workspace config
│   ├── config/tsup/        #   Shared tsup workspace config
│   └── config/jurisdiction/ #  Shared jurisdiction config
├── rust/                   # 6 Rust crates
│   ├── gtcx-crypto/        #   Ed25519, SHA-256/512, Blake3
│   ├── gtcx-zkp/           #   Groth16, Bulletproofs, Schnorr
│   ├── gtcx-consensus/     #   Weighted PBFT consensus
│   ├── gtcx-network/       #   P2P networking and pub/sub
│   ├── gtcx-edge/          #   Edge runtime + device profiles
│   └── gtcx-node/          #   NAPI-RS Node.js bindings
├── tests/integration/      # Cross-package integration tests
├── benchmarks/             # Performance budgets and history
├── quality/                # API baselines and evidence artifacts
├── tools/                  # CI and quality automation scripts
└── docs/                   # Standard operating procedures
```

---

## Key Files

| File                                  | Purpose                                               |
| ------------------------------------- | ----------------------------------------------------- |
| `package.json`                        | Root scripts: build, test, lint, typecheck, api:check |
| `turbo.json`                          | Turborepo pipeline configuration                      |
| `quality/api-surface-baseline.json`   | Tracked API surface — changes require human approval  |
| `tools/check-package-boundaries.mjs`  | Architecture boundary enforcement                     |
| `tools/check-threat-matrix.mjs`       | Security threat matrix check                          |
| `tools/check-performance-budgets.mjs` | Performance budget enforcement                        |

---

## Data Flow

```
Downstream repo calls @gtcx/crypto to generate keys or sign data:

1. Consumer imports from @gtcx/crypto-native (binding loader)
2. Loader checks GTCX_REQUIRE_NATIVE — if true, loads Rust NAPI module
3. Rust module (gtcx-node → gtcx-crypto) executes Ed25519 or SHA-256
4. Result returned as TypeScript-compatible types from @gtcx/types
5. Consumer uses @gtcx/verification to build a W3C VC proof bundle
6. Proof bundle is stored offline via @gtcx/security or synced via @gtcx/sync
```

---

## Dependencies

**This repo depends on:** Nothing. It is the foundation layer.

**What depends on this repo:**

| Consumer            | How It Connects         |
| ------------------- | ----------------------- |
| `gtcx-protocols`    | npm import of `@gtcx/*` |
| `gtcx-platforms`    | npm import of `@gtcx/*` |
| `gtcx-intelligence` | npm import of `@gtcx/*` |
| `gtcx-app`          | npm import of `@gtcx/*` |
| All GTCX repos      | npm import of `@gtcx/*` |

---

## API

`gtcx-core` has no HTTP API. Its interface is its TypeScript exports. The full API surface is tracked in `quality/api-surface-baseline.json` and enforced by `pnpm api:check`. Any breaking change requires human approval before updating the baseline.

---

## Running Locally

```bash
pnpm install
pnpm build
pnpm test
```

For full setup: [Developer Setup](developer-setup.md).
