# Package Spec — `@gtcx/ai`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

AI-native observability infrastructure for the GTCX protocol. Provides traced operation wrappers and structured operation logging that enable AI systems in `gtcx-intelligence` to analyze, monitor, and reason about cryptographic and protocol operations at runtime. This package is a stub in `gtcx-core` — the full implementation lives in `gtcx-intelligence`.

All `traced*` exports across `@gtcx/crypto`, `@gtcx/verification`, and other packages depend on this package's `traced()` wrapper and `OperationLog` type.

---

## Public API

### Operation Log Type

```typescript
interface OperationLog<TInput = any, TOutput = any> {
  operationName: string;
  type: string;
  category?: string;
  input?: TInput;
  output?: TOutput;
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}
```

### Traced Wrapper

| Export                 | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `traced(fn, options?)` | Wrap a function with tracing — emits an `OperationLog` on each call         |
| `TracedOptions`        | Type: tracing configuration — category, input/output sanitization, metadata |

The stub implementation is a no-op — it returns the wrapped function as-is without adding overhead. The full implementation in `gtcx-intelligence` replaces this with active logging to the AI observability pipeline.

### Category Logging

| Export              | Description                           |
| ------------------- | ------------------------------------- |
| `logOperation(log)` | Emit a structured operation log entry |

---

## `TracedOptions`

| Field            | Type                       | Description                                               |
| ---------------- | -------------------------- | --------------------------------------------------------- |
| `category`       | `string?`                  | Semantic category for grouping in the observability UI    |
| `logInput`       | `boolean?`                 | Whether to include input in the log (default: true)       |
| `logOutput`      | `boolean?`                 | Whether to include output in the log (default: true)      |
| `metadata`       | `Record<string, unknown>?` | Additional static metadata                                |
| `sanitizeInput`  | `(input) => unknown`       | Sanitize input before logging — use to strip key material |
| `sanitizeOutput` | `(output) => unknown`      | Sanitize output before logging                            |

---

## Dependencies

No npm dependencies. This package is intentionally dependency-free to avoid circular dependencies (it is a peer dependency of `@gtcx/crypto`).

---

## Stub vs. Full Implementation

| Aspect              | Stub (this package)          | Full (gtcx-intelligence)            |
| ------------------- | ---------------------------- | ----------------------------------- |
| `traced()` behavior | Returns wrapped fn unchanged | Wraps fn with log emission          |
| `logOperation()`    | No-op                        | Writes to AI observability pipeline |
| Output              | None                         | Structured JSON to ANISA            |

Downstream consumers do not need to change when the full implementation is injected — the interface is identical.

---

## Non-Goals

- Does not implement ML or AI inference
- Does not ship logs to external services — the stub emits nothing
- Does not manage AI model configuration

---

## Implementation

`packages/ai/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/crypto.md`](./crypto.md) — primary consumer of traced wrappers
- [`_sop/2-docs/5-specs/4-backend/packages/verification.md`](./verification.md) — secondary consumer
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
