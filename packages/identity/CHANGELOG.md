# @gtcx/identity

## 3.0.0

### Minor Changes

- 30126d9: Baseline the reviewed 2026-05-06 public API surface for release readiness.

  The current generated declarations expose additive exports in crypto and identity, and signature-level changes in events and services. This changeset records the required semver intent so release automation does not publish the updated API contract without the appropriate package version movement.

### Patch Changes

- Updated dependencies [5775d52]
- Updated dependencies [30126d9]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
  - @gtcx/types@3.0.0
  - @gtcx/crypto@3.0.0

## 2.0.0

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
  - @gtcx/types@2.0.0

## 1.0.1

### Patch Changes

- First published release. Cryptographic primitives, identity, verification, domain models, schemas, and security — production-ready foundation for the GTCX ecosystem. All quality gates passing, security audit complete, specs aligned with code.

- Updated dependencies []:
  - @gtcx/types@1.0.1
  - @gtcx/crypto@1.0.1

## 1.0.0

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
  - @gtcx/types@1.0.0
  - @gtcx/crypto@1.0.0
