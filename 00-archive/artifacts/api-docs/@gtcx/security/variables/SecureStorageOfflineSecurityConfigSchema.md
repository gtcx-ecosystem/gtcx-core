[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / SecureStorageOfflineSecurityConfigSchema

# Variable: SecureStorageOfflineSecurityConfigSchema

> `const` **SecureStorageOfflineSecurityConfigSchema**: `ZodObject`\<\{ `argon2Iterations`: `ZodDefault`\<`ZodNumber`\>; `argon2Memory`: `ZodDefault`\<`ZodNumber`\>; `argon2Parallelism`: `ZodDefault`\<`ZodNumber`\>; `credentialRefreshBufferHours`: `ZodDefault`\<`ZodNumber`\>; `integrityCheckIntervalMinutes`: `ZodDefault`\<`ZodNumber`\>; `keyDerivation`: `ZodDefault`\<`ZodLiteral`\<`"ARGON2ID"`\>\>; `lockoutDurationSeconds`: `ZodDefault`\<`ZodNumber`\>; `maxFailedAttempts`: `ZodDefault`\<`ZodNumber`\>; `maxOfflineHours`: `ZodDefault`\<`ZodNumber`\>; `storageEncryption`: `ZodDefault`\<`ZodLiteral`\<`"AES-256-GCM"`\>\>; `wipeOnExceed`: `ZodDefault`\<`ZodBoolean`\>; \}, `"strip"`, `ZodTypeAny`, \{ `argon2Iterations`: `number`; `argon2Memory`: `number`; `argon2Parallelism`: `number`; `credentialRefreshBufferHours`: `number`; `integrityCheckIntervalMinutes`: `number`; `keyDerivation`: `"ARGON2ID"`; `lockoutDurationSeconds`: `number`; `maxFailedAttempts`: `number`; `maxOfflineHours`: `number`; `storageEncryption`: `"AES-256-GCM"`; `wipeOnExceed`: `boolean`; \}, \{ `argon2Iterations?`: `number`; `argon2Memory?`: `number`; `argon2Parallelism?`: `number`; `credentialRefreshBufferHours?`: `number`; `integrityCheckIntervalMinutes?`: `number`; `keyDerivation?`: `"ARGON2ID"`; `lockoutDurationSeconds?`: `number`; `maxFailedAttempts?`: `number`; `maxOfflineHours?`: `number`; `storageEncryption?`: `"AES-256-GCM"`; `wipeOnExceed?`: `boolean`; \}\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/config.ts:7](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/config.ts#L7)
