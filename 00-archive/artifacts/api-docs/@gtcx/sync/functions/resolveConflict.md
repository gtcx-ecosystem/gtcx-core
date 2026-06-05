[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/sync](../README.md) / resolveConflict

# Function: resolveConflict()

> **resolveConflict**\<`T`\>(`strategy`, `localItems`, `remoteItem?`): `object`

Defined in: [index.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/index.ts#L31)

## Type Parameters

### T

`T`

## Parameters

### strategy

[`ConflictStrategy`](../type-aliases/ConflictStrategy.md)

### localItems

[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>[]

### remoteItem?

[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>

## Returns

`object`

### resolved

> **resolved**: `boolean`

### winner?

> `optional` **winner**: [`SyncItem`](../interfaces/SyncItem.md)\<`T`\>
