[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / verify

# Function: verify()

> **verify**(`message`, `signatureHex`, `publicKeyHex`, `options?`): `boolean`

Defined in: [signing.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/signing.ts#L108)

Verify a signature.

In FIPS mode with P256 keys, routes through node:crypto.

## Parameters

### message

`string` | `Uint8Array`\<`ArrayBufferLike`\>

### signatureHex

`string`

### publicKeyHex

`string`

### options?

Optional: `{ algorithm: 'P256' }` to force FIPS backend

#### algorithm?

`"Ed25519"` \| `"P256"`

## Returns

`boolean`
