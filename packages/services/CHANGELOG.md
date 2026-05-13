# @gtcx/services

## 1.0.0

### Major Changes

- 30126d9: Baseline the reviewed 2026-05-06 public API surface for release readiness.

  The current generated declarations expose additive exports in crypto and identity, and signature-level changes in events and services. This changeset records the required semver intent so release automation does not publish the updated API contract without the appropriate package version movement.

### Patch Changes

- c2ce76c: Decompose `registration.ts` and `trading.ts` into focused submodules
  - `registration.ts`: 599 → 364 LOC (extracted `config`, `errors`, `helpers`, `types`, `validation`, `progress`)
  - `trading.ts`: 728 → 411 LOC (extracted `config`, `errors`, `pricing`, `validation`, `execution`, `helpers`)
  - Removed architecture boundary exceptions for both files
  - All 189 tests pass, zero lint/type errors

- b8c5c81: Decompose `UnifiedComplianceService` into focused modules: `infrastructure.ts` (metrics/event factories), `dashboard.ts` (dashboard builder), `queries.ts` (data access), and `verification-methods.ts` (license/KYC verification). Reduces `UnifiedComplianceService.ts` from 555 to 495 LOC, removing the architecture boundary exception.
- Updated dependencies [30126d9]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
  - @gtcx/crypto@3.0.0
  - @gtcx/events@1.0.0
  - @gtcx/domain@3.0.0

## 0.2.2

### Patch Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

- Updated dependencies []:
  - @gtcx/crypto@2.0.0
  - @gtcx/domain@2.0.0
  - @gtcx/events@0.2.2

## 0.2.1

### Patch Changes

- First published release. AI integration hooks, API client, connectivity detection, event system, logging, networking, services, sync engine, utilities, and WorkProof attestations. Pre-stable (0.x) — API may evolve.

- Updated dependencies []:
  - @gtcx/events@0.2.1
  - @gtcx/crypto@1.0.1
  - @gtcx/domain@1.0.1

## 0.2.0

### Minor Changes

- Initial public release of GTCX Core packages.
  - Ed25519 cryptographic primitives with Rust-powered performance
  - Identity management with DID (Decentralized Identifier) support
  - Certificate generation, verification, and QR code proofing
  - Domain models with offline-first queue and event sourcing
  - Core12 compliance schema framework
  - Security boundary validation with Zod schemas
  - AI integration hooks and structured logging
  - Offline-first connectivity with deterministic conflict resolution
  - Full cross-package integration test coverage (57 tests)
  - 143 Rust tests across 6 crates
  - 10 Architecture Decision Records

### Patch Changes

- Updated dependencies []:
  - @gtcx/domain@1.0.0
