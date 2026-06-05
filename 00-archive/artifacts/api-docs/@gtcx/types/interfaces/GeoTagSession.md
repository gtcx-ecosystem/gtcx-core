[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / GeoTagSession

# Interface: GeoTagSession

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:191](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L191)

GeoTag capture session - groups related proofs

## Properties

### commodityType?

> `optional` **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:201](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L201)

Commodity type for this session

***

### endTime?

> `optional` **endTime**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:195](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L195)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:192](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L192)

***

### locationProofs

> **locationProofs**: [`LocationProof`](LocationProof.md)[]

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:196](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L196)

***

### photoEvidence

> **photoEvidence**: [`PhotoEvidence`](PhotoEvidence.md)[]

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:197](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L197)

***

### startTime

> **startTime**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L194)

***

### status

> **status**: `"active"` \| `"completed"` \| `"cancelled"`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:199](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L199)

***

### tradePassId

> **tradePassId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:193](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L193)

***

### workflowType

> **workflowType**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:198](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L198)
