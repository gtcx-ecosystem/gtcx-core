# @gtcx/runtime

## 0.2.1

### Patch Changes

- Updated dependencies [028e3d9]
  - @gtcx/connectivity@0.5.0
  - @gtcx/api-client@0.4.1

## 0.2.0

### Minor Changes

- 1b625fc: Runtime Substrate: resilience, telemetry, connectivity bridge, and batteries-included runtime
  - **@gtcx/resilience** (new): Circuit breaker, adaptive retry with jitter, timeout wrapper, bulkhead (45 tests).
  - **@gtcx/telemetry** (new): Metrics (Prometheus + in-memory), W3C traceparent tracing, OTel bridge, logging bridge (22 tests).
  - **@gtcx/api-client**: Added PATCH, request/response interceptors, request deduplication (`dedupeKey`), adaptive retry policy integration, circuit breaker hook, traceparent injection, telemetry hooks (`onRequestStart/Complete/Error`). Refactored into modular source files to respect 500-line boundary.
  - **@gtcx/connectivity**: New adapter module bridging `ConnectivityDetector` to `ApiClientOptions` with profile-aware timeout/retry defaults and `createAdaptiveClientOptions` for live profile adaptation.
  - **@gtcx/runtime** (new): Batteries-included substrate factory wiring connectivity detection, adaptive API client, resilience primitives, and telemetry into a single `createRuntime(options)` surface (13 tests).

### Patch Changes

- Updated dependencies [db60a11]
- Updated dependencies [b8c5c81]
- Updated dependencies [1b625fc]
- Updated dependencies [c2ce76c]
  - @gtcx/api-client@0.4.0
  - @gtcx/logging@0.3.0
  - @gtcx/connectivity@0.4.0
  - @gtcx/resilience@0.2.0
  - @gtcx/telemetry@0.2.0
