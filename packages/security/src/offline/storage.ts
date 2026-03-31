/**
 * @gtcx/security - Offline Security
 *
 * Secure storage, credential caching, and tamper detection for offline operation.
 * Implements P8 (Offline-First) and P9 (Security by Design).
 *
 * CRITICAL: This module ensures security works without network connectivity.
 */

import { z } from 'zod';

import { logSecurityEvent } from '../audit/events';

import { secureCompare } from './tamper-detection';

// =============================================================================
// CONFIGURATION
// =============================================================================

export interface OfflineSecurityConfig {
  /** Maximum hours credentials are valid offline (default: 72) */
  maxOfflineHours: number;

  /** Hours before expiry to prompt refresh (default: 24) */
  credentialRefreshBuffer: number;

  /** Maximum failed unlock attempts before wipe (default: 10) */
  maxFailedAttempts: number;

  /** Wipe local data after max failures (default: true) */
  wipeOnExceed: boolean;

  /** Minutes between integrity checks (default: 15) */
  integrityCheckInterval: number;
}

export const DEFAULT_OFFLINE_CONFIG: OfflineSecurityConfig = {
  maxOfflineHours: 72,
  credentialRefreshBuffer: 24,
  maxFailedAttempts: 10,
  wipeOnExceed: true,
  integrityCheckInterval: 15,
};

// =============================================================================
// SECURE STORAGE INTERFACE
// =============================================================================

/**
 * Abstract storage backend interface
 *
 * Implementations should use platform-specific secure storage:
 * - React Native: expo-secure-store
 * - Web: IndexedDB with encryption
 * - Node: encrypted file storage
 */
export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

/**
 * Encryption interface (implemented by @gtcx/crypto)
 */
export interface EncryptionProvider {
  deriveKey(password: string, salt: string): Promise<Uint8Array>;
  encrypt(data: Uint8Array, key: Uint8Array): Promise<string>;
  decrypt(ciphertext: string, key: Uint8Array): Promise<Uint8Array>;
}

// =============================================================================
// SECURE STORAGE
// =============================================================================

export interface SecureStorageOptions {
  /** Device identifier for key derivation */
  deviceId: string;

  /** Storage backend */
  backend: StorageBackend;

  /** Encryption provider (from @gtcx/crypto) */
  encryption: EncryptionProvider;

  /** Configuration */
  config?: Partial<OfflineSecurityConfig>;
}

/**
 * Secure local storage with encryption
 *
 * Key is derived from user secret + device ID, never stored.
 * Data is encrypted at rest using AES-256-GCM.
 *
 * @example
 * const storage = new SecureStorage({
 *   deviceId: await getDeviceId(),
 *   backend: new ExpoSecureStoreBackend(),
 *   encryption: cryptoProvider,
 * });
 *
 * await storage.unlock(userPin);
 * await storage.set('credentials', myCredentials);
 * const creds = await storage.get('credentials');
 */
/**
 * Key used to persist lockout state in the backend (stored unencrypted).
 * This ensures brute-force counters survive process restarts.
 */
const LOCKOUT_STATE_KEY = '__lockout_state';

interface LockoutState {
  failedAttempts: number;
  lastFailedAt: string | null;
}

export class SecureStorage {
  private encryptionKey: Uint8Array | null = null;
  private failedAttempts = 0;
  private lockoutStateLoaded = false;
  private readonly config: OfflineSecurityConfig;

  constructor(private readonly options: SecureStorageOptions) {
    this.config = { ...DEFAULT_OFFLINE_CONFIG, ...options.config };
  }

  /**
   * Load persisted lockout state from backend.
   * Called automatically before unlock checks.
   */
  private async loadLockoutState(): Promise<void> {
    if (this.lockoutStateLoaded) return;
    try {
      const raw = await this.options.backend.getItem(LOCKOUT_STATE_KEY);
      if (raw) {
        const state: LockoutState = JSON.parse(raw);
        this.failedAttempts = state.failedAttempts ?? 0;
      }
    } catch {
      // If lockout state is corrupted, fail closed — assume max attempts exhausted
      this.failedAttempts = this.config.maxFailedAttempts;
    }
    this.lockoutStateLoaded = true;
  }

  /**
   * Persist lockout state to backend (unencrypted so it works when locked).
   */
  private async persistLockoutState(): Promise<void> {
    const state: LockoutState = {
      failedAttempts: this.failedAttempts,
      lastFailedAt: this.failedAttempts > 0 ? new Date().toISOString() : null,
    };
    await this.options.backend.setItem(LOCKOUT_STATE_KEY, JSON.stringify(state));
  }

  /**
   * Unlock storage with user secret
   *
   * Derives encryption key from secret + device ID.
   * Key is held in memory, never persisted.
   */
  async unlock(userSecret: string): Promise<{ success: boolean; attemptsRemaining?: number }> {
    // Load persisted lockout state before checking
    await this.loadLockoutState();

    // Check if already locked out
    if (this.failedAttempts >= this.config.maxFailedAttempts) {
      if (this.config.wipeOnExceed) {
        await this.wipe();
      }

      await logSecurityEvent('AUTH_LOCKOUT', {
        outcome: 'BLOCKED',
        reason: 'MAX_ATTEMPTS_EXCEEDED',
        metadata: { failedAttempts: this.failedAttempts },
      });

      return { success: false };
    }

    try {
      // Derive key
      this.encryptionKey = await this.options.encryption.deriveKey(
        userSecret,
        this.options.deviceId
      );

      // Verify by attempting to read a known value
      const verification = await this.options.backend.getItem('__verification');
      const initialized = await this.options.backend.getItem('__initialized');
      if (verification) {
        try {
          await this.options.encryption.decrypt(verification, this.encryptionKey);
        } catch {
          // Decryption failed - wrong key; zero key before discarding
          this.encryptionKey.fill(0);
          this.encryptionKey = null;
          this.failedAttempts++;
          await this.persistLockoutState();

          await logSecurityEvent('AUTH_FAILURE', {
            outcome: 'FAILURE',
            reason: 'INVALID_SECRET',
            metadata: {
              attemptsRemaining: this.config.maxFailedAttempts - this.failedAttempts,
            },
          });

          return {
            success: false,
            attemptsRemaining: this.config.maxFailedAttempts - this.failedAttempts,
          };
        }
      } else if (initialized) {
        // Storage was previously initialized but verification token is gone
        // (e.g. after a wipe). Require explicit re-initialization.
        this.encryptionKey.fill(0);
        this.encryptionKey = null;

        await logSecurityEvent('AUTH_FAILURE', {
          outcome: 'FAILURE',
          reason: 'REQUIRES_REINITIALIZE',
          metadata: {
            detail:
              'Verification token missing after prior initialization. Call reinitialize() instead.',
          },
        });

        return { success: false };
      } else {
        // First time - set verification value and mark as initialized
        const verificationData = new TextEncoder().encode('gtcx-verification');
        const encrypted = await this.options.encryption.encrypt(
          verificationData,
          this.encryptionKey
        );
        await this.options.backend.setItem('__verification', encrypted);
        await this.options.backend.setItem('__initialized', 'true');

        await logSecurityEvent('SECURITY_CONFIG_CHANGED', {
          outcome: 'SUCCESS',
          metadata: { detail: 'New verification token created for first-time initialization' },
        });
      }

      // Success - reset attempts and persist
      this.failedAttempts = 0;
      await this.persistLockoutState();

      await logSecurityEvent('AUTH_SUCCESS', {
        outcome: 'SUCCESS',
        metadata: { method: 'offline_unlock' },
      });

      return { success: true };
    } catch (error) {
      // Zero key buffer before discarding
      if (this.encryptionKey) {
        this.encryptionKey.fill(0);
        this.encryptionKey = null;
      }
      this.failedAttempts++;
      await this.persistLockoutState();

      await logSecurityEvent('AUTH_FAILURE', {
        outcome: 'FAILURE',
        reason: 'UNLOCK_ERROR',
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          attemptsRemaining: this.config.maxFailedAttempts - this.failedAttempts,
        },
      });

      return {
        success: false,
        attemptsRemaining: this.config.maxFailedAttempts - this.failedAttempts,
      };
    }
  }

  /**
   * Lock storage (clear encryption key from memory)
   */
  lock(): void {
    if (this.encryptionKey) {
      // Zero out key memory
      this.encryptionKey.fill(0);
      this.encryptionKey = null;
    }
  }

  /**
   * Check if storage is unlocked
   */
  isUnlocked(): boolean {
    return this.encryptionKey !== null;
  }

  /**
   * Store encrypted data
   */
  async set<T>(key: string, value: T): Promise<void> {
    this.ensureUnlocked();

    const plaintext = JSON.stringify(value);
    const encrypted = await this.options.encryption.encrypt(
      new TextEncoder().encode(plaintext),
      this.encryptionKey!
    );

    await this.options.backend.setItem(key, encrypted);
  }

  /**
   * Retrieve and decrypt data
   */
  async get<T>(key: string): Promise<T | null> {
    this.ensureUnlocked();

    const encrypted = await this.options.backend.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = await this.options.encryption.decrypt(encrypted, this.encryptionKey!);
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch {
      // Decryption failed - data may be corrupted
      await logSecurityEvent('CRYPTO_DECRYPT_FAILED', {
        outcome: 'FAILURE',
        resource: key,
        reason: 'DECRYPTION_FAILED',
      });
      return null;
    }
  }

  /**
   * Delete encrypted data
   */
  async delete(key: string): Promise<void> {
    this.ensureUnlocked();
    await this.options.backend.removeItem(key);
  }

  /**
   * Secure wipe - clear all data.
   * After wipe, unlock() will refuse to accept new secrets.
   * Use reinitialize() to set up a new secret after a wipe.
   */
  async wipe(): Promise<void> {
    this.lock();
    // Preserve initialized flag so unlock() knows this was previously set up
    await this.options.backend.clear();
    await this.options.backend.setItem('__initialized', 'true');
    this.failedAttempts = 0;
    this.lockoutStateLoaded = true;
    await this.persistLockoutState();

    await logSecurityEvent('DATA_DELETED', {
      outcome: 'SUCCESS',
      reason: 'SECURITY_WIPE',
      severity: 'HIGH',
    });
  }

  /**
   * Re-initialize storage with a new secret after a wipe.
   * This explicitly creates a new verification token, unlike unlock()
   * which refuses to accept any secret after wipe.
   */
  async reinitialize(userSecret: string): Promise<{ success: boolean }> {
    this.encryptionKey = await this.options.encryption.deriveKey(userSecret, this.options.deviceId);

    const verificationData = new TextEncoder().encode('gtcx-verification');
    const encrypted = await this.options.encryption.encrypt(verificationData, this.encryptionKey);
    await this.options.backend.setItem('__verification', encrypted);
    await this.options.backend.setItem('__initialized', 'true');
    this.failedAttempts = 0;
    await this.persistLockoutState();

    await logSecurityEvent('SECURITY_CONFIG_CHANGED', {
      outcome: 'SUCCESS',
      metadata: { detail: 'Storage re-initialized with new secret after wipe' },
    });

    return { success: true };
  }

  private ensureUnlocked(): void {
    if (!this.encryptionKey) {
      throw new SecureStorageError('Storage is locked', 'STORAGE_LOCKED');
    }
  }
}

export class SecureStorageError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'SecureStorageError';
  }
}

// =============================================================================
// CREDENTIAL CACHE
// =============================================================================

export const CachedCredentialSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.unknown(),
  cachedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  signature: z.string(),
  issuer: z.string(),
});

export type CachedCredential = z.infer<typeof CachedCredentialSchema>;

/**
 * Credential cache with expiry management
 *
 * Handles P8 requirement for offline credential validation.
 */
export class CredentialCache {
  private readonly CACHE_PREFIX = 'cred_';

  constructor(
    private readonly storage: SecureStorage,
    private readonly config: OfflineSecurityConfig = DEFAULT_OFFLINE_CONFIG
  ) {}

  /**
   * Cache a credential
   */
  async store(
    credential: Omit<CachedCredential, 'cachedAt' | 'expiresAt'>,
    options?: {
      /** Custom expiry (default: maxOfflineHours from config) */
      expiresAt?: string;
    }
  ): Promise<void> {
    const now = new Date();
    const expiresAt =
      options?.expiresAt ??
      new Date(now.getTime() + this.config.maxOfflineHours * 60 * 60 * 1000).toISOString();

    const cached: CachedCredential = {
      ...credential,
      cachedAt: now.toISOString(),
      expiresAt,
    };

    await this.storage.set(`${this.CACHE_PREFIX}${credential.id}`, cached);

    // Track credential IDs for purgeExpired()
    const existingKeys = (await this.storage.get<string[]>('__credential_keys')) ?? [];
    if (!existingKeys.includes(credential.id)) {
      existingKeys.push(credential.id);
      await this.storage.set('__credential_keys', existingKeys);
    }

    await logSecurityEvent('OFFLINE_CREDENTIAL_CACHED', {
      outcome: 'SUCCESS',
      resource: credential.id,
      metadata: { type: credential.type, expiresAt },
    });
  }

  /**
   * Retrieve cached credential
   */
  async get(id: string): Promise<{
    credential: CachedCredential | null;
    status: 'valid' | 'expired' | 'not_found' | 'needs_refresh';
  }> {
    const cached = await this.storage.get<CachedCredential>(`${this.CACHE_PREFIX}${id}`);

    if (!cached) {
      await logSecurityEvent('OFFLINE_CACHE_MISS', {
        outcome: 'FAILURE',
        resource: id,
      });
      return { credential: null, status: 'not_found' };
    }

    const now = new Date();
    const expiresAt = new Date(cached.expiresAt);
    const refreshAt = new Date(
      expiresAt.getTime() - this.config.credentialRefreshBuffer * 60 * 60 * 1000
    );

    // Check if expired — return null credential and delete the expired entry
    if (now >= expiresAt) {
      await this.remove(id);
      await logSecurityEvent('OFFLINE_CACHE_EXPIRED', {
        outcome: 'FAILURE',
        resource: id,
        metadata: { expiredAt: cached.expiresAt },
      });
      return { credential: null, status: 'expired' };
    }

    // Check if needs refresh
    if (now >= refreshAt) {
      await logSecurityEvent('OFFLINE_CACHE_HIT', {
        outcome: 'SUCCESS',
        resource: id,
        metadata: { needsRefresh: true },
      });
      return { credential: cached, status: 'needs_refresh' };
    }

    await logSecurityEvent('OFFLINE_CACHE_HIT', {
      outcome: 'SUCCESS',
      resource: id,
    });
    return { credential: cached, status: 'valid' };
  }

  /**
   * Remove cached credential
   */
  async remove(id: string): Promise<void> {
    await this.storage.delete(`${this.CACHE_PREFIX}${id}`);

    // Remove from tracked keys
    const existingKeys = (await this.storage.get<string[]>('__credential_keys')) ?? [];
    const updatedKeys = existingKeys.filter((k) => k !== id);
    await this.storage.set('__credential_keys', updatedKeys);
  }

  /**
   * Remove all expired credentials
   */
  async purgeExpired(): Promise<number> {
    let purgedCount = 0;
    const now = new Date();

    // Use the storage backend to get all keys, then check each credential
    const allKeys = (await this.storage.get<string[]>('__credential_keys')) ?? [];

    // Also try to find credential keys by checking known IDs
    // We'll iterate through stored credentials and check expiry
    const keysToRemove: string[] = [];

    for (const credId of allKeys) {
      const cached = await this.storage.get<CachedCredential>(`${this.CACHE_PREFIX}${credId}`);
      if (cached && new Date(cached.expiresAt) <= now) {
        await this.storage.delete(`${this.CACHE_PREFIX}${credId}`);
        keysToRemove.push(credId);
        purgedCount++;
      }
    }

    // Update the credential keys list
    if (keysToRemove.length > 0) {
      const remainingKeys = allKeys.filter((k) => !keysToRemove.includes(k));
      await this.storage.set('__credential_keys', remainingKeys);

      await logSecurityEvent('DATA_DELETED', {
        outcome: 'SUCCESS',
        metadata: { purgedCount, reason: 'EXPIRED_CREDENTIALS_PURGED' },
      });
    }

    return purgedCount;
  }
}

// =============================================================================
// TAMPER DETECTION
// =============================================================================

export const IntegrityCheckSchema = z.object({
  dataHash: z.string(),
  signatureChain: z.array(z.string()),
  createdAt: z.string().datetime(),
  lastVerified: z.string().datetime(),
});

export type IntegrityCheck = z.infer<typeof IntegrityCheckSchema>;

export interface IntegrityProvider {
  hash(data: string): Promise<string>;
  verify(signature: string, data: string, publicKey: string): Promise<boolean>;
}

/**
 * Optional signer callback for creating integrity checks with real signatures.
 * If not provided, the integrity check is hash-only (no cryptographic signature).
 */
export type IntegritySigner = (data: string, signingKey: string) => Promise<string>;

/**
 * Create integrity check for data.
 *
 * @param data - Data to protect
 * @param signingKey - Key identifier for signing
 * @param integrity - Hash/verify provider
 * @param signer - Optional callback to produce a cryptographic signature.
 *   If omitted, the check is hash-only (no signature verification will be performed).
 */
export async function createIntegrityCheck(
  data: unknown,
  signingKey: string,
  integrity: IntegrityProvider,
  signer?: IntegritySigner
): Promise<IntegrityCheck> {
  const dataString = JSON.stringify(data);
  const dataHash = await integrity.hash(dataString);
  const now = new Date().toISOString();

  const signatureChain: string[] = [dataHash];

  if (signer) {
    // Sign the hash and include both hash and signature in the chain
    const signature = await signer(dataHash, signingKey);
    signatureChain.push(signature);
  }

  return {
    dataHash,
    signatureChain,
    createdAt: now,
    lastVerified: now,
  };
}

/**
 * Verify data integrity.
 *
 * If the signature chain has only one entry (hash-only mode, no signer was
 * provided at creation time), only the hash is verified. If the chain has
 * two or more entries, each signature in the chain is verified against the
 * previous entry using the integrity provider.
 */
export async function verifyIntegrity(
  data: unknown,
  check: IntegrityCheck,
  trustedKey: string,
  integrity: IntegrityProvider
): Promise<{ valid: boolean; reason?: string; hashOnly?: boolean }> {
  const dataString = JSON.stringify(data);
  const currentHash = await integrity.hash(dataString);

  // Verify hash matches (constant-time comparison to prevent timing attacks)
  if (!secureCompare(currentHash, check.dataHash)) {
    await logSecurityEvent('TAMPER_DETECTED', {
      outcome: 'BLOCKED',
      severity: 'CRITICAL',
      reason: 'DATA_MODIFIED',
      metadata: { expectedHash: check.dataHash, actualHash: currentHash },
    });
    return { valid: false, reason: 'DATA_MODIFIED' };
  }

  // If signature chain has only the hash (no signer was used), hash-only mode
  if (check.signatureChain.length <= 1) {
    await logSecurityEvent('INTEGRITY_CHECK_PASSED', {
      outcome: 'SUCCESS',
      metadata: { mode: 'hash-only', detail: 'No signature in chain; hash verification only' },
    });
    return { valid: true, hashOnly: true };
  }

  // Verify signature chain
  for (let i = 0; i < check.signatureChain.length - 1; i++) {
    const isValid = await integrity.verify(
      check.signatureChain[i + 1]!,
      check.signatureChain[i]!,
      trustedKey
    );

    if (!isValid) {
      await logSecurityEvent('TAMPER_DETECTED', {
        outcome: 'BLOCKED',
        severity: 'CRITICAL',
        reason: 'SIGNATURE_CHAIN_BROKEN',
        metadata: { chainIndex: i },
      });
      return { valid: false, reason: 'CHAIN_BROKEN' };
    }
  }

  await logSecurityEvent('INTEGRITY_CHECK_PASSED', {
    outcome: 'SUCCESS',
  });

  return { valid: true };
}

// =============================================================================
// OFFLINE SYNC
// =============================================================================

export interface SyncStatus {
  lastSyncAt: string | null;
  pendingChanges: number;
  syncInProgress: boolean;
  lastError?: string;
}

/**
 * Track offline changes for sync
 */
export class OfflineSyncTracker {
  private pendingChanges: Array<{
    id: string;
    type: string;
    action: 'create' | 'update' | 'delete';
    data: unknown;
    timestamp: string;
  }> = [];

  constructor(private readonly storage: SecureStorage) {}

  /**
   * Record a change for later sync
   */
  async recordChange(change: {
    type: string;
    action: 'create' | 'update' | 'delete';
    data: unknown;
  }): Promise<string> {
    const id = crypto.randomUUID();
    this.pendingChanges.push({
      id,
      ...change,
      timestamp: new Date().toISOString(),
    });

    // Persist pending changes
    await this.storage.set('__pending_sync', this.pendingChanges);

    return id;
  }

  /**
   * Get pending changes
   */
  async getPendingChanges(): Promise<typeof this.pendingChanges> {
    const stored = await this.storage.get<typeof this.pendingChanges>('__pending_sync');
    this.pendingChanges = stored ?? [];
    return this.pendingChanges;
  }

  /**
   * Mark changes as synced
   */
  async markSynced(ids: string[]): Promise<void> {
    this.pendingChanges = this.pendingChanges.filter((c) => !ids.includes(c.id));
    await this.storage.set('__pending_sync', this.pendingChanges);

    await logSecurityEvent('OFFLINE_SYNC_COMPLETE', {
      outcome: 'SUCCESS',
      metadata: { syncedCount: ids.length },
    });
  }
}
