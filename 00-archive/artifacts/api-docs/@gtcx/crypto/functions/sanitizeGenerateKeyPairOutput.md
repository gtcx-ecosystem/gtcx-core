[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / sanitizeGenerateKeyPairOutput

# Function: sanitizeGenerateKeyPairOutput()

> **sanitizeGenerateKeyPairOutput**(`output`): `Record`\<`string`, `unknown`\>

Defined in: [traced-keys.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/traced-keys.ts#L30)

Generate a new key pair (traced)

Generates a new Ed25519 or secp256k1 key pair. The operation is logged
but private keys are NEVER included in logs.

## Parameters

### output

`unknown`

## Returns

`Record`\<`string`, `unknown`\>
