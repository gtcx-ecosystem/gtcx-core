[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / LocationProof

# Interface: LocationProof

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:111](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L111)

Location proof - cryptographically attested GPS capture

## Properties

### coordinates

> **coordinates**: [`GeoCoordinates`](GeoCoordinates.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:113](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L113)

***

### cryptographicProof

> **cryptographicProof**: [`CryptographicProof`](CryptographicProof.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:116](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L116)

***

### deviceAttestation?

> `optional` **deviceAttestation**: [`DeviceAttestation`](DeviceAttestation.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:115](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L115)

***

### ~~geologicalContext?~~

> `optional` **geologicalContext**: [`GeologicalContext`](GeologicalContext.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L119)

#### Deprecated

Use resourceContext instead

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:112](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L112)

***

### resourceContext?

> `optional` **resourceContext**: [`ResourceContext`](ResourceContext.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L117)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/geotag.ts:114](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/geotag.ts#L114)
