[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / generateKeyPair

# Function: generateKeyPair()

> **generateKeyPair**(`algorithm?`): [`KeyPairResult`](../interfaces/KeyPairResult.md)

Defined in: [keys.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/keys.ts#L45)

Generate a new key pair.

In FIPS mode (`GTCX_FIPS_MODE=true`), defaults to Secp256k1 (FIPS 186-4).
Ed25519 is still available but triggers a FIPS compliance warning.

## Parameters

### algorithm?

[`KeyAlgorithm`](../type-aliases/KeyAlgorithm.md)

'Ed25519' or 'Secp256k1'. Defaults to Secp256k1 in FIPS mode, Ed25519 otherwise.

## Returns

[`KeyPairResult`](../interfaces/KeyPairResult.md)
