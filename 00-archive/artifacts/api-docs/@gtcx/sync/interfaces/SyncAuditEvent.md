[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/sync](../README.md) / SyncAuditEvent

# Interface: SyncAuditEvent\<T\>

Defined in: [types.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L40)

## Type Parameters

### T

`T` = `unknown`

## Properties

### error?

> `optional` **error**: `string`

Defined in: [types.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L48)

***

### id?

> `optional` **id**: `string`

Defined in: [types.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L44)

***

### localCount?

> `optional` **localCount**: `number`

Defined in: [types.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L45)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [types.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L49)

***

### remotePresent?

> `optional` **remotePresent**: `boolean`

Defined in: [types.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L46)

***

### strategy

> **strategy**: [`ConflictStrategy`](../type-aliases/ConflictStrategy.md)

Defined in: [types.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L43)

***

### timestamp

> **timestamp**: `string`

Defined in: [types.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L42)

***

### type

> **type**: [`SyncAuditEventType`](../type-aliases/SyncAuditEventType.md)

Defined in: [types.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L41)

***

### winner?

> `optional` **winner**: [`SyncItem`](SyncItem.md)\<`T`\>

Defined in: [types.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/sync/src/types.ts#L47)
