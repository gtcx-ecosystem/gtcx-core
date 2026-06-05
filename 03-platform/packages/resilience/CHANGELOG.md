# @gtcx/resilience

## 0.2.3

### Patch Changes

- chore(release): republish with npm publish --provenance

  Uses publish-packages-provenance.mjs (pnpm pack + npm publish). Prior pnpm publish releases lack registry attestations.

## 0.2.2

### Patch Changes

- fe01c1a: chore(release): republish with npm provenance via pnpm publish

  Enables NPM_CONFIG_PROVENANCE / publishConfig.provenance (changeset --provenance is ignored).

## 0.2.1

### Patch Changes

- 330da2c: chore(release): republish with npm provenance attestations

  No API changes. Publishes Sigstore attestations on the npm registry via `changeset publish --provenance` (SLSA Build L3 pipeline).

## 0.2.0

### Minor Changes

- 1b625fc: Runtime Substrate: resilience, telemetry, connectivity bridge, and batteries-included runtime
  - **@gtcx/resilience** (new): Circuit breaker, adaptive retry with jitter, timeout wrapper, bulkhead (45 tests).
  - **@gtcx/telemetry** (new): Metrics (Prometheus + in-memory), W3C traceparent tracing, OTel bridge, logging bridge (22 tests).
  - **@gtcx/api-client**: Added PATCH, request/response interceptors, request deduplication (`dedupeKey`), adaptive retry policy integration, circuit breaker hook, traceparent injection, telemetry hooks (`onRequestStart/Complete/Error`). Refactored into modular source files to respect 500-line boundary.
  - **@gtcx/connectivity**: New adapter module bridging `ConnectivityDetector` to `ApiClientOptions` with profile-aware timeout/retry defaults and `createAdaptiveClientOptions` for live profile adaptation.
  - **@gtcx/runtime** (new): Batteries-included substrate factory wiring connectivity detection, adaptive API client, resilience primitives, and telemetry into a single `createRuntime(options)` surface (13 tests).
