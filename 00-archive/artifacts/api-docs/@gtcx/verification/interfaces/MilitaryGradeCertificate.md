[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / MilitaryGradeCertificate

# Interface: MilitaryGradeCertificate

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L117)

Military-grade certificate (multi-signature, post-quantum)

## Extends

- [`Certificate`](Certificate.md)

## Properties

### certificateData

> **certificateData**: `object`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L121)

#### assetLotData?

> `optional` **assetLotData**: [`AssetLotData`](AssetLotData.md)

#### claims?

> `optional` **claims**: [`Claim`](Claim.md)[]

Claims associated with this certificate

#### complianceData?

> `optional` **complianceData**: [`ComplianceData`](ComplianceData.md)

#### custodyData?

> `optional` **custodyData**: [`CustodyEntry`](CustodyEntry.md)

#### ~~goldLotData?~~

> `optional` **goldLotData**: [`GoldLotData`](GoldLotData.md)

##### Deprecated

Use assetLotData

#### photoEvidence?

> `optional` **photoEvidence**: [`PhotoEvidenceRef`](PhotoEvidenceRef.md)[]

#### photoHash?

> `optional` **photoHash**: `string`

#### settlementData?

> `optional` **settlementData**: [`SettlementRecord`](SettlementRecord.md)

#### workflowContext?

> `optional` **workflowContext**: `string`

***

### certificateId

> **certificateId**: `string`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L96)

#### Inherited from

[`Certificate`](Certificate.md).[`certificateId`](Certificate.md#certificateid)

***

### createdAt

> **createdAt**: `number`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L102)

#### Inherited from

[`Certificate`](Certificate.md).[`createdAt`](Certificate.md#createdat)

***

### metadata

> **metadata**: [`CertificateMetadata`](CertificateMetadata.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L100)

#### Inherited from

[`Certificate`](Certificate.md).[`metadata`](Certificate.md#metadata)

***

### multiSignature

> **multiSignature**: [`MultiSignature`](MultiSignature.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:120](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L120)

***

### postQuantumHash

> **postQuantumHash**: `string`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L119)

***

### securityLevel

> **securityLevel**: `"military"` \| `"post-quantum"`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:118](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L118)

#### Overrides

[`Certificate`](Certificate.md).[`securityLevel`](Certificate.md#securitylevel)

***

### type

> **type**: [`CertificateType`](../type-aliases/CertificateType.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L98)

#### Inherited from

[`Certificate`](Certificate.md).[`type`](Certificate.md#type)

***

### verificationData

> **verificationData**: [`CertificateVerificationData`](CertificateVerificationData.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L101)

#### Inherited from

[`Certificate`](Certificate.md).[`verificationData`](Certificate.md#verificationdata)

***

### version

> **version**: `string`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/certificates.ts#L97)

#### Inherited from

[`Certificate`](Certificate.md).[`version`](Certificate.md#version)
