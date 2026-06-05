[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / TokenValidationResult

# Interface: TokenValidationResult

Defined in: [03-platform/packages/security/src/auth/tokens.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L71)

## Properties

### claims?

> `optional` **claims**: `object`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L75)

#### aud?

> `optional` **aud**: `string` \| `string`[]

#### exp

> **exp**: `number`

#### iat

> **iat**: `number`

#### iss

> **iss**: `string`

#### jti?

> `optional` **jti**: `string`

#### nbf?

> `optional` **nbf**: `number`

#### offline?

> `optional` **offline**: `boolean`

#### offlineExpiry?

> `optional` **offlineExpiry**: `number`

#### permissions?

> `optional` **permissions**: `string`[]

#### roles?

> `optional` **roles**: `string`[]

#### sub

> **sub**: `string`

#### tier?

> `optional` **tier**: `"UNVERIFIED"` \| `"BASIC"` \| `"STANDARD"` \| `"PREMIUM"` \| `"SOVEREIGN"`

#### tradePassId?

> `optional` **tradePassId**: `string`

***

### error?

> `optional` **error**: `string`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L76)

***

### expired

> **expired**: `boolean`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:73](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L73)

***

### notYetValid

> **notYetValid**: `boolean`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L74)

***

### valid

> **valid**: `boolean`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L72)
