[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / IPriceService

# Interface: IPriceService

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:454](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L454)

Price service interface

## Methods

### getExchangeRate()

> **getExchangeRate**(`from`, `to`): `Promise`\<`number`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:456](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L456)

#### Parameters

##### from

`string`

##### to

`string`

#### Returns

`Promise`\<`number`\>

***

### getMarketPrice()

> **getMarketPrice**(`commodityType`, `source?`): `Promise`\<`number`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:455](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L455)

#### Parameters

##### commodityType

`string`

##### source?

`string`

#### Returns

`Promise`\<`number`\>
