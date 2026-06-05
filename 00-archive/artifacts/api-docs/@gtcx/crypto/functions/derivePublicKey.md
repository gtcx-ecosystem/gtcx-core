[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / derivePublicKey

# Function: derivePublicKey()

> **derivePublicKey**(`privateKeyHex`, `algorithm?`): `string`

Defined in: [keys.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/keys.ts#L109)

Derive public key from private key.

In FIPS mode, defaults to P256.

Note: P256 keys use DER encoding (PKCS8/SPKI) — derivePublicKey is not
applicable since the public key is embedded in the DER structure. Use
generateKeyPair('P256') instead.

## Parameters

### privateKeyHex

`string`

### algorithm?

[`KeyAlgorithm`](../type-aliases/KeyAlgorithm.md)

## Returns

`string`
