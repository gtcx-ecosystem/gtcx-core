# Package Spec — `@gtcx/logging`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Structured logging utility for the GTCX protocol. Provides a typed `Logger` class with configurable log levels and structured JSON output. Used by all `@gtcx/*` packages and downstream services that need consistent, machine-readable log output.

---

## Public API

| Export                 | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `Logger`               | Class: typed structured logger                                          |
| `createLogger(config)` | Factory: create a configured logger instance                            |
| `LogLevel`             | Type: `debug \| info \| warn \| error`                                  |
| `LogEntry`             | Type: structured log entry with level, timestamp, message, and metadata |
| `LoggerConfig`         | Type: logger configuration — minimum level, output sink, context fields |

### Logger Interface

```typescript
class Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
  child(contextFields: Record<string, unknown>): Logger;
}
```

`child()` creates a derived logger with additional context fields merged into every entry — use for request-scoped or service-scoped logging.

---

## Dependencies

No npm dependencies. Uses only Node.js built-ins.

---

## Log Format

All log entries are structured JSON:

```json
{
  "level": "info",
  "timestamp": "2026-03-07T12:00:00.000Z",
  "message": "...",
  "context": { "service": "...", "requestId": "..." },
  "metadata": {}
}
```

Logs are written to `stdout` by default. Configurable via `LoggerConfig.sink`.

---

## Non-Goals

- Does not aggregate or ship logs — that is an infrastructure concern
- Does not implement distributed tracing — `@gtcx/ai` provides the traced operation wrappers
- Does not redact secrets automatically — callers must sanitize before logging

---

## Security Constraint

Never log private keys, tokens, or raw credential material. This package has no automatic redaction — the caller is responsible.

---

## Implementation

`packages/logging/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/ai.md`](./ai.md) — AI-native traced operations (higher-level observability)
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
