[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / getDefaultSpanEmitter

# Function: getDefaultSpanEmitter()

> **getDefaultSpanEmitter**(): [`SpanEmitter`](../interfaces/SpanEmitter.md) \| `undefined`

Defined in: [span-emitter.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/span-emitter.ts#L96)

Read the current process-wide default [SpanEmitter](../interfaces/SpanEmitter.md), or `undefined`
if none is registered. Primarily useful for diagnostics and tests.

## Returns

[`SpanEmitter`](../interfaces/SpanEmitter.md) \| `undefined`
