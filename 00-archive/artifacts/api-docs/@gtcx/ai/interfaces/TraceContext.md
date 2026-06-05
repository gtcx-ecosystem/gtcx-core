[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / TraceContext

# Interface: TraceContext

Defined in: [trace-context.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/trace-context.ts#L11)

@gtcx/ai - AI Integration & Observability Utilities

Provides traced operation wrappers and structured category logging
for observability across GTCX packages.

All tracing is written to stderr as structured JSON lines.
No external dependencies — safe to use in any package.

The package is decomposed into focused modules:
- `trace-context` — TraceContext type, AsyncLocalStorage propagation
- `category-logger` — structured per-category JSON logger
- `redaction` — default secret redaction (defense-in-depth)
- `span-emitter` — pluggable lifecycle emitter for OTel/Datadog/etc.
- `traced` — the load-bearing observability wrapper
- `provenance` — provenance-aware tracing extensions

This file is a barrel re-export of every public symbol.

## Properties

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [trace-context.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/trace-context.ts#L14)

***

### spanId

> **spanId**: `string`

Defined in: [trace-context.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/trace-context.ts#L13)

***

### traceId

> **traceId**: `string`

Defined in: [trace-context.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/trace-context.ts#L12)
