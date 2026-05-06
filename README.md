# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

## Engineering Excellence

This repository adheres to **Infrastructure Grade (10/10)** engineering standards, ensuring the reliability and mathematical correctness required for global trade and governmental systems.

- **Mathematical Verification**: All core cryptographic paths are verified using property-based testing (`fast-check`) and continuous fuzzing (`cargo-fuzz` on nightly).
- **Security by Design**: Deep object sanitization (`sanitizeSecrets`) prevents cryptographic leakage in observability layers.
- **Architectural Rigor**: Strictly enforced layering boundaries (zero circular dependencies) and standardized error taxonomy (ADR-012).
- **Audit Ready**: All code is instrumented for tracing while preserving zero-trust security boundaries.

For a detailed breakdown of these mandates, see [GEMINI.md](./GEMINI.md).

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

For a step-by-step integration walkthrough, see the [Orientation guide](./docs/agents/onboarding/orientation.md).

## Packages

### Public `@gtcx/*` Packages (18)

| Package                                           | Description                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`@gtcx/types`](./packages/types)                 | Core type definitions for the GTCX ecosystem                                                |
| [`@gtcx/schemas`](./packages/schemas)             | Core12 compliance verification schemas                                                      |
| [`@gtcx/crypto`](./packages/crypto)               | Cryptographic primitives — key generation, signing, hashing, Merkle trees, commitments      |
| [`@gtcx/crypto-native`](./packages/crypto-native) | Native crypto bindings loader (NAPI-RS)                                                     |
| [`@gtcx/domain`](./packages/domain)               | Commodity-agnostic domain services with DI, offline queues, and observability               |
| [`@gtcx/utils`](./packages/utils)                 | Common utilities for GTCX applications                                                      |
| [`@gtcx/identity`](./packages/identity)           | DID creation, identity lifecycle, key management, identity resolution                       |
| [`@gtcx/security`](./packages/security)           | Auth, validation, offline credential management, audit logging                              |
| [`@gtcx/verification`](./packages/verification)   | Certificate generation, QR codes, proof bundles, and verification proofs                    |
| [`@gtcx/events`](./packages/events)               | Type-safe event bus with offline buffering                                                  |
| [`@gtcx/services`](./packages/services)           | Registration, trading, and compliance business services                                     |
| [`@gtcx/workproof`](./packages/workproof)         | TradeCV/WorkProof v2.1 — W3C VC-based work attestations, 38 predicates, AI validation types |
| [`@gtcx/ai`](./packages/ai)                       | Observability stubs and tracing hooks (full implementation in `gtcx-intelligence`)          |
| [`@gtcx/api-client`](./packages/api-client)       | Resilient HTTP client with retry, offline queue, and request signing                        |
| [`@gtcx/connectivity`](./packages/connectivity)   | Network connectivity detection and profiling for offline-first apps                         |
| [`@gtcx/logging`](./packages/logging)             | Structured logging for GTCX services                                                        |
| [`@gtcx/network`](./packages/network)             | P2P networking primitives and transport utilities                                           |
| [`@gtcx/sync`](./packages/sync)                   | Offline-first sync engine with conflict resolution strategies                               |

### Shared Config Workspace Packages (4)

These live under [`packages/config`](./packages/config) and support the monorepo/tooling layer rather than the main runtime API surface:

| Package                                                       | Description                               |
| ------------------------------------------------------------- | ----------------------------------------- |
| [`@gtcx/eslint-config`](./packages/config/eslint)             | Shared ESLint 9 flat configuration        |
| [`@gtcx/typescript-config`](./packages/config/typescript)     | Shared TypeScript base configs            |
| [`@gtcx/tsup-config`](./packages/config/tsup)                 | Shared `tsup` build presets               |
| [`@gtcx/jurisdiction-config`](./packages/config/jurisdiction) | Shared jurisdiction configuration schemas |

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
core/
├── packages/               # 18 public packages + shared config workspace packages
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
│   ├── network/            #   Networking primitives
│   ├── sync/               #   Sync engine
│   ├── utils/              #   Shared utilities
│   └── config/             #   Internal/shared config workspace packages
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
└── docs/                   # Documentation and operations
    ├── agents/             #   Agent team, roles, safety rules, task playbooks
    ├── architecture/       #   System architecture and layer map
    ├── decisions/          #   Architecture decision records (ADRs)
    ├── specs/              #   Package specs, backend, testing
    ├── security/           #   Security framework and controls
    ├── devops/             #   CI/CD, runbooks, release management
    ├── agile/              #   Roadmap, sprints, backlog
    ├── compliance/         #   Compliance documentation
    ├── deployment/         #   Deployment guides
    ├── release/            #   Release notes and history
    ├── stack/              #   Tech stack documentation
    └── testing/            #   Test strategy and guides
```

## Quick Navigation

| Document                                                             | Description                                    |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| [Documentation](./docs/README.md)                                    | Full documentation and operations hub          |
| [Orientation](./docs/agents/onboarding/orientation.md)               | Start here — codebase map and session protocol |
| [Safety Rules](./docs/agents/workflows/safety-rules.md)              | What requires human approval                   |
| [Architecture Overview](./docs/architecture/overview.md)             | Layer map, trust boundaries, package graph     |
| [ADR Index](./docs/decisions/README.md)                              | All 17 architecture decision records           |
| [Package Specs](./docs/specs/packages/README.md)                     | Per-package API and responsibility specs       |
| [Rust Crate Specs](./docs/specs/packages/rust/)                      | Rust crate specs and build targets             |
| [Security Framework](./docs/security/security-framework.md)          | Security architecture and controls             |
| [Quality Runbook](./docs/devops/runbooks/quality-runbook.md)         | CI triage order and gate sequence              |
| [Release Checklist](./docs/devops/release-mgmt/release-checklist.md) | Release gate and evidence requirements         |
| [Roadmap](./docs/agile/roadmap/roadmap.md)                           | Delivery roadmap and sprint status             |

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
