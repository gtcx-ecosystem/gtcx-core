[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / isTokenValidOffline

# Function: isTokenValidOffline()

> **isTokenValidOffline**(`claims`, `maxOfflineHours?`): `boolean`

Defined in: [03-platform/packages/security/03-platform/src/auth/tokens.ts:143](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/tokens.ts#L143)

Check if token is valid for offline use

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

### maxOfflineHours?

`number` = `72`

## Returns

`boolean`
