[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / ResourceContext

# Interface: ResourceContext

Defined in: 03-platform/packages/types/dist/index.d.ts:261

Resource context - COMMODITY-AGNOSTIC
Applies to any commodity extraction site

## Properties

### commodityPotential

> **commodityPotential**: `"high"` \| `"medium"` \| `"low"` \| `"none"`

Defined in: 03-platform/packages/types/dist/index.d.ts:263

Potential for the target commodity at this location

***

### commodityType?

> `optional` **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: 03-platform/packages/types/dist/index.d.ts:265

Which commodity this assessment is for

***

### confidence

> **confidence**: `number`

Defined in: 03-platform/packages/types/dist/index.d.ts:269

Confidence in the assessment (0-1)

***

### formation?

> `optional` **formation**: `string`

Defined in: 03-platform/packages/types/dist/index.d.ts:267

Geological formation or agricultural zone

***

### source?

> `optional` **source**: `string`

Defined in: 03-platform/packages/types/dist/index.d.ts:271

Source of the assessment
