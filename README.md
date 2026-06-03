# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

**Trust portal:** [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal) — see [hosting runbook](./docs/operations/trust-portal-hosting.md)
**Last reviewed:** 2026-06-04

## Engineering Standards

This repository targets infrastructure-grade engineering standards suitable for global trade and governmental systems. Current maturity varies by package — see the [Readiness Matrix](#package-readiness-matrix) below.

- **Mathematical Verification**: Core cryptographic paths are verified using property-based testing (`fast-check`) and continuous fuzzing (`cargo-fuzz` on nightly).
- **Security by Design**: Deep object sanitization (`sanitizeSecrets`) prevents cryptographic leakage in observability layers; `SecurityLogger` operates in strict mode in production.
- **Architectural Rigor**: Enforced layering boundaries (zero circular dependencies), max 500 LOC per source file, and standardized error taxonomy (ADR-012).
- **Audit Ready**: Structured tracing and security logging preserve zero-trust boundaries.

For a detailed breakdown of these mandates, see [Quality Standards](./docs/testing/quality-standards.md).

## Current State

Two scores apply — do not conflate them ([full-audit 2026-06-04](./docs/audit/full-audit-2026-06-04.md)).

### Library readiness (npm / engineering 10/10)

**Composite: 9.5/10** as of [2026-05-21](./docs/audit/internal-completion-audit-2026-05-21.md). The monorepo is in a hardened, code-addressable state with active quality gates:

- trust-path defects in signing, verification, token handling, and offline lockout recovery have been remediated
- offline replay ordering uses logical sequence instead of wall-clock time
- API surface is baselined, docs are aligned to the current architecture, and release/readiness artifacts are in place
- coverage gates enforce **≥95% branch coverage** — 19/19 testable packages meet the threshold ([audit table](./docs/audit/))
- Rust FIPS backend (aws-lc-rs, CMVP #4816) verified with 63/63 tests passing
- HSM key storage traits implemented for PKCS11 (SoftHSM, AWS CloudHSM) and AWS KMS Cloud Custody
- 500,000+ fuzz iterations across 6 cargo-fuzz targets, **zero crashes, zero panics, zero ASAN violations** ([evidence](./docs/audit/fuzz-campaign-evidence-2026-05-21.md))
- `cargo deny` and `cargo audit` run in CI; known upstream advisories in the `ark-*` ecosystem are tracked in `rust/.cargo/audit.toml`
- **24** TypeScript workspace packages under `packages/` (see [package specs](./docs/specs/packages/README.md)); **22** published to npm on the **3.1.4 train** — verify: `pnpm provenance:check-npm:strict`
- SLSA: Source L2 enforced in CI; npm registry provenance via `release.yml` — see [trust portal](./docs/governance/trust-portal.md#published-versions)
- Root `pnpm typecheck` / `pnpm build` green (turbo graph; FA-P0-1, 2026-06-04)

### Defensibility Tier 5 (DTF-001 — jurisdiction ZKP moat)

**Technical Tier 5: ~88%** — automatable slice complete (DTF-5.5.1 strict jurisdiction packs shipped). Tiers 1–4 are achieved; remaining Tier 5 work is ceremony-gated (CORE-004 / XR-402) and commercial (Legal/GTM). See [tier-5 workplan](./docs/operations/tier-5-workplan-2026-06.md).

| Track                                   | Status        | Canonical doc                                                                                         |
| --------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| S-T5-1 gh-gold profile + KAT            | **done**      | [tier-5 workplan](./docs/operations/tier-5-workplan-2026-06.md)                                       |
| S-T5-2 zw-diamond + verification + KATs | **done**      | [execution roadmap](./docs/audit/execution-roadmap.md)                                                |
| S-T5-3 cross-repo witness + registry    | **done**      | [DTF-5.4.4 ack](./docs/operations/coordination/to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md) |
| S-T5-4 strict jurisdiction packs        | **done**      | `pnpm jurisdiction:validate-packs`                                                                    |
| Sovereign pilot / bank-grade            | **not ready** | Ecosystem gates below                                                                                 |

**Moat path (in-repo):** WorkProof witness → `@gtcx/crypto` profile prove → `@gtcx/verification` bundle (`commodity-origin-zk`). Cross-package test: [`tests/integration/commodity-origin-zk.test.ts`](./tests/integration/commodity-origin-zk.test.ts).

### Active execution program

- **FA-S1 / DTF Tier 5:** [execution-roadmap.md](./docs/audit/execution-roadmap.md) (reconciled with [full-audit-2026-06-04](./docs/audit/full-audit-2026-06-04.md))
- **Engagement readiness:** [sprint roadmap 2026-05-22](./docs/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — sovereign-state engagements (Zimbabwe, Ghana, Namibia, Botswana, DRC)

### Remaining blockers before sovereign pilot / production release

**Library maturity alone does not clear a sovereign pilot.** The items below are ecosystem or human gates:

**External clearance (XC) — owned with [gtcx-infrastructure GTM](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/gtm/README.md), not in this repo alone:**

- regional pen-test on **live stack** ($8–15K, 4–6 weeks) — [EXT-INF-002](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/audit/external-dependencies-register-2026-05-31.md)
- ZWCMP pilot owner + DPA (EXT-INF-013–015)
- testnet deploy + DR proof ([Global South plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/gtm/plans/global-south-10x-plan.md))
- Zimbabwe sandbox intro — [`docs/gtm/sandbox-intro-email-template.md`](./docs/gtm/sandbox-intro-email-template.md) (human send)

**Bank track (optional, US/EU):** SOC 2 Type I ($15–45K). See [ecosystem GTM alignment](./docs/gtm/16-ecosystem-gtm-alignment.md) and [GTM reality check 2026-06-02](./docs/gtm/gtm-reality-check-2026-06-02.md).

**Internal (known, tracked):**

- Rust `ark-*` transitive dependencies carry unmaintained crates (`derivative`, `paste`) — mitigated via `rust/.cargo/audit.toml` pending arkworks 0.5
- Optional CI ergonomics (not release blockers): `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` at org scope — run `pnpm ops:check` for status

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

| Package               | State                  | Branch Coverage | Notes                                                                                                                   |
| --------------------- | ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `@gtcx/crypto`        | ✅ Production-hardened | 100%            | Property-tested, native + JS backends, 386 tests                                                                        |
| `@gtcx/schemas`       | ✅ Production-hardened | 100%            | Core12: 12 domains, 24 controls fully populated                                                                         |
| `@gtcx/logging`       | ✅ Production-hardened | 100%            | Structured logging adapters                                                                                             |
| `@gtcx/network`       | 🚧 Scaffolding         | 100%            | In-memory + transport types; **libp2p mesh Phase 2** — see [`packages/network/README.md`](./packages/network/README.md) |
| `@gtcx/workproof`     | ✅ Production-hardened | 100%            | 38 predicates, AI validation types, 293 tests                                                                           |
| `@gtcx/crypto-native` | ✅ Production-hardened | 99.03%          | Native NAPI bindings; `assertHex` / `isHex` at boundary (0.4.0+)                                                        |
| `@gtcx/services`      | ✅ Production-hardened | 98.45%          | Compliance decomposed, health checks, metrics, 224 tests                                                                |
| `@gtcx/sync`          | ✅ Production-hardened | 97.95%          | Offline-first sync engine with conflict resolution                                                                      |
| `@gtcx/types`         | ✅ Production-hardened | 97.67%          | Core type definitions, 38 tests                                                                                         |
| `@gtcx/ai`            | ✅ Production-hardened | 97.43%          | Synchronous + async tracing with span propagation via AsyncLocalStorage, 68 tests                                       |
| `@gtcx/security`      | ✅ Production-hardened | 97.08%          | Strict-mode audit logger, redaction, 406 tests                                                                          |
| `@gtcx/identity`      | ✅ Production-hardened | 96.53%          | DID and credential management, 93 tests                                                                                 |
| `@gtcx/api-client`    | ✅ Production-hardened | 96.18%          | Retry, offline queue, request signing, 133 tests                                                                        |
| `@gtcx/utils`         | ✅ Production-hardened | 95.45%          | Common utilities, 32 tests                                                                                              |
| `@gtcx/verification`  | ✅ Production-hardened | 95.2%           | QR, proofs, bundles, 265 tests                                                                                          |
| `@gtcx/telemetry`     | ✅ Production-hardened | 95.18%          | OpenTelemetry-compatible metrics, traces, logs                                                                          |
| `@gtcx/domain`        | ✅ Production-hardened | 95.3%           | DI container, offline queues, versioning, 346 tests                                                                     |
| `@gtcx/events`        | ✅ Production-hardened | 98%             | Event bus, 55 tests                                                                                                     |
| `@gtcx/connectivity`  | ✅ Production-hardened | 98.7%           | Network detection and profiling, 127 tests                                                                              |
| `@gtcx/resilience`    | ✅ Production-hardened | —               | Circuit breaker, adaptive retry, timeout, bulkhead, 50 tests                                                            |
| `@gtcx/runtime`       | ✅ Production-hardened | —               | Batteries-included substrate aggregating api-client, connectivity, resilience, telemetry (ADR-014)                      |

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
├── packages/               # 22 public npm packages + 4 shared config workspace packages
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
| [Roadmap](./docs/roadmap.md)                                         | Master roadmap + active FA/DTF execution          |
| [Tier 5 workplan](./docs/operations/tier-5-workplan-2026-06.md)      | DTF-5.x register (Protocol 22)                    |
| [Execution roadmap](./docs/audit/execution-roadmap.md)               | FA-S1–S6 sprint overlay                           |
| [Agile roadmap](./docs/agile/roadmap/roadmap.md)                     | Delivery phases 0–7                               |

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
