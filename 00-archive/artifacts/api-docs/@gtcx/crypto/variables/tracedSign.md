[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / tracedSign

# Variable: tracedSign()

> `const` **tracedSign**: (...`args`) => `string`

Defined in: [traced.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/traced.ts#L47)

Sign a message with Ed25519 (traced)

Traced version of sign() that logs operation details for debugging
and AI analysis. Does NOT log the private key or full message content.
For complex objects, prefer using sanitizeSecrets() from @gtcx/security
in the sanitizeInput/sanitizeOutput callbacks.

Signature matches the underlying `sign(message, privateKeyHex)` from
`@gtcx/crypto`. Returns the signature in hex format.

## Parameters

### args

...\[`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `string`\]

## Returns

`string`
