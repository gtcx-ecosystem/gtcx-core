[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / checkProofStructure

# Function: checkProofStructure()

> **checkProofStructure**(`proof`): [`TamperCheckResult`](../interfaces/TamperCheckResult.md)

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:107](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L107)

Basic tamper check (structure only)
Full verification requires @gtcx/crypto for signature verification

## Parameters

### proof

#### createdAt

`string` = `...`

#### dataHash

`string` = `...`

#### dataId

`string` = `...`

#### dataType

`string` = `...`

#### hashAlgorithm

`"SHA-256"` = `...`

#### lastVerifiedAt

`string` = `...`

#### signatureChain

`object`[] = `...`

#### trustedRootKeyId

`string` = `...`

## Returns

[`TamperCheckResult`](../interfaces/TamperCheckResult.md)
