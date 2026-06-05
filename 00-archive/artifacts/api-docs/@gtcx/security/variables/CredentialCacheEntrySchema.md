[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / CredentialCacheEntrySchema

# Variable: CredentialCacheEntrySchema

> `const` **CredentialCacheEntrySchema**: `ZodObject`\<\{ `dataHash`: `ZodString`; `expiresAt`: `ZodString`; `holderId`: `ZodString`; `holderPublicKey`: `ZodString`; `id`: `ZodString`; `issuedAt`: `ZodString`; `lastRevocationCheckAt`: `ZodString`; `offlineExpiresAt`: `ZodString`; `revocationListHash`: `ZodOptional`\<`ZodString`\>; `signatureChain`: `ZodArray`\<`ZodObject`\<\{ `signature`: `ZodString`; `signedAt`: `ZodString`; `signerPublicKey`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `signature`: `string`; `signedAt`: `string`; `signerPublicKey`: `string`; \}, \{ `signature`: `string`; `signedAt`: `string`; `signerPublicKey`: `string`; \}\>, `"many"`\>; `syncedAt`: `ZodString`; `syncRequired`: `ZodDefault`\<`ZodBoolean`\>; `type`: `ZodEnum`\<\[`"TRADEPASS"`, `"SESSION"`, `"TOKEN"`, `"CERTIFICATE"`\]\>; \}, `"strip"`, `ZodTypeAny`, \{ `dataHash`: `string`; `expiresAt`: `string`; `holderId`: `string`; `holderPublicKey`: `string`; `id`: `string`; `issuedAt`: `string`; `lastRevocationCheckAt`: `string`; `offlineExpiresAt`: `string`; `revocationListHash?`: `string`; `signatureChain`: `object`[]; `syncedAt`: `string`; `syncRequired`: `boolean`; `type`: `"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"`; \}, \{ `dataHash`: `string`; `expiresAt`: `string`; `holderId`: `string`; `holderPublicKey`: `string`; `id`: `string`; `issuedAt`: `string`; `lastRevocationCheckAt`: `string`; `offlineExpiresAt`: `string`; `revocationListHash?`: `string`; `signatureChain`: `object`[]; `syncedAt`: `string`; `syncRequired?`: `boolean`; `type`: `"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"`; \}\>

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L19)

Cached credential for offline use
