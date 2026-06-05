[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / Token

# Interface: Token

Defined in: [03-platform/packages/security/src/auth/tokens.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L64)

## Properties

### claims

> **claims**: `object`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L66)

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

### header

> **header**: `object`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L65)

#### alg

> **alg**: `"EdDSA"` \| `"ES256K"`

#### kid?

> `optional` **kid**: `string`

#### typ

> **typ**: `"JWT"`

***

### raw

> **raw**: `string`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L68)

***

### signature

> **signature**: `string`

Defined in: [03-platform/packages/security/src/auth/tokens.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/tokens.ts#L67)
