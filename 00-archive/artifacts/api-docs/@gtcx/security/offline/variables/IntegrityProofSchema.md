[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / IntegrityProofSchema

# Variable: IntegrityProofSchema

> `const` **IntegrityProofSchema**: `ZodObject`\<\{ `createdAt`: `ZodString`; `dataHash`: `ZodString`; `dataId`: `ZodString`; `dataType`: `ZodString`; `hashAlgorithm`: `ZodDefault`\<`ZodLiteral`\<`"SHA-256"`\>\>; `lastVerifiedAt`: `ZodString`; `signatureChain`: `ZodArray`\<`ZodObject`\<\{ `hash`: `ZodString`; `signature`: `ZodString`; `signedAt`: `ZodString`; `signerKeyId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `hash`: `string`; `signature`: `string`; `signedAt`: `string`; `signerKeyId`: `string`; \}, \{ `hash`: `string`; `signature`: `string`; `signedAt`: `string`; `signerKeyId`: `string`; \}\>, `"many"`\>; `trustedRootKeyId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `createdAt`: `string`; `dataHash`: `string`; `dataId`: `string`; `dataType`: `string`; `hashAlgorithm`: `"SHA-256"`; `lastVerifiedAt`: `string`; `signatureChain`: `object`[]; `trustedRootKeyId`: `string`; \}, \{ `createdAt`: `string`; `dataHash`: `string`; `dataId`: `string`; `dataType`: `string`; `hashAlgorithm?`: `"SHA-256"`; `lastVerifiedAt`: `string`; `signatureChain`: `object`[]; `trustedRootKeyId`: `string`; \}\>

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L19)

Integrity proof for tamper detection
