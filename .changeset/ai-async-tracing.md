---
'@gtcx/ai': minor
---

Add async span propagation via `AsyncLocalStorage`. `traced()` and `withTrace()` now emit `traceId`, `spanId`, and `parentSpanId` in structured logs. Nested traced operations inherit parent trace context across sync and async boundaries. New APIs: `getCurrentTraceContext()`, `runWithTraceContext()`.
