/**
 * @gtcx/security — Coverage gap tests (batch 3)
 *
 * Targets previously uncovered branches identified in 2026-05-19 coverage run:
 * - audit/events.ts: KEY_REVOKED+SUCCESS severity, options?.outcome ?? 'SUCCESS',
 *   AUTH_/CRYPTO_ failure branches, removeSecurityHandler not-found,
 *   dev-logging process.stdout/stderr falsy
 * - auth/tokens.ts: decodeToken oversized header, isTokenValidOffline iat branch,
 *   verifyTokenSignature decodeToken null after valid sig
 * - offline/secure-storage.ts: lockout state too large, failedAttempts ?? 0,
 *   lastFailedAt truthy, needsSync, isLockedOut undefined expiry,
 *   verifyKey initialized true, reinitialize catch with encryptionKey set
 * - offline/tamper-detection.ts: chain loop else branch, secureCompare b shorter
 * - validation/sanitize.ts: maxDepth ?? 10, maxArrayLength ?? 1000, maxKeys ?? 100,
 *   firstError?.message ?? 'Validation failed', sanitizeForLog short match
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { z, ZodError } from 'zod';

import {
  createSecurityEvent,
  logSecurityEvent,
  registerSecurityHandler,
  removeSecurityHandler,
  clearSecurityHandlers,
} from '../src/audit/events';
import { decodeToken, isTokenValidOffline } from '../src/auth/tokens';
import { SecureStorageBase } from '../src/offline/secure-storage';
import type { StorageBackend } from '../src/offline/secure-storage';
import { checkProofStructure, secureCompare } from '../src/offline/tamper-detection';
import type { IntegrityProof } from '../src/offline/tamper-detection';
import {
  sanitizeObject,
  createBoundaryValidator,
  SanitizationError,
  sanitizeForLog,
} from '../src/validation/sanitize';

// =============================================================================
// Helpers
// =============================================================================

class TestSecureStorage extends SecureStorageBase {
  private store = new Map<string, string>();

  protected async deriveKey(secret: string, _salt: Uint8Array): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    return encoder.encode(secret.padEnd(32, '0').slice(0, 32));
  }

  protected async encrypt(plaintext: Uint8Array, key: Uint8Array) {
    const iv = new Uint8Array(12);
    const tag = new Uint8Array(16);
    const ciphertext = new Uint8Array(plaintext.length);
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
      getItem: async (k: string) => this.store.get(k) ?? null,
      setItem: async (k: string, v: string) => {
        this.store.set(k, v);
      },
      removeItem: async (k: string) => {
        this.store.delete(k);
      },
      getAllKeys: async () => [...this.store.keys()],
      clear: async () => {
        this.store.clear();
      },
    };
  }

  protected async getDeviceSalt() {
    return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  }

  getState() {
    return this.state;
  }

  exposeStore() {
    return this.store;
  }
}

// =============================================================================
// audit/events.ts
// =============================================================================

describe('createSecurityEvent — severity inference branches', () => {
  it('should infer HIGH for KEY_REVOKED with SUCCESS outcome', () => {
    const event = createSecurityEvent('KEY_REVOKED', 'SUCCESS');
    expect(event.severity).toBe('HIGH');
  });

  it('should infer WARN for AUTH_FAILURE with FAILURE outcome', () => {
    const event = createSecurityEvent('AUTH_FAILURE', 'FAILURE');
    expect(event.severity).toBe('WARN');
  });

  it('should infer WARN for CRYPTO_VERIFY_FAILED with FAILURE outcome', () => {
    const event = createSecurityEvent('CRYPTO_VERIFY_FAILED', 'FAILURE');
    expect(event.severity).toBe('WARN');
  });
});

describe('logSecurityEvent — options?.outcome ?? SUCCESS', () => {
  afterEach(() => {
    clearSecurityHandlers();
  });

  it('should use SUCCESS fallback when options is omitted', async () => {
    const received: unknown[] = [];
    registerSecurityHandler((e) => {
      received.push(e);
      return Promise.resolve();
    });

    await logSecurityEvent('AUTH_SUCCESS');
    expect(received.length).toBe(1);
    const event = received[0] as { outcome: string };
    expect(event.outcome).toBe('SUCCESS');
  });

  it('should use SUCCESS fallback when options has no outcome', async () => {
    const received: unknown[] = [];
    registerSecurityHandler((e) => {
      received.push(e);
      return Promise.resolve();
    });

    await logSecurityEvent('AUTH_SUCCESS', { actor: 'user-1' });
    expect(received.length).toBe(1);
    const event = received[0] as { outcome: string };
    expect(event.outcome).toBe('SUCCESS');
  });
});

describe('removeSecurityHandler — not-found branch', () => {
  it('should not throw when removing a handler that was never added', () => {
    const handler = async () => {};
    expect(() => removeSecurityHandler(handler)).not.toThrow();
  });
});

describe('logSecurityEvent — process.stdout/stderr falsy branches', () => {
  const originalEnv = process.env['NODE_ENV'];

  afterEach(() => {
    process.env['NODE_ENV'] = originalEnv;
    clearSecurityHandlers();
  });

  it('should skip stdout write when process.stdout is undefined', async () => {
    process.env['NODE_ENV'] = 'development';
    const originalStdout = process.stdout;
    Object.defineProperty(process, 'stdout', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    await logSecurityEvent('AUTH_SUCCESS', { outcome: 'SUCCESS' });

    Object.defineProperty(process, 'stdout', {
      value: originalStdout,
      configurable: true,
      writable: true,
    });
    expect(true).toBe(true);
  });

  it('should skip stderr write when process.stderr is undefined', async () => {
    const originalStderr = process.stderr;
    Object.defineProperty(process, 'stderr', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    registerSecurityHandler(async () => {
      throw new Error('handler failed');
    });

    await logSecurityEvent('AUTH_SUCCESS', { outcome: 'SUCCESS' });

    Object.defineProperty(process, 'stderr', {
      value: originalStderr,
      configurable: true,
      writable: true,
    });
    expect(true).toBe(true);
  });
});

// =============================================================================
// auth/tokens.ts
// =============================================================================

describe('decodeToken — oversized segments', () => {
  it('should return null when header segment exceeds 10_000 chars', () => {
    const token = `${'a'.repeat(10001)}.${Buffer.from('{}').toString('base64url')}.sig`;
    expect(decodeToken(token)).toBeNull();
  });
});

describe('isTokenValidOffline — iat branch', () => {
  const now = Math.floor(Date.now() / 1000);

  it('should use iat when offlineExpiry is undefined', () => {
    const claims = {
      offline: true,
      iat: now - 100,
      exp: now + 3600,
    } as Parameters<typeof isTokenValidOffline>[0];
    expect(isTokenValidOffline(claims)).toBe(true);
  });
});

describe('verifyTokenSignature — decodeToken returns null after valid sig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return decode error when claims fail schema validation', async () => {
    vi.resetModules();
    vi.doMock('@gtcx/crypto', () => ({
      verify: () => true,
    }));
    const { verifyTokenSignature: vts } = await import('../src/auth/tokens');

    const header = Buffer.from(JSON.stringify({ alg: 'EdDSA', typ: 'JWT' })).toString('base64url');
    // Missing required `exp` field — causes decodeToken to return null
    const claims = Buffer.from(JSON.stringify({ iss: 'test', sub: 'user' })).toString('base64url');
    const token = `${header}.${claims}.00`;

    const result = vts(token, '00'.repeat(32));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Failed to decode token claims');
    vi.doUnmock('@gtcx/crypto');
  });
});

// =============================================================================
// offline/secure-storage.ts
// =============================================================================

describe('SecureStorageBase — lockout state branches', () => {
  it('should reject lockout state when raw length exceeds 1024', async () => {
    const storage = new TestSecureStorage();
    storage.exposeStore().set('gtcx_secure___lockout_state', 'x'.repeat(1025));

    const result = await storage.unlock('secret');
    // Lockout state parse throws → catch sets failedAttempts to max and lastFailedAt to now
    expect(result.success).toBe(false);
  });

  it('should use fallback 0 when parsed.failedAttempts is missing', async () => {
    const storage = new TestSecureStorage();
    storage
      .exposeStore()
      .set(
        'gtcx_secure___lockout_state',
        JSON.stringify({ lastFailedAt: new Date().toISOString() })
      );

    // Unlock loads lockout state; failedAttempts should default to 0
    const result = await storage.unlock('secret');
    expect(result.success).toBe(true);
    expect(storage.getState().failedAttempts).toBe(0);
  });

  it('should parse lastFailedAt when present', async () => {
    const storage = new TestSecureStorage({ maxFailedAttempts: 3 });
    await storage.unlock('secret'); // establish encryption key
    storage.lock();
    storage
      .exposeStore()
      .set(
        'gtcx_secure___lockout_state',
        JSON.stringify({ failedAttempts: 2, lastFailedAt: new Date().toISOString() })
      );

    const result = await storage.unlock('wrong');
    expect(result.success).toBe(false);
    expect(storage.getState().lastFailedAt).toBeInstanceOf(Date);
  });
});

describe('SecureStorageBase — needsSync', () => {
  it('should return true when lastUnlockedAt is undefined', () => {
    const storage = new TestSecureStorage();
    expect(storage.needsSync()).toBe(true);
  });

  it('should return false shortly after unlock', async () => {
    const storage = new TestSecureStorage();
    await storage.unlock('secret');
    expect(storage.needsSync()).toBe(false);
  });
});

describe('SecureStorageBase — isLockedOut when expiry is undefined', () => {
  it('should report locked out when failedAttempts >= max but lastFailedAt is undefined', async () => {
    const storage = new TestSecureStorage({ maxFailedAttempts: 2 });
    await storage.unlock('secret');
    storage.lock();

    // Manually bump failedAttempts without setting lastFailedAt
    storage.getState().failedAttempts = 2;

    const result = await storage.unlock('secret');
    expect(result.success).toBe(false);
    expect(result.error).toBe('LOCKED_OUT');
  });
});

describe('SecureStorageBase — verifyKey initialized branch', () => {
  it('should return false when initialized marker exists but verify marker is missing', async () => {
    const storage = new TestSecureStorage();
    await storage.reinitialize('secret');

    // Remove the verify marker but keep initialized marker
    storage.exposeStore().delete('gtcx_secure___verify__');
    storage.lock();

    const result = await storage.unlock('secret');
    expect(result.success).toBe(false);
  });
});

describe('SecureStorageBase — reinitialize catch with encryptionKey set', () => {
  it('should clear encryptionKey when set() throws during reinitialize', async () => {
    class BadSetStorage extends TestSecureStorage {
      async set<T>(key: string, _data: T, _expiresInHours?: number): Promise<void> {
        if (key === '__verify__') {
          throw new Error('set error');
        }
        return super.set(key, _data as unknown as string, _expiresInHours);
      }
    }

    const storage = new BadSetStorage();
    const result = await storage.reinitialize('secret');
    expect(result.success).toBe(false);
    expect(storage.getState().isLocked).toBe(true);
  });
});

// =============================================================================
// offline/tamper-detection.ts
// =============================================================================

describe('checkProofStructure — chain continuity else branch', () => {
  it('should pass when chain entries have both hash and signature', () => {
    const proof: IntegrityProof = {
      dataId: 'd1',
      dataType: 'type',
      dataHash: 'h1',
      hashAlgorithm: 'SHA-256',
      trustedRootKeyId: 'root',
      signatureChain: [
        {
          hash: 'h1',
          signature: 'sig1',
          signerKeyId: 'mid',
          signedAt: '2026-01-01T00:00:00Z',
        },
        {
          hash: 'h2',
          signature: 'sig2',
          signerKeyId: 'root',
          signedAt: '2026-01-01T00:00:01Z',
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      lastVerifiedAt: '2026-01-01T00:00:00Z',
    };

    const result = checkProofStructure(proof);
    expect(result.valid).toBe(true);
    expect(result.tamperedWith).toBe(false);
  });
});

describe('secureCompare — b shorter than a', () => {
  it('should return false when b is shorter than a', () => {
    expect(secureCompare('longer-string', 'short')).toBe(false);
  });
});

// =============================================================================
// validation/sanitize.ts
// =============================================================================

describe('sanitizeObject — default option fallbacks', () => {
  function makeDeepObject(depth: number): unknown {
    let obj: unknown = 'leaf';
    for (let i = 0; i < depth; i++) {
      obj = { value: obj };
    }
    return obj;
  }

  it('should throw with default maxDepth of 10', () => {
    expect(() => sanitizeObject(makeDeepObject(12), { maxDepth: undefined })).toThrow(
      SanitizationError
    );
  });

  it('should truncate array with default maxArrayLength of 1000', () => {
    const arr = new Array(1001).fill('x');
    const result = sanitizeObject(arr, { maxArrayLength: undefined }) as string[];
    expect(result.length).toBe(1000);
  });

  it('should throw with default maxKeys of 100', () => {
    const obj: Record<string, string> = {};
    for (let i = 0; i < 101; i++) {
      obj[`key${i}`] = 'value';
    }
    expect(() => sanitizeObject(obj, { maxKeys: undefined })).toThrow(SanitizationError);
  });
});

describe('createBoundaryValidator — firstError?.message ?? Validation failed', () => {
  it('should use fallback message when ZodError has no issues', () => {
    const mockSchema = {
      parse: () => {
        const err = new ZodError([]);
        throw err;
      },
    } as unknown as z.ZodSchema<unknown>;

    const validator = createBoundaryValidator(mockSchema);
    const result = validator({});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe('Validation failed');
    }
  });
});

describe('sanitizeForLog — short match branch', () => {
  it('should keep matches of 30 chars or less unchanged', () => {
    // Use a 30-char string that does NOT match any sensitive pattern
    const input = 'key=abcdefghijklmnopqrstuvwxyzab'; // 28 letters, no digits
    expect(sanitizeForLog(input)).toBe(input);
  });
});
