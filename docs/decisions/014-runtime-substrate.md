# ADR-014: Runtime Substrate — Batteries-Included Service Foundation

## Status

Accepted

## Date

2026-05-06

## Context

GTCX Core has grown to 21 TypeScript packages across cryptography, identity, connectivity, AI, and services. Each downstream consumer (e.g. `gtcx-protocols` SDK, `gtcx-intelligence` server) currently hand-wires:

- HTTP client configuration (timeouts, retries, mTLS)
- Offline-first queueing (Principle P8)
- Resilience (circuit breakers, bulkheads)
- Observability (metrics, traces, structured logs)
- Connectivity-aware adaptation (edge, satellite, degraded profiles)

This leads to duplicated logic, inconsistent defaults, and gaps in Global South resilience (e.g. no adaptive retry for satellite links). We need a single "runtime substrate" that packages these cross-cutting concerns into a supported, versioned surface.

## Decision

We will create a layered runtime substrate with the following packages and responsibilities:

1. **@gtcx/resilience** — Pure resilience primitives: circuit breaker, adaptive retry (exponential + decorrelated jitter), timeout wrapper, bulkhead. Zero external dependencies.
2. **@gtcx/telemetry** — Pure telemetry primitives: in-memory and Prometheus metrics collectors, W3C traceparent propagation, noop and OTel tracers, logging bridge. Optional peer dependency on `@opentelemetry/api`.
3. **@gtcx/api-client** — Enhanced HTTP client consuming resilience and telemetry. New features: PATCH method, request/response interceptors, request deduplication (`dedupeKey`), adaptive retry policy, traceparent injection, telemetry hooks.
4. **@gtcx/connectivity** — Existing connectivity detector enhanced with an adapter module that bridges `ConnectivityDetector` to `ApiClientOptions`, providing profile-aware defaults and live adaptation via `createAdaptiveClientOptions`.
5. **@gtcx/runtime** — Batteries-included factory (`createRuntime`) that wires the above into a single surface with deployment profiles (`edge`, `satellite`, `standard`, `test`).

All packages follow existing conventions: strict TypeScript (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`), `tsup` for builds, vitest for tests, ESLint with `no-restricted-properties` (no `Math.random`).

## Alternatives Considered

| Option                                                               | Pros                           | Cons                                                                                                                 |
| -------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Use external libraries (axios-retry, opentelemetry-js, resilience4j) | Battle-tested, large community | Heavy dependency trees, not designed for offline-first / Global South profiles, licensing/auditing overhead          |
| Put everything in `@gtcx/api-client`                                 | One package to install         | Violates single-responsibility; makes tree-shaking harder; forces telemetry/resilience deps on lightweight consumers |
| Keep wiring in each downstream repo                                  | Full flexibility               | Duplication, drift, support burden                                                                                   |

## Consequences

**Positive:**

- Downstream repos can replace ~200 lines of hand-wired setup with `createRuntime({ baseUrl, deployment: 'edge' })`.
- Consistent resilience defaults for satellite (120s timeout, 5 retries), edge (60s, 1 retry), standard (30s, 3 retries).
- Telemetry is opt-in by mode (`none`, `in-memory`, `prometheus`, `otel`) and never breaks requests.
- All new code passes architecture boundary checks (≤500 lines per source file) and API surface baselines.

**Negative:**

- Adds 2 new packages to maintain (`@gtcx/resilience`, `@gtcx/telemetry`, `@gtcx/runtime`).
- `@gtcx/connectivity` now depends on `@gtcx/api-client` and `@gtcx/resilience`, creating a one-way dependency arrow (acceptable, no cycle).
- `tsup` DTS generation requires occasional `// @ts-ignore` or `as any` casts for `exactOptionalPropertyTypes` edge cases.

**Neutral:**

- Existing packages (`ai`, `services`, `identity`) retain pre-existing type errors unrelated to this work. Root `pnpm typecheck` still fails; per-package typecheck is the current gate.

## References

- ADR-007: Offline-first architecture
- ADR-008: Optional tracing peer dependencies
- ADR-011: Architecture boundary enforcement
- ADR-013: API baseline and performance budget gates
- Plan: `wildcat-bishop-jericho.md`
