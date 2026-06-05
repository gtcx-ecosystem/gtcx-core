[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / UnlockResult

# Interface: UnlockResult

Defined in: [03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts#L27)

## Properties

### error?

> `optional` **error**: `"INVALID_SECRET"` \| `"LOCKED_OUT"` \| `"CORRUPTED"`

Defined in: [03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts#L29)

***

### lockoutExpiresAt?

> `optional` **lockoutExpiresAt**: `Date`

Defined in: [03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts#L31)

***

### remainingAttempts?

> `optional` **remainingAttempts**: `number`

Defined in: [03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts#L30)

***

### success

> **success**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/offline/secure-storage/types.ts#L28)
