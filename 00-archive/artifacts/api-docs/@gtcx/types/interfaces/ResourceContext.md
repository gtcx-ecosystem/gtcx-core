[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ResourceContext

# Interface: ResourceContext

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:133](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L133)

Resource context - COMMODITY-AGNOSTIC
Applies to any commodity extraction site

## Properties

### commodityPotential

> **commodityPotential**: `"high"` \| `"medium"` \| `"low"` \| `"none"`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:135](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L135)

Potential for the target commodity at this location

***

### commodityType?

> `optional` **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:137](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L137)

Which commodity this assessment is for

***

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:141](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L141)

Confidence in the assessment (0-1)

***

### formation?

> `optional` **formation**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:139](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L139)

Geological formation or agricultural zone

***

### source?

> `optional` **source**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:143](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L143)

Source of the assessment
