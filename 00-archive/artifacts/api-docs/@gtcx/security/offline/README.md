[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / offline

# offline

@gtcx/security/offline

Offline security utilities - secure storage, credential caching, tamper detection.
Implements P8 (Offline-First) and P9 (Security by Design).

## Interfaces

- [CacheStatus](interfaces/CacheStatus.md)
- [EncryptedItem](interfaces/EncryptedItem.md)
- [IntegrityResult](interfaces/IntegrityResult.md)
- [OfflineOperation](interfaces/OfflineOperation.md)
- [StorageStatus](interfaces/StorageStatus.md)
- [StoredItemMeta](interfaces/StoredItemMeta.md)
- [TamperCheckResult](interfaces/TamperCheckResult.md)
- [TamperDetectionEvent](interfaces/TamperDetectionEvent.md)

## Type Aliases

- [CachedCredential](type-aliases/CachedCredential.md)
- [CacheInvalidReason](type-aliases/CacheInvalidReason.md)
- [IntegrityFailureReason](type-aliases/IntegrityFailureReason.md)
- [IntegrityProof](type-aliases/IntegrityProof.md)
- [OfflineOperationType](type-aliases/OfflineOperationType.md)
- [OfflineSecurityConfig](type-aliases/OfflineSecurityConfig.md)

## Variables

- [CachedCredentialSchema](variables/CachedCredentialSchema.md)
- [DEFAULT\_OFFLINE\_CONFIG](variables/DEFAULT_OFFLINE_CONFIG.md)
- [IntegrityProofSchema](variables/IntegrityProofSchema.md)
- [OfflineSecurityConfigSchema](variables/OfflineSecurityConfigSchema.md)

## Functions

- [checkProofStructure](functions/checkProofStructure.md)
- [createIntegrityProofStructure](functions/createIntegrityProofStructure.md)
- [createTamperDetectionEvent](functions/createTamperDetectionEvent.md)
- [hashesMatch](functions/hashesMatch.md)
- [isProofStructureValid](functions/isProofStructureValid.md)
- [secureCompare](functions/secureCompare.md)

## References

### CredentialCache

Re-exports [CredentialCache](../classes/CredentialCache.md)

***

### CredentialCacheConfig

Re-exports [CredentialCacheConfig](../interfaces/CredentialCacheConfig.md)

***

### CredentialCacheEntry

Re-exports [CredentialCacheEntry](../type-aliases/CredentialCacheEntry.md)

***

### CredentialCacheEntrySchema

Re-exports [CredentialCacheEntrySchema](../variables/CredentialCacheEntrySchema.md)

***

### CredentialValidation

Re-exports [CredentialValidation](../interfaces/CredentialValidation.md)

***

### DEFAULT\_CREDENTIAL\_CACHE\_CONFIG

Re-exports [DEFAULT_CREDENTIAL_CACHE_CONFIG](../variables/DEFAULT_CREDENTIAL_CACHE_CONFIG.md)

***

### SecureStorageBase

Re-exports [SecureStorageBase](../classes/SecureStorageBase.md)

***

### SecureStorageOfflineSecurityConfig

Re-exports [SecureStorageOfflineSecurityConfig](../type-aliases/SecureStorageOfflineSecurityConfig.md)

***

### SecureStorageOfflineSecurityConfigSchema

Re-exports [SecureStorageOfflineSecurityConfigSchema](../variables/SecureStorageOfflineSecurityConfigSchema.md)

***

### SecureStorageState

Re-exports [SecureStorageState](../interfaces/SecureStorageState.md)

***

### StorageBackend

Re-exports [StorageBackend](../interfaces/StorageBackend.md)

***

### UnlockResult

Re-exports [UnlockResult](../interfaces/UnlockResult.md)
