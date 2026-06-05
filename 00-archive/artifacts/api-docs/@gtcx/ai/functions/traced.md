[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / traced

# Function: traced()

> **traced**\<`TArgs`, `TReturn`\>(`fn`, `operationName`, `options?`): (...`args`) => `TReturn`

Defined in: [traced.ts:105](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L105)

Wrap a function with tracing instrumentation.

- Measures execution duration
- Logs operation start (debug) and completion (info)
- Logs errors (error level) with stack trace
- Respects `logInput` / `logOutput` / `sanitizeInput` / `sanitizeOutput`
- Propagates trace context across async boundaries via AsyncLocalStorage
- Forwards span lifecycle events to the configured `SpanEmitter`
  (per-call or process-wide default)

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TReturn

`TReturn`

## Parameters

### fn

(...`args`) => `TReturn`

### operationName

`string`

### options?

[`TracedOptions`](../interfaces/TracedOptions.md)

## Returns

> (...`args`): `TReturn`

### Parameters

#### args

...`TArgs`

### Returns

`TReturn`

## Example

```ts
const tracedSign = traced(sign, 'crypto.sign', {
  category: 'crypto',
  logInput: false, // never log private keys
  metadata: { algorithm: 'Ed25519' },
});
```
