# GTCX Core

Shared foundation for the GTCX ecosystem. Contains cryptographic primitives (Rust + TypeScript), type definitions, Zod schemas, domain models, verification infrastructure, and WorkProof/TradeCV attestation schemas consumed by all other repos. This is the lowest-level dependency in the stack — it depends on nothing else.

**Trust portal:** [gtcx-protocol.gitbook.io/gtcx-open-source](https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal) — see [hosting runbook](./01-docs/04-ops/trust-portal-hosting.md)
**Last reviewed:** 2026-06-04

<!-- gtcx-agents-index -->

## Engineering Standards

This repository targets infrastructure-grade engineering standards suitable for global trade and governmental systems. Current maturity varies by package — see the [Readiness Matrix](#package-readiness-matrix) below.

- **Mathematical Verification**: Core cryptographic paths are verified using property-based testing (`fast-check`) and continuous fuzzing (`cargo-fuzz` on nightly).
- **Security by Design**: Deep object sanitization (`sanitizeSecrets`) prevents cryptographic leakage in observability layers; `SecurityLogger` operates in strict mode in production.
- **Architectural Rigor**: Enforced layering boundaries (zero circular dependencies), max 500 LOC per source file, and standardized error taxonomy (ADR-012).
- **Audit Ready**: Structured tracing and security logging preserve zero-trust boundaries.

For a detailed breakdown of these mandates, see [Quality Standards](./01-docs/testing/quality-standards.md).

## Current State

**Five audit lanes** — do not conflate ([readiness model](./01-docs/05-audit/readiness-model.md)):

| Lane                      | Audit quality (1–10) | Readiness outcome                | Index                                                                                 |
| ------------------------- | -------------------: | -------------------------------- | ------------------------------------------------------------------------------------- |
| **1 Engineering**         |                  8.5 | 9.5 completion / 10.0 signoff    | [engineering](./01-docs/05-audit/engineering-completeness-quality-2026-06-05.md)      |
| **2 Internal compliance** |                  8.5 | **9.0** (5 domains)              | [internal](./01-docs/05-audit/internal-compliance-2026-06-05.md)                      |
| **3 Industry Compliance** |                  8.0 | **IC-T0** · OPEN 0/12            | [industry](./01-docs/05-audit/industry-compliance-2026-06-05.md)                      |
| **GCR** (L2+L3 rollup)    |                    — | **GCR-T0** · **BLOCKED**         | [global compliance rating](./01-docs/05-audit/global-compliance-rating-2026-06-05.md) |
| **4 Bank-grade**          |                  8.5 | composite 8.9                    | [bank-grade](./01-docs/05-audit/bank-grade-2026-06-05.md)                             |
| **5 GTM-Readiness**       |                  8.0 | **GR-T1** / sovereign &lt; GR-T2 | [gtm-readiness](./01-docs/05-audit/gtm-readiness-2026-06-05.md)                       |

### Engineering completeness & quality (lane 1)

**10.0/10** [signoff](./01-docs/05-audit/internal-10-10-signoff-2026-05-28.md) · **9.5/10** [completion audit](./01-docs/05-audit/internal-completion-audit-2026-05-21.md). Hardened monorepo with active quality gates:

- trust-path defects in signing, verification, token handling, and offline lockout recovery have been remediated
- offline replay ordering uses logical sequence instead of wall-clock time
- API surface is baselined, docs are aligned to the current architecture, and release/readiness artifacts are in place
- coverage gates enforce **≥95% branch coverage** — 19/19 testable packages meet the threshold ([audit table](./01-docs/05-audit/))
- Rust FIPS backend (aws-lc-rs, CMVP #4816) verified with 63/63 tests passing
- HSM key storage traits implemented for PKCS11 (SoftHSM, AWS CloudHSM) and AWS KMS Cloud Custody
- 500,000+ fuzz iterations across 6 cargo-fuzz targets, **zero crashes, zero panics, zero ASAN violations** ([evidence](./01-docs/05-audit/fuzz-campaign-evidence-2026-05-21.md))
- `cargo deny` and `cargo audit` run in CI; known upstream advisories in the `ark-*` ecosystem are tracked in `rust/.cargo/audit.toml`
- **24** TypeScript workspace packages under `03-platform/packages/` (see [package specs](./01-docs/specs/03-platform/packages/README.md)); **22** published to npm on the **3.1.4 train** — verify: `pnpm provenance:check-npm:strict`
- SLSA: Source L2 enforced in CI; npm registry provenance via `release.yml` — see [trust portal](./01-docs/governance/trust-portal.md#published-versions)
- Root `pnpm typecheck` / `pnpm build` green (turbo graph; FA-P0-1, 2026-06-04)

### Defensibility Tier 5 (DTF-001 — jurisdiction ZKP moat)

**Technical Tier 5: ~88%** — automatable slice complete (DTF-5.5.1 strict jurisdiction packs shipped). Tiers 1–4 are achieved; remaining Tier 5 work is ceremony-gated (CORE-004 / XR-402) and commercial (Legal/GTM). See [tier-5 workplan](./01-docs/04-ops/tier-5-workplan-2026-06.md).

| Track                                   | Status      | Canonical doc                                                                                        |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| S-T5-1 gh-gold profile + KAT            | **done**    | [tier-5 workplan](./01-docs/04-ops/tier-5-workplan-2026-06.md)                                       |
| S-T5-2 zw-diamond + verification + KATs | **done**    | [execution roadmap](./01-docs/05-audit/execution-roadmap.md)                                         |
| S-T5-3 cross-repo witness + registry    | **done**    | [DTF-5.4.4 ack](./01-docs/04-ops/coordination/to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md) |
| S-T5-4 strict jurisdiction packs        | **done**    | `pnpm jurisdiction:validate-packs`                                                                   |
| Ceremony (CORE-004)                     | **blocked** | Compliance lane — XR-402                                                                             |

**Moat path (in-repo):** WorkProof witness → `@gtcx/crypto` profile prove → `@gtcx/verification` bundle (`commodity-origin-zk`). Cross-package test: [`tests/integration/commodity-origin-zk.test.ts`](./tests/integration/commodity-origin-zk.test.ts).

### Internal compliance (lane 2)

**9.0 composite** — repo hygiene **9.6** · documentation **9.6** · AI trust **8.8** · security **8.8** · corporate readiness **8.2** — [internal-compliance index](./01-docs/05-audit/internal-compliance-2026-06-05.md).

### Industry Compliance (lane 3)

Pen-test report, SOC 2 **letter**, ceremony — **IC-T0** aggregate · [industry-compliance index](./01-docs/05-audit/industry-compliance-2026-06-05.md) · [register](./01-docs/05-audit/external-dependencies-register-2026-05-28.md) (**0/12** complete).

### Bank-grade (lane 4)

Certified composite **8.9/10** — [master-audit-2026-06-03](./01-docs/05-audit/master-audit-2026-06-03.md) only; not engineering score.

### GTM-Readiness (lane 5)

**Library:** **GR-T1**. **Ecosystem sovereign stack:** **below GR-T2** — [gtm-readiness index](./01-docs/05-audit/gtm-readiness-2026-06-05.md).

### Active execution program

- **FA-S1 / DTF Tier 5:** [execution-roadmap.md](./01-docs/05-audit/execution-roadmap.md)
- **Engagement readiness:** [sprint roadmap 2026-05-22](./01-docs/05-audit/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md)

### Ecosystem blockers (compliance + GTM — not engineering)

**These do not lower the engineering score.** They block **sovereign stack** deals owned with [gtcx-infrastructure GTM](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/README.md):

**External clearance (XC) — owned with [gtcx-infrastructure GTM](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/README.md), not in this repo alone:**

- regional pen-test on **live stack** ($8–15K, 4–6 weeks) — [EXT-INF-002](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/05-audit/external-dependencies-register-2026-05-31.md)
- ZWCMP pilot owner + DPA (EXT-INF-013–015)
- testnet deploy + DR proof ([Global South plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/plans/global-south-10x-plan.md))
- Zimbabwe sandbox intro — [`01-docs/08-gtm/sandbox-intro-email-template.md`](./01-docs/08-gtm/sandbox-intro-email-template.md) (human send)

**Bank track (optional, US/EU):** SOC 2 Type I ($15–45K). See [ecosystem GTM alignment](./01-docs/08-gtm/16-ecosystem-gtm-alignment.md) and [GTM reality check 2026-06-02](./01-docs/08-gtm/gtm-reality-check-2026-06-02.md).

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

For a step-by-step repo walkthrough, see the [Orientation guide](./01-docs/01-agents/onboarding/orientation.md). For consumer adoption and release posture, start in [01-docs/release/README.md](./01-docs/release/README.md).

## Package Readiness Matrix

Coverage numbers reflect the [2026-05-21 internal completion audit](./01-docs/05-audit/internal-completion-audit-2026-05-21.md). All testable packages clear the **≥95% branch coverage** gate.

| Package               | State                  | Branch Coverage | Notes                                                                                                                                           |
| --------------------- | ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `@gtcx/crypto`        | ✅ Production-hardened | 100%            | Property-tested, native + JS backends, 386 tests                                                                                                |
| `@gtcx/schemas`       | ✅ Production-hardened | 100%            | Core12: 12 domains, 24 controls fully populated                                                                                                 |
| `@gtcx/logging`       | ✅ Production-hardened | 100%            | Structured logging adapters                                                                                                                     |
| `@gtcx/network`       | 🚧 Scaffolding         | 100%            | In-memory + transport types; **libp2p mesh Phase 2** — see [`03-platform/packages/network/README.md`](./03-platform/packages/network/README.md) |
| `@gtcx/workproof`     | ✅ Production-hardened | 100%            | 38 predicates, AI validation types, 293 tests                                                                                                   |
| `@gtcx/crypto-native` | ✅ Production-hardened | 99.03%          | Native NAPI bindings; `assertHex` / `isHex` at boundary (0.4.0+)                                                                                |
| `@gtcx/services`      | ✅ Production-hardened | 98.45%          | Compliance decomposed, health checks, metrics, 224 tests                                                                                        |
| `@gtcx/sync`          | ✅ Production-hardened | 97.95%          | Offline-first sync engine with conflict resolution                                                                                              |
| `@gtcx/types`         | ✅ Production-hardened | 97.67%          | Core type definitions, 38 tests                                                                                                                 |
| `@gtcx/ai`            | ✅ Production-hardened | 97.43%          | Synchronous + async tracing with span propagation via AsyncLocalStorage, 68 tests                                                               |
| `@gtcx/security`      | ✅ Production-hardened | 97.08%          | Strict-mode audit logger, redaction, 406 tests                                                                                                  |
| `@gtcx/identity`      | ✅ Production-hardened | 96.53%          | DID and credential management, 93 tests                                                                                                         |
| `@gtcx/api-client`    | ✅ Production-hardened | 96.18%          | Retry, offline queue, request signing, 133 tests                                                                                                |
| `@gtcx/utils`         | ✅ Production-hardened | 95.45%          | Common utilities, 32 tests                                                                                                                      |
| `@gtcx/verification`  | ✅ Production-hardened | 95.2%           | QR, proofs, bundles, 265 tests                                                                                                                  |
| `@gtcx/telemetry`     | ✅ Production-hardened | 95.18%          | OpenTelemetry-compatible metrics, traces, logs                                                                                                  |
| `@gtcx/domain`        | ✅ Production-hardened | 95.3%           | DI container, offline queues, versioning, 346 tests                                                                                             |
| `@gtcx/events`        | ✅ Production-hardened | 98%             | Event bus, 55 tests                                                                                                                             |
| `@gtcx/connectivity`  | ✅ Production-hardened | 98.7%           | Network detection and profiling, 127 tests                                                                                                      |
| `@gtcx/resilience`    | ✅ Production-hardened | —               | Circuit breaker, adaptive retry, timeout, bulkhead, 50 tests                                                                                    |
| `@gtcx/runtime`       | ✅ Production-hardened | —               | Batteries-included substrate aggregating api-client, connectivity, resilience, telemetry (ADR-014)                                              |

### Shared Config Workspace Packages (4)

These live under [`03-platform/packages/config`](./packages/config) and support the monorepo/tooling layer rather than the main runtime API surface:

| Package                                                                   | Description                               |
| ------------------------------------------------------------------------- | ----------------------------------------- |
| [`@gtcx/eslint-config`](./03-platform/packages/config/eslint)             | Shared ESLint 9 flat configuration        |
| [`@gtcx/typescript-config`](./03-platform/packages/config/typescript)     | Shared TypeScript base configs            |
| [`@gtcx/tsup-config`](./03-platform/packages/config/tsup)                 | Shared `tsup` build presets               |
| [`@gtcx/jurisdiction-config`](./03-platform/packages/config/jurisdiction) | Shared jurisdiction configuration schemas |

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
├── 03-platform/packages/               # 22 public npm packages + 4 shared config workspace packages
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
└── 01-docs/                   # Documentation and operations
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

| Document                                                                | Description                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------- |
| [Documentation](./01-docs/README.md)                                    | Full documentation and operations hub             |
| [Trust Portal](./01-docs/governance/trust-portal.md)                    | Evidence index for vendor risk teams + regulators |
| [Orientation](./01-docs/01-agents/onboarding/orientation.md)            | Start here — codebase map and session protocol    |
| [Safety Rules](./01-docs/01-agents/workflows/safety-rules.md)           | What requires human approval                      |
| [Architecture Overview](./01-docs/architecture/overview.md)             | Layer map, trust boundaries, package graph        |
| [ADR Index](./01-docs/decisions/README.md)                              | All 14 architecture decision records              |
| [Package Specs](./01-docs/specs/03-platform/packages/README.md)         | Per-package API and responsibility specs          |
| [Rust Crate Specs](./01-docs/specs/03-platform/packages/rust/)          | Rust crate specs and build targets                |
| [Security Framework](./01-docs/09-security/security-framework.md)       | Security architecture and controls                |
| [Quality Runbook](./01-docs/devops/runbooks/quality-runbook.md)         | CI triage order and gate sequence                 |
| [Release Checklist](./01-docs/devops/release-mgmt/release-checklist.md) | Release gate and evidence requirements            |
| [Roadmap](./01-docs/roadmap.md)                                         | Master roadmap + active FA/DTF execution          |
| [Tier 5 workplan](./01-docs/04-ops/tier-5-workplan-2026-06.md)          | DTF-5.x register (Protocol 22)                    |
| [Execution roadmap](./01-docs/05-audit/execution-roadmap.md)            | FA-S1–S6 sprint overlay                           |
| [Agile roadmap](./01-docs/05-audit/agile/roadmap/roadmap.md)            | Delivery phases 0–7                               |

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

## Governance

| Document        | Path                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| Contributing    | [CONTRIBUTING.md](./01-docs/04-ops/repo/CONTRIBUTING.md)                   |
| Code of conduct | [CODE_OF_CONDUCT.md](./01-docs/04-ops/repo/CODE_OF_CONDUCT.md)             |
| Security        | [SECURITY.md](./01-docs/04-ops/repo/SECURITY.md)                           |
| Repo hygiene    | [repo-hygiene-protocol.md](./01-docs/04-ops/repo/repo-hygiene-protocol.md) |
| Changelog       | [CHANGELOG.md](./CHANGELOG.md)                                             |
| License         | [LICENSE](./LICENSE)                                                       |

## Agents

| Resource    | Path                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| Agent entry | [AGENTS.md](./AGENTS.md)                                                              |
| Audit start | [05-audit/AGENT-START.md](./05-audit/AGENT-START.md)                                  |
| Layout v3   | [ecosystem-repo-layout-v3.md](./01-docs/04-ops/workspace/ecosystem-repo-layout-v3.md) |
