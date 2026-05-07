---
'@gtcx/logging': minor
---

Auto-enrich `LogEntry` with `traceId`, `spanId`, and `parentSpanId` when emitted inside an `@gtcx/ai` traced operation. Maintains loose coupling via dynamic `require` with graceful fallback when `@gtcx/ai` is not installed.
