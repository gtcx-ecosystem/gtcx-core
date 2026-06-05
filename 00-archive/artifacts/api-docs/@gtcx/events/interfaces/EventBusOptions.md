[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / EventBusOptions

# Interface: EventBusOptions

Defined in: [types.ts:400](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L400)

Configuration options for the TypedEventBus.

## Properties

### enableOfflineBuffer?

> `optional` **enableOfflineBuffer**: `boolean`

Defined in: [types.ts:404](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L404)

Whether to enable offline buffering. Defaults to true.

***

### maxBufferSize?

> `optional` **maxBufferSize**: `number`

Defined in: [types.ts:406](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L406)

Maximum buffer size for offline events. Defaults to 5000.

***

### maxHistorySize?

> `optional` **maxHistorySize**: `number`

Defined in: [types.ts:402](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L402)

Maximum number of events to keep in history. Defaults to 1000.

***

### onHandlerError()?

> `optional` **onHandlerError**: (`error`, `event`) => `void`

Defined in: [types.ts:408](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L408)

Called when a handler throws. By default errors are silently swallowed.

#### Parameters

##### error

`unknown`

##### event

[`DomainEvent`](DomainEvent.md)

#### Returns

`void`
