[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [migrations](../README.md) / SchemaMigrator

# Class: SchemaMigrator

Defined in: [03-platform/packages/domain/src/migrations.ts:156](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L156)

## Constructors

### Constructor

> **new SchemaMigrator**(`customMigrations?`): `SchemaMigrator`

Defined in: [03-platform/packages/domain/src/migrations.ts:159](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L159)

#### Parameters

##### customMigrations?

[`Migration`](../interfaces/Migration.md)[]

#### Returns

`SchemaMigrator`

## Methods

### getCurrentVersion()

> **getCurrentVersion**(`entityType`): `string`

Defined in: [03-platform/packages/domain/src/migrations.ts:177](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L177)

Get current schema version for entity type

#### Parameters

##### entityType

[`EntityType`](../type-aliases/EntityType.md)

#### Returns

`string`

***

### migrate()

> **migrate**\<`T`\>(`entity`): [`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

Defined in: [03-platform/packages/domain/src/migrations.ts:192](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L192)

Migrate entity to current schema version

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

#### Returns

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

***

### migrateMany()

> **migrateMany**\<`T`\>(`entities`): [`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>[]

Defined in: [03-platform/packages/domain/src/migrations.ts:226](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L226)

Migrate multiple entities

#### Type Parameters

##### T

`T`

#### Parameters

##### entities

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>[]

#### Returns

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>[]

***

### needsMigration()

> **needsMigration**\<`T`\>(`entity`): `boolean`

Defined in: [03-platform/packages/domain/src/migrations.ts:184](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L184)

Check if entity needs migration

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

#### Returns

`boolean`

***

### registerMigration()

> **registerMigration**(`migration`): `void`

Defined in: [03-platform/packages/domain/src/migrations.ts:166](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L166)

Register a new migration

#### Parameters

##### migration

[`Migration`](../interfaces/Migration.md)

#### Returns

`void`

***

### unwrap()

> **unwrap**\<`T`\>(`entity`): `T`

Defined in: [03-platform/packages/domain/src/migrations.ts:244](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L244)

Unwrap versioned entity to raw data

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

#### Returns

`T`

***

### validate()

> **validate**\<`T`\>(`entity`, `validator`): `object`

Defined in: [03-platform/packages/domain/src/migrations.ts:251](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L251)

Validate entity against current schema

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

##### validator

(`data`) => `boolean`

#### Returns

`object`

##### errors?

> `optional` **errors**: `string`[]

##### migrated

> **migrated**: `boolean`

##### valid

> **valid**: `boolean`

***

### wrap()

> **wrap**\<`T`\>(`data`, `entityType`, `version?`): [`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>

Defined in: [03-platform/packages/domain/src/migrations.ts:233](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/migrations.ts#L233)

Wrap raw data as versioned entity

#### Type Parameters

##### T

`T`

#### Parameters

##### data

`T`

##### entityType

[`EntityType`](../type-aliases/EntityType.md)

##### version?

`string`

#### Returns

[`VersionedEntity`](../interfaces/VersionedEntity.md)\<`T`\>
