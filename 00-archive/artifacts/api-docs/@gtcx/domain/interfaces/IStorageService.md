[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / IStorageService

# Interface: IStorageService

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:444](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L444)

Storage service interface

## Methods

### getAssetLot()

> **getAssetLot**(`id`): `Promise`\<[`AssetLot`](AssetLot.md) \| `null`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:446](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L446)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`AssetLot`](AssetLot.md) \| `null`\>

***

### saveAssetLot()

> **saveAssetLot**(`lot`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:445](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L445)

#### Parameters

##### lot

[`AssetLot`](AssetLot.md)

#### Returns

`Promise`\<`void`\>

***

### saveCertificate()

> **saveCertificate**(`cert`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:447](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L447)

#### Parameters

##### cert

[`AssetCertificate`](AssetCertificate.md)

#### Returns

`Promise`\<`void`\>

***

### saveTransaction()

> **saveTransaction**(`tx`): `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:448](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L448)

#### Parameters

##### tx

[`Transaction`](Transaction.md)

#### Returns

`Promise`\<`void`\>
