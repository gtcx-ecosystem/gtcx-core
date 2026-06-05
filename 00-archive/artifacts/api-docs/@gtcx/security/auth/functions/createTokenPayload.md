[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / createTokenPayload

# Function: createTokenPayload()

> **createTokenPayload**(`claims`, `options?`): `string`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:167](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L167)

Create unsigned token payload (for signing with @gtcx/crypto)

## Parameters

### claims

#### aud?

`string` \| `string`[] = `...`

#### exp

`number` = `...`

#### iat

`number` = `...`

#### iss

`string` = `...`

#### jti?

`string` = `...`

#### nbf?

`number` = `...`

#### offline?

`boolean` = `...`

#### offlineExpiry?

`number` = `...`

#### permissions?

`string`[] = `...`

#### roles?

`string`[] = `...`

#### sub

`string` = `...`

#### tier?

`"UNVERIFIED"` \| `"BASIC"` \| `"STANDARD"` \| `"PREMIUM"` \| `"SOVEREIGN"` = `...`

#### tradePassId?

`string` = `...`

### options?

[`TokenOptions`](../interfaces/TokenOptions.md) = `{}`

## Returns

`string`
