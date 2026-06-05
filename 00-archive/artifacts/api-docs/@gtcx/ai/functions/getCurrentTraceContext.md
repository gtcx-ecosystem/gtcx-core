[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / getCurrentTraceContext

# Function: getCurrentTraceContext()

> **getCurrentTraceContext**(): [`TraceContext`](../interfaces/TraceContext.md) \| `undefined`

Defined in: [trace-context.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/trace-context.ts#L51)

Get the current trace context from AsyncLocalStorage.
Returns `undefined` when not inside a traced operation.

## Returns

[`TraceContext`](../interfaces/TraceContext.md) \| `undefined`
