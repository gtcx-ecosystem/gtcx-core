[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / CachedCredentialSchema

# Variable: CachedCredentialSchema

> `const` **CachedCredentialSchema**: `ZodObject`\<\{ `cachedAt`: `ZodNumber`; `data`: `ZodUnknown`; `dataHash`: `ZodString`; `expiresAt`: `ZodNumber`; `id`: `ZodString`; `lastUsedAt`: `ZodNumber`; `needsSync`: `ZodBoolean`; `signatureChain`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `cachedAt`: `number`; `data?`: `unknown`; `dataHash`: `string`; `expiresAt`: `number`; `id`: `string`; `lastUsedAt`: `number`; `needsSync`: `boolean`; `signatureChain`: `string`[]; \}, \{ `cachedAt`: `number`; `data?`: `unknown`; `dataHash`: `string`; `expiresAt`: `number`; `id`: `string`; `lastUsedAt`: `number`; `needsSync`: `boolean`; `signatureChain`: `string`[]; \}\>

Defined in: [03-platform/packages/security/src/offline/types.ts:132](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/types.ts#L132)

Cached credential schema
