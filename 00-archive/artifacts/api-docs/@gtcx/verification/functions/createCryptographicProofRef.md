[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createCryptographicProofRef

# Function: createCryptographicProofRef()

> **createCryptographicProofRef**(`dataHash`, `signature`, `publicKey`, `algorithm?`): [`CryptographicProofRef`](../interfaces/CryptographicProofRef.md)

Defined in: [03-platform/packages/verification/03-platform/src/proofs/bundler.ts:78](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/proofs/bundler.ts#L78)

Create a cryptographic proof reference

## Parameters

### dataHash

`string`

### signature

`string`

### publicKey

`string`

### algorithm?

`string` = `'Ed25519-SHA256'`

## Returns

[`CryptographicProofRef`](../interfaces/CryptographicProofRef.md)
