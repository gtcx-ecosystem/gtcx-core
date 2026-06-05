[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/ai

# @gtcx/ai

Observability and tracing instrumentation for GTCX operations.

Provides `traced()` function wrappers that measure duration, log structured JSON to stderr, and capture errors — with zero external dependencies. Used by `@gtcx/crypto` and `@gtcx/verification` for operational telemetry and audit trails.

## Installation

```bash
pnpm add @gtcx/ai
```

## Quick Start

```typescript
import { traced, createCategoryLogger } from '@gtcx/ai';

// Wrap a function with tracing
const classify = traced(
  async (data: unknown) => ({ category: 'gold', confidence: 0.97 }),
  'classify',
  { category: 'ai', logOutput: true }
);

// Scoped structured logger
const logger = createCategoryLogger('ai.classification');
logger.info('Done', { confidence: 0.97 });
```

## API

| Export                           | Description                                      |
| -------------------------------- | ------------------------------------------------ |
| `traced(fn, name, opts?)`        | Wrap function with duration + structured logging |
| `withTrace(fn, name?, opts?)`    | Execute a no-arg function with tracing           |
| `createCategoryLogger(category)` | Scoped logger emitting JSON lines to stderr      |

### TracedOptions

| Option           | Type                           | Description                          |
| ---------------- | ------------------------------ | ------------------------------------ |
| `category`       | `string`                       | Logger category (default: `default`) |
| `logInput`       | `boolean`                      | Include sanitized input in logs      |
| `logOutput`      | `boolean`                      | Include sanitized output in logs     |
| `sanitizeInput`  | `(input: unknown) => unknown`  | Redact sensitive inputs              |
| `sanitizeOutput` | `(output: unknown) => unknown` | Redact sensitive outputs             |
| `metadata`       | `Record<string, unknown>`      | Extra fields attached to every log   |

> No runtime dependencies. Safe to use in security-sensitive packages.

## Related

- [ADR-008: Optional Tracing via Peer Dependencies](../../_media/008-optional-tracing-peer-deps.md)

## License

MIT

## Interfaces

- [CategoryLogger](interfaces/CategoryLogger.md)
- [OperationLog](interfaces/OperationLog.md)
- [ProvenancedResult](interfaces/ProvenancedResult.md)
- [ProvenanceLogger](interfaces/ProvenanceLogger.md)
- [SpanEmitter](interfaces/SpanEmitter.md)
- [SpanLifecycleEnd](interfaces/SpanLifecycleEnd.md)
- [SpanLifecycleStart](interfaces/SpanLifecycleStart.md)
- [TraceContext](interfaces/TraceContext.md)
- [TracedOptions](interfaces/TracedOptions.md)

## Functions

- [attachProvenance](functions/attachProvenance.md)
- [createCategoryLogger](functions/createCategoryLogger.md)
- [createProvenanceLogger](functions/createProvenanceLogger.md)
- [generateSpanId](functions/generateSpanId.md)
- [generateTraceId](functions/generateTraceId.md)
- [getCurrentTraceContext](functions/getCurrentTraceContext.md)
- [getDefaultSpanEmitter](functions/getDefaultSpanEmitter.md)
- [redactSecrets](functions/redactSecrets.md)
- [runWithTraceContext](functions/runWithTraceContext.md)
- [setDefaultSpanEmitter](functions/setDefaultSpanEmitter.md)
- [traced](functions/traced.md)
- [withTrace](functions/withTrace.md)
