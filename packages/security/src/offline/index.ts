/**
 * @gtcx/security/offline
 *
 * Offline security utilities - secure storage, credential caching, tamper detection.
 * Implements P8 (Offline-First) and P9 (Security by Design).
 *
 * @packageDocumentation
 */

export * from './types';
export { SecureStorageBase } from './secure-storage';
export type { StorageBackend, SecureStorageState, UnlockResult } from './secure-storage';
export { CredentialCache, DEFAULT_CREDENTIAL_CACHE_CONFIG } from './credential-cache';
export type { CredentialCacheConfig, CredentialValidation } from './credential-cache';
export * from './tamper-detection';
