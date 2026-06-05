[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [offline](../README.md) / IOfflineQueueStorage

# Interface: IOfflineQueueStorage

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L94)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L97)

#### Returns

`Promise`\<`void`\>

***

### load()

> **load**(): `Promise`\<[`QueuedOperation`](QueuedOperation.md)\<`unknown`\>[]\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L96)

#### Returns

`Promise`\<[`QueuedOperation`](QueuedOperation.md)\<`unknown`\>[]\>

***

### save()

> **save**(`operations`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/src/internal/offline-queue.ts:95](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/internal/offline-queue.ts#L95)

#### Parameters

##### operations

[`QueuedOperation`](QueuedOperation.md)\<`unknown`\>[]

#### Returns

`Promise`\<`void`\>
