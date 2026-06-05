[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/sync](../README.md) / ISyncEngine

# Interface: ISyncEngine

Defined in: [types.ts:88](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/03-platform/src/types.ts#L88)

## Methods

### cancel()

> **cancel**(): `void`

Defined in: [types.ts:91](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/03-platform/src/types.ts#L91)

#### Returns

`void`

***

### getStatus()

> **getStatus**(): [`SyncStatus`](../type-aliases/SyncStatus.md)

Defined in: [types.ts:90](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/03-platform/src/types.ts#L90)

#### Returns

[`SyncStatus`](../type-aliases/SyncStatus.md)

***

### sync()

> **sync**(`items`, `options`): `Promise`\<[`SyncResult`](SyncResult.md)\>

Defined in: [types.ts:89](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/03-platform/src/types.ts#L89)

#### Parameters

##### items

[`SyncItem`](SyncItem.md)\<`unknown`\>[]

##### options

[`SyncOptions`](SyncOptions.md)

#### Returns

`Promise`\<[`SyncResult`](SyncResult.md)\>
