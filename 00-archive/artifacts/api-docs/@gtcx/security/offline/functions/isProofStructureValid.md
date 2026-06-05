[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / isProofStructureValid

# Function: isProofStructureValid()

> **isProofStructureValid**(`proof`): `proof is { createdAt: string; dataHash: string; dataId: string; dataType: string; hashAlgorithm: "SHA-256"; lastVerifiedAt: string; signatureChain: { hash: string; signature: string; signedAt: string; signerKeyId: string }[]; trustedRootKeyId: string }`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L94)

Check if integrity proof structure is valid

## Parameters

### proof

`unknown`

## Returns

`proof is { createdAt: string; dataHash: string; dataId: string; dataType: string; hashAlgorithm: "SHA-256"; lastVerifiedAt: string; signatureChain: { hash: string; signature: string; signedAt: string; signerKeyId: string }[]; trustedRootKeyId: string }`
