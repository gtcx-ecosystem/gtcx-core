import { generateKeyPair, sign } from '@gtcx/crypto';
import {
  createTokenPayload,
  assembleToken,
  verifyTokenSignature,
  SecureStorageBase,
  type StorageBackend,
} from '@gtcx/security';
import { tracedGenerateCertificate, tracedVerifyCertificate } from '@gtcx/verification';
import { describe, it, expect, afterEach, vi } from 'vitest';

class IntegrationTestSecureStorage extends SecureStorageBase {
  constructor(
    config: ConstructorParameters<typeof SecureStorageBase>[0] = {},
    private readonly store: Map<string, string> = new Map()
  ) {
    super(config);
  }

  protected async deriveKey(secret: string, _salt: Uint8Array): Promise<Uint8Array> {
    return new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32));
  }

  protected async encrypt(plaintext: Uint8Array, key: Uint8Array) {
    const ciphertext = new Uint8Array(plaintext.length);
    const iv = new Uint8Array(12);
    const tag = new Uint8Array(16);

    for (let i = 0; i < plaintext.length; i++) {
      ciphertext[i] = plaintext[i]! ^ key[i % key.length]!;
    }

    return { ciphertext, iv, tag };
  }

  protected async decrypt(
    ciphertext: Uint8Array,
    key: Uint8Array,
    _iv: Uint8Array,
    _tag: Uint8Array
  ) {
    const plaintext = new Uint8Array(ciphertext.length);

    for (let i = 0; i < ciphertext.length; i++) {
      plaintext[i] = ciphertext[i]! ^ key[i % key.length]!;
    }

    return plaintext;
  }

  protected getStorage(): StorageBackend {
    return {
      getItem: async (key: string) => this.store.get(key) ?? null,
      setItem: async (key: string, value: string) => {
        this.store.set(key, value);
      },
      removeItem: async (key: string) => {
        this.store.delete(key);
      },
      getAllKeys: async () => [...this.store.keys()],
      clear: async () => {
        this.store.clear();
      },
    };
  }

  protected async getDeviceSalt(): Promise<Uint8Array> {
    return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  }
}

function makeLocation() {
  return {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
  };
}

describe('Integration: security and verification contracts', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('verifies traced certificates generated through public exports', async () => {
    const keyPair = generateKeyPair();

    const certificate = await tracedGenerateCertificate({
      type: 'location',
      securityLevel: 'standard',
      location: makeLocation(),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });

    const validResult = await tracedVerifyCertificate(certificate);
    expect(validResult.isValid).toBe(true);

    const tamperedCertificate = {
      ...certificate,
      metadata: {
        ...certificate.metadata,
        deviceId: 'tampered-device',
      },
    };

    const tamperedResult = await tracedVerifyCertificate(tamperedCertificate);
    expect(tamperedResult.isValid).toBe(false);
    expect(tamperedResult.checks.signatureValid).toBe(false);
  });

  it('verifies tokens assembled from raw signature bytes through public exports', () => {
    const keyPair = generateKeyPair();
    const payload = createTokenPayload({ iss: 'gtcx', sub: 'user-001', exp: 0, iat: 0 });
    const signatureHex = sign(payload, keyPair.privateKey);
    const signatureBytes = Uint8Array.from(Buffer.from(signatureHex, 'hex'));

    const token = assembleToken(payload, signatureBytes);
    const result = verifyTokenSignature(token, keyPair.publicKey);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('expires secure-storage lockouts after the configured duration', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const storage = new IntegrationTestSecureStorage({
      maxFailedAttempts: 2,
      wipeOnExceed: false,
      lockoutDurationSeconds: 30,
    });

    await storage.unlock('correct-secret');
    storage.lock();

    await storage.unlock('wrong-secret');
    await storage.unlock('wrong-secret');

    const blocked = await storage.unlock('correct-secret');
    expect(blocked.success).toBe(false);
    expect(blocked.error).toBe('LOCKED_OUT');

    vi.setSystemTime(new Date('2026-01-01T00:00:31Z'));

    const recovered = await storage.unlock('correct-secret');
    expect(recovered.success).toBe(true);
  });

  it('preserves secure-storage lockout state across instance restarts', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const backingStore = new Map<string, string>();
    const config = {
      maxFailedAttempts: 2,
      wipeOnExceed: false,
      lockoutDurationSeconds: 30,
    };

    const firstInstance = new IntegrationTestSecureStorage(config, backingStore);
    await firstInstance.unlock('correct-secret');
    firstInstance.lock();

    await firstInstance.unlock('wrong-secret');
    await firstInstance.unlock('wrong-secret');

    const restartedInstance = new IntegrationTestSecureStorage(config, backingStore);
    const blocked = await restartedInstance.unlock('correct-secret');
    expect(blocked.success).toBe(false);
    expect(blocked.error).toBe('LOCKED_OUT');

    vi.setSystemTime(new Date('2026-01-01T00:00:31Z'));

    const recovered = await restartedInstance.unlock('correct-secret');
    expect(recovered.success).toBe(true);
  });

  it('fails safe when persisted lockout state is corrupted after restart', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

    const backingStore = new Map<string, string>();
    backingStore.set('gtcx_secure___lockout_state', '{corrupted-json');

    const storage = new IntegrationTestSecureStorage(
      {
        maxFailedAttempts: 2,
        wipeOnExceed: false,
        lockoutDurationSeconds: 30,
      },
      backingStore
    );

    const blocked = await storage.unlock('correct-secret');
    expect(blocked.success).toBe(false);
    expect(blocked.error).toBe('LOCKED_OUT');
  });
});
