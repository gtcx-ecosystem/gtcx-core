[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / TracedOptions

# Interface: TracedOptions

Defined in: [traced.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L35)

## Properties

### category?

> `optional` **category**: `string`

Defined in: [traced.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L36)

***

### logInput?

> `optional` **logInput**: `boolean`

Defined in: [traced.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L37)

***

### logOutput?

> `optional` **logOutput**: `boolean`

Defined in: [traced.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L38)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [traced.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L39)

***

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [traced.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L43)

***

### sanitizeInput()?

> `optional` **sanitizeInput**: (`input`) => `unknown`

Defined in: [traced.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L40)

#### Parameters

##### input

`unknown`

#### Returns

`unknown`

***

### sanitizeOutput()?

> `optional` **sanitizeOutput**: (`output`) => `unknown`

Defined in: [traced.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L41)

#### Parameters

##### output

`unknown`

#### Returns

`unknown`

***

### spanEmitter?

> `optional` **spanEmitter**: [`SpanEmitter`](SpanEmitter.md)

Defined in: [traced.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L51)

Optional span emitter for forwarding traces to external systems
(OpenTelemetry, Honeycomb, custom backends). When set, overrides
the process-wide default registered via `setDefaultSpanEmitter`.

Stderr JSON emission continues regardless — the emitter is additive.

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [traced.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/src/traced.ts#L42)
