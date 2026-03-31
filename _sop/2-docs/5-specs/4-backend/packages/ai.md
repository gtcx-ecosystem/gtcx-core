# Package Spec — `@gtcx/ai`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

AI-native observability infrastructure for the GTCX protocol. Provides traced operation wrappers, a higher-order tracing decorator, and category-scoped structured logging that enable AI systems in `gtcx-intelligence` to analyze, monitor, and reason about cryptographic and protocol operations at runtime. This package is a stub in `gtcx-core` — the full implementation lives in `gtcx-intelligence`.

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

| Export                                | Description                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `traced(fn, operationName, options?)` | Wrap a function with tracing — emits an `OperationLog` on each call                     |
| `TracedOptions`                       | Interface: tracing configuration — category, input/output logging, sanitizers, metadata |

`traced()` requires an `operationName: string` as the second argument. The stub implementation returns the wrapped function as-is without adding overhead. The full implementation in `gtcx-intelligence` replaces this with active logging to the AI observability pipeline.

### Higher-Order Trace Decorator

| Export                                    | Description                                                      |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `withTrace(fn, operationName?, options?)` | Higher-order tracing — supports two calling patterns (see below) |

Calling patterns:

1. `withTrace(fn, name, options)` — wraps `fn` with tracing (like `traced` but immediately invokes)
2. `withTrace(fn)` — executes `fn()` and returns the result directly

The stub implementation calls `fn()` and returns the result.

### Category Logger

| Export                           | Description                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------- |
| `createCategoryLogger(category)` | Factory: creates a category-scoped logger that outputs structured JSON to stderr |
| `CategoryLogger`                 | Interface: `{ info, warn, error, debug }` — structured logging methods           |

```typescript
interface CategoryLogger {
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, data?: Record<string, unknown>): void;
}
```

`createCategoryLogger` outputs JSON to stderr with the shape `{ level, category, msg, ts, ...data }`.

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

| Aspect                   | Stub (this package)          | Full (gtcx-intelligence)            |
| ------------------------ | ---------------------------- | ----------------------------------- |
| `traced()` behavior      | Returns wrapped fn unchanged | Wraps fn with log emission          |
| `withTrace()` behavior   | Calls fn() directly          | Calls fn() with tracing             |
| `createCategoryLogger()` | Writes JSON to stderr        | Writes to AI observability pipeline |

Downstream consumers do not need to change when the full implementation is injected — the interface is identical.

---

## Non-Goals

- Does not implement ML or AI inference
- Does not ship logs to external services — the stub emits to stderr only
- Does not manage AI model configuration

---

## Implementation

`packages/ai/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/crypto.md`](./crypto.md) — primary consumer of traced wrappers
- [`_sop/2-docs/5-specs/4-backend/packages/verification.md`](./verification.md) — secondary consumer
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
