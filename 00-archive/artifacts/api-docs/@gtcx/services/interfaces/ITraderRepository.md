[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / ITraderRepository

# Interface: ITraderRepository

Defined in: [03-platform/packages/services/03-platform/src/repositories.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/repositories.ts#L39)

## Methods

### getAvailableLots()

> **getAvailableLots**(`filters?`): `Promise`\<`AssetLot`[]\>

Defined in: [03-platform/packages/services/03-platform/src/repositories.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/repositories.ts#L41)

#### Parameters

##### filters?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`AssetLot`[]\>

***

### getTrader()

> **getTrader**(`id`): `Promise`\<`Trader` \| `undefined`\>

Defined in: [03-platform/packages/services/03-platform/src/repositories.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/repositories.ts#L40)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`Trader` \| `undefined`\>
