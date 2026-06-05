[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / sign

# Function: sign()

> **sign**(`message`, `privateKeyHex`, `options?`): `string`

Defined in: [signing.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/signing.ts#L45)

Sign a message.

In FIPS mode with P256 keys (DER-encoded), routes through node:crypto
which delegates to the OpenSSL FIPS provider. Otherwise uses Ed25519
via native bindings or noble-curves.

## Parameters

### message

The message to sign

`string` | `Uint8Array`\<`ArrayBufferLike`\>

### privateKeyHex

`string`

Hex-encoded private key (raw Ed25519 or DER P256)

### options?

Optional: `{ algorithm: 'P256' }` to force FIPS backend

#### algorithm?

`"Ed25519"` \| `"P256"`

## Returns

`string`
