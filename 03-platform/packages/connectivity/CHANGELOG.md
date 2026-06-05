# @gtcx/connectivity

## 0.5.4

### Patch Changes

- chore(release): republish with npm publish --provenance

  Uses publish-packages-provenance.mjs (pnpm pack + npm publish). Prior pnpm publish releases lack registry attestations.

- Updated dependencies
  - @gtcx/api-client@0.4.5
  - @gtcx/resilience@0.2.3

## 0.5.3

### Patch Changes

- fe01c1a: chore(release): republish with npm provenance via pnpm publish

  Enables NPM_CONFIG_PROVENANCE / publishConfig.provenance (changeset --provenance is ignored).

- Updated dependencies [fe01c1a]
  - @gtcx/api-client@0.4.4
  - @gtcx/resilience@0.2.2

## 0.5.2

### Patch Changes

- 330da2c: chore(release): republish with npm provenance attestations

  No API changes. Publishes Sigstore attestations on the npm registry via `changeset publish --provenance` (SLSA Build L3 pipeline).

- Updated dependencies [330da2c]
  - @gtcx/api-client@0.4.3
  - @gtcx/resilience@0.2.1

## 0.5.1

### Patch Changes

- @gtcx/api-client@0.4.2

## 0.5.0

### Minor Changes

- 028e3d9: Declare USSD protocol handler exports added in `3cdc511`
  (`feat(connectivity): implement USSD protocol handlers per 10/10-roadmap M2`).

  **New exports**
  - `UssdParsedInput`, `UssdParseError`, `UssdParser` — parser surface for
    USSD session strings.
  - `UssdRequest`, `UssdResponse` — request/response types for USSD
    interactions.
  - `UssdSession`, `UssdSessionData`, `UssdSessionOptions`,
    `UssdSessionState` — session lifecycle.

  This is a declaration-only changeset; the exports already exist in the
  source tree. Required by `api:check:release` so the next publish
  records the minor bump.

### Patch Changes

- @gtcx/api-client@0.4.1

## 0.4.0

### Minor Changes

- 1b625fc: Runtime Substrate: resilience, telemetry, connectivity bridge, and batteries-included runtime
  - **@gtcx/resilience** (new): Circuit breaker, adaptive retry with jitter, timeout wrapper, bulkhead (45 tests).
  - **@gtcx/telemetry** (new): Metrics (Prometheus + in-memory), W3C traceparent tracing, OTel bridge, logging bridge (22 tests).
  - **@gtcx/api-client**: Added PATCH, request/response interceptors, request deduplication (`dedupeKey`), adaptive retry policy integration, circuit breaker hook, traceparent injection, telemetry hooks (`onRequestStart/Complete/Error`). Refactored into modular source files to respect 500-line boundary.
  - **@gtcx/connectivity**: New adapter module bridging `ConnectivityDetector` to `ApiClientOptions` with profile-aware timeout/retry defaults and `createAdaptiveClientOptions` for live profile adaptation.
  - **@gtcx/runtime** (new): Batteries-included substrate factory wiring connectivity detection, adaptive API client, resilience primitives, and telemetry into a single `createRuntime(options)` surface (13 tests).

### Patch Changes

- Updated dependencies [db60a11]
- Updated dependencies [1b625fc]
- Updated dependencies [c2ce76c]
  - @gtcx/api-client@0.4.0
  - @gtcx/resilience@0.2.0

## 0.3.0

### Minor Changes

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
