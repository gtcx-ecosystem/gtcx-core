[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / decodeToken

# Function: decodeToken()

> **decodeToken**(`token`): [`Token`](../interfaces/Token.md) \| `null`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:87](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L87)

Decode a JWT without verifying signature
Use this only for inspection - always verify before trusting!

## Parameters

### token

`string`

## Returns

[`Token`](../interfaces/Token.md) \| `null`
