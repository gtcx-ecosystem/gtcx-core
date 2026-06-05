[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / createResourceContext

# Function: createResourceContext()

> **createResourceContext**(`commodityType`, `potential`, `confidence`, `options?`): [`ResourceContext`](../interfaces/ResourceContext.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:338](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L338)

Helper to create ResourceContext for any commodity

## Parameters

### commodityType

[`CommodityType`](../type-aliases/CommodityType.md)

### potential

`"high"` | `"medium"` | `"low"` | `"none"`

### confidence

`number`

### options?

#### formation?

`string`

#### source?

`string`

## Returns

[`ResourceContext`](../interfaces/ResourceContext.md)
