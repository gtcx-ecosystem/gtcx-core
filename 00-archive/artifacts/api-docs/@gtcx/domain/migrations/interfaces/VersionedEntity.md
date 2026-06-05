[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [migrations](../README.md) / VersionedEntity

# Interface: VersionedEntity\<T\>

Defined in: [03-platform/packages/domain/src/migrations.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L27)

## Type Parameters

### T

`T` = `unknown`

## Properties

### \_entityType

> **\_entityType**: [`EntityType`](../type-aliases/EntityType.md)

Defined in: [03-platform/packages/domain/src/migrations.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L33)

Entity type

***

### \_migrations?

> `optional` **\_migrations**: `string`[]

Defined in: [03-platform/packages/domain/src/migrations.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L35)

Migration history

***

### \_schemaVersion

> **\_schemaVersion**: `string`

Defined in: [03-platform/packages/domain/src/migrations.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L31)

Schema version

***

### data

> **data**: `T`

Defined in: [03-platform/packages/domain/src/migrations.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L29)

Entity data
