[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / OfflineEventBuffer

# Class: OfflineEventBuffer

Defined in: [offline-buffer.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L32)

## Constructors

### Constructor

> **new OfflineEventBuffer**(`options?`): `OfflineEventBuffer`

Defined in: [offline-buffer.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L36)

#### Parameters

##### options?

[`OfflineBufferOptions`](../interfaces/OfflineBufferOptions.md)

#### Returns

`OfflineEventBuffer`

## Properties

### droppedCount

> **droppedCount**: `number` = `0`

Defined in: [offline-buffer.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L41)

Number of events dropped due to buffer overflow since creation.

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [offline-buffer.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L102)

Get the number of buffered events.

##### Returns

`number`

## Methods

### buffer()

> **buffer**(`event`): `void`

Defined in: [offline-buffer.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L47)

Store an event for later dispatch.
If the buffer is full, the oldest event is dropped and a warning is logged.

#### Parameters

##### event

[`DomainEvent`](../interfaces/DomainEvent.md)

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [offline-buffer.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L109)

Clear all buffered events.

#### Returns

`void`

***

### flush()

> **flush**(`emitFn`): `Promise`\<`number`\>

Defined in: [offline-buffer.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L72)

Replay all buffered events through the provided emit function.
Events are flushed in FIFO order. Each event's retryCount is
incremented before dispatch. If the emitFn throws, the remaining
events stay in the buffer with incremented retry counts.

#### Parameters

##### emitFn

(`event`) => `void`

#### Returns

`Promise`\<`number`\>

***

### getBuffered()

> **getBuffered**(): [`BufferedEvent`](../interfaces/BufferedEvent.md)\<`unknown`\>[]

Defined in: [offline-buffer.ts:95](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/offline-buffer.ts#L95)

Retrieve a copy of all currently buffered events.

#### Returns

[`BufferedEvent`](../interfaces/BufferedEvent.md)\<`unknown`\>[]
