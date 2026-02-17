/**
 * Tests for @gtcx/security - Offline Storage (storage.ts)
 *
 * Covers: SecureStorage, CredentialCache, createIntegrityCheck,
 * verifyIntegrity, OfflineSyncTracker, SecureStorageError
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  SecureStorage,
  SecureStorageError,
  CredentialCache,
  createIntegrityCheck,
  verifyIntegrity,
  OfflineSyncTracker,
  DEFAULT_OFFLINE_CONFIG,
  CachedCredentialSchema,
} from '../src/offline/storage';
import type { StorageBackend, EncryptionProvider, IntegrityProvider } from '../src/offline/storage';

// Mock audit logging to avoid side effects
vi.mock('../src/audit/events', () => ({
  logSecurityEvent: vi.fn().mockResolvedValue(undefined),
}));

// =============================================================================
// HELPERS
// =============================================================================

/** In-memory storage backend for tests */
function createMockBackend(): StorageBackend {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn(async (key: string) => store.get(key) ?? null),
    setItem: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    getAllKeys: vi.fn(async () => [...store.keys()]),
    clear: vi.fn(async () => {
      store.clear();
    }),
  };
}

/** Simple XOR-based mock encryption for testing */
function createMockEncryption(): EncryptionProvider {
  return {
    deriveKey: vi.fn(async (password: string, _salt: string) => {
      const encoder = new TextEncoder();
      return encoder.encode(password.padEnd(32, '0').slice(0, 32));
    }),
    encrypt: vi.fn(async (data: Uint8Array, key: Uint8Array) => {
      const result = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        result[i] = data[i]! ^ key[i % key.length]!;
      }
      return Buffer.from(result).toString('base64');
    }),
    decrypt: vi.fn(async (ciphertext: string, key: Uint8Array) => {
      const data = Buffer.from(ciphertext, 'base64');
      const result = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        result[i] = data[i]! ^ key[i % key.length]!;
      }
      return result;
    }),
  };
}

/** Creates a mock encryption provider that always fails to decrypt */
function createFailingDecryptEncryption(): EncryptionProvider {
  return {
    deriveKey: vi.fn(async (password: string, _salt: string) => {
      const encoder = new TextEncoder();
      return encoder.encode(password.padEnd(32, '0').slice(0, 32));
    }),
    encrypt: vi.fn(async (data: Uint8Array, key: Uint8Array) => {
      const result = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        result[i] = data[i]! ^ key[i % key.length]!;
      }
      return Buffer.from(result).toString('base64');
    }),
    decrypt: vi.fn(async () => {
      throw new Error('Decryption failed');
    }),
  };
}

/** Mock integrity provider */
function createMockIntegrity(): IntegrityProvider {
  return {
    hash: vi.fn(async (data: string) => {
      // Simple deterministic hash for testing
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = ((h << 5) - h + data.charCodeAt(i)) | 0;
      }
      return Math.abs(h).toString(16).padStart(8, '0');
    }),
    verify: vi.fn(async (_signature: string, _data: string, _publicKey: string) => true),
  };
}

// =============================================================================
// SecureStorage
// =============================================================================

describe('SecureStorage', () => {
  let backend: StorageBackend;
  let encryption: EncryptionProvider;
  let storage: SecureStorage;

  beforeEach(() => {
    backend = createMockBackend();
    encryption = createMockEncryption();
    storage = new SecureStorage({
      deviceId: 'test-device-001',
      backend,
      encryption,
    });
  });

  describe('unlock', () => {
    it('should succeed on first unlock (initialization)', async () => {
      const result = await storage.unlock('my-secret');
      expect(result.success).toBe(true);
    });

    it('should set verification token on first unlock', async () => {
      await storage.unlock('my-secret');
      expect(backend.setItem).toHaveBeenCalledWith('__verification', expect.any(String));
      expect(backend.setItem).toHaveBeenCalledWith('__initialized', 'true');
    });

    it('should succeed on subsequent unlocks with correct secret', async () => {
      await storage.unlock('my-secret');
      storage.lock();

      const result = await storage.unlock('my-secret');
      expect(result.success).toBe(true);
    });

    it('should fail on wrong secret when verification exists', async () => {
      // First, unlock with correct secret to set verification token
      await storage.unlock('correct-secret');
      storage.lock();

      // Create a new storage with failing decrypt to simulate wrong key
      const failEncryption = createFailingDecryptEncryption();
      const wrongStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend, // same backend with verification token
        encryption: failEncryption,
      });

      const result = await wrongStorage.unlock('wrong-secret');
      expect(result.success).toBe(false);
      expect(result.attemptsRemaining).toBeDefined();
    });

    it('should decrement attempts remaining on failure', async () => {
      await storage.unlock('correct-secret');
      storage.lock();

      const failEncryption = createFailingDecryptEncryption();
      const wrongStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 5 },
      });

      const r1 = await wrongStorage.unlock('wrong1');
      expect(r1.attemptsRemaining).toBe(4);

      const r2 = await wrongStorage.unlock('wrong2');
      expect(r2.attemptsRemaining).toBe(3);
    });

    it('should block after max failed attempts', async () => {
      await storage.unlock('correct-secret');
      storage.lock();

      const failEncryption = createFailingDecryptEncryption();
      const wrongStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 2, wipeOnExceed: false },
      });

      await wrongStorage.unlock('wrong1');
      await wrongStorage.unlock('wrong2');

      // Now at max attempts - should be blocked
      const blocked = await wrongStorage.unlock('correct-secret');
      expect(blocked.success).toBe(false);
    });

    it('should wipe on exceed when configured', async () => {
      await storage.unlock('correct-secret');
      await storage.set('important-data', { secret: 'value' });
      storage.lock();

      const failEncryption = createFailingDecryptEncryption();
      const wrongStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 2, wipeOnExceed: true },
      });

      await wrongStorage.unlock('wrong1');
      await wrongStorage.unlock('wrong2');

      // The next unlock triggers wipe because attempts >= max
      await wrongStorage.unlock('anything');

      // Backend should have been cleared
      expect(backend.clear).toHaveBeenCalled();
    });

    it('should reset failed attempts on successful unlock', async () => {
      await storage.unlock('correct-secret');
      storage.lock();

      // Simulate a failed attempt by using failing encryption
      const failEncryption = createFailingDecryptEncryption();
      const failStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 10 },
      });

      await failStorage.unlock('wrong');
      // failedAttempts is now 1

      // Now unlock with correct secret using working encryption
      const goodStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption,
        config: { maxFailedAttempts: 10 },
      });

      const result = await goodStorage.unlock('correct-secret');
      expect(result.success).toBe(true);
    });

    it('should handle deriveKey errors gracefully', async () => {
      const errorEncryption = createMockEncryption();
      (errorEncryption.deriveKey as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Key derivation failed')
      );

      const errorStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: errorEncryption,
      });

      const result = await errorStorage.unlock('secret');
      expect(result.success).toBe(false);
      expect(result.attemptsRemaining).toBeDefined();
    });

    it('should refuse unlock after wipe without reinitialize', async () => {
      await storage.unlock('correct-secret');
      await storage.wipe();

      // A fresh storage pointing to the same backend (which has __initialized but no __verification)
      const newStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption,
      });

      const result = await newStorage.unlock('correct-secret');
      expect(result.success).toBe(false);
    });
  });

  describe('lockout persistence', () => {
    it('should persist lockout state across instances', async () => {
      await storage.unlock('correct-secret');
      storage.lock();

      // Fail once
      const failEncryption = createFailingDecryptEncryption();
      const failStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 3 },
      });
      await failStorage.unlock('wrong');

      // New instance should load persisted lockout state
      const newFailStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: failEncryption,
        config: { maxFailedAttempts: 3 },
      });
      const result = await newFailStorage.unlock('wrong2');
      // Should be 1 remaining (started at 1, now 2, max is 3)
      expect(result.attemptsRemaining).toBe(1);
    });

    it('should handle corrupted lockout state', async () => {
      // Write corrupt lockout state
      await backend.setItem('__lockout_state', 'not-json');

      // Should not throw, should start fresh
      const result = await storage.unlock('my-secret');
      expect(result.success).toBe(true);
    });
  });

  describe('lock / isUnlocked', () => {
    it('should report locked state', () => {
      expect(storage.isUnlocked()).toBe(false);
    });

    it('should report unlocked after unlock', async () => {
      await storage.unlock('secret');
      expect(storage.isUnlocked()).toBe(true);
    });

    it('should report locked after lock()', async () => {
      await storage.unlock('secret');
      storage.lock();
      expect(storage.isUnlocked()).toBe(false);
    });

    it('should be safe to call lock() multiple times', async () => {
      await storage.unlock('secret');
      storage.lock();
      storage.lock(); // should not throw
      expect(storage.isUnlocked()).toBe(false);
    });
  });

  describe('set / get / delete', () => {
    beforeEach(async () => {
      await storage.unlock('test-secret');
    });

    it('should store and retrieve data', async () => {
      await storage.set('key1', { hello: 'world' });
      const result = await storage.get<{ hello: string }>('key1');
      expect(result).toEqual({ hello: 'world' });
    });

    it('should store various types', async () => {
      await storage.set('string', 'hello');
      await storage.set('number', 42);
      await storage.set('boolean', true);
      await storage.set('array', [1, 2, 3]);

      expect(await storage.get('string')).toBe('hello');
      expect(await storage.get('number')).toBe(42);
      expect(await storage.get('boolean')).toBe(true);
      expect(await storage.get('array')).toEqual([1, 2, 3]);
    });

    it('should return null for missing keys', async () => {
      const result = await storage.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should delete items', async () => {
      await storage.set('to-delete', 'value');
      await storage.delete('to-delete');
      const result = await storage.get('to-delete');
      expect(result).toBeNull();
    });

    it('should throw when locked on set', async () => {
      storage.lock();
      await expect(storage.set('key', 'value')).rejects.toThrow(SecureStorageError);
      await expect(storage.set('key', 'value')).rejects.toThrow('Storage is locked');
    });

    it('should throw when locked on get', async () => {
      storage.lock();
      await expect(storage.get('key')).rejects.toThrow(SecureStorageError);
    });

    it('should throw when locked on delete', async () => {
      storage.lock();
      await expect(storage.delete('key')).rejects.toThrow(SecureStorageError);
    });

    it('should return null for corrupted data', async () => {
      // Store data with working encryption
      await storage.set('key', 'value');
      storage.lock();

      // Create encryption that succeeds for verification but fails for user data
      let decryptCallCount = 0;
      const corruptEncryption: EncryptionProvider = {
        deriveKey: encryption.deriveKey,
        encrypt: encryption.encrypt,
        decrypt: vi.fn(async (ciphertext: string, key: Uint8Array) => {
          decryptCallCount++;
          // First decrypt call is for the verification token during unlock
          if (decryptCallCount <= 1) {
            return encryption.decrypt(ciphertext, key);
          }
          // Subsequent calls (user data) fail
          throw new Error('Corrupted');
        }),
      };

      const corruptStorage = new SecureStorage({
        deviceId: 'test-device-001',
        backend,
        encryption: corruptEncryption,
      });
      await corruptStorage.unlock('test-secret');
      const result = await corruptStorage.get('key');
      expect(result).toBeNull();
    });
  });

  describe('wipe', () => {
    it('should clear all data', async () => {
      await storage.unlock('secret');
      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');

      await storage.wipe();

      expect(backend.clear).toHaveBeenCalled();
      expect(storage.isUnlocked()).toBe(false);
    });

    it('should set __initialized flag after wipe', async () => {
      await storage.unlock('secret');
      await storage.wipe();

      expect(backend.setItem).toHaveBeenCalledWith('__initialized', 'true');
    });

    it('should reset failed attempts after wipe', async () => {
      await storage.unlock('secret');
      await storage.wipe();

      // Lockout state should be persisted with 0 attempts
      expect(backend.setItem).toHaveBeenCalledWith(
        '__lockout_state',
        expect.stringContaining('"failedAttempts":0')
      );
    });
  });

  describe('reinitialize', () => {
    it('should create new verification token', async () => {
      await storage.unlock('old-secret');
      await storage.wipe();

      const result = await storage.reinitialize('new-secret');
      expect(result.success).toBe(true);
    });

    it('should allow get/set after reinitialize', async () => {
      await storage.unlock('old-secret');
      await storage.wipe();

      await storage.reinitialize('new-secret');
      await storage.set('newkey', 'newvalue');
      const val = await storage.get('newkey');
      expect(val).toBe('newvalue');
    });

    it('should reset failed attempts', async () => {
      await storage.unlock('secret');
      await storage.wipe();
      await storage.reinitialize('new-secret');

      // Lockout state should reflect 0 attempts
      expect(backend.setItem).toHaveBeenCalledWith(
        '__lockout_state',
        expect.stringContaining('"failedAttempts":0')
      );
    });
  });

  describe('config defaults', () => {
    it('should use DEFAULT_OFFLINE_CONFIG values', () => {
      expect(DEFAULT_OFFLINE_CONFIG.maxOfflineHours).toBe(72);
      expect(DEFAULT_OFFLINE_CONFIG.credentialRefreshBuffer).toBe(24);
      expect(DEFAULT_OFFLINE_CONFIG.maxFailedAttempts).toBe(10);
      expect(DEFAULT_OFFLINE_CONFIG.wipeOnExceed).toBe(true);
      expect(DEFAULT_OFFLINE_CONFIG.integrityCheckInterval).toBe(15);
    });

    it('should allow partial config override', async () => {
      const customStorage = new SecureStorage({
        deviceId: 'device-1',
        backend: createMockBackend(),
        encryption: createMockEncryption(),
        config: { maxFailedAttempts: 3 },
      });

      // Should merge with defaults
      await customStorage.unlock('secret');
      expect(customStorage.isUnlocked()).toBe(true);
    });
  });
});

// =============================================================================
// SecureStorageError
// =============================================================================

describe('SecureStorageError', () => {
  it('should have correct name and code', () => {
    const error = new SecureStorageError('test message', 'TEST_CODE');
    expect(error.name).toBe('SecureStorageError');
    expect(error.code).toBe('TEST_CODE');
    expect(error.message).toBe('test message');
    expect(error).toBeInstanceOf(Error);
  });
});

// =============================================================================
// CredentialCache
// =============================================================================

describe('CredentialCache', () => {
  let backend: StorageBackend;
  let encryption: EncryptionProvider;
  let secureStorage: SecureStorage;
  let cache: CredentialCache;

  beforeEach(async () => {
    backend = createMockBackend();
    encryption = createMockEncryption();
    secureStorage = new SecureStorage({
      deviceId: 'test-device-001',
      backend,
      encryption,
    });
    await secureStorage.unlock('test-pin');
    cache = new CredentialCache(secureStorage);
  });

  describe('store', () => {
    it('should store a credential with generated expiry', async () => {
      await cache.store({
        id: 'cred-001',
        type: 'TRADEPASS',
        data: { name: 'Gold Certificate' },
        signature: 'sig-abc',
        issuer: 'issuer-001',
      });

      const result = await cache.get('cred-001');
      expect(result.status).toBe('valid');
      expect(result.credential).not.toBeNull();
      expect(result.credential!.id).toBe('cred-001');
      expect(result.credential!.type).toBe('TRADEPASS');
    });

    it('should store with custom expiry', async () => {
      const customExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour
      await cache.store(
        {
          id: 'cred-002',
          type: 'GEOTAG',
          data: {},
          signature: 'sig-xyz',
          issuer: 'issuer-002',
        },
        { expiresAt: customExpiry }
      );

      const result = await cache.get('cred-002');
      expect(result.credential!.expiresAt).toBe(customExpiry);
    });

    it('should track credential keys', async () => {
      await cache.store({
        id: 'cred-a',
        type: 'TYPE_A',
        data: null,
        signature: 'sig',
        issuer: 'iss',
      });
      await cache.store({
        id: 'cred-b',
        type: 'TYPE_B',
        data: null,
        signature: 'sig',
        issuer: 'iss',
      });

      const keys = await secureStorage.get<string[]>('__credential_keys');
      expect(keys).toContain('cred-a');
      expect(keys).toContain('cred-b');
    });

    it('should not duplicate credential key on re-store', async () => {
      const cred = {
        id: 'cred-dup',
        type: 'TRADEPASS',
        data: null,
        signature: 'sig',
        issuer: 'iss',
      };

      await cache.store(cred);
      await cache.store(cred); // store again

      const keys = await secureStorage.get<string[]>('__credential_keys');
      const count = keys!.filter((k) => k === 'cred-dup').length;
      expect(count).toBe(1);
    });
  });

  describe('get', () => {
    it('should return not_found for missing credential', async () => {
      const result = await cache.get('nonexistent');
      expect(result.status).toBe('not_found');
      expect(result.credential).toBeNull();
    });

    it('should return valid for non-expired credential', async () => {
      await cache.store({
        id: 'cred-valid',
        type: 'TRADEPASS',
        data: {},
        signature: 'sig',
        issuer: 'iss',
      });

      const result = await cache.get('cred-valid');
      expect(result.status).toBe('valid');
      expect(result.credential).not.toBeNull();
    });

    it('should return expired for expired credential', async () => {
      const pastExpiry = new Date(Date.now() - 1000).toISOString();
      await cache.store(
        {
          id: 'cred-expired',
          type: 'TRADEPASS',
          data: {},
          signature: 'sig',
          issuer: 'iss',
        },
        { expiresAt: pastExpiry }
      );

      const result = await cache.get('cred-expired');
      expect(result.status).toBe('expired');
      expect(result.credential).toBeNull();
    });

    it('should return needs_refresh when within refresh buffer', async () => {
      // Default config: maxOfflineHours=72, credentialRefreshBuffer=24
      // So needs_refresh when within 24h of expiry
      const refreshCache = new CredentialCache(secureStorage, {
        ...DEFAULT_OFFLINE_CONFIG,
        credentialRefreshBuffer: 24,
      });

      // Expiry in 12 hours (within 24h buffer)
      const soonExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
      await refreshCache.store(
        {
          id: 'cred-refresh',
          type: 'TRADEPASS',
          data: {},
          signature: 'sig',
          issuer: 'iss',
        },
        { expiresAt: soonExpiry }
      );

      const result = await refreshCache.get('cred-refresh');
      expect(result.status).toBe('needs_refresh');
      expect(result.credential).not.toBeNull();
    });

    it('should remove expired credential on access', async () => {
      const pastExpiry = new Date(Date.now() - 1000).toISOString();
      await cache.store(
        {
          id: 'cred-auto-remove',
          type: 'TRADEPASS',
          data: {},
          signature: 'sig',
          issuer: 'iss',
        },
        { expiresAt: pastExpiry }
      );

      await cache.get('cred-auto-remove');

      // The credential should have been removed
      const secondGet = await cache.get('cred-auto-remove');
      expect(secondGet.status).toBe('not_found');
    });
  });

  describe('remove', () => {
    it('should remove a credential', async () => {
      await cache.store({
        id: 'cred-rm',
        type: 'TRADEPASS',
        data: {},
        signature: 'sig',
        issuer: 'iss',
      });

      await cache.remove('cred-rm');
      const result = await cache.get('cred-rm');
      expect(result.status).toBe('not_found');
    });

    it('should update tracked keys on remove', async () => {
      await cache.store({
        id: 'cred-track',
        type: 'TRADEPASS',
        data: {},
        signature: 'sig',
        issuer: 'iss',
      });
      await cache.remove('cred-track');

      const keys = await secureStorage.get<string[]>('__credential_keys');
      expect(keys).not.toContain('cred-track');
    });
  });

  describe('purgeExpired', () => {
    it('should purge expired credentials', async () => {
      const pastExpiry = new Date(Date.now() - 1000).toISOString();
      // Far-future expiry (well beyond the 24h refresh buffer)
      const futureExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await cache.store(
        { id: 'expired-1', type: 'A', data: {}, signature: 's', issuer: 'i' },
        { expiresAt: pastExpiry }
      );
      await cache.store(
        { id: 'expired-2', type: 'B', data: {}, signature: 's', issuer: 'i' },
        { expiresAt: pastExpiry }
      );
      await cache.store(
        { id: 'valid-1', type: 'C', data: {}, signature: 's', issuer: 'i' },
        { expiresAt: futureExpiry }
      );

      const purged = await cache.purgeExpired();
      expect(purged).toBe(2);

      // Valid credential should remain
      const valid = await cache.get('valid-1');
      expect(valid.status).toBe('valid');
    });

    it('should return 0 when nothing to purge', async () => {
      const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await cache.store(
        { id: 'still-valid', type: 'A', data: {}, signature: 's', issuer: 'i' },
        { expiresAt: futureExpiry }
      );

      const purged = await cache.purgeExpired();
      expect(purged).toBe(0);
    });

    it('should return 0 when cache is empty', async () => {
      const purged = await cache.purgeExpired();
      expect(purged).toBe(0);
    });
  });

  describe('CachedCredentialSchema', () => {
    it('should validate correct credential shape', () => {
      const valid = {
        id: 'cred-001',
        type: 'TRADEPASS',
        data: { name: 'test' },
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        signature: 'abc123',
        issuer: 'issuer-001',
      };

      expect(CachedCredentialSchema.safeParse(valid).success).toBe(true);
    });

    it('should reject invalid credential shape', () => {
      const invalid = { id: 'cred-001' }; // missing fields
      expect(CachedCredentialSchema.safeParse(invalid).success).toBe(false);
    });
  });
});

// =============================================================================
// Integrity Check
// =============================================================================

describe('createIntegrityCheck', () => {
  let integrity: IntegrityProvider;

  beforeEach(() => {
    integrity = createMockIntegrity();
  });

  it('should create hash-only check without signer', async () => {
    const data = { name: 'Gold', purity: 0.999 };
    const check = await createIntegrityCheck(data, 'key-1', integrity);

    expect(check.dataHash).toBeDefined();
    expect(check.signatureChain).toHaveLength(1);
    expect(check.signatureChain[0]).toBe(check.dataHash);
    expect(check.createdAt).toBeDefined();
    expect(check.lastVerified).toBeDefined();
  });

  it('should create signed check with signer', async () => {
    const signer = vi.fn(async (data: string, _key: string) => `sig-of-${data}`);
    const data = { commodity: 'cocoa' };
    const check = await createIntegrityCheck(data, 'key-2', integrity, signer);

    expect(check.signatureChain).toHaveLength(2);
    expect(check.signatureChain[0]).toBe(check.dataHash);
    expect(check.signatureChain[1]).toContain('sig-of-');
    expect(signer).toHaveBeenCalledWith(check.dataHash, 'key-2');
  });
});

describe('verifyIntegrity', () => {
  let integrity: IntegrityProvider;

  beforeEach(() => {
    integrity = createMockIntegrity();
  });

  it('should pass for unmodified data (hash-only)', async () => {
    const data = { test: 'value' };
    const check = await createIntegrityCheck(data, 'key-1', integrity);

    const result = await verifyIntegrity(data, check, 'key-1', integrity);
    expect(result.valid).toBe(true);
    expect(result.hashOnly).toBe(true);
  });

  it('should detect modified data', async () => {
    const original = { test: 'original' };
    const check = await createIntegrityCheck(original, 'key-1', integrity);

    const modified = { test: 'tampered' };
    const result = await verifyIntegrity(modified, check, 'key-1', integrity);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('DATA_MODIFIED');
  });

  it('should verify signed check with valid signature chain', async () => {
    const signer = vi.fn(async (data: string, _key: string) => `sig-of-${data}`);
    const data = { signed: true };
    const check = await createIntegrityCheck(data, 'trusted-key', integrity, signer);

    const result = await verifyIntegrity(data, check, 'trusted-key', integrity);
    expect(result.valid).toBe(true);
    expect(result.hashOnly).toBeUndefined();
  });

  it('should detect broken signature chain', async () => {
    const signer = vi.fn(async (data: string, _key: string) => `sig-of-${data}`);
    const data = { signed: true };
    const check = await createIntegrityCheck(data, 'key', integrity, signer);

    // Make integrity.verify return false
    (integrity.verify as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const result = await verifyIntegrity(data, check, 'key', integrity);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('CHAIN_BROKEN');
  });
});

// =============================================================================
// OfflineSyncTracker
// =============================================================================

describe('OfflineSyncTracker', () => {
  let secureStorage: SecureStorage;
  let tracker: OfflineSyncTracker;

  beforeEach(async () => {
    const backend = createMockBackend();
    const encryption = createMockEncryption();
    secureStorage = new SecureStorage({
      deviceId: 'test-device',
      backend,
      encryption,
    });
    await secureStorage.unlock('secret');
    tracker = new OfflineSyncTracker(secureStorage);
  });

  it('should record a change and return an id', async () => {
    const id = await tracker.recordChange({
      type: 'TRADEPASS',
      action: 'create',
      data: { name: 'Gold' },
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('should persist pending changes', async () => {
    await tracker.recordChange({
      type: 'TRADEPASS',
      action: 'create',
      data: { name: 'Gold' },
    });
    await tracker.recordChange({
      type: 'GEOTAG',
      action: 'update',
      data: { lat: 5.0 },
    });

    const changes = await tracker.getPendingChanges();
    expect(changes).toHaveLength(2);
    expect(changes[0]!.type).toBe('TRADEPASS');
    expect(changes[0]!.action).toBe('create');
    expect(changes[1]!.type).toBe('GEOTAG');
    expect(changes[1]!.action).toBe('update');
  });

  it('should mark changes as synced', async () => {
    const id1 = await tracker.recordChange({
      type: 'A',
      action: 'create',
      data: null,
    });
    const id2 = await tracker.recordChange({
      type: 'B',
      action: 'delete',
      data: null,
    });
    const id3 = await tracker.recordChange({
      type: 'C',
      action: 'update',
      data: null,
    });

    await tracker.markSynced([id1, id3]);

    const remaining = await tracker.getPendingChanges();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]!.id).toBe(id2);
  });

  it('should return empty array when no pending changes', async () => {
    const changes = await tracker.getPendingChanges();
    expect(changes).toEqual([]);
  });

  it('should include timestamps in recorded changes', async () => {
    const before = new Date().toISOString();
    await tracker.recordChange({
      type: 'TEST',
      action: 'create',
      data: null,
    });
    const after = new Date().toISOString();

    const changes = await tracker.getPendingChanges();
    expect(changes[0]!.timestamp).toBeDefined();
    expect(changes[0]!.timestamp >= before).toBe(true);
    expect(changes[0]!.timestamp <= after).toBe(true);
  });
});
