[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / GTCXTokenClaimsSchema

# Variable: GTCXTokenClaimsSchema

> `const` **GTCXTokenClaimsSchema**: `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `aud?`: `string` \| `string`[]; `exp`: `number`; `iat`: `number`; `iss`: `string`; `jti?`: `string`; `nbf?`: `number`; `offline?`: `boolean`; `offlineExpiry?`: `number`; `permissions?`: `string`[]; `roles?`: `string`[]; `sub`: `string`; `tier?`: `"UNVERIFIED"` \| `"BASIC"` \| `"STANDARD"` \| `"PREMIUM"` \| `"SOVEREIGN"`; `tradePassId?`: `string`; \}, \{ `aud?`: `string` \| `string`[]; `exp`: `number`; `iat`: `number`; `iss`: `string`; `jti?`: `string`; `nbf?`: `number`; `offline?`: `boolean`; `offlineExpiry?`: `number`; `permissions?`: `string`[]; `roles?`: `string`[]; `sub`: `string`; `tier?`: `"UNVERIFIED"` \| `"BASIC"` \| `"STANDARD"` \| `"PREMIUM"` \| `"SOVEREIGN"`; `tradePassId?`: `string`; \}\>

Defined in: [03-platform/packages/security/03-platform/src/auth/tokens.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/tokens.ts#L46)

GTCX-specific token claims
