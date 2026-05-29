---
title: "Package Spec — `@gtcx/runtime`"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

---
title: 'Runtime'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/runtime`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Batteries-included runtime substrate. Wires together `@gtcx/api-client`, `@gtcx/connectivity`, `@gtcx/resilience`, `@gtcx/telemetry`, and `@gtcx/logging` into a single configured surface so downstream consumers (gtcx-protocols SDK, gtcx-intelligence server, gtcx-platforms backends) do not hand-wire HTTP timeouts, retries, mTLS, offline queueing, circuit breakers, bulkheads, metrics, traces, and connectivity-aware adaptation.

Established by ADR-014.

---

## Public API

| Export              | Description                                                                         |
| ------------------- | ----------------------------------------------------------------------------------- |
| `createRuntime`     | Factory: `(options: RuntimeOptions) => Runtime`                                     |
| `Runtime`           | Interface: composed handle with `client`, `connectivity`, `metrics`, `tracer`, etc. |
| `RuntimeOptions`    | Interface: substrate configuration (see below)                                      |
| `DeploymentProfile` | Type: `'edge' \| 'satellite' \| 'standard' \| 'test'`                               |

### RuntimeOptions

| Field            | Type                                              | Notes                                                   |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `baseUrl`        | `string`                                          | Required — base URL for API requests                    |
| `deployment`     | `DeploymentProfile`                               | Default: `'standard'`                                   |
| `signer`         | `ApiClientOptions['signer']`                      | Optional request signer                                 |
| `fetcher`        | `ApiClientOptions['fetcher']`                     | Custom fetcher (testing, undici)                        |
| `connectivity`   | `ConnectivityDetectorOptions`                     | Detector configuration                                  |
| `offlineQueue`   | `boolean`                                         | Wire connectivity-driven offline handler                |
| `circuitBreaker` | `boolean`                                         | Enable circuit breaker on the API client                |
| `bulkhead`       | `boolean`                                         | Enable bulkhead (concurrency limiter) on the API client |
| `telemetry`      | `'none' \| 'in-memory' \| 'prometheus' \| 'otel'` | Telemetry mode; defaults vary by deployment profile     |
| `serviceName`    | `string`                                          | Service name for metrics + logger                       |
| `traceContext`   | `SpanContext \| (() => SpanContext \| undefined)` | Initial or callback-derived trace context               |
| `interceptors`   | `ApiClientOptions['interceptors']`                | Request/response interceptors                           |
| `logger`         | `Logger`                                          | Custom logger; default created if absent                |
| `headers`        | `Record<string, string>`                          | Extra headers on every request                          |

### Deployment Profile Defaults

| Profile     | Timeout | Retries | Telemetry  |
| ----------- | ------- | ------- | ---------- |
| `edge`      | 60s     | 1       | in-memory  |
| `satellite` | 120s    | 5       | in-memory  |
| `standard`  | 30s     | 3       | prometheus |
| `test`      | 5s      | 0       | none       |

### Runtime Surface

| Field            | Type                          | Notes                                                |
| ---------------- | ----------------------------- | ---------------------------------------------------- |
| `client`         | `IApiClient`                  | Pre-configured API client                            |
| `connectivity`   | `ConnectivityDetector`        | Active detector (already started)                    |
| `circuitBreaker` | `CircuitBreaker \| undefined` | Present iff `options.circuitBreaker === true`        |
| `bulkhead`       | `Bulkhead \| undefined`       | Present iff `options.bulkhead === true`              |
| `metrics`        | `MetricsCollector`            | In-memory, Prometheus, or noop per telemetry mode    |
| `tracer`         | `Tracer`                      | Noop or OTel per telemetry mode                      |
| `logger`         | `Logger`                      | Default or user-supplied                             |
| `destroy()`      | `() => void`                  | Stops connectivity, unsubscribes adapters, resets CB |

---

## Responsibility Boundaries

`@gtcx/runtime` MUST:

- Be the only `@gtcx/*` package that aggregates other `@gtcx/*` packages — this is its purpose per ADR-014
- Honor `exactOptionalPropertyTypes` — do not pass `undefined` for optional fields
- Provide a `destroy()` that cleans up every resource it created (connectivity polling, adaptive subscription, circuit breaker timers)
- Emit telemetry consistent with the configured mode without requiring consumers to wire it manually

`@gtcx/runtime` MUST NOT:

- Reach into transport-layer details (consumers should configure via `RuntimeOptions`, not by reaching into the produced `client`)
- Cache state across `createRuntime` calls
- Couple to a specific cloud provider, deployment target, or framework

---

## Architectural Position

```
Downstream consumer
  → @gtcx/runtime
    → @gtcx/api-client
    → @gtcx/connectivity
    → @gtcx/resilience
    → @gtcx/telemetry
    → @gtcx/logging
```

`@gtcx/runtime` is the only package permitted to depend on this combination. It is the substrate aggregator. New packages added to the substrate require an ADR amending or superseding ADR-014.

---

## Test Coverage Targets

- 75% statements (lower than leaf primitives because the package is composition-heavy)
- 65% branches

Special-case tests required:

- Each deployment profile produces the expected default configuration
- `destroy()` cleanly tears down all subsystems (no leaked timers, no dangling subscriptions)
- Telemetry mode `'otel'` no-ops gracefully when peer deps are absent
- Connectivity-driven adaptive options propagate to the API client

---

## See also

- ADR-014 (`docs/decisions/014-runtime-substrate.md`) — established this package
- `packages/runtime/src/runtime.ts` — implementation
- `docs/specs/packages/api-client.md`, `connectivity.md`, `resilience.md`, `telemetry.md`, `logging.md` — composed packages
