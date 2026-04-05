# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.15.0
- [Rust](https://rustup.rs/) >= 1.82.0 (for Rust crates)

### Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

For a step-by-step integration walkthrough, see the [Orientation guide](./_sop/1-agents/1-onboarding/orientation.md).

## Packages

### TypeScript (18 packages + 4 config presets)

| Package                                           | Description                                                                            |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`@gtcx/types`](./packages/types)                 | Core type definitions for the GTCX ecosystem                                           |
| [`@gtcx/schemas`](./packages/schemas)             | Core12 compliance verification schemas                                                 |
| [`@gtcx/crypto`](./packages/crypto)               | Cryptographic primitives — key generation, signing, hashing, Merkle trees, commitments |
| [`@gtcx/crypto-native`](./packages/crypto-native) | Native crypto bindings loader (NAPI-RS)                                                |
| [`@gtcx/domain`](./packages/domain)               | Commodity-agnostic domain services with DI, offline queues, and observability          |
| [`@gtcx/utils`](./packages/utils)                 | Common utilities for GTCX applications                                                 |
| [`@gtcx/identity`](./packages/identity)           | DID creation, credential management, key lifecycle, identity resolution                |
| [`@gtcx/security`](./packages/security)           | Auth, validation, offline credential management, audit logging                         |
| [`@gtcx/verification`](./packages/verification)   | Certificate generation, QR codes, proof bundles, and verification proofs               |
| [`@gtcx/events`](./packages/events)               | Type-safe event bus with offline buffering                                             |
| [`@gtcx/services`](./packages/services)           | Registration, trading, and compliance business services                                |
| [`@gtcx/workproof`](./packages/workproof)         | TradeCV/WorkProof v2.1 — W3C VC-based work attestations, 40 predicates, AI validation  |
| [`@gtcx/ai`](./packages/ai)                       | AI integration hooks and tracing utilities                                             |
| [`@gtcx/api-client`](./packages/api-client)       | Resilient HTTP client with retry, circuit breakers, and offline queue                  |
| [`@gtcx/connectivity`](./packages/connectivity)   | Network connectivity detection and profiling for offline-first apps                    |
| [`@gtcx/logging`](./packages/logging)             | Structured logging for GTCX services                                                   |
| [`@gtcx/network`](./packages/network)             | P2P networking and messaging via libp2p                                                |
| [`@gtcx/sync`](./packages/sync)                   | Offline-first sync engine with conflict resolution strategies                          |
| [`@gtcx/config`](./packages/config)               | Shared build configuration (ESLint, TypeScript, tsup, jurisdiction configs)            |

### Rust (6 crates)

| Crate                                     | Description                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| [`gtcx-crypto`](./rust/gtcx-crypto)       | Core cryptographic primitives — Ed25519, SHA-256/512, key derivation            |
| [`gtcx-zkp`](./rust/gtcx-zkp)             | Proof system: Groth16/Bulletproofs/Schnorr circuits + hash-commitment baseline  |
| [`gtcx-consensus`](./rust/gtcx-consensus) | Weighted PBFT consensus engine for multi-stakeholder verification               |
| [`gtcx-network`](./rust/gtcx-network)     | P2P networking types with topic-based pub/sub messaging                         |
| [`gtcx-edge`](./rust/gtcx-edge)           | Edge runtime with resource-constrained device profiles and verification caching |
| [`gtcx-node`](./rust/gtcx-node)           | Node.js native bindings via NAPI-RS for cryptographic operations                |

## Directory Structure

```
gtcx-core/
├── packages/               # 18 TypeScript packages + config presets
│   ├── types/              #   Core types and protocol definitions
│   ├── schemas/            #   Zod validation schemas
│   ├── crypto/             #   Cryptographic primitives
│   ├── crypto-native/      #   Native bindings loader
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
│   ├── network/            #   P2P networking
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
├── benchmarks/             # Performance budgets and results
├── quality/                # API baselines and evidence artifacts
└── _sop/                   # Standard operating procedures
    ├── 1-agents/           #   Agent team, roles, safety rules, task playbooks
    ├── 2-docs/             #   Engineering, devops, specs, architecture
    │   ├── 3-engineering/  #     System design, ADRs, security, tech stack
    │   ├── 4-devops/       #     CI/CD, runbooks, release management
    │   └── 5-specs/        #     Package specs, backend, testing
    └── 3-agile/            #   Roadmap, sprints, backlog
```

## Quick Navigation

| Document                                                                           | Description                                    |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| [\_sop Index](./_sop/README.md)                                                    | Full documentation and operations hub          |
| [Orientation](./_sop/1-agents/1-onboarding/orientation.md)                         | Start here — codebase map and session protocol |
| [Safety Rules](./_sop/1-agents/4-workflows/safety-rules.md)                        | What requires human approval                   |
| [Architecture Overview](./_sop/2-docs/3-engineering/2-system-design/overview.md)   | Layer map, trust boundaries, package graph     |
| [ADR Index](./_sop/2-docs/3-engineering/6-decisions/README.md)                     | All 13 architecture decision records           |
| [Package Specs](./_sop/2-docs/5-specs/4-backend/packages/README.md)                | Per-package API and responsibility specs       |
| [Rust Crate Specs](./_sop/2-docs/5-specs/4-backend/packages/rust/)                 | Rust crate specs and build targets             |
| [Security Framework](./_sop/2-docs/3-engineering/7-security/security-framework.md) | Security architecture and controls             |
| [Quality Runbook](./_sop/2-docs/4-devops/2-runbooks/quality-runbook.md)            | CI triage order and gate sequence              |
| [Release Checklist](./_sop/2-docs/4-devops/7-release-mgmt/release-checklist.md)    | Release gate and evidence requirements         |
| [Roadmap](./_sop/3-agile/2-scrum-board/2-phases/roadmap.md)                        | Delivery roadmap and sprint status             |

## Dependencies

None. This is the foundation layer.

## Principles

> Full definitions in gtcx-infrastructure repo

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

## Cross-Links

- gtcx-docs — Ecosystem documentation hub
- gtcx-protocols — Protocol specs and delivery planning
