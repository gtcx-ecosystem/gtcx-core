[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [migrations](../README.md) / Migration

# Interface: Migration

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L38)

## Properties

### description

> **description**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L48)

Migration description

***

### entityTypes

> **entityTypes**: [`EntityType`](../type-aliases/EntityType.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L46)

Entity types this migration applies to

***

### fromVersion

> **fromVersion**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L42)

Source version

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L40)

Migration ID (semver format)

***

### migrate()

> **migrate**: (`data`) => `unknown`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L50)

Migration function

#### Parameters

##### data

`unknown`

#### Returns

`unknown`

***

### rollback()?

> `optional` **rollback**: (`data`) => `unknown`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:52](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L52)

Rollback function (optional)

#### Parameters

##### data

`unknown`

#### Returns

`unknown`

***

### toVersion

> **toVersion**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/migrations.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/migrations.ts#L44)

Target version
