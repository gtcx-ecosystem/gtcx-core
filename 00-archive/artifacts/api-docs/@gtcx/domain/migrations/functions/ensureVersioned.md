[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [migrations](../README.md) / ensureVersioned

# Function: ensureVersioned()

> **ensureVersioned**\<`T`\>(`data`, `entityType`): [`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:340](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L340)

Ensure data is wrapped as versioned entity

## Type Parameters

### T

`T`

## Parameters

### data

`T` | [`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

### entityType

[`EntityType`](../type-aliases/EntityType.md)

## Returns

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>
