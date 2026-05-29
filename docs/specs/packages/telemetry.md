---
title: "Package Spec — `@gtcx/telemetry`"
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
title: 'Telemetry'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/telemetry`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Unified OpenTelemetry-compatible instrumentation surface. Provides metrics (counter, gauge, histogram), distributed tracing (spans, context propagation), and a logging bridge that ties trace IDs into log entries. Zero required external dependencies; OTel integration is opt-in via peer deps.

Consumed by `@gtcx/runtime` and any package needing observability without coupling to a specific exporter.

---

## Public API

| Export                           | Description                                                            |
| -------------------------------- | ---------------------------------------------------------------------- |
| `createInMemoryMetricsCollector` | Factory: in-memory metrics for testing or default mode                 |
| `PrometheusMetricsCollector`     | Class: Prometheus text-format metrics                                  |
| `MetricsCollector`               | Interface: `counter`, `gauge`, `histogram`                             |
| `Counter`                        | Interface: `increment(by?)`, `value()`                                 |
| `Gauge`                          | Interface: `set(value)`, `value()`                                     |
| `Histogram`                      | Interface: `observe(value)`, `snapshot()` (buckets + sum + count)      |
| `createNoopTracer`               | Factory: no-op tracer for environments without telemetry               |
| `createOtelTracer`               | Factory: tracer backed by `@opentelemetry/api` (peer dep)              |
| `Tracer`                         | Interface: `startSpan(name, options?)`, `withSpan`, `currentSpan`      |
| `Span`                           | Interface: `setAttribute`, `setStatus`, `recordException`, `end`       |
| `SpanContext`                    | Interface: `traceId`, `spanId`, `traceFlags?`, `traceState?`           |
| `createSpanContext`              | Utility: build a SpanContext from a parent or fresh                    |
| `injectTraceContext`             | Utility: inject trace context into HTTP-style header carrier           |
| `extractTraceContext`            | Utility: extract trace context from header carrier                     |
| `runWithSpanContext`             | AsyncLocalStorage helper: bind span context to async work              |
| `getCurrentSpanContext`          | Utility: read current span context                                     |
| `createTelemetryLogger`          | Factory: logger that auto-includes traceId/spanId from current context |
| `TelemetryLogger`                | Interface: same as `Logger` plus span-context auto-tagging             |

---

## Responsibility Boundaries

`@gtcx/telemetry` MUST:

- Default to in-memory / noop primitives so packages can adopt it without forcing an exporter on consumers
- Treat `@opentelemetry/api`, `@opentelemetry/sdk-node`, and Prometheus client libraries as peer/optional dependencies
- Use `AsyncLocalStorage` for context propagation under Node.js
- Honor explicit no-op modes for cold-start sensitive environments

`@gtcx/telemetry` MUST NOT:

- Hard-import any OTel SDK (must be peer-deps)
- Emit logs directly to stderr or stdout from the metrics or tracing surface; logging-bridge is the only path
- Take dependencies on any other `@gtcx/*` package besides `@gtcx/types` (allowed)

---

## Architectural Position

```
@gtcx/runtime → @gtcx/telemetry
@gtcx/ai → (optionally bridges to @gtcx/telemetry — wiring is consumer-side)
```

Per ADR-014: `@gtcx/telemetry` is a leaf primitive at the observability layer. The logging bridge integrates with `@gtcx/logging` only via a wrapper consumers compose; there is no direct dependency.

---

## Test Coverage Targets

- 80% statements
- 70% branches

Special-case tests required:

- Span context propagation across `await` boundaries
- Histogram bucket math correctness
- Prometheus text-format output stability
- Trace context injection/extraction round-trip with known carriers (W3C traceparent)

---

## See also

- ADR-014 (`docs/decisions/014-runtime-substrate.md`)
- `packages/telemetry/src/` — implementation
- `packages/runtime/src/runtime.ts` — primary consumer that wires `MetricsCollector` + `Tracer` into the API client
