[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / verifyCanonicalSignature

# Function: verifyCanonicalSignature()

> **verifyCanonicalSignature**(`method`, `url`, `headers`, `body`, `publicKeyHex`, `options?`): [`VerificationResult`](../interfaces/VerificationResult.md)

Defined in: [03-platform/packages/api-client/src/canonical/verify.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/verify.ts#L35)

Verify a canonical request signature.

## Parameters

### method

`string`

HTTP method

### url

`string`

Full request URL

### headers

`Record`\<`string`, `string`\>

All request headers (case-insensitive keys OK)

### body

Request body (or null)

`string` | `Uint8Array`\<`ArrayBufferLike`\> | `null`

### publicKeyHex

`string`

Public key that signed the request

### options?

[`CanonicalizationOptions`](../interfaces/CanonicalizationOptions.md)

Canonicalization options

## Returns

[`VerificationResult`](../interfaces/VerificationResult.md)
