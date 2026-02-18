# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.15.0
- [Rust](https://rustup.rs/) >= 1.75.0 (for Rust crates)

### Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

For a step-by-step integration walkthrough, see [First Integration Tutorial](./docs/guides/first-integration.md).

## Packages

### TypeScript (17 packages)

| Package                                         | Description                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`@gtcx/types`](./packages/types)               | Core type definitions for the GTCX ecosystem                                           |
| [`@gtcx/schemas`](./packages/schemas)           | Core12 compliance verification schemas                                                 |
| [`@gtcx/crypto`](./packages/crypto)             | Cryptographic primitives — key generation, signing, hashing, Merkle trees, commitments |
| [`@gtcx/domain`](./packages/domain)             | Commodity-agnostic domain services with DI, offline queues, and observability          |
| [`@gtcx/utils`](./packages/utils)               | Common utilities for GTCX applications                                                 |
| [`@gtcx/identity`](./packages/identity)         | DID creation, credential management, key lifecycle, identity resolution                |
| [`@gtcx/security`](./packages/security)         | Auth, validation, offline credential management, audit logging                         |
| [`@gtcx/verification`](./packages/verification) | Certificate generation, QR codes, proof bundles, and verification proofs               |
| [`@gtcx/events`](./packages/events)             | Type-safe event bus with offline buffering                                             |
| [`@gtcx/services`](./packages/services)         | Registration, trading, and compliance business services                                |
| [`@gtcx/workproof`](./packages/workproof)       | TradeCV/WorkProof v2.1 — W3C VC-based work attestations, 40 predicates, AI validation  |
| [`@gtcx/ai`](./packages/ai)                     | AI integration hooks and tracing utilities                                             |
| [`@gtcx/api-client`](./packages/api-client)     | Resilient HTTP client with retry, circuit breakers, and offline queue                  |
| [`@gtcx/connectivity`](./packages/connectivity) | Network connectivity detection and profiling for offline-first apps                    |
| [`@gtcx/logging`](./packages/logging)           | Structured logging for GTCX services                                                   |
| [`@gtcx/sync`](./packages/sync)                 | Offline-first sync engine with conflict resolution strategies                          |
| [`@gtcx/config`](./packages/config)             | Shared build configuration (tsup presets)                                              |

### Rust (6 crates)

| Crate                                     | Description                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| [`gtcx-crypto`](./rust/gtcx-crypto)       | Core cryptographic primitives — Ed25519, SHA-256/512, key derivation            |
| [`gtcx-zkp`](./rust/gtcx-zkp)             | Zero-knowledge proof system with hash-commitment proofs                         |
| [`gtcx-consensus`](./rust/gtcx-consensus) | Weighted PBFT consensus engine for multi-stakeholder verification               |
| [`gtcx-network`](./rust/gtcx-network)     | P2P networking types with topic-based pub/sub messaging                         |
| [`gtcx-edge`](./rust/gtcx-edge)           | Edge runtime with resource-constrained device profiles and verification caching |
| [`gtcx-node`](./rust/gtcx-node)           | Node.js native bindings via NAPI-RS for cryptographic operations                |

## Directory Structure

```
gtcx-core/
├── packages/               # 17 TypeScript packages
│   ├── types/              #   Core types and protocol definitions
│   ├── schemas/            #   Zod validation schemas
│   ├── crypto/             #   Cryptographic primitives
│   ├── domain/             #   Domain services
│   ├── identity/           #   DID and credential management
│   ├── security/           #   Auth, validation, audit
│   ├── verification/       #   Certificates and proof bundles
│   ├── events/             #   Event bus
│   ├── services/           #   Business services
│   ├── workproof/          #   WorkProof/TradeCV attestations
│   ├── ai/                 #   AI integration
│   ├── api-client/         #   HTTP client
│   ├── connectivity/       #   Network profiling
│   ├── logging/            #   Structured logging
│   ├── sync/               #   Sync engine
│   ├── utils/              #   Shared utilities
│   └── config/             #   Build configuration
├── rust/                   # 6 Rust crates
│   ├── gtcx-crypto/        #   Core crypto primitives
│   ├── gtcx-zkp/           #   Zero-knowledge proofs
│   ├── gtcx-consensus/     #   PBFT consensus
│   ├── gtcx-network/       #   P2P networking
│   ├── gtcx-edge/          #   Edge runtime
│   └── gtcx-node/          #   NAPI-RS bindings
├── tests/                  # Integration test suite
│   └── integration/        #   Cross-package integration tests
└── docs/                   # Documentation
    ├── architecture/       #   Architecture overviews
    ├── specs/              #   Protocol specifications
    ├── packages/           #   Package-level documentation
    ├── rust/               #   Rust crate documentation
    ├── guides/             #   Tutorials and how-tos
    └── adr/                #   Architecture Decision Records
```

## Quick Navigation

| Document                                                                        | Description                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Documentation Index](./docs/README.md)                                         | Full documentation hub                            |
| [Architecture Overview](./docs/architecture/core-architecture-overview.md)      | Composable architecture and ecosystem integration |
| [Shared Infrastructure](./docs/architecture/shared-infrastructure.md)           | Shared infrastructure and integration patterns    |
| [Cryptographic Verification](./docs/architecture/cryptographic-verification.md) | Crypto design and verification model              |
| [Integration Patterns](./docs/architecture/integration-patterns.md)             | Cross-protocol integration patterns               |
| [Data Models Spec](./docs/specs/data-models.md)                                 | Core data model specification                     |
| [Security Framework](./docs/specs/security-framework.md)                        | Security architecture and threat model            |
| [Identity Core](./docs/specs/identity-core.md)                                  | TradePass identity specification                  |
| [EventCore Spec](./docs/specs/eventcore.md)                                     | Event data model and encoding                     |
| [Network Protocol](./docs/specs/network-protocol.md)                            | P2P network protocol specification                |
| [Package Docs](./docs/packages/README.md)                                       | TypeScript package documentation index            |
| [Rust Docs](./docs/rust/README.md)                                              | Rust crate documentation                          |
| [ADR Index](./docs/adr/README.md)                                               | Architecture Decision Records                     |
| [Benchmarks](./docs/BENCHMARKS.md)                                              | Cryptographic operation benchmarks                |
| [First Integration Guide](./docs/guides/first-integration.md)                   | Getting started with gtcx-core                    |
| [Validator Deployment](./docs/guides/validator-deployment.md)                   | Deploying a GTCX validator node                   |

## Dependencies

None. This is the foundation layer.

## Principles

> Full definitions: [PRINCIPLES.md](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/tools/templates/PRINCIPLES.md)

Primary principles for this repo:

- P1 Proof — every claim requires cryptographic proof
- P2 Private — minimal disclosure, data sovereignty
- P4 Immutable — verification records cannot be altered
- P11 Secure — zero-trust security at every layer

Required across all repos:

- P7 Open — open-source, no vendor lock-in
- P13 Modular — single responsibility, clear boundaries
- P27 Documented — every system and API is documented
- P29 Tested — automated tests for every module
- P30 Intentional — every line of code serves a purpose

## Spec Canon Alignment

- gtcx-protocols/agile-pm/spec-canon.md
- gtcx-docs/docs/docs-overview.md

## Cross-Links

- gtcx-docs — Ecosystem documentation hub
- gtcx-protocols — Protocol specs and delivery planning
- gtcx-core — Shared crypto, types, and schemas
