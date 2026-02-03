/**
 * @gtcx/security - Credential Cache
 *
 * Cache credentials for offline authentication.
 * Implements P8 (Offline-First) principle.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// =============================================================================
// CACHED CREDENTIAL SCHEMA
// =============================================================================

/**
 * Cached credential for offline use
 */
export const CachedCredentialSchema = z.object({
  // Credential identity
  id: z.string(),
  type: z.enum(['TRADEPASS', 'SESSION', 'TOKEN', 'CERTIFICATE']),

  // Holder
  holderId: z.string(),
  holderPublicKey: z.string(),

  // Validity
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  offlineExpiresAt: z.string().datetime(), // Separate offline expiry

  // Signature chain for verification
  signatureChain: z.array(
    z.object({
      signature: z.string(),
      signerPublicKey: z.string(),
      signedAt: z.string().datetime(),
    })
  ),

  // Credential data (encrypted separately)
  dataHash: z.string(), // Hash of the actual credential data

  // Revocation check
  lastRevocationCheckAt: z.string().datetime(),
  revocationListHash: z.string().optional(),

  // Sync status
  syncedAt: z.string().datetime(),
  syncRequired: z.boolean().default(false),
});

export type CachedCredential = z.infer<typeof CachedCredentialSchema>;

// =============================================================================
// CREDENTIAL CACHE CONFIGURATION
// =============================================================================

export interface CredentialCacheConfig {
  maxOfflineHours: number;
  revocationCheckIntervalHours: number;
  maxCachedCredentials: number;
  autoCleanupEnabled: boolean;
}

export const DEFAULT_CREDENTIAL_CACHE_CONFIG: CredentialCacheConfig = {
  maxOfflineHours: 72,
  revocationCheckIntervalHours: 24,
  maxCachedCredentials: 100,
  autoCleanupEnabled: true,
};

// =============================================================================
// CREDENTIAL CACHE
// =============================================================================

/**
 * Credential cache manager
 * Uses SecureStorageBase for encrypted persistence
 */
export class CredentialCache {
  private config: CredentialCacheConfig;

  constructor(
    private readonly storageKey: string = 'credential_cache',
    config: Partial<CredentialCacheConfig> = {}
  ) {
    this.config = { ...DEFAULT_CREDENTIAL_CACHE_CONFIG, ...config };
  }

  /**
   * Check if a credential is valid for offline use
   */
  isCredentialValidOffline(credential: CachedCredential): CredentialValidation {
    const now = new Date();

    // Check offline expiry
    const offlineExpiry = new Date(credential.offlineExpiresAt);
    if (offlineExpiry < now) {
      return {
        valid: false,
        reason: 'OFFLINE_EXPIRED',
        message: 'Credential offline validity has expired',
      };
    }

    // Check regular expiry
    const expiry = new Date(credential.expiresAt);
    if (expiry < now) {
      return {
        valid: false,
        reason: 'EXPIRED',
        message: 'Credential has expired',
      };
    }

    // Check if revocation check is stale
    const lastRevocationCheck = new Date(credential.lastRevocationCheckAt);
    const revocationAge = now.getTime() - lastRevocationCheck.getTime();
    const maxRevocationAge = this.config.revocationCheckIntervalHours * 60 * 60 * 1000;

    if (revocationAge > maxRevocationAge) {
      return {
        valid: true,
        warning: 'REVOCATION_CHECK_STALE',
        message: 'Revocation status may be outdated',
      };
    }

    return { valid: true };
  }

  /**
   * Calculate offline expiry from issuance
   */
  calculateOfflineExpiry(issuedAt: Date): Date {
    return new Date(
      issuedAt.getTime() + this.config.maxOfflineHours * 60 * 60 * 1000
    );
  }

  /**
   * Check if credential needs sync
   */
  needsSync(credential: CachedCredential): boolean {
    if (credential.syncRequired) {
      return true;
    }

    const now = new Date();
    const offlineExpiry = new Date(credential.offlineExpiresAt);
    const bufferMs = 24 * 60 * 60 * 1000; // 24 hour buffer

    // Sync if approaching offline expiry
    return offlineExpiry.getTime() - now.getTime() < bufferMs;
  }

  /**
   * Prepare credential for offline caching
   */
  prepareForOffline(
    credential: Omit<CachedCredential, 'offlineExpiresAt' | 'syncedAt' | 'syncRequired'>
  ): CachedCredential {
    const now = new Date();
    return {
      ...credential,
      offlineExpiresAt: this.calculateOfflineExpiry(new Date(credential.issuedAt)).toISOString(),
      syncedAt: now.toISOString(),
      syncRequired: false,
    };
  }

  /**
   * Mark credential as synced
   */
  markSynced(credential: CachedCredential): CachedCredential {
    const now = new Date();
    return {
      ...credential,
      syncedAt: now.toISOString(),
      syncRequired: false,
      lastRevocationCheckAt: now.toISOString(),
      // Extend offline expiry on successful sync
      offlineExpiresAt: this.calculateOfflineExpiry(now).toISOString(),
    };
  }

  /**
   * Find expired credentials for cleanup
   */
  findExpiredCredentials(credentials: CachedCredential[]): CachedCredential[] {
    const now = new Date();
    return credentials.filter((c) => {
      const expiry = new Date(c.expiresAt);
      const offlineExpiry = new Date(c.offlineExpiresAt);
      return expiry < now || offlineExpiry < now;
    });
  }

  /**
   * Validate signature chain (basic check)
   * Full verification should use @gtcx/crypto
   */
  hasValidSignatureChain(credential: CachedCredential): boolean {
    return (
      credential.signatureChain.length > 0 &&
      credential.signatureChain.every(
        (sig) => sig.signature && sig.signerPublicKey && sig.signedAt
      )
    );
  }
}

export interface CredentialValidation {
  valid: boolean;
  reason?: 'EXPIRED' | 'OFFLINE_EXPIRED' | 'REVOKED' | 'CHAIN_INVALID';
  warning?: 'REVOCATION_CHECK_STALE';
  message?: string;
}
