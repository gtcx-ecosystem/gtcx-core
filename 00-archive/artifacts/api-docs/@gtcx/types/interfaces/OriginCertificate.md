[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / OriginCertificate

# Interface: OriginCertificate

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:208](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L208)

Origin certificate - the final attestation
COMMODITY-AGNOSTIC - works for any commodity

## Properties

### certificateId

> **certificateId**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:209](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L209)

***

### cryptographicProof

> **cryptographicProof**: [`CryptographicProof`](CryptographicProof.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:220](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L220)

***

### evidenceHashes

> **evidenceHashes**: `string`[]

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:216](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L216)

***

### expiresAt?

> `optional` **expiresAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:213](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L213)

***

### ~~geologicalContext?~~

> `optional` **geologicalContext**: [`GeologicalContext`](GeologicalContext.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:219](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L219)

#### Deprecated

Use resourceContext instead

***

### issuedAt

> **issuedAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:212](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L212)

***

### issuedTo

> **issuedTo**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:211](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L211)

***

### issuer

> **issuer**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:210](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L210)

***

### locationProof

> **locationProof**: [`LocationProof`](LocationProof.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:215](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L215)

***

### lotData

> **lotData**: [`LotData`](LotData.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:214](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L214)

***

### qrCode

> **qrCode**: `string`

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:221](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L221)

***

### resourceContext?

> `optional` **resourceContext**: [`ResourceContext`](ResourceContext.md)

Defined in: [03-platform/packages/types/src/protocols/geotag.ts:217](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/geotag.ts#L217)
