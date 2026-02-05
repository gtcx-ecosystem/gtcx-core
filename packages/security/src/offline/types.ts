/**
 * @gtcx/security - Offline Security Types
 *
 * Type definitions for P8-compliant offline security.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Offline security configuration schema
 */
export const OfflineSecurityConfigSchema = z.object({
  /**
   * Maximum hours credentials are valid offline
   * @default 72
   */
  maxOfflineHours: z.number().min(1).max(168).default(72),

  /**
   * Hours before expiry to prompt credential refresh
   * @default 24
   */
  credentialRefreshBuffer: z.number().min(1).default(24),

  /**
   * Symmetric encryption algorithm for local storage
   */
  storageEncryption: z.literal('AES-256-GCM'),

  /**
   * Key derivation function
   */
  keyDerivation: z.literal('ARGON2ID'),

  /**
   * Argon2id memory parameter (KB)
   * @default 65536 (64MB)
   */
  argon2Memory: z.number().min(16384).default(65536),

  /**
   * Argon2id iterations
   * @default 3
   */
  argon2Iterations: z.number().min(1).default(3),

  /**
   * Minutes between integrity checks
   * @default 15
   */
  integrityCheckInterval: z.number().min(1).default(15),

  /**
   * Maximum failed unlock attempts before wipe
   * @default 10
   */
  maxFailedAttempts: z.number().min(3).default(10),

  /**
   * Whether to wipe data after max failures
   * @default true
   */
  wipeOnExceed: z.boolean().default(true),
});

export type OfflineSecurityConfig = z.infer<typeof OfflineSecurityConfigSchema>;

/**
 * Default offline security configuration
 */
export const DEFAULT_OFFLINE_CONFIG: OfflineSecurityConfig = {
  maxOfflineHours: 72,
  credentialRefreshBuffer: 24,
  storageEncryption: 'AES-256-GCM',
  keyDerivation: 'ARGON2ID',
  argon2Memory: 65536,
  argon2Iterations: 3,
  integrityCheckInterval: 15,
  maxFailedAttempts: 10,
  wipeOnExceed: true,
};

// =============================================================================
// SECURE STORAGE
// =============================================================================

/**
 * Stored item metadata
 */
export interface StoredItemMeta {
  key: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  version: number;
}

/**
 * Encrypted storage item
 */
export interface EncryptedItem {
  ciphertext: string; // Base64-encoded encrypted data
  iv: string; // Base64-encoded initialization vector
  tag: string; // Base64-encoded authentication tag
  meta: StoredItemMeta;
}

/**
 * Storage status
 */
export interface StorageStatus {
  isUnlocked: boolean;
  itemCount: number;
  failedAttempts: number;
  lastUnlockAt?: number;
  lastActivityAt?: number;
}

// =============================================================================
// CREDENTIAL CACHE
// =============================================================================

/**
 * Cached credential schema
 */
export const CachedCredentialSchema = z.object({
  id: z.string(),
  data: z.unknown(),

  // Timing
  cachedAt: z.number(),
  expiresAt: z.number(),
  lastUsedAt: z.number(),

  // Integrity
  dataHash: z.string(),
  signatureChain: z.array(z.string()),

  // Status
  needsSync: z.boolean(),
});

export type CachedCredential = z.infer<typeof CachedCredentialSchema>;

/**
 * Credential cache status
 */
export interface CacheStatus {
  valid: boolean;
  expiresIn: number; // Milliseconds
  needsRefresh: boolean; // Within refresh buffer
  needsSync: boolean; // Needs server sync
  reason?: CacheInvalidReason;
}

export type CacheInvalidReason = 'NOT_FOUND' | 'EXPIRED' | 'TAMPERED' | 'CHAIN_BROKEN' | 'REVOKED';

// =============================================================================
// INTEGRITY
// =============================================================================

// IntegrityProofSchema and IntegrityProof are defined in tamper-detection.ts

/**
 * Integrity verification result
 */
export interface IntegrityResult {
  valid: boolean;
  reason?: IntegrityFailureReason;
  verifiedAt: number;
}

export type IntegrityFailureReason =
  | 'DATA_MODIFIED'
  | 'CHAIN_BROKEN'
  | 'SIGNATURE_INVALID'
  | 'ROOT_KEY_UNKNOWN'
  | 'TIMESTAMP_EXPIRED';

// =============================================================================
// OFFLINE EVENTS
// =============================================================================

/**
 * Offline operation types for audit
 */
export type OfflineOperationType =
  | 'STORAGE_UNLOCK'
  | 'STORAGE_LOCK'
  | 'STORAGE_WIPE'
  | 'CREDENTIAL_CACHE'
  | 'CREDENTIAL_USE'
  | 'CREDENTIAL_EXPIRE'
  | 'INTEGRITY_CHECK'
  | 'INTEGRITY_FAIL'
  | 'SYNC_START'
  | 'SYNC_COMPLETE'
  | 'SYNC_FAIL';

/**
 * Offline operation record
 */
export interface OfflineOperation {
  type: OfflineOperationType;
  timestamp: number;
  success: boolean;
  metadata?: Record<string, unknown>;
}
