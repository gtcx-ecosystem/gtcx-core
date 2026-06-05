[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / createIntegrityProofStructure

# Function: createIntegrityProofStructure()

> **createIntegrityProofStructure**(`dataId`, `dataType`, `dataHash`, `trustedRootKeyId`): `Omit`\<[`IntegrityProof`](../type-aliases/IntegrityProof.md), `"signatureChain"`\>

Defined in: [03-platform/packages/security/03-platform/src/offline/tamper-detection.ts:73](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/tamper-detection.ts#L73)

Create integrity proof structure
NOTE: Actual hashing/signing should use @gtcx/crypto

## Parameters

### dataId

`string`

### dataType

`string`

### dataHash

`string`

### trustedRootKeyId

`string`

## Returns

`Omit`\<[`IntegrityProof`](../type-aliases/IntegrityProof.md), `"signatureChain"`\>
