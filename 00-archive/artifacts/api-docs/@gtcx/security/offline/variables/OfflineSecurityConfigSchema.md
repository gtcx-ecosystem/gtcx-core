[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / OfflineSecurityConfigSchema

# Variable: OfflineSecurityConfigSchema

> `const` **OfflineSecurityConfigSchema**: `ZodObject`\<\{ `argon2Iterations`: `ZodDefault`\<`ZodNumber`\>; `argon2Memory`: `ZodDefault`\<`ZodNumber`\>; `credentialRefreshBuffer`: `ZodDefault`\<`ZodNumber`\>; `integrityCheckInterval`: `ZodDefault`\<`ZodNumber`\>; `keyDerivation`: `ZodLiteral`\<`"ARGON2ID"`\>; `maxFailedAttempts`: `ZodDefault`\<`ZodNumber`\>; `maxOfflineHours`: `ZodDefault`\<`ZodNumber`\>; `storageEncryption`: `ZodLiteral`\<`"AES-256-GCM"`\>; `wipeOnExceed`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `argon2Iterations`: `number`; `argon2Memory`: `number`; `credentialRefreshBuffer`: `number`; `integrityCheckInterval`: `number`; `keyDerivation`: `"ARGON2ID"`; `maxFailedAttempts`: `number`; `maxOfflineHours`: `number`; `storageEncryption`: `"AES-256-GCM"`; `wipeOnExceed`: `boolean`; \}, \{ `argon2Iterations?`: `number`; `argon2Memory?`: `number`; `credentialRefreshBuffer?`: `number`; `integrityCheckInterval?`: `number`; `keyDerivation`: `"ARGON2ID"`; `maxFailedAttempts?`: `number`; `maxOfflineHours?`: `number`; `storageEncryption`: `"AES-256-GCM"`; `wipeOnExceed?`: `boolean`; \}\>

Defined in: [03-platform/packages/security/03-platform/src/offline/types.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/types.ts#L18)

Offline security configuration schema
