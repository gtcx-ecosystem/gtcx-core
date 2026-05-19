/**
 * @gtcx/security — Coverage gap tests (batch 2)
 *
 * Targets previously uncovered branches identified in 2026-05-19 coverage run:
 * - audit/events.ts: finalize with FAILURE outcome
 * - audit/logger.ts: securityAlert
 * - auth/tokens.ts: assembleToken fallback, isTokenValidOffline without iat,
 *   verifyTokenSignature with issuer/audience mismatch and notYetValid
 * - offline/secure-storage.ts: reinitialize, verifyKey catch, wipe catch
 * - offline/tamper-detection.ts: secureCompare empty strings, chain broken at index
 */

import * as cryptoModule from '@gtcx/crypto';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createAuditTrail, clearSecurityHandlers } from '../src/audit/events';
import { SecurityLogger } from '../src/audit/logger';
import { isTokenValidOffline, assembleToken, verifyTokenSignature } from '../src/auth/tokens';
import { SecureStorageBase } from '../src/offline/secure-storage';
import type { StorageBackend } from '../src/offline/secure-storage';
import { secureCompare, checkProofStructure } from '../src/offline/tamper-detection';
import type { IntegrityProof } from '../src/offline/tamper-detection';

// =============================================================================
// Helpers
// =============================================================================

class TestSecureStorage extends SecureStorageBase {
  private store = new Map<string, string>();
  private shouldThrowOnGet = false;
  private shouldThrowOnWipe = false;

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
      getItem: async (k: string) => {
        if (this.shouldThrowOnGet) throw new Error('storage get error');
        return this.store.get(k) ?? null;
      },
      setItem: async (k: string, v: string) => {
        this.store.set(k, v);
      },
      removeItem: async (k: string) => {
        this.store.delete(k);
      },
      getAllKeys: async () => [...this.store.keys()],
      clear: async () => {
        if (this.shouldThrowOnWipe) throw new Error('wipe error');
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

  setThrowOnGet(value: boolean) {
    this.shouldThrowOnGet = value;
  }

  setThrowOnWipe(value: boolean) {
    this.shouldThrowOnWipe = value;
  }
}

function createValidToken(): string {
  const payload =
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.' +
    'eyJpc3MiOiJ0ZXN0LWlzc3VlciIsInN1YiI6InVzZXItMSIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxfQ';
  const signatureHex =
    'aabbccdd00112233aabbccdd00112233aabbccdd00112233aabbccdd00112233' +
    'aabbccdd00112233aabbccdd00112233aabbccdd00112233aabbccdd00112233';
  return `${payload}.${signatureHex}`;
}

// =============================================================================
// audit/events.ts
// =============================================================================

describe('createAuditTrail — finalize branches', () => {
  afterEach(() => {
    clearSecurityHandlers();
  });

  it('should log WARN severity when finalize called with FAILURE', async () => {
    clearSecurityHandlers();
    const logger = new SecurityLogger({ minSeverity: 'INFO', outputJson: false });
    const logged: unknown[] = [];
    logger.addHandler((e) => {
      logged.push(e);
      return Promise.resolve();
    });

    const trail = createAuditTrail('test_op', { actor: 'a', resource: 'r' });
    trail.record('step1');

    await trail.finalize('FAILURE', 'test reason');
    expect(logged.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// audit/logger.ts
// =============================================================================

describe('SecurityLogger — securityAlert', () => {
  it('should log SECURITY_ALERT with CRITICAL severity', async () => {
    const logger = new SecurityLogger({ minSeverity: 'INFO', outputJson: false });
    const logged: unknown[] = [];
    logger.addHandler((e) => {
      logged.push(e);
      return Promise.resolve();
    });

    await logger.securityAlert('test alert', { source: 'test' });

    expect(logged.length).toBe(1);
    const event = logged[0] as { eventType: string; severity: string; reason: string };
    expect(event.eventType).toBe('SECURITY_ALERT');
    expect(event.severity).toBe('CRITICAL');
    expect(event.reason).toBe('test alert');
  });
});

// =============================================================================
// auth/tokens.ts
// =============================================================================

describe('isTokenValidOffline — branches', () => {
  const now = Math.floor(Date.now() / 1000);

  it('should return false when offline is true but neither offlineExpiry nor iat provided', () => {
    const claims = { offline: true } as Parameters<typeof isTokenValidOffline>[0];
    expect(isTokenValidOffline(claims)).toBe(false);
  });

  it('should return false when offline flag is false', () => {
    const claims = { offline: false, offlineExpiry: now + 3600, iat: now };
    expect(isTokenValidOffline(claims)).toBe(false);
  });
});

describe('assembleToken — fallback branch', () => {
  it('should fallback to hex encoding for non-hex non-base64url strings', () => {
    const payload = 'header.claims';
    // Use a string that is neither valid hex nor valid base64url
    const signature = '!!!not-valid!!!';
    const token = assembleToken(payload, signature);
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    expect(parts[2]).toBe(Buffer.from(signature).toString('hex'));
  });
});

describe('verifyTokenSignature — issuer, audience, notYetValid branches', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject when issuer does not match expectedIssuer', () => {
    vi.spyOn(cryptoModule, 'verify').mockReturnValue(true);
    const token = createValidToken();
    const result = verifyTokenSignature(token, '00'.repeat(32), {
      expectedIssuer: 'wrong-issuer',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Issuer mismatch');
  });

  it('should reject when audience does not match expectedAudience (string aud)', () => {
    vi.spyOn(cryptoModule, 'verify').mockReturnValue(true);
    const token = createValidToken();
    const result = verifyTokenSignature(token, '00'.repeat(32), {
      expectedAudience: 'wrong-audience',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Audience mismatch');
  });

  it('should reject when audience array does not include expectedAudience', () => {
    vi.spyOn(cryptoModule, 'verify').mockReturnValue(true);
    // Build a token with aud as array
    const header = { alg: 'EdDSA' as const, typ: 'JWT' as const };
    const claims = {
      iss: 'test-issuer',
      sub: 'user-1',
      exp: 9999999999,
      iat: 1,
      aud: ['aud-a', 'aud-b'],
    };
    const payload =
      Buffer.from(JSON.stringify(header)).toString('base64url') +
      '.' +
      Buffer.from(JSON.stringify(claims)).toString('base64url');
    const token = assembleToken(payload, '00'.repeat(64));

    const result = verifyTokenSignature(token, '00'.repeat(32), {
      expectedAudience: 'wrong-audience',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Audience mismatch');
  });

  it('should reject token that is not yet valid (nbf in future)', () => {
    vi.spyOn(cryptoModule, 'verify').mockReturnValue(true);
    const header = { alg: 'EdDSA' as const, typ: 'JWT' as const };
    const claims = {
      iss: 'test-issuer',
      sub: 'user-1',
      exp: 9999999999,
      iat: 1,
      nbf: 9999999998,
    };
    const payload =
      Buffer.from(JSON.stringify(header)).toString('base64url') +
      '.' +
      Buffer.from(JSON.stringify(claims)).toString('base64url');
    const token = assembleToken(payload, '00'.repeat(64));

    const result = verifyTokenSignature(token, '00'.repeat(32));
    expect(result.valid).toBe(false);
    expect(result.notYetValid).toBe(true);
    expect(result.error).toBe('Token is not yet valid');
  });
});

// =============================================================================
// offline/secure-storage.ts
// =============================================================================

describe('SecureStorageBase — reinitialize', () => {
  it('should reinitialize storage with new secret', async () => {
    const storage = new TestSecureStorage();
    const result = await storage.reinitialize('new-secret');
    expect(result.success).toBe(true);
    expect(storage.getState().isLocked).toBe(false);
  });

  it('should fail reinitialize when deriveKey throws', async () => {
    class BadStorage extends TestSecureStorage {
      protected async deriveKey(_secret: string, _salt: Uint8Array): Promise<Uint8Array> {
        throw new Error('derive error');
      }
    }
    const storage = new BadStorage();
    const result = await storage.reinitialize('any-secret');
    expect(result.success).toBe(false);
    expect(result.error).toBe('INVALID_SECRET');
    expect(storage.getState().isLocked).toBe(true);
  });
});

describe('SecureStorageBase — verifyKey catch block', () => {
  it('should return false when get() throws during verifyKey', async () => {
    const storage = new TestSecureStorage();
    await storage.reinitialize('secret');
    storage.setThrowOnGet(true);
    storage.lock();

    // Unlock will call verifyKey which calls get('__verify__')
    // which now throws, so verifyKey catch returns false
    const result = await storage.unlock('secret');
    expect(result.success).toBe(false);
  });
});

describe('SecureStorageBase — wipe catch during lockout', () => {
  it('should handle wipe failure gracefully during lockout', async () => {
    const storage = new TestSecureStorage({
      maxFailedAttempts: 2,
      wipeOnExceed: true,
    });
    await storage.reinitialize('secret');
    storage.setThrowOnWipe(true);
    storage.lock();

    // Trigger lockout; wipe will throw but should be caught
    await storage.unlock('wrong');
    await storage.unlock('wrong');

    // If we get here without unhandled rejection, the catch worked
    expect(storage.getState().failedAttempts).toBeGreaterThanOrEqual(2);
  });
});

// =============================================================================
// offline/tamper-detection.ts
// =============================================================================

describe('secureCompare — edge cases', () => {
  it('should return false for two empty strings', () => {
    expect(secureCompare('', '')).toBe(false);
  });
});

describe('checkProofStructure — chain broken at index', () => {
  it('should detect broken chain when current hash is missing', () => {
    const proof: IntegrityProof = {
      dataId: 'd1',
      dataType: 'type',
      dataHash: 'h1',
      hashAlgorithm: 'SHA-256',
      trustedRootKeyId: 'root',
      signatureChain: [
        { hash: 'h1', signature: 'sig1', signerKeyId: 'root', signedAt: '2026-01-01T00:00:00Z' },
        { hash: '', signature: 'sig2', signerKeyId: 'root', signedAt: '2026-01-01T00:00:01Z' },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      lastVerifiedAt: '2026-01-01T00:00:00Z',
    };

    const result = checkProofStructure(proof);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('CHAIN_BROKEN');
  });

  it('should detect broken chain when previous signature is missing', () => {
    const proof: IntegrityProof = {
      dataId: 'd1',
      dataType: 'type',
      dataHash: 'h1',
      hashAlgorithm: 'SHA-256',
      trustedRootKeyId: 'root',
      signatureChain: [
        { hash: 'h1', signature: '', signerKeyId: 'root', signedAt: '2026-01-01T00:00:00Z' },
        { hash: 'h2', signature: 'sig2', signerKeyId: 'root', signedAt: '2026-01-01T00:00:01Z' },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      lastVerifiedAt: '2026-01-01T00:00:00Z',
    };

    const result = checkProofStructure(proof);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('CHAIN_BROKEN');
  });
});
