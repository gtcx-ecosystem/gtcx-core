/**
 * @gtcx/security/offline
 *
 * Offline security utilities - secure storage, credential caching, tamper detection.
 * Implements P8 (Offline-First) and P9 (Security by Design).
 *
 * @packageDocumentation
 */

export * from './types';
export {
  SecureStorageBase,
  OfflineSecurityConfigSchema as SecureStorageOfflineSecurityConfigSchema,
} from './secure-storage';
export type {
  StorageBackend,
  SecureStorageState,
  UnlockResult,
  OfflineSecurityConfig as SecureStorageOfflineSecurityConfig,
} from './secure-storage';
export {
  CredentialCache,
  DEFAULT_CREDENTIAL_CACHE_CONFIG,
  CachedCredentialSchema as CredentialCacheEntrySchema,
} from './credential-cache';
export type {
  CredentialCacheConfig,
  CredentialValidation,
  CachedCredential as CredentialCacheEntry,
} from './credential-cache';
export * from './tamper-detection';
