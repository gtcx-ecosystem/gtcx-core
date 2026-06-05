[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / JWTClaimsSchema

# Variable: JWTClaimsSchema

> `const` **JWTClaimsSchema**: `ZodObject`\<\{ `aud`: `ZodOptional`\<`ZodUnion`\<\[`ZodString`, `ZodArray`\<`ZodString`, `"many"`\>\]\>\>; `exp`: `ZodNumber`; `iat`: `ZodNumber`; `iss`: `ZodString`; `jti`: `ZodOptional`\<`ZodString`\>; `nbf`: `ZodOptional`\<`ZodNumber`\>; `sub`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `aud?`: `string` \| `string`[]; `exp`: `number`; `iat`: `number`; `iss`: `string`; `jti?`: `string`; `nbf?`: `number`; `sub`: `string`; \}, \{ `aud?`: `string` \| `string`[]; `exp`: `number`; `iat`: `number`; `iss`: `string`; `jti?`: `string`; `nbf?`: `number`; `sub`: `string`; \}\>

Defined in: [03-platform/packages/security/03-platform/src/auth/tokens.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/tokens.ts#L32)

Standard JWT claims
