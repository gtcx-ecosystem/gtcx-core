[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / ICryptoService

# Interface: ICryptoService

Defined in: [03-platform/packages/domain/src/types.ts:422](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L422)

Crypto service interface for dependency injection

## Methods

### createHash()

> **createHash**(`data`): `Promise`\<`string`\>

Defined in: [03-platform/packages/domain/src/types.ts:423](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L423)

#### Parameters

##### data

`string`

#### Returns

`Promise`\<`string`\>

***

### sign()

> **sign**(`data`): `Promise`\<`string`\>

Defined in: [03-platform/packages/domain/src/types.ts:424](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L424)

#### Parameters

##### data

`string`

#### Returns

`Promise`\<`string`\>

***

### signTransaction()

> **signTransaction**(`data`): `Promise`\<`string`\>

Defined in: [03-platform/packages/domain/src/types.ts:426](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L426)

#### Parameters

##### data

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`string`\>

***

### verify()

> **verify**(`data`, `signature`): `Promise`\<`boolean`\>

Defined in: [03-platform/packages/domain/src/types.ts:425](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L425)

#### Parameters

##### data

`string`

##### signature

`string`

#### Returns

`Promise`\<`boolean`\>
