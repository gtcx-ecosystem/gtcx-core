[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / SpanEmitter

# Interface: SpanEmitter

Defined in: [span-emitter.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/span-emitter.ts#L24)

Pluggable span lifecycle emitter.

Implementations MUST:
- Be safe to call from any context (sync, async, error paths)
- Not throw — emitter errors must not derail the traced operation
  (the runner catches and surfaces them via stderr `event=span_emitter_error`)
- Treat `onSpanStart` and `onSpanEnd` as paired: every start is followed
  by exactly one end (success or error). The matching key is `spanId`.

## Methods

### onSpanEnd()

> **onSpanEnd**(`span`): `void`

Defined in: [span-emitter.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/span-emitter.ts#L28)

Called when a traced operation completes — success or failure.

#### Parameters

##### span

[`SpanLifecycleEnd`](SpanLifecycleEnd.md)

#### Returns

`void`

***

### onSpanStart()

> **onSpanStart**(`span`): `void`

Defined in: [span-emitter.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/span-emitter.ts#L26)

Called when a traced operation begins.

#### Parameters

##### span

[`SpanLifecycleStart`](SpanLifecycleStart.md)

#### Returns

`void`
