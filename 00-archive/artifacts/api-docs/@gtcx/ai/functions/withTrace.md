[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / withTrace

# Function: withTrace()

> **withTrace**\<`T`\>(`fn`, `operationName?`, `options?`): `T`

Defined in: [traced.ts:290](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L290)

Execute a no-argument function with tracing instrumentation.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `T`

### operationName?

`string`

### options?

[`TracedOptions`](../interfaces/TracedOptions.md)

## Returns

`T`

## Example

```ts
const result = withTrace(() => generateKeyPair(), 'crypto.keygen');
```
