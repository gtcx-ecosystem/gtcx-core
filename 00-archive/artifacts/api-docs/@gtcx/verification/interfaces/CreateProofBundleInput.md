[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / CreateProofBundleInput

# Interface: CreateProofBundleInput

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:95](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L95)

Input for creating a proof bundle

## Properties

### certificate?

> `optional` **certificate**: [`Certificate`](Certificate.md)

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L100)

***

### cryptographicProof

> **cryptographicProof**: [`CryptographicProofRef`](CryptographicProofRef.md)

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L97)

***

### locationProof?

> `optional` **locationProof**: [`LocationProofRef`](LocationProofRef.md)

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L98)

***

### photoProofs?

> `optional` **photoProofs**: [`PhotoProofRef`](PhotoProofRef.md)[]

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:99](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L99)

***

### qrCode?

> `optional` **qrCode**: [`GeneratedQRCode`](GeneratedQRCode.md)

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L101)

***

### type

> **type**: `"location"` \| `"photo"` \| `"certificate"` \| `"workflow"`

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L96)
