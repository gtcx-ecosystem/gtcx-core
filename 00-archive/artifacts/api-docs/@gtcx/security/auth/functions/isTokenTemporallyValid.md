[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / isTokenTemporallyValid

# Function: isTokenTemporallyValid()

> **isTokenTemporallyValid**(`claims`, `clockSkewSeconds?`): `object`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L121)

Check if token claims are temporally valid (not expired, not before nbf)

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

#### sub

`string` = `...`

### clockSkewSeconds?

`number` = `60`

## Returns

`object`

### expired

> **expired**: `boolean`

### notYetValid

> **notYetValid**: `boolean`

### valid

> **valid**: `boolean`
