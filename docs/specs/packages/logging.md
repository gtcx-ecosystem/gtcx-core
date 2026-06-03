---
title: 'Package Spec — `@gtcx/logging`'
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

title: 'Logging'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/logging`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Structured logging utility for the GTCX protocol. Provides a typed `Logger` class with configurable log levels (including `fatal`) and structured JSON output. Used by all `@gtcx/*` packages and downstream services that need consistent, machine-readable log output.

---

## Public API

| Export                 | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `Logger`               | Class: typed structured logger                                                     |
| `createLogger(config)` | Factory: create a configured logger instance                                       |
| `LogLevel`             | Type: `'debug' \| 'info' \| 'warn' \| 'error' \| 'fatal'`                          |
| `LogEntry`             | Interface: structured log entry (see below)                                        |
| `LoggerConfig`         | Interface: logger configuration — `service`, `level?`, `correlationId?`, `output?` |

### Logger Methods

```typescript
class Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error?: Error, data?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, data?: Record<string, unknown>): void;
  child(overrides: Partial<LoggerConfig>): Logger;
  startTimer(): () => number;
  static generateCorrelationId(): string;
}
```

`child()` creates a derived logger with overrides for any `LoggerConfig` fields (`service`, `level`, `correlationId`, `output`). Use for request-scoped or service-scoped logging.

`startTimer()` returns a function that, when called, returns elapsed milliseconds since the timer started.

`generateCorrelationId()` is a static method that returns a UUID via `crypto.randomUUID()`.

### LogEntry Shape

```typescript
interface LogEntry {
  timestamp: string; // ISO 8601
  level: LogLevel;
  message: string;
  service: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  data?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
  duration?: number;
}
```

### LoggerConfig

| Field           | Type                        | Default       | Description                               |
| --------------- | --------------------------- | ------------- | ----------------------------------------- |
| `service`       | `string`                    | (required)    | Service or module name in every log entry |
| `level`         | `LogLevel?`                 | `'debug'`     | Minimum log level to output               |
| `correlationId` | `string?`                   | `''`          | Correlation ID included in every entry    |
| `output`        | `(entry: LogEntry) => void` | stdout/stderr | Custom output handler                     |

---

## Dependencies

No npm dependencies. Uses only Node.js built-ins (`node:crypto` for `randomUUID`).

---

## Log Format

All log entries are structured JSON:

```json
{
  "timestamp": "2026-03-07T12:00:00.000Z",
  "level": "info",
  "message": "...",
  "service": "api-gateway",
  "correlationId": "...",
  "data": {}
}
```

By default, `debug`, `info`, and `warn` levels write to `stdout`. `error` and `fatal` levels write to `stderr`. Configurable via `LoggerConfig.output`.

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

- [`docs/specs/packages/ai.md`](./ai.md) — AI-native traced operations for higher-level observability
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
