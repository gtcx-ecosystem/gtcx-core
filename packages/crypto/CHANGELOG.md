# @gtcx/crypto

## 3.0.0

### Major Changes

- fed8541: **Breaking:** `HashCommitmentZkpEngine.generate()` now fails closed by default

  Closes SA-002. The placeholder hash-commitment engine produces output indistinguishable from random bytes to a verifier, but its previous default was warn-only. Sandbox regulators and AI-driven verification pipelines could miss the warning and consume placeholder proofs as real ZK proofs.

  **What changed:**
  - `HashCommitmentZkpEngine.generate()` throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` is set (literal string `'1'` — `'true'`, `'yes'`, etc. do not opt in)
  - `createZkpEngine()` factory's no-native fallback path also throws by default; the same flag opts in
  - `verify()` remains open without the flag — services that only validate proofs they receive do not need to opt in
  - `GTCX_REQUIRE_NATIVE=true` continues to surface a pointed error message when native bindings are unavailable; this flag's behavior is unchanged

  **Migration:**

  If your service generates placeholder proofs intentionally (testing, non-regulatory contexts), set `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`. For production, install `@gtcx/crypto-native` and use `createZkpEngine()` — it auto-selects the native arkworks backend (Groth16, Bulletproofs, Schnorr).

  Tests that exercise `generate()` should wrap with `vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1')` in `beforeEach`.

  See `docs/security/threat-model.md` (SA-002 row) and `packages/crypto/src/zkp.ts:113-152`.

### Minor Changes

- 30126d9: Baseline the reviewed 2026-05-06 public API surface for release readiness.

  The current generated declarations expose additive exports in crypto and identity, and signature-level changes in events and services. This changeset records the required semver intent so release automation does not publish the updated API contract without the appropriate package version movement.

### Patch Changes

- b8c5c81: Fix ZKP NAPI boundary hex encoding bug in `NativeZkpEngine`. `schnorrProveIdentityAttribute` now normalizes arbitrary `subjectHash` inputs to 32-byte SHA-256 digests before crossing the JS→Rust boundary. Verify path hardened against malformed JSON and cryptographic errors, returning `false` instead of throwing.
- Updated dependencies [b8c5c81]
- Updated dependencies [d432014]
  - @gtcx/ai@0.3.0

## 2.0.0

### Minor Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

### Patch Changes

- Updated dependencies []:
  - @gtcx/ai@0.2.2

## 1.0.1

### Patch Changes

- First published release. Cryptographic primitives, identity, verification, domain models, schemas, and security — production-ready foundation for the GTCX ecosystem. All quality gates passing, security audit complete, specs aligned with code.

- Updated dependencies []:
  - @gtcx/ai@0.2.1
  - @gtcx/types@1.0.1

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
  - @gtcx/ai@0.2.0
