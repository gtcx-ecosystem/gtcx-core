[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / setDefaultSpanEmitter

# Function: setDefaultSpanEmitter()

> **setDefaultSpanEmitter**(`emitter`): `void`

Defined in: [span-emitter.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/span-emitter.ts#L83)

Register a process-wide default [SpanEmitter](../interfaces/SpanEmitter.md). Subsequent `traced()`
calls will forward span lifecycle events to this emitter unless overridden
per-call via `options.spanEmitter`. Pass `undefined` to clear.

Typical wiring: `@gtcx/telemetry` calls this with an OTel-backed emitter
during runtime initialization, so consumers get OTel forwarding for free.

## Parameters

### emitter

[`SpanEmitter`](../interfaces/SpanEmitter.md) | `undefined`

## Returns

`void`
