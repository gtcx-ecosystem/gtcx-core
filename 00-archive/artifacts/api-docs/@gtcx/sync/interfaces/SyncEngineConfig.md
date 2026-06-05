[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/sync](../README.md) / SyncEngineConfig

# Interface: SyncEngineConfig\<T\>

Defined in: [types.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L15)

## Type Parameters

### T

`T` = `unknown`

## Properties

### fetchRemote()?

> `optional` **fetchRemote**: (`ids`) => `Promise`\<[`SyncItem`](SyncItem.md)\<`T`\>[]\>

Defined in: [types.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L16)

#### Parameters

##### ids

`string`[]

#### Returns

`Promise`\<[`SyncItem`](SyncItem.md)\<`T`\>[]\>

***

### onAudit()?

> `optional` **onAudit**: (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L21)

#### Parameters

##### event

[`SyncAuditEvent`](SyncAuditEvent.md)\<`T`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onConflict()?

> `optional` **onConflict**: (`conflict`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L19)

#### Parameters

##### conflict

[`SyncConflict`](SyncConflict.md)\<`T`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### onMetrics()?

> `optional` **onMetrics**: (`metrics`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L22)

#### Parameters

##### metrics

[`SyncMetrics`](SyncMetrics.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onResolved()?

> `optional` **onResolved**: (`items`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L18)

#### Parameters

##### items

[`SyncItem`](SyncItem.md)\<`T`\>[]

#### Returns

`void` \| `Promise`\<`void`\>

***

### pushLocal()?

> `optional` **pushLocal**: (`items`) => `Promise`\<`void`\>

Defined in: [types.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L17)

#### Parameters

##### items

[`SyncItem`](SyncItem.md)\<`T`\>[]

#### Returns

`Promise`\<`void`\>

***

### resolveConflict()?

> `optional` **resolveConflict**: (`conflict`) => `Promise`\<[`SyncItem`](SyncItem.md)\<`T`\> \| `null`\>

Defined in: [types.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L20)

#### Parameters

##### conflict

[`SyncConflict`](SyncConflict.md)\<`T`\>

#### Returns

`Promise`\<[`SyncItem`](SyncItem.md)\<`T`\> \| `null`\>
