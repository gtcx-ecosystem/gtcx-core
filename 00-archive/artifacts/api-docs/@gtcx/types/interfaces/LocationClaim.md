[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / LocationClaim

# Interface: LocationClaim

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:290](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L290)

LocationClaim - A claim about a location that can be verified

## Properties

### claimant

> **claimant**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:292](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L292)

***

### claimId

> **claimId**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:291](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L291)

***

### evidence?

> `optional` **evidence**: `string`[]

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:296](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L296)

***

### location

> **location**: [`GeoCoordinates`](GeoCoordinates.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:293](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L293)

***

### purpose

> **purpose**: `"other"` \| `"custody"` \| `"transport"` \| `"extraction"` \| `"processing"`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:295](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L295)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:294](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L294)

***

### verified

> **verified**: `boolean`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:297](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L297)

***

### verifiedAt?

> `optional` **verifiedAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:298](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L298)

***

### verifiedBy?

> `optional` **verifiedBy**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:299](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L299)
