[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / LotData

# Interface: LotData

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:227](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L227)

Lot data - COMMODITY-AGNOSTIC

## Properties

### commodity

> **commodity**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:230](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L230)

Commodity type (gold, silver, cocoa, etc.)

***

### commoditySubtype?

> `optional` **commoditySubtype**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:232](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L232)

Commodity subtype (e.g., 'alluvial', 'lode', 'arabica')

***

### discoveryDate

> **discoveryDate**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:238](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L238)

***

### estimatedWeight

> **estimatedWeight**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:233](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L233)

***

### lotId

> **lotId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:228](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L228)

***

### producerId?

> `optional` **producerId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:241](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L241)

Producer identifier (was: minerId)

***

### purity?

> `optional` **purity**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:237](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L237)

Purity percentage (0-100), primarily for metals

***

### quality?

> `optional` **quality**: [`QualityGrade`](../type-aliases/QualityGrade.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:235](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L235)

***

### site?

> `optional` **site**: [`SiteReference`](SiteReference.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:239](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L239)

***

### unit

> **unit**: [`MeasurementUnit`](../type-aliases/MeasurementUnit.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:234](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L234)
