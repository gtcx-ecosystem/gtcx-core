[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / JWTHeaderSchema

# Variable: JWTHeaderSchema

> `const` **JWTHeaderSchema**: `ZodObject`\<\{ `alg`: `ZodEnum`\<\[`"EdDSA"`, `"ES256K"`\]\>; `kid`: `ZodOptional`\<`ZodString`\>; `typ`: `ZodLiteral`\<`"JWT"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `alg`: `"EdDSA"` \| `"ES256K"`; `kid?`: `string`; `typ`: `"JWT"`; \}, \{ `alg`: `"EdDSA"` \| `"ES256K"`; `kid?`: `string`; `typ`: `"JWT"`; \}\>

Defined in: [03-platform/packages/security/03-platform/src/auth/tokens.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/tokens.ts#L23)

JWT Header schema
