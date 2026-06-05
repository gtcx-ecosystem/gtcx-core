[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / assembleToken

# Function: assembleToken()

> **assembleToken**(`payload`, `signature`): `string`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:208](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L208)

Assemble token from payload and signature.

## Parameters

### payload

`string`

The base64url-encoded header.claims string

### signature

Raw signature bytes, a hex-encoded signature string,
  or a legacy base64url-encoded signature string.

`string` | `Uint8Array`\<`ArrayBufferLike`\>

## Returns

`string`
