[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [offline](../README.md) / OfflineQueue

# Class: OfflineQueue

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L100)

## Constructors

### Constructor

> **new OfflineQueue**(`options?`): `OfflineQueue`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L108)

#### Parameters

##### options?

###### maxQueueSize?

`number`

###### onConflict?

(`conflict`) => `Promise`\<`unknown`\>

###### storage?

[`IOfflineQueueStorage`](../interfaces/IOfflineQueueStorage.md)

#### Returns

`OfflineQueue`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:375](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L375)

Clear all operations

#### Returns

`Promise`\<`void`\>

***

### enqueue()

> **enqueue**\<`T`\>(`type`, `payload`, `options?`): `Promise`\<`string`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:146](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L146)

Add operation to queue

#### Type Parameters

##### T

`T`

#### Parameters

##### type

[`QueuedOperationType`](../type-aliases/QueuedOperationType.md)

##### payload

`T`

##### options?

###### conflictStrategy?

[`ConflictStrategy`](../type-aliases/ConflictStrategy.md)

###### dependsOn?

`string`[]

###### maxAttempts?

`number`

###### metadata?

\{ `checksum?`: `string`; `entityId?`: `string`; `entityType?`: `string`; `version?`: `number`; \}

###### metadata.checksum?

`string`

###### metadata.entityId?

`string`

###### metadata.entityType?

`string`

###### metadata.version?

`number`

###### priority?

`number`

#### Returns

`Promise`\<`string`\>

***

### getConflicts()

> **getConflicts**(): [`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:325](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L325)

Get all conflicts

#### Returns

[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

***

### getFailed()

> **getFailed**(): [`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:318](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L318)

Get all failed operations

#### Returns

[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

***

### getNext()

> **getNext**(): [`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\> \| `undefined`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:200](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L200)

Get next operation to process

#### Returns

[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\> \| `undefined`

***

### getPending()

> **getPending**(): [`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:311](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L311)

Get all pending operations

#### Returns

[`QueuedOperation`](../interfaces/QueuedOperation.md)\<`unknown`\>[]

***

### getStats()

> **getStats**(): `object`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:332](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L332)

Get queue statistics

#### Returns

`object`

##### completed

> **completed**: `number`

##### conflicts

> **conflicts**: `number`

##### failed

> **failed**: `number`

##### pending

> **pending**: `number`

##### processing

> **processing**: `number`

##### total

> **total**: `number`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L121)

Initialize queue from storage

#### Returns

`Promise`\<`void`\>

***

### markCompleted()

> **markCompleted**(`id`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:232](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L232)

Mark operation as completed

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### markConflict()

> **markConflict**\<`T`\>(`id`, `serverData`): `Promise`\<[`ConflictResolution`](../interfaces/ConflictResolution.md)\<`T`\> \| `undefined`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:262](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L262)

Mark operation as having a conflict

#### Type Parameters

##### T

`T`

#### Parameters

##### id

`string`

##### serverData

`T`

#### Returns

`Promise`\<[`ConflictResolution`](../interfaces/ConflictResolution.md)\<`T`\> \| `undefined`\>

***

### markFailed()

> **markFailed**(`id`, `error`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:244](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L244)

Mark operation as failed

#### Parameters

##### id

`string`

##### error

`string`

#### Returns

`Promise`\<`void`\>

***

### markProcessing()

> **markProcessing**(`id`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:217](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L217)

Mark operation as processing.
Serialized via persistLock to prevent race conditions with concurrent callers.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

***

### pruneCompleted()

> **pruneCompleted**(`maxAgeMs?`): `Promise`\<`number`\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:354](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L354)

Remove completed operations older than specified age

#### Parameters

##### maxAgeMs?

`number` = `...`

#### Returns

`Promise`\<`number`\>
