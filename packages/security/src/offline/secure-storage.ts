/**
 * @gtcx/security - Offline Secure Storage
 *
 * Encrypted local storage for offline operation.
 * Implements P8 (Offline-First) and P9 (Security) principles.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// =============================================================================
// ERROR CLASS
// =============================================================================

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
// CONFIGURATION
// =============================================================================

/**
 * Offline security configuration
 */
export const OfflineSecurityConfigSchema = z.object({
  // Credential caching
  maxOfflineHours: z.number().int().min(1).max(168).default(72), // Max 7 days
  credentialRefreshBufferHours: z.number().int().min(1).default(24),

  // Encryption
  storageEncryption: z.literal('AES-256-GCM').default('AES-256-GCM'),
  keyDerivation: z.literal('ARGON2ID').default('ARGON2ID'),

  // Key derivation parameters
  argon2Memory: z.number().int().min(16384).default(131072), // 128MB default (OWASP minimum)
  argon2Iterations: z.number().int().min(1).default(4),
  argon2Parallelism: z.number().int().min(1).default(1),

  // Tamper detection
  integrityCheckIntervalMinutes: z.number().int().min(1).default(15),

  // Security limits
  maxFailedAttempts: z.number().int().min(1).default(10),
  wipeOnExceed: z.boolean().default(true),

  // Lockout duration
  lockoutDurationSeconds: z.number().int().min(60).default(900), // 15 minutes
});

export type OfflineSecurityConfig = z.infer<typeof OfflineSecurityConfigSchema>;

export const DEFAULT_OFFLINE_CONFIG: OfflineSecurityConfig = {
  maxOfflineHours: 72,
  credentialRefreshBufferHours: 24,
  storageEncryption: 'AES-256-GCM',
  keyDerivation: 'ARGON2ID',
  argon2Memory: 131072,
  argon2Iterations: 4,
  argon2Parallelism: 1,
  integrityCheckIntervalMinutes: 15,
  maxFailedAttempts: 10,
  wipeOnExceed: true,
  lockoutDurationSeconds: 900,
};

// =============================================================================
// STORAGE ITEM SCHEMA
// =============================================================================

/**
 * Encrypted storage item envelope
 */
export const EncryptedItemSchema = z.object({
  // Encrypted data
  ciphertext: z.string(), // Base64-encoded encrypted data
  iv: z.string(), // Base64-encoded initialization vector
  tag: z.string(), // Base64-encoded authentication tag

  // Metadata (unencrypted)
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),

  // Integrity
  version: z.number().int().min(1).default(1),
});

export type EncryptedItem = z.infer<typeof EncryptedItemSchema>;

// =============================================================================
// STORAGE STATE
// =============================================================================

/**
 * Secure storage state
 */
export interface SecureStorageState {
  isLocked: boolean;
  failedAttempts: number;
  lastUnlockedAt?: Date;
  lastIntegrityCheckAt?: Date;
}

/**
 * Storage unlock result
 */
export interface UnlockResult {
  success: boolean;
  error?: 'INVALID_SECRET' | 'LOCKED_OUT' | 'CORRUPTED' | undefined;
  remainingAttempts?: number | undefined;
  lockoutExpiresAt?: Date | undefined;
}

// =============================================================================
// ABSTRACT STORAGE INTERFACE
// =============================================================================

/**
 * Platform-agnostic storage interface
 * Implement this for your platform (React Native, Web, Node, etc.)
 */
export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}

// =============================================================================
// SECURE STORAGE ABSTRACT CLASS
// =============================================================================

/**
 * Abstract secure storage class
 * Subclass and implement platform-specific crypto and storage
 */
/**
 * Key used to persist lockout state in the backend (stored unencrypted).
 * This ensures brute-force counters survive process restarts.
 */
const LOCKOUT_STATE_KEY = 'gtcx_secure___lockout_state';

interface LockoutState {
  failedAttempts: number;
  lastFailedAt: string | null;
}

export abstract class SecureStorageBase {
  protected config: OfflineSecurityConfig;
  protected state: SecureStorageState;
  protected encryptionKey: Uint8Array | null = null;
  private lockoutStateLoaded = false;

  constructor(config: Partial<OfflineSecurityConfig> = {}) {
    this.config = { ...DEFAULT_OFFLINE_CONFIG, ...config };
    this.state = {
      isLocked: true,
      failedAttempts: 0,
    };
  }

  /**
   * Load persisted lockout state from backend.
   * Called automatically before unlock checks.
   */
  private async loadLockoutState(): Promise<void> {
    if (this.lockoutStateLoaded) return;
    try {
      const raw = await this.getStorage().getItem(LOCKOUT_STATE_KEY);
      if (raw) {
        const parsed: LockoutState = JSON.parse(raw);
        this.state.failedAttempts = parsed.failedAttempts ?? 0;
      }
    } catch {
      // If lockout state is corrupted, assume maximum failed attempts (locked)
      this.state.failedAttempts = this.config.maxFailedAttempts;
    }
    this.lockoutStateLoaded = true;
  }

  /**
   * Persist lockout state to backend (unencrypted so it works when locked).
   */
  private async persistLockoutState(): Promise<void> {
    const lockoutState: LockoutState = {
      failedAttempts: this.state.failedAttempts,
      lastFailedAt: this.state.failedAttempts > 0 ? new Date().toISOString() : null,
    };
    await this.getStorage().setItem(LOCKOUT_STATE_KEY, JSON.stringify(lockoutState));
  }

  /**
   * Derive encryption key from user secret
   * MUST be implemented by subclass using @gtcx/crypto
   */
  protected abstract deriveKey(secret: string, salt: Uint8Array): Promise<Uint8Array>;

  /**
   * Encrypt data with AES-256-GCM
   * MUST be implemented by subclass using @gtcx/crypto
   */
  protected abstract encrypt(
    plaintext: Uint8Array,
    key: Uint8Array
  ): Promise<{ ciphertext: Uint8Array; iv: Uint8Array; tag: Uint8Array }>;

  /**
   * Decrypt data with AES-256-GCM
   * MUST be implemented by subclass using @gtcx/crypto
   */
  protected abstract decrypt(
    ciphertext: Uint8Array,
    key: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array
  ): Promise<Uint8Array>;

  /**
   * Get platform-specific storage backend
   */
  protected abstract getStorage(): StorageBackend;

  /**
   * Get device-specific salt (unique per device)
   */
  protected abstract getDeviceSalt(): Promise<Uint8Array>;

  /**
   * Unlock storage with user secret (PIN, password, biometric key)
   */
  async unlock(secret: string): Promise<UnlockResult> {
    // Load persisted lockout state before checking
    await this.loadLockoutState();

    // Check lockout
    if (this.isLockedOut()) {
      return {
        success: false,
        error: 'LOCKED_OUT',
        lockoutExpiresAt: this.getLockoutExpiry(),
      };
    }

    try {
      const salt = await this.getDeviceSalt();
      this.encryptionKey = await this.deriveKey(secret, salt);

      // Temporarily unlock so verifyKey() can use get()/set()
      this.state.isLocked = false;

      // Verify key by attempting to decrypt a known item
      const verified = await this.verifyKey();
      if (!verified) {
        this.state.isLocked = true;
        // Zero key buffer before discarding
        if (this.encryptionKey) {
          this.encryptionKey.fill(0);
        }
        this.encryptionKey = null;
        await this.recordFailedAttempt();
        return {
          success: false,
          error: 'INVALID_SECRET',
          remainingAttempts: this.config.maxFailedAttempts - this.state.failedAttempts,
        };
      }

      // Success - reset attempts and persist
      this.state.failedAttempts = 0;
      await this.persistLockoutState();
      this.state.lastUnlockedAt = new Date();

      return { success: true };
    } catch (_error) {
      this.state.isLocked = true;
      // Zero key buffer before discarding
      if (this.encryptionKey) {
        this.encryptionKey.fill(0);
      }
      this.encryptionKey = null;
      await this.recordFailedAttempt();
      return {
        success: false,
        error: 'INVALID_SECRET',
        remainingAttempts: this.config.maxFailedAttempts - this.state.failedAttempts,
      };
    }
  }

  /**
   * Lock storage (clear encryption key from memory)
   */
  lock(): void {
    if (this.encryptionKey) {
      // Zero out the key
      this.encryptionKey.fill(0);
      this.encryptionKey = null;
    }
    this.state.isLocked = true;
  }

  /**
   * Store encrypted data
   */
  async set<T>(key: string, data: T, expiresInHours?: number): Promise<void> {
    this.ensureUnlocked();

    const plaintext = new TextEncoder().encode(JSON.stringify(data));
    const { ciphertext, iv, tag } = await this.encrypt(plaintext, this.encryptionKey!);

    const now = new Date();
    const item: EncryptedItem = {
      ciphertext: this.toBase64(ciphertext),
      iv: this.toBase64(iv),
      tag: this.toBase64(tag),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: expiresInHours
        ? new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString()
        : undefined,
      version: 1,
    };

    await this.getStorage().setItem(this.prefixKey(key), JSON.stringify(item));
  }

  /**
   * Retrieve and decrypt data
   */
  async get<T>(key: string): Promise<T | null> {
    this.ensureUnlocked();

    const raw = await this.getStorage().getItem(this.prefixKey(key));
    if (!raw) {
      return null;
    }

    let item;
    try {
      item = EncryptedItemSchema.parse(JSON.parse(raw));
    } catch {
      throw new SecureStorageError(
        `Secure storage: corrupt entry for key "${key}"`,
        'CORRUPT_ENTRY'
      );
    }

    // Check expiration
    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      await this.remove(key);
      return null;
    }

    const plaintext = await this.decrypt(
      this.fromBase64(item.ciphertext),
      this.encryptionKey!,
      this.fromBase64(item.iv),
      this.fromBase64(item.tag)
    );

    try {
      return JSON.parse(new TextDecoder().decode(plaintext));
    } catch {
      throw new SecureStorageError(
        `Secure storage: decrypted data is not valid JSON for key "${key}"`,
        'INVALID_JSON'
      );
    }
  }

  /**
   * Remove item
   */
  async remove(key: string): Promise<void> {
    await this.getStorage().removeItem(this.prefixKey(key));
  }

  /**
   * Secure wipe - delete all data.
   * After wipe, unlock() will refuse to accept new secrets.
   * Use reinitialize() to set up a new secret after a wipe.
   */
  async wipe(): Promise<void> {
    await this.getStorage().clear();
    this.lock();
    this.state.failedAttempts = 0;
    // Preserve initialized flag so unlock() knows this was previously set up
    await this.getStorage().setItem('gtcx_secure___initialized', 'true');
    this.lockoutStateLoaded = true;
    await this.persistLockoutState();
  }

  /**
   * Check if data needs sync (approaching offline expiry)
   */
  needsSync(): boolean {
    if (!this.state.lastUnlockedAt) {
      return true;
    }

    const bufferMs = this.config.credentialRefreshBufferHours * 60 * 60 * 1000;
    const maxOfflineMs = this.config.maxOfflineHours * 60 * 60 * 1000;
    const elapsed = Date.now() - this.state.lastUnlockedAt.getTime();

    return elapsed > maxOfflineMs - bufferMs;
  }

  // =============================================================================
  // PRIVATE HELPERS
  // =============================================================================

  private ensureUnlocked(): void {
    if (this.state.isLocked || !this.encryptionKey) {
      throw new SecureStorageError('Storage is locked. Call unlock() first.', 'STORAGE_LOCKED');
    }
  }

  private isLockedOut(): boolean {
    return this.state.failedAttempts >= this.config.maxFailedAttempts;
  }

  private getLockoutExpiry(): Date | undefined {
    if (!this.isLockedOut()) {
      return undefined;
    }
    return new Date(Date.now() + this.config.lockoutDurationSeconds * 1000);
  }

  private async recordFailedAttempt(): Promise<void> {
    this.state.failedAttempts++;
    await this.persistLockoutState();

    if (this.config.wipeOnExceed && this.isLockedOut()) {
      // Trigger async wipe
      this.wipe().catch((error) => {
        console.error('[gtcx/security] wipe failed:', error);
      });
    }
  }

  private async verifyKey(): Promise<boolean> {
    const INITIALIZED_KEY = 'gtcx_secure___initialized';
    // Try to decrypt a verification marker
    try {
      const marker = await this.get<{ verified: boolean }>('__verify__');
      if (marker === null) {
        // Check if storage was previously initialized
        const initialized = await this.getStorage().getItem(INITIALIZED_KEY);
        if (initialized) {
          // Previously initialized but verification token gone (e.g. after wipe)
          // Refuse to accept any secret — require explicit re-initialization
          return false;
        }
        // First time setup - create verification marker and mark initialized
        await this.set('__verify__', { verified: true });
        await this.getStorage().setItem(INITIALIZED_KEY, 'true');
        return true;
      }
      return marker.verified === true;
    } catch {
      // Decryption failed with current key = wrong secret
      return false;
    }
  }

  /**
   * Re-initialize storage with a new secret after a wipe.
   * This explicitly creates a new verification token.
   */
  async reinitialize(secret: string): Promise<UnlockResult> {
    const INITIALIZED_KEY = 'gtcx_secure___initialized';

    try {
      const salt = await this.getDeviceSalt();
      this.encryptionKey = await this.deriveKey(secret, salt);

      this.state.isLocked = false;
      await this.set('__verify__', { verified: true });
      await this.getStorage().setItem(INITIALIZED_KEY, 'true');
      this.state.failedAttempts = 0;
      await this.persistLockoutState();
      this.state.lastUnlockedAt = new Date();

      return { success: true };
    } catch {
      this.state.isLocked = true;
      if (this.encryptionKey) {
        this.encryptionKey.fill(0);
      }
      this.encryptionKey = null;
      return { success: false, error: 'INVALID_SECRET' };
    }
  }

  private prefixKey(key: string): string {
    return `gtcx_secure_${key}`;
  }

  private toBase64(data: Uint8Array): string {
    return Buffer.from(data).toString('base64');
  }

  private fromBase64(data: string): Uint8Array {
    return new Uint8Array(Buffer.from(data, 'base64'));
  }
}
