# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

**Last reviewed:** 2026-05-11

## Engineering Standards

This repository targets infrastructure-grade engineering standards suitable for global trade and governmental systems. Current maturity varies by package — see the [Readiness Matrix](#package-readiness-matrix) below.

- **Mathematical Verification**: Core cryptographic paths are verified using property-based testing (`fast-check`) and continuous fuzzing (`cargo-fuzz` on nightly).
- **Security by Design**: Deep object sanitization (`sanitizeSecrets`) prevents cryptographic leakage in observability layers; `SecurityLogger` operates in strict mode in production.
- **Architectural Rigor**: Enforced layering boundaries (zero circular dependencies), max 500 LOC per source file, and standardized error taxonomy (ADR-012).
- **Audit Ready**: Structured tracing and security logging preserve zero-trust boundaries.

For a detailed breakdown of these mandates, see [Quality Standards](./docs/testing/quality-standards.md).

## Current State

**Composite readiness: 9.5/10** as of [2026-05-21](./docs/audit/internal-completion-audit-2026-05-21.md). The codebase is in a hardened, code-addressable state with active quality gates:

- trust-path defects in signing, verification, token handling, and offline lockout recovery have been remediated
- offline replay ordering uses logical sequence instead of wall-clock time
- API surface is baselined, docs are aligned to the current architecture, and release/readiness artifacts are in place
- coverage gates enforce **≥95% branch coverage** — 19/19 testable packages meet the threshold ([audit table](./docs/audit/internal-completion-audit-2026-05-21.md#updated-coverage-table))
- Rust FIPS backend (aws-lc-rs, CMVP #4816) verified with 63/63 tests passing
- HSM key storage traits implemented for PKCS11 (SoftHSM, AWS CloudHSM) and AWS KMS Cloud Custody
- 500,000+ fuzz iterations across 6 cargo-fuzz targets, **zero crashes, zero panics, zero ASAN violations** ([evidence](./docs/audit/fuzz-campaign-evidence-2026-05-21.md))
- `cargo deny` and `cargo audit` run in CI; known upstream advisories in the `ark-*` ecosystem are tracked in `rust/.cargo/audit.toml`
- SLSA provenance pipeline wired (Source L2 enforced, Build L3 aspirational); `NPM_TOKEN` set at org as of 2026-05-21

### Active execution program

[Engagement Readiness Sprint Roadmap (2026-05-22)](./docs/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — 4-sprint plan driven by imminent sovereign-state engagements (Zimbabwe, Ghana, Namibia, Botswana, DRC). Closes the customer-visible readiness gap.

### Remaining blockers before production release

**External (budgeted, Sprint 4 kickoff per roadmap above):**

- external security review / pen test ($8–25K, 4–6 weeks)
- SOC 2 Type 1 attestation ($15–45K, 8–10 weeks)
- first sandbox regulator response (Zimbabwe email staged; Sprint 3 send)

**Internal (known, tracked):**

- `@gtcx/crypto-native` odd-length-hex NAPI boundary edge case (Sprint 2 fix)
- Rust `ark-*` transitive dependencies carry unmaintained crates (`derivative`, `paste`) — mitigated via audit ignore list pending upstream updates
- 3 org secrets remain unset: `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` (Sprint 1)

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.15.0
- [Rust](https://rustup.rs/) >= 1.91.0 (for Rust crates)

### Setup

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

For a step-by-step repo walkthrough, see the [Orientation guide](./docs/agents/onboarding/orientation.md). For consumer adoption and release posture, start in [docs/release/README.md](./docs/release/README.md).

## Package Readiness Matrix

Coverage numbers reflect the [2026-05-21 internal completion audit](./docs/audit/internal-completion-audit-2026-05-21.md). All testable packages clear the **≥95% branch coverage** gate.

| Package               | State                  | Branch Coverage | Notes                                                                                              |
| --------------------- | ---------------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `@gtcx/crypto`        | ✅ Production-hardened | 100%            | Property-tested, native + JS backends, 386 tests                                                   |
| `@gtcx/schemas`       | ✅ Production-hardened | 100%            | Core12: 12 domains, 24 controls fully populated                                                    |
| `@gtcx/logging`       | ✅ Production-hardened | 100%            | Structured logging adapters                                                                        |
| `@gtcx/network`       | ✅ Production-hardened | 100%            | P2P types, peer discovery, libp2p transport                                                        |
| `@gtcx/workproof`     | ✅ Production-hardened | 100%            | 38 predicates, AI validation types, 293 tests                                                      |
| `@gtcx/crypto-native` | ✅ Production-hardened | 99.03%          | Mock-binding coverage; odd-length-hex NAPI edge case queued for Sprint 2                           |
| `@gtcx/services`      | ✅ Production-hardened | 98.45%          | Compliance decomposed, health checks, metrics, 224 tests                                           |
| `@gtcx/sync`          | ✅ Production-hardened | 97.95%          | Offline-first sync engine with conflict resolution                                                 |
| `@gtcx/types`         | ✅ Production-hardened | 97.67%          | Core type definitions, 38 tests                                                                    |
| `@gtcx/ai`            | ✅ Production-hardened | 97.43%          | Synchronous + async tracing with span propagation via AsyncLocalStorage, 68 tests                  |
| `@gtcx/security`      | ✅ Production-hardened | 97.08%          | Strict-mode audit logger, redaction, 406 tests                                                     |
| `@gtcx/identity`      | ✅ Production-hardened | 96.53%          | DID and credential management, 93 tests                                                            |
| `@gtcx/api-client`    | ✅ Production-hardened | 96.18%          | Retry, offline queue, request signing, 133 tests                                                   |
| `@gtcx/utils`         | ✅ Production-hardened | 95.45%          | Common utilities, 32 tests                                                                         |
| `@gtcx/verification`  | ✅ Production-hardened | 95.2%           | QR, proofs, bundles, 265 tests                                                                     |
| `@gtcx/telemetry`     | ✅ Production-hardened | 95.18%          | OpenTelemetry-compatible metrics, traces, logs                                                     |
| `@gtcx/domain`        | ✅ Production-hardened | 95.3%           | DI container, offline queues, versioning, 346 tests                                                |
| `@gtcx/events`        | ✅ Production-hardened | 98%             | Event bus, 55 tests                                                                                |
| `@gtcx/connectivity`  | ✅ Production-hardened | 98.7%           | Network detection and profiling, 127 tests                                                         |
| `@gtcx/resilience`    | ✅ Production-hardened | —               | Circuit breaker, adaptive retry, timeout, bulkhead, 50 tests                                       |
| `@gtcx/runtime`       | ✅ Production-hardened | —               | Batteries-included substrate aggregating api-client, connectivity, resilience, telemetry (ADR-014) |

### Shared Config Workspace Packages (4)

These live under [`packages/config`](./packages/config) and support the monorepo/tooling layer rather than the main runtime API surface:

| Package                                                       | Description                               |
| ------------------------------------------------------------- | ----------------------------------------- |
| [`@gtcx/eslint-config`](./packages/config/eslint)             | Shared ESLint 9 flat configuration        |
| [`@gtcx/typescript-config`](./packages/config/typescript)     | Shared TypeScript base configs            |
| [`@gtcx/tsup-config`](./packages/config/tsup)                 | Shared `tsup` build presets               |
| [`@gtcx/jurisdiction-config`](./packages/config/jurisdiction) | Shared jurisdiction configuration schemas |

### Rust (6 crates)

| Crate                                     | State          | Description                                                                     |
| ----------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| [`gtcx-crypto`](./rust/gtcx-crypto)       | ✅ Hardened    | Core cryptographic primitives — Ed25519, SHA-256/512, key derivation            |
| [`gtcx-zkp`](./rust/gtcx-zkp)             | ⚠️ Functional  | Proof system: Groth16/Bulletproofs/Schnorr circuits + hash-commitment baseline  |
| [`gtcx-consensus`](./rust/gtcx-consensus) | 🚧 Scaffolding | Weighted PBFT consensus engine for multi-stakeholder verification               |
| [`gtcx-network`](./rust/gtcx-network)     | 🚧 Scaffolding | P2P networking types with topic-based pub/sub messaging                         |
| [`gtcx-edge`](./rust/gtcx-edge)           | 🚧 Scaffolding | Edge runtime with resource-constrained device profiles and verification caching |
| [`gtcx-node`](./rust/gtcx-node)           | ⚠️ Functional  | Node.js native bindings via NAPI-RS for cryptographic operations                |

## Directory Structure

```
core/
├── packages/               # 21 public packages + shared config workspace packages
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
│   ├── resilience/         #   Circuit breaker, retry, timeout, bulkhead
│   ├── telemetry/          #   OpenTelemetry-compatible instrumentation
│   ├── runtime/            #   Batteries-included runtime substrate (ADR-014)
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

| Document                                                             | Description                                       |
| -------------------------------------------------------------------- | ------------------------------------------------- |
| [Documentation](./docs/README.md)                                    | Full documentation and operations hub             |
| [Trust Portal](./docs/governance/trust-portal.md)                    | Evidence index for vendor risk teams + regulators |
| [Orientation](./docs/agents/onboarding/orientation.md)               | Start here — codebase map and session protocol    |
| [Safety Rules](./docs/agents/workflows/safety-rules.md)              | What requires human approval                      |
| [Architecture Overview](./docs/architecture/overview.md)             | Layer map, trust boundaries, package graph        |
| [ADR Index](./docs/decisions/README.md)                              | All 14 architecture decision records              |
| [Package Specs](./docs/specs/packages/README.md)                     | Per-package API and responsibility specs          |
| [Rust Crate Specs](./docs/specs/packages/rust/)                      | Rust crate specs and build targets                |
| [Security Framework](./docs/security/security-framework.md)          | Security architecture and controls                |
| [Quality Runbook](./docs/devops/runbooks/quality-runbook.md)         | CI triage order and gate sequence                 |
| [Release Checklist](./docs/devops/release-mgmt/release-checklist.md) | Release gate and evidence requirements            |
| [Roadmap](./docs/agile/roadmap/roadmap.md)                           | Delivery roadmap and sprint status                |

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
