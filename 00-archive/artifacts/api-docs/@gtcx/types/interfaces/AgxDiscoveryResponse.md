[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / AgxDiscoveryResponse

# Interface: AgxDiscoveryResponse

Defined in: [03-platform/packages/types/03-platform/src/api/platforms.ts:162](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/platforms.ts#L162)

## Properties

### aggregations

> **aggregations**: `object`

Defined in: [03-platform/packages/types/03-platform/src/api/platforms.ts:165](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/platforms.ts#L165)

#### byOrigin

> **byOrigin**: `Record`\<`string`, `number`\>

#### byTier

> **byTier**: `Record`\<`string`, `number`\>

#### priceRange

> **priceRange**: `object`

##### priceRange.max

> **max**: `number`

##### priceRange.min

> **min**: `number`

#### quantityRange

> **quantityRange**: `object`

##### quantityRange.max

> **max**: `number`

##### quantityRange.min

> **min**: `number`

***

### listings

> **listings**: [`AgxListing`](AgxListing.md)[]

Defined in: [03-platform/packages/types/03-platform/src/api/platforms.ts:163](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/platforms.ts#L163)

***

### totalCount

> **totalCount**: `number`

Defined in: [03-platform/packages/types/03-platform/src/api/platforms.ts:164](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/platforms.ts#L164)
