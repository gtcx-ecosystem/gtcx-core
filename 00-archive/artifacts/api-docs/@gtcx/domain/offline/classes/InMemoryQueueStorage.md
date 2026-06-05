[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [offline](../README.md) / InMemoryQueueStorage

# Class: InMemoryQueueStorage

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:468](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L468)

## Implements

- [`IOfflineQueueStorage`](../interfaces/IOfflineQueueStorage.md)

## Constructors

### Constructor

> **new InMemoryQueueStorage**(): `InMemoryQueueStorage`

#### Returns

`InMemoryQueueStorage`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:479](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L479)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IOfflineQueueStorage`](../interfaces/IOfflineQueueStorage.md).[`clear`](../interfaces/IOfflineQueueStorage.md#clear)

***

### load()

> **load**(): `Promise`\<[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:475](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L475)

#### Returns

`Promise`\<[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]\>

#### Implementation of

[`IOfflineQueueStorage`](../interfaces/IOfflineQueueStorage.md).[`load`](../interfaces/IOfflineQueueStorage.md#load)

***

### save()

> **save**(`operations`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:471](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L471)

#### Parameters

##### operations

[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IOfflineQueueStorage`](../interfaces/IOfflineQueueStorage.md).[`save`](../interfaces/IOfflineQueueStorage.md#save)
