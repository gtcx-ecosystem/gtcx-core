# Changelog

## 0.3.0

### Minor Changes

- dbd465b: **FIPS-validated cryptographic backend via aws-lc-rs**

  `rust/gtcx-crypto` now ships an `AwsLcSigningProvider` and `AwsLcHashProvider` behind `#[cfg(feature = "fips")]`. Compile with `cargo build --features fips` to route Ed25519, SHA-256, and SHA-512 through aws-lc-rs (NIST CMVP #4816). The wire format is identical to the default dalek backend — verified by an interop test that round-trips signatures between both backends.

  This is the implementation half of the FIPS inheritance design documented in `docs/security/fips-validation-boundary.md`. With this change, the FIPS path is no longer aspirational.

  Coverage:
  - Ed25519 signing → FIPS-validated via aws-lc-rs
  - SHA-256, SHA-512 → FIPS-validated via aws-lc-rs
  - BLAKE3 → falls through to the blake3 crate (not FIPS-approved at any module level; consumers in regulatory paths must use SHA-256)

  CI runs the FIPS test matrix on every PR. The `default_signing()` and `default_hashing()` selectors return the FIPS provider when the feature is active and the dalek provider otherwise — downstream consumers don't observe the swap.

  This is a `@gtcx/crypto-native` minor bump because the Rust crate gains a new opt-in backend; the public API of consuming TypeScript packages does not change.

### Patch Changes

- b8c5c81: Replace `console.log` with `process.stdout.write` in preflight CLI output to comply with project no-console policy. Zero lint warnings across package.

## 0.2.0

### Minor Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

## 0.1.1

### Patch Changes

- First published release. AI integration hooks, API client, connectivity detection, event system, logging, networking, services, sync engine, utilities, and WorkProof attestations. Pre-stable (0.x) — API may evolve.

All notable changes to this package will be documented in this file.
