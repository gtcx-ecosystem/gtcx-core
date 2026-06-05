[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / Pbkdf2Params

# Interface: Pbkdf2Params

Defined in: [key-derivation.ts:8](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L8)

## Properties

### iterations

> **iterations**: `number`

Defined in: [key-derivation.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L14)

Iteration count. Mobile PIN-hashing uses 100_000.

***

### keyLengthBits?

> `optional` **keyLengthBits**: `number`

Defined in: [key-derivation.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L16)

Output length in bits. Defaults to 256. Must be a positive multiple of 8.

***

### password

> **password**: `string`

Defined in: [key-derivation.ts:10](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L10)

Arbitrary string input. May be low-entropy (e.g. a 6-digit PIN).

***

### salt

> **salt**: `string`

Defined in: [key-derivation.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/key-derivation.ts#L12)

Caller-provided salt. Should be unique per derivation.
