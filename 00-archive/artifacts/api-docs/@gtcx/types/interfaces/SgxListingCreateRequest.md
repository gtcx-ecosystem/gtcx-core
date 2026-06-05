[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / SgxListingCreateRequest

# Interface: SgxListingCreateRequest

Defined in: [03-platform/packages/types/src/api/platforms.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L65)

## Properties

### lotId

> **lotId**: `string`

Defined in: [03-platform/packages/types/src/api/platforms.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L66)

***

### price

> **price**: `object`

Defined in: [03-platform/packages/types/src/api/platforms.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L68)

#### amount

> **amount**: `number`

#### currency

> **currency**: `string`

#### pricePerUnit

> **pricePerUnit**: `number`

#### unit

> **unit**: `string`

***

### sellerId

> **sellerId**: `string`

Defined in: [03-platform/packages/types/src/api/platforms.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L67)

***

### terms

> **terms**: `object`

Defined in: [03-platform/packages/types/src/api/platforms.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L74)

#### deliveryMethod

> **deliveryMethod**: `string`

#### minimumQuantity?

> `optional` **minimumQuantity**: `number`

#### settlementType

> **settlementType**: `string`

#### validUntil

> **validUntil**: `number`

***

### visibility?

> `optional` **visibility**: `"private"` \| `"public"` \| `"invited"`

Defined in: [03-platform/packages/types/src/api/platforms.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/platforms.ts#L80)
