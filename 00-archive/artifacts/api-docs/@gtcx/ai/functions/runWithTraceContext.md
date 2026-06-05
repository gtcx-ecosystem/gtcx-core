[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / runWithTraceContext

# Function: runWithTraceContext()

> **runWithTraceContext**\<`T`\>(`fn`, `context?`): `T`

Defined in: [trace-context.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/trace-context.ts#L59)

Run a function within an explicit trace context.
Useful for creating root spans or propagating external trace IDs.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `T`

### context?

`Partial`\<[`TraceContext`](../interfaces/TraceContext.md)\>

## Returns

`T`
