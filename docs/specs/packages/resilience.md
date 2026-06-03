---
title: 'Package Spec — `@gtcx/resilience`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Resilience'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/resilience`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Resilience primitives for service-to-service communication. Provides circuit breaker, adaptive retry with jitter, timeout wrapper, and bulkhead (concurrency limiter) patterns. Zero runtime dependencies. Consumed by `@gtcx/runtime` and `@gtcx/api-client`.

---

## Public API

| Export                  | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `createCircuitBreaker`  | Factory: builds a circuit breaker with failure threshold + reset timeout                  |
| `CircuitBreakerError`   | Error: thrown when calls are rejected by an open circuit                                  |
| `CircuitBreaker`        | Type: `{ exec, state, reset }`                                                            |
| `CircuitBreakerConfig`  | Interface: `failureThreshold`, `resetTimeoutMs`, `onStateChange?`                         |
| `CircuitBreakerState`   | Type: `'closed' \| 'open' \| 'half-open'`                                                 |
| `CircuitBreakerStats`   | Interface: `failures`, `successes`, `state`, `lastFailureAt?`                             |
| `withRetry`             | Wrap a promise-returning function with retry policy                                       |
| `calculateDelay`        | Utility: derive backoff delay given attempt number + policy                               |
| `isRetryableError`      | Utility: determine retryability per policy                                                |
| `RetryPolicy`           | Interface: `maxAttempts`, `strategy`, `baseDelayMs`, `maxDelayMs?`, `jitter?`, `retryOn?` |
| `RetryStrategy`         | Type: `'fixed' \| 'linear' \| 'exponential'`                                              |
| `JitterMode`            | Type: `'none' \| 'full' \| 'equal' \| 'decorrelated'`                                     |
| `withTimeout`           | Wrap a promise with an AbortController-based deadline                                     |
| `TimeoutError`          | Error: thrown on timeout                                                                  |
| `TimeoutConfig`         | Interface: `timeoutMs`, `onTimeout?`                                                      |
| `createBulkhead`        | Factory: bulkhead enforcing max concurrent + max queued                                   |
| `BulkheadRejectedError` | Error: thrown when queue saturated                                                        |
| `Bulkhead`              | Type: `{ exec, stats, reset }`                                                            |
| `BulkheadConfig`        | Interface: `maxConcurrent`, `maxQueue`                                                    |

---

## Responsibility Boundaries

`@gtcx/resilience` MUST:

- Operate purely on user-supplied functions; never reach for global state, timers without cleanup, or unbounded queues
- Surface failures via typed errors (`CircuitBreakerError`, `TimeoutError`, `BulkheadRejectedError`) — never via thrown strings
- Provide cleanup hooks (`reset()`, AbortController unsub) for every primitive that holds state
- Honor `AbortSignal` in callers' contexts

`@gtcx/resilience` MUST NOT:

- Depend on any other `@gtcx/*` package
- Emit telemetry directly (consumers compose with `@gtcx/telemetry`)
- Make network requests, read files, or import from `node:*` (must be runtime-agnostic)

---

## Architectural Position

```
@gtcx/runtime → @gtcx/resilience
@gtcx/api-client → @gtcx/resilience
```

Per ADR-014: `@gtcx/resilience` is a leaf primitive. It has no inbound dependencies on other `@gtcx/*` packages.

---

## Test Coverage Targets

- 80% statements
- 70% branches

Special-case tests required:

- Circuit breaker state transitions under concurrent load
- Retry with all jitter modes
- Timeout with both AbortSignal-aware and AbortSignal-unaware promises
- Bulkhead queue saturation behavior

---

## See also

- ADR-014 (`docs/decisions/014-runtime-substrate.md`) — runtime substrate rationale
- `packages/resilience/src/` — implementation
- `packages/runtime/src/runtime.ts` — primary consumer
