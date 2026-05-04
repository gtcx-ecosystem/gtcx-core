# Changelog — gtcx-core

All notable changes to the GTCX Core monorepo.

## [1.0.0] — 2026-03-19

### Packages (19 TypeScript + 6 Rust)

**Core type system and domain models:**

- `@gtcx/types` — Core type definitions for the GTCX ecosystem
- `@gtcx/domain` — Commodity-agnostic domain services with DI, offline queues, and observability
- `@gtcx/schemas` — Core12 compliance verification schemas (Zod)

**Cryptographic and security primitives:**

- `@gtcx/crypto` — Cryptographic primitives (Ed25519, hashing, Merkle trees, commitments)
- `@gtcx/crypto-native` — Native crypto bindings loader (NAPI-RS)
- `@gtcx/security` — Auth, validation, offline credential management, audit logging
- `@gtcx/identity` — DID creation, credential management, key lifecycle
- `@gtcx/verification` — Certificate generation, QR codes, proof bundles, verification proofs
- `@gtcx/workproof` — TradeCV/WorkProof v2.1 (W3C VC-based work attestations, 40 predicates)

**Application services:**

- `@gtcx/services` — Registration, trading, and compliance business services
- `@gtcx/ai` — AI integration hooks and tracing utilities
- `@gtcx/api-client` — Resilient HTTP client with retry, offline queue, request signing
- `@gtcx/events` — Type-safe event bus with offline buffering
- `@gtcx/connectivity` — Network connectivity detection and profiling
- `@gtcx/sync` — Offline-first sync engine with conflict resolution
- `@gtcx/network` — P2P networking with libp2p integration
- `@gtcx/logging` — Structured logging for GTCX services
- `@gtcx/utils` — Common utilities

**Rust crates:**

- `gtcx-crypto` — Core cryptographic primitives (Ed25519, SHA-256/512)
- `gtcx-zkp` — Zero-knowledge proof system
- `gtcx-consensus` — Weighted PBFT consensus engine
- `gtcx-network` — P2P networking types
- `gtcx-edge` — Edge runtime for resource-constrained devices
- `gtcx-node` — Node.js native bindings via NAPI-RS

### Quality

- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESLint with `@typescript-eslint/recommended-type-checked` + `eslint-plugin-security`
- Husky + lint-staged pre-commit hooks
- 1,921 tests across 70 test files, CI-enforced coverage thresholds
- Conventional commits enforced

### Infrastructure

- pnpm workspaces with Turborepo orchestration
- Vitest test runner with v8 coverage
- CI pipeline: architecture check → governance → threat matrix → perf budgets → lint → format → typecheck → test → coverage → build → API surface → KPI → provenance → docs
- Rust CI: fmt → clippy → test
- Security: Trivy vulnerability scan + SBOM generation
- Docker build verification
