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
  argon2Memory: z.number().int().min(16384).default(65536), // 64MB default
  argon2Iterations: z.number().int().min(1).default(3),
  argon2Parallelism: z.number().int().min(1).default(1),

  // Tamper detection
  integrityCheckIntervalMinutes: z.number().int().min(1).default(15),

  // Security limits
  maxFailedAttempts: z.number().int().min(1).default(10),
  wipeOnExceed: z.boolean().default(true),
});

export type OfflineSecurityConfig = z.infer<typeof OfflineSecurityConfigSchema>;

export const DEFAULT_OFFLINE_CONFIG: OfflineSecurityConfig = {
  maxOfflineHours: 72,
  credentialRefreshBufferHours: 24,
  storageEncryption: 'AES-256-GCM',
  keyDerivation: 'ARGON2ID',
  argon2Memory: 65536,
  argon2Iterations: 3,
  argon2Parallelism: 1,
  integrityCheckIntervalMinutes: 15,
  maxFailedAttempts: 10,
  wipeOnExceed: true,
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
  error?: 'INVALID_SECRET' | 'LOCKED_OUT' | 'CORRUPTED';
  remainingAttempts?: number;
  lockoutExpiresAt?: Date;
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
export abstract class SecureStorageBase {
  protected config: OfflineSecurityConfig;
  protected state: SecureStorageState;
  protected encryptionKey: Uint8Array | null = null;

  constructor(config: Partial<OfflineSecurityConfig> = {}) {
    this.config = { ...DEFAULT_OFFLINE_CONFIG, ...config };
    this.state = {
      isLocked: true,
      failedAttempts: 0,
    };
  }

  /**
   * Derive encryption key from user secret
   * MUST be implemented by subclass using @gtcx/crypto
   */
  protected abstract deriveKey(
    secret: string,
    salt: Uint8Array
  ): Promise<Uint8Array>;

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
        this.encryptionKey = null;
        this.recordFailedAttempt();
        return {
          success: false,
          error: 'INVALID_SECRET',
          remainingAttempts: this.config.maxFailedAttempts - this.state.failedAttempts,
        };
      }

      // Success
      this.state.failedAttempts = 0;
      this.state.lastUnlockedAt = new Date();

      return { success: true };
    } catch (error) {
      this.state.isLocked = true;
      this.encryptionKey = null;
      this.recordFailedAttempt();
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
    const { ciphertext, iv, tag } = await this.encrypt(
      plaintext,
      this.encryptionKey!
    );

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

    await this.getStorage().setItem(
      this.prefixKey(key),
      JSON.stringify(item)
    );
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

    const item = EncryptedItemSchema.parse(JSON.parse(raw));

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

    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  /**
   * Remove item
   */
  async remove(key: string): Promise<void> {
    await this.getStorage().removeItem(this.prefixKey(key));
  }

  /**
   * Secure wipe - delete all data
   */
  async wipe(): Promise<void> {
    await this.getStorage().clear();
    this.lock();
    this.state.failedAttempts = 0;
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
      throw new Error('Storage is locked. Call unlock() first.');
    }
  }

  private isLockedOut(): boolean {
    return this.state.failedAttempts >= this.config.maxFailedAttempts;
  }

  private getLockoutExpiry(): Date | undefined {
    if (!this.isLockedOut()) {
      return undefined;
    }
    // 15 minute lockout per config
    return new Date(Date.now() + 15 * 60 * 1000);
  }

  private recordFailedAttempt(): void {
    this.state.failedAttempts++;

    if (this.config.wipeOnExceed && this.isLockedOut()) {
      // Trigger async wipe
      this.wipe().catch(() => {
        // Wipe failed - log but don't throw
      });
    }
  }

  private async verifyKey(): Promise<boolean> {
    // Try to decrypt a verification marker
    try {
      const marker = await this.get<{ verified: boolean }>('__verify__');
      if (marker === null) {
        // First time setup - create verification marker
        await this.set('__verify__', { verified: true });
        return true;
      }
      return marker.verified === true;
    } catch {
      // Decryption failed with current key = wrong secret
      return false;
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
