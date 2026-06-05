[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / GeoTagData

# Interface: GeoTagData

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:263](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L263)

GeoTagData - Primary data structure for a verified location capture
Alias for GeoTagSession for protocol layer convenience

## Properties

### accuracy

> **accuracy**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:268](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L268)

***

### altitude?

> `optional` **altitude**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:269](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L269)

***

### commodityType?

> `optional` **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:271](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L271)

***

### coordinates

> **coordinates**: [`GeoCoordinates`](GeoCoordinates.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:266](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L266)

***

### deviceAttestation?

> `optional` **deviceAttestation**: [`DeviceAttestation`](DeviceAttestation.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:270](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L270)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:264](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L264)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:272](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L272)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:267](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L267)

***

### tradePassId

> **tradePassId**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:265](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L265)
