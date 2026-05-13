# @gtcx/api-client

## 0.4.0

### Minor Changes

- db60a11: Add locked canonical signing contract test vectors (`test-vectors.json`) with 25 cross-repo validation vectors. Export from `@gtcx/api-client/canonical/test-vectors` for downstream consumers (mobile, protocols, infrastructure). Include formal `CONTRACT.md` specifying all 11 canonicalization rules.
- 1b625fc: Runtime Substrate: resilience, telemetry, connectivity bridge, and batteries-included runtime
  - **@gtcx/resilience** (new): Circuit breaker, adaptive retry with jitter, timeout wrapper, bulkhead (45 tests).
  - **@gtcx/telemetry** (new): Metrics (Prometheus + in-memory), W3C traceparent tracing, OTel bridge, logging bridge (22 tests).
  - **@gtcx/api-client**: Added PATCH, request/response interceptors, request deduplication (`dedupeKey`), adaptive retry policy integration, circuit breaker hook, traceparent injection, telemetry hooks (`onRequestStart/Complete/Error`). Refactored into modular source files to respect 500-line boundary.
  - **@gtcx/connectivity**: New adapter module bridging `ConnectivityDetector` to `ApiClientOptions` with profile-aware timeout/retry defaults and `createAdaptiveClientOptions` for live profile adaptation.
  - **@gtcx/runtime** (new): Batteries-included substrate factory wiring connectivity detection, adaptive API client, resilience primitives, and telemetry into a single `createRuntime(options)` surface (13 tests).

- c2ce76c: Add canonical request canonicalization contract (`@gtcx/api-client/canonical`)

  A shared server/client-safe signing contract aligned with the gtcx-mobile auth-token.ts implementation. Prevents mobile/backend drift:
  - `createCanonicalSigner()` — produces a `RequestSigner` for `createApiClient`
  - `verifyCanonicalSignature()` — server-side verification with clock-skew guard
  - `buildCanonicalRequest()` — 9-line deterministic canonical string
  - `formatDID()` / `formatKeyId()` — `did:gtcx:tp_<32-hex>` and 32-char key IDs
  - Emits headers: `Authorization`, `X-GTCX-Auth-Scheme`, `X-GTCX-DID`, `X-GTCX-Key-Id`, `X-GTCX-Timestamp`, `X-GTCX-Nonce`, `X-GTCX-Audience`, `X-GTCX-Body-SHA256`, `X-GTCX-Signature`
  - Generates short-lived bearer tokens: `base64url(JSON({did, iat, exp})).<signature>`

  Both sides import identical canonicalization logic from the shared package.

### Patch Changes

- Updated dependencies [30126d9]
- Updated dependencies [1b625fc]
- Updated dependencies [fed8541]
- Updated dependencies [b8c5c81]
  - @gtcx/crypto@3.0.0
  - @gtcx/resilience@0.2.0
  - @gtcx/telemetry@0.2.0

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
