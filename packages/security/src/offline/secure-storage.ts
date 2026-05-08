/**
 * @gtcx/security - Offline Secure Storage
 *
 * Encrypted local storage for offline operation.
 * Implements P8 (Offline-First) and P9 (Security) principles.
 *
 * @packageDocumentation
 */

import { OfflineSecurityConfigSchema, DEFAULT_OFFLINE_CONFIG } from './secure-storage/config';
import type { OfflineSecurityConfig } from './secure-storage/config';
import { SecureStorageError } from './secure-storage/errors';
import type {
  EncryptedItem,
  SecureStorageState,
  UnlockResult,
  StorageBackend,
} from './secure-storage/types';
import { EncryptedItemSchema } from './secure-storage/types';

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

  private async loadLockoutState(): Promise<void> {
    if (this.lockoutStateLoaded) return;
    try {
      const raw = await this.getStorage().getItem(LOCKOUT_STATE_KEY);
      if (raw) {
        if (raw.length > 1024) throw new Error('Lockout state too large');
        const parsed: LockoutState = JSON.parse(raw);
        this.state.failedAttempts = parsed.failedAttempts ?? 0;
        this.state.lastFailedAt = parsed.lastFailedAt ? new Date(parsed.lastFailedAt) : undefined;
      }
    } catch {
      this.state.failedAttempts = this.config.maxFailedAttempts;
      this.state.lastFailedAt = new Date();
    }
    this.lockoutStateLoaded = true;
  }

  private async persistLockoutState(): Promise<void> {
    const lockoutState: LockoutState = {
      failedAttempts: this.state.failedAttempts,
      lastFailedAt: this.state.lastFailedAt?.toISOString() ?? null,
    };
    await this.getStorage().setItem(LOCKOUT_STATE_KEY, JSON.stringify(lockoutState));
  }

  protected abstract deriveKey(secret: string, salt: Uint8Array): Promise<Uint8Array>;

  protected abstract encrypt(
    plaintext: Uint8Array,
    key: Uint8Array
  ): Promise<{ ciphertext: Uint8Array; iv: Uint8Array; tag: Uint8Array }>;

  protected abstract decrypt(
    ciphertext: Uint8Array,
    key: Uint8Array,
    iv: Uint8Array,
    tag: Uint8Array
  ): Promise<Uint8Array>;

  protected abstract getStorage(): StorageBackend;

  protected abstract getDeviceSalt(): Promise<Uint8Array>;

  async unlock(secret: string): Promise<UnlockResult> {
    await this.loadLockoutState();
    await this.clearExpiredLockoutIfNeeded();

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
      this.state.isLocked = false;

      const verified = await this.verifyKey();
      if (!verified) {
        this.state.isLocked = true;
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

      this.state.failedAttempts = 0;
      this.state.lastFailedAt = undefined;
      await this.persistLockoutState();
      this.state.lastUnlockedAt = new Date();

      return { success: true };
    } catch {
      this.state.isLocked = true;
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

  lock(): void {
    if (this.encryptionKey) {
      this.encryptionKey.fill(0);
      this.encryptionKey = null;
    }
    this.state.isLocked = true;
  }

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

  async get<T>(key: string): Promise<T | null> {
    this.ensureUnlocked();

    const raw = await this.getStorage().getItem(this.prefixKey(key));
    if (!raw) {
      return null;
    }

    let item;
    try {
      if (raw.length > 5_000_000) {
        throw new SecureStorageError('Encrypted entry too large', 'PAYLOAD_TOO_LARGE');
      }
      item = EncryptedItemSchema.parse(JSON.parse(raw));
    } catch {
      throw new SecureStorageError(
        `Secure storage: corrupt entry for key "${key}"`,
        'CORRUPT_ENTRY'
      );
    }

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
      const decoded = new TextDecoder().decode(plaintext);
      if (decoded.length > 5_000_000) {
        throw new SecureStorageError('Decrypted payload too large', 'PAYLOAD_TOO_LARGE');
      }
      return JSON.parse(decoded);
    } catch (error) {
      if (error instanceof SecureStorageError) throw error;
      throw new SecureStorageError(
        `Secure storage: decrypted data is not valid JSON for key "${key}"`,
        'INVALID_JSON'
      );
    }
  }

  async remove(key: string): Promise<void> {
    await this.getStorage().removeItem(this.prefixKey(key));
  }

  async wipe(): Promise<void> {
    await this.getStorage().clear();
    this.lock();
    this.state.failedAttempts = 0;
    this.state.lastFailedAt = undefined;
    await this.getStorage().setItem('gtcx_secure___initialized', 'true');
    this.lockoutStateLoaded = true;
    await this.persistLockoutState();
  }

  needsSync(): boolean {
    if (!this.state.lastUnlockedAt) {
      return true;
    }

    const bufferMs = this.config.credentialRefreshBufferHours * 60 * 60 * 1000;
    const maxOfflineMs = this.config.maxOfflineHours * 60 * 60 * 1000;
    const elapsed = Date.now() - this.state.lastUnlockedAt.getTime();

    return elapsed > maxOfflineMs - bufferMs;
  }

  private ensureUnlocked(): void {
    if (this.state.isLocked || !this.encryptionKey) {
      throw new SecureStorageError('Storage is locked. Call unlock() first.', 'STORAGE_LOCKED');
    }
  }

  private isLockedOut(): boolean {
    if (this.state.failedAttempts < this.config.maxFailedAttempts) {
      return false;
    }

    const expiresAt = this.getLockoutExpiry();
    if (!expiresAt) {
      return true;
    }

    return expiresAt.getTime() > Date.now();
  }

  private getLockoutExpiry(): Date | undefined {
    if (this.state.failedAttempts < this.config.maxFailedAttempts || !this.state.lastFailedAt) {
      return undefined;
    }

    return new Date(this.state.lastFailedAt.getTime() + this.config.lockoutDurationSeconds * 1000);
  }

  private async recordFailedAttempt(): Promise<void> {
    this.state.failedAttempts++;
    this.state.lastFailedAt = new Date();
    await this.persistLockoutState();

    if (this.config.wipeOnExceed && this.isLockedOut()) {
      this.wipe().catch((error) => {
        process.stderr.write(`[gtcx/security] wipe failed: ${String(error)}\n`);
      });
    }
  }

  private async verifyKey(): Promise<boolean> {
    const INITIALIZED_KEY = 'gtcx_secure___initialized';
    try {
      const marker = await this.get<{ verified: boolean }>('__verify__');
      if (marker === null) {
        const initialized = await this.getStorage().getItem(INITIALIZED_KEY);
        if (initialized) {
          return false;
        }
        await this.set('__verify__', { verified: true });
        await this.getStorage().setItem(INITIALIZED_KEY, 'true');
        return true;
      }
      return marker.verified === true;
    } catch {
      return false;
    }
  }

  async reinitialize(secret: string): Promise<UnlockResult> {
    const INITIALIZED_KEY = 'gtcx_secure___initialized';

    try {
      const salt = await this.getDeviceSalt();
      this.encryptionKey = await this.deriveKey(secret, salt);

      this.state.isLocked = false;
      await this.set('__verify__', { verified: true });
      await this.getStorage().setItem(INITIALIZED_KEY, 'true');
      this.state.failedAttempts = 0;
      this.state.lastFailedAt = undefined;
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

  private async clearExpiredLockoutIfNeeded(): Promise<void> {
    const expiresAt = this.getLockoutExpiry();
    if (!expiresAt || expiresAt.getTime() > Date.now()) {
      return;
    }

    this.state.failedAttempts = 0;
    this.state.lastFailedAt = undefined;
    await this.persistLockoutState();
  }

  private toBase64(data: Uint8Array): string {
    return Buffer.from(data).toString('base64');
  }

  private fromBase64(data: string): Uint8Array {
    return new Uint8Array(Buffer.from(data, 'base64'));
  }
}

export {
  SecureStorageError,
  OfflineSecurityConfigSchema,
  DEFAULT_OFFLINE_CONFIG,
  type OfflineSecurityConfig,
  type EncryptedItem,
  type SecureStorageState,
  type UnlockResult,
  type StorageBackend,
  EncryptedItemSchema,
};
