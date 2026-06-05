[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / StandardCertificate

# Interface: StandardCertificate

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L108)

Standard certificate (single signature)

## Extends

- [`Certificate`](Certificate.md)

## Properties

### certificateId

> **certificateId**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L96)

#### Inherited from

[`Certificate`](Certificate.md).[`certificateId`](Certificate.md#certificateid)

***

### createdAt

> **createdAt**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L102)

#### Inherited from

[`Certificate`](Certificate.md).[`createdAt`](Certificate.md#createdat)

***

### dataHash

> **dataHash**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:110](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L110)

***

### metadata

> **metadata**: [`CertificateMetadata`](CertificateMetadata.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L100)

#### Inherited from

[`Certificate`](Certificate.md).[`metadata`](Certificate.md#metadata)

***

### securityLevel

> **securityLevel**: `"standard"` \| `"enhanced"`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L109)

#### Overrides

[`Certificate`](Certificate.md).[`securityLevel`](Certificate.md#securitylevel)

***

### signature

> **signature**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:111](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L111)

***

### type

> **type**: [`CertificateType`](../type-aliases/CertificateType.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L98)

#### Inherited from

[`Certificate`](Certificate.md).[`type`](Certificate.md#type)

***

### verificationData

> **verificationData**: [`CertificateVerificationData`](CertificateVerificationData.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L101)

#### Inherited from

[`Certificate`](Certificate.md).[`verificationData`](Certificate.md#verificationdata)

***

### version

> **version**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L97)

#### Inherited from

[`Certificate`](Certificate.md).[`version`](Certificate.md#version)
