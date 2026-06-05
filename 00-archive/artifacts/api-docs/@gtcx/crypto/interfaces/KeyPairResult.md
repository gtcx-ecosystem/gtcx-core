[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / KeyPairResult

# Interface: KeyPairResult

Defined in: [keys.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/keys.ts#L25)

Result of key pair generation.

WARNING: `privateKey` is a hex-encoded string. JavaScript strings are immutable
and cannot be securely wiped from memory. Callers MUST:
1. Never pass `KeyPairResult` to `JSON.stringify()` or logging functions
2. Transfer the private key to secure storage immediately
3. Use `@gtcx/identity` which wraps private keys as non-enumerable properties

## Properties

### algorithm

> **algorithm**: [`KeyAlgorithm`](../type-aliases/KeyAlgorithm.md)

Defined in: [keys.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/keys.ts#L28)

***

### privateKey

> **privateKey**: `string`

Defined in: [keys.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/keys.ts#L27)

***

### publicKey

> **publicKey**: `string`

Defined in: [keys.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/keys.ts#L26)
