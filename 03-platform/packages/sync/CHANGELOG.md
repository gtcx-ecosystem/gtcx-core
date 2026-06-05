# @gtcx/sync

## 0.3.3

### Patch Changes

- chore(release): republish with npm publish --provenance

  Uses publish-packages-provenance.mjs (pnpm pack + npm publish). Prior pnpm publish releases lack registry attestations.

## 0.3.2

### Patch Changes

- fe01c1a: chore(release): republish with npm provenance via pnpm publish

  Enables NPM_CONFIG_PROVENANCE / publishConfig.provenance (changeset --provenance is ignored).

## 0.3.1

### Patch Changes

- 330da2c: chore(release): republish with npm provenance attestations

  No API changes. Publishes Sigstore attestations on the npm registry via `changeset publish --provenance` (SLSA Build L3 pipeline).

## 0.3.0

### Minor Changes

- 028e3d9: Declare the `resolveConflict` export added by the conflict-resolution
  work in `436338d`/`79075ee` (`feat(sync): add conflict hooks` and
  follow-up).

  **New export**
  - `resolveConflict` — conflict resolver entry point used by the
    offline-first sync engine.

  This is a declaration-only changeset; the export already exists in the
  source tree. Required by `api:check:release` so the next publish
  records the minor bump.

## 0.2.2

### Patch Changes

- Sprint 1-4 remediation release.

  **@gtcx/crypto** — Add NativeZkpEngine backed by real Groth16, Bulletproofs, and Schnorr circuits via NAPI-RS. `createZkpEngine()` factory auto-detects native bindings. HashCommitmentZkpEngine gated behind `GTCX_REQUIRE_NATIVE=false`.

  **@gtcx/api-client** — Add offline-aware request handling via `OfflineHandler`. When configured, checks connectivity before each request and enqueues offline requests.

  **@gtcx/connectivity** — Replace hardcoded `online: true` stub with real HTTP health probe. Configurable via `GTCX_HEALTH_URL` env var.

  **@gtcx/network** — Add real libp2p runtime dependencies (was all optional peers, transport was dead code).

  **@gtcx/crypto-native** — Export ZKP binding interfaces for Groth16, Bulletproofs, and Schnorr native functions.

  All packages — Remove unused peerDependencies, remove `--passWithNoTests` flags, fix stale eslint-disable directives.

## 0.2.1

### Patch Changes

- First published release. AI integration hooks, API client, connectivity detection, event system, logging, networking, services, sync engine, utilities, and WorkProof attestations. Pre-stable (0.x) — API may evolve.

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
