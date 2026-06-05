[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / ProofBundle

# Interface: ProofBundle

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L11)

Bundled proof combining multiple verification elements

## Properties

### certificate?

> `optional` **certificate**: [`Certificate`](Certificate.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L20)

***

### claims?

> `optional` **claims**: [`Claim`](Claim.md)[]

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L23)

Claims included in this bundle

***

### id

> **id**: `string`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L12)

***

### proofs

> **proofs**: `object`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L15)

#### cryptographicProof

> **cryptographicProof**: [`CryptographicProofRef`](CryptographicProofRef.md)

#### locationProof?

> `optional` **locationProof**: [`LocationProofRef`](LocationProofRef.md)

#### photoProofs?

> `optional` **photoProofs**: [`PhotoProofRef`](PhotoProofRef.md)[]

***

### qrCode?

> `optional` **qrCode**: [`GeneratedQRCode`](GeneratedQRCode.md)

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L21)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L14)

***

### type

> **type**: `"location"` \| `"photo"` \| `"certificate"` \| `"workflow"`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/proofs.ts#L13)
