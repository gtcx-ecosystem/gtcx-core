[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / verifyTokenSignature

# Function: verifyTokenSignature()

> **verifyTokenSignature**(`token`, `publicKeyHex`, `options?`): [`TokenValidationResult`](../interfaces/TokenValidationResult.md)

Defined in: [03-platform/packages/security/03-platform/src/auth/tokens.ts:235](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/tokens.ts#L235)

Verify a token's cryptographic signature and temporal validity.

GTCX tokens use hex-encoded Ed25519 signatures in the third JWT segment,
NOT the standard base64url encoding. This means GTCX tokens are NOT
interoperable with standard JWT libraries (e.g., `jsonwebtoken`, `jose`).
Use `assembleToken()` to create tokens and this function to verify them.

## Parameters

### token

`string`

The full JWT string (header.claims.signature) where signature is hex-encoded

### publicKeyHex

`string`

Hex-encoded Ed25519 public key of the issuer

### options?

#### clockSkewSeconds?

`number`

#### expectedAudience?

`string`

#### expectedIssuer?

`string`

## Returns

[`TokenValidationResult`](../interfaces/TokenValidationResult.md)
