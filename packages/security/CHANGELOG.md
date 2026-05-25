# @gtcx/security

## 3.1.0

### Patch Changes

- 02d5641: Add rustls-webpki mitigation documentation, P1-free tracking, and coverage gap tests
  - docs/security/RUSTSEC-rustls-webpki-mitigation.md: documents 3 RUSTSEC advisories,
    dependency path through AWS SDK, threat model assessment, and monitoring plan
  - docs/quality/p1-free-tracking.md: starts 90-day P1-free clock with weekly checks
  - packages/security/tests/coverage-gaps-2.test.ts: 16 targeted tests pushing branch
    coverage from 87.86% to 90.77%

  Infrastructure-only release to trigger CI provenance generation (SLSA Build L3).

- Updated dependencies [ab3f544]
  - @gtcx/crypto@3.1.0

## 3.0.0

### Patch Changes

- Updated dependencies [30126d9]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
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
