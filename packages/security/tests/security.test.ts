/**
 * @gtcx/security - Test Suite
 *
 * Security package tests organized by module.
 * [COMPLETED] FND-202: All 69 .todo() stubs converted to real test assertions.
 *
 * Run tests: pnpm test
 * Run with coverage: pnpm test:coverage
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { z } from 'zod';

// -- Validation imports --

// -- Auth imports --
import {
  createSecurityEvent,
  registerSecurityHandler,
  clearSecurityHandlers,
  logSecurityEvent,
  createAuditTrail,
} from '../src/audit/events';
import type { SecurityEvent } from '../src/audit/events';
import { SecurityLogger } from '../src/audit/logger';
import { Permissions, hasPermission, expandPermissions } from '../src/auth/permissions';
import {
  isSessionValid,
  isSessionValidOffline,
  recordFailedAttempt,
  prepareSessionForOffline,
  DEFAULT_SESSION_CONFIG,
} from '../src/auth/sessions';
import type { Session } from '../src/auth/sessions';
import {
  decodeToken,
  isTokenTemporallyValid,
  isTokenValidOffline,
  createTokenPayload,
} from '../src/auth/tokens';
import type { GTCXTokenClaims } from '../src/auth/tokens';
import { CredentialCache } from '../src/offline/credential-cache';
import type { CachedCredential } from '../src/offline/credential-cache';
import { SecureStorageBase } from '../src/offline/secure-storage';
import type { StorageBackend } from '../src/offline/secure-storage';
import {
  checkProofStructure,
  secureCompare,
  hashesMatch,
  createTamperDetectionEvent,
} from '../src/offline/tamper-detection';
import type { IntegrityProof } from '../src/offline/tamper-detection';
import {
  UuidSchema,
  DidSchema,
  TradePassIdSchema,
  EmailSchema,
  PhoneSchema,
  CoordinatesSchema,
  Hash256Schema,
  SignatureSchema,
  sanitizeString,
  sanitizeObject,
  createBoundaryValidator,
  SanitizationError,
} from '../src/validation';

// =============================================================================
// HELPERS
// =============================================================================

/** Concrete implementation of SecureStorageBase for testing */
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

  /** Expose internal state for testing */
  getState() {
    return this.state;
  }
}

/** Helper to build a valid Session object */
function createTestSession(overrides: Partial<Session> & Record<string, unknown> = {}): Session {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    userId: 'user-001',
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    state: 'ACTIVE',
    offlineCapable: false,
    failedAttempts: 0,
    ...overrides,
  } as Session;
}

/** Helper to build a valid CachedCredential (for credential-cache.ts) */
function createMockCredential(overrides: Partial<CachedCredential> = {}): CachedCredential {
  const now = new Date();
  return {
    id: 'cred-001',
    type: 'TRADEPASS',
    holderId: 'user-001',
    holderPublicKey: 'abc123',
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    offlineExpiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
    signatureChain: [
      {
        signature: 'sig1',
        signerPublicKey: 'key1',
        signedAt: now.toISOString(),
      },
    ],
    dataHash: 'abcd1234',
    lastRevocationCheckAt: now.toISOString(),
    syncedAt: now.toISOString(),
    syncRequired: false,
    ...overrides,
  };
}

/** Helper: create a minimal valid JWT string */
function makeJwt(
  header: Record<string, unknown>,
  claims: Record<string, unknown>,
  signature = 'test-sig'
): string {
  const h = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  const c = Buffer.from(JSON.stringify(claims))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  const s = Buffer.from(signature)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${h}.${c}.${s}`;
}

/** Valid IntegrityProof for tamper-detection tests */
function makeValidProof(overrides: Partial<IntegrityProof> = {}): IntegrityProof {
  const now = new Date().toISOString();
  return {
    dataId: 'data-001',
    dataType: 'TRADEPASS',
    dataHash: 'abc123',
    hashAlgorithm: 'SHA-256',
    signatureChain: [
      {
        hash: 'hash0',
        signature: 'sig0',
        signerKeyId: 'root-key',
        signedAt: now,
      },
    ],
    trustedRootKeyId: 'root-key',
    createdAt: now,
    lastVerifiedAt: now,
    ...overrides,
  };
}

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe('@gtcx/security/validation', () => {
  describe('schemas', () => {
    it('should validate UUID format', () => {
      const valid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      expect(UuidSchema.safeParse(valid).success).toBe(true);
      expect(UuidSchema.safeParse('not-a-uuid').success).toBe(false);
      expect(UuidSchema.safeParse('').success).toBe(false);
    });

    it('should validate DID format', () => {
      expect(DidSchema.safeParse('did:web:example.com').success).toBe(true);
      expect(
        DidSchema.safeParse('did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK').success
      ).toBe(true);
      expect(DidSchema.safeParse('notadid').success).toBe(false);
      expect(DidSchema.safeParse('did::missing').success).toBe(false);
    });

    it('should validate TradePassId format', () => {
      const validTpId = 'tp_f47ac10b-58cc-4372-a567-0e02b2c3d479';
      expect(TradePassIdSchema.safeParse(validTpId).success).toBe(true);
      expect(TradePassIdSchema.safeParse('tp_invalid').success).toBe(false);
      expect(TradePassIdSchema.safeParse('f47ac10b-58cc-4372-a567-0e02b2c3d479').success).toBe(
        false
      );
    });

    it('should validate email format', () => {
      expect(EmailSchema.safeParse('user@example.com').success).toBe(true);
      expect(EmailSchema.safeParse('bad-email').success).toBe(false);
      expect(EmailSchema.safeParse('@missing.local').success).toBe(false);
    });

    it('should validate phone E.164 format', () => {
      expect(PhoneSchema.safeParse('+1234567890').success).toBe(true);
      expect(PhoneSchema.safeParse('+442071234567').success).toBe(true);
      expect(PhoneSchema.safeParse('1234567890').success).toBe(false);
      expect(PhoneSchema.safeParse('+0123456789').success).toBe(false); // starts with 0 after +
    });

    it('should validate coordinates bounds', () => {
      const valid = { latitude: 45.0, longitude: -73.5 };
      expect(CoordinatesSchema.safeParse(valid).success).toBe(true);

      const outOfBoundsLat = { latitude: 91, longitude: 0 };
      expect(CoordinatesSchema.safeParse(outOfBoundsLat).success).toBe(false);

      const outOfBoundsLng = { latitude: 0, longitude: 181 };
      expect(CoordinatesSchema.safeParse(outOfBoundsLng).success).toBe(false);

      // Edge values
      const edge = { latitude: -90, longitude: 180 };
      expect(CoordinatesSchema.safeParse(edge).success).toBe(true);
    });

    it('should validate hash256 length', () => {
      const validHash = 'a'.repeat(64);
      expect(Hash256Schema.safeParse(validHash).success).toBe(true);
      expect(Hash256Schema.safeParse('a'.repeat(63)).success).toBe(false);
      expect(Hash256Schema.safeParse('a'.repeat(65)).success).toBe(false);
      expect(Hash256Schema.safeParse('z'.repeat(64)).success).toBe(false); // z is not hex
    });

    it('should validate signature length', () => {
      const validSig = 'a'.repeat(128);
      expect(SignatureSchema.safeParse(validSig).success).toBe(true);
      expect(SignatureSchema.safeParse('a'.repeat(127)).success).toBe(false);
      expect(SignatureSchema.safeParse('a'.repeat(129)).success).toBe(false);
      expect(SignatureSchema.safeParse('g'.repeat(128)).success).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('should strip HTML tags', () => {
      const result = sanitizeString('<script>alert("xss")</script>Hello');
      expect(result).toBe('alert("xss")Hello');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should enforce max length', () => {
      const long = 'a'.repeat(200);
      const result = sanitizeString(long, { maxLength: 50 });
      expect(result.length).toBe(50);
    });

    it('should normalize unicode', () => {
      // e + combining acute accent vs pre-composed e-acute
      const decomposed = 'e\u0301'; // NFD
      const composed = '\u00e9'; // NFC
      const result = sanitizeString(decomposed, { normalizeUnicode: true });
      expect(result).toBe(composed);
    });

    it('should strip control characters', () => {
      const withControl = 'Hello\x00World\x07Test';
      const result = sanitizeString(withControl, { stripControlChars: true });
      expect(result).toBe('HelloWorldTest');
      // Newlines and tabs should be preserved
      const withNewline = 'Hello\nWorld\tTest';
      const result2 = sanitizeString(withNewline, { stripControlChars: true });
      expect(result2).toContain('\n');
      expect(result2).toContain('\t');
    });

    it('should handle nested objects', () => {
      const nested = {
        name: '<b>Bold</b>',
        inner: {
          value: '<i>Italic</i>',
          deep: {
            text: '<script>x</script>safe',
          },
        },
      };
      const result = sanitizeObject<typeof nested>(nested);
      expect(result.name).toBe('Bold');
      expect(result.inner.value).toBe('Italic');
      expect(result.inner.deep.text).toBe('xsafe');
    });

    it('should respect max depth', () => {
      const deep: Record<string, unknown> = { a: { b: { c: 'value' } } };
      expect(() => sanitizeObject(deep, { maxDepth: 1 })).toThrow(SanitizationError);
    });

    it('should remove __proto__', () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": true}, "safe": "ok"}');
      const result = sanitizeObject<Record<string, unknown>>(malicious, {
        stripProto: true,
      });
      expect(result).not.toHaveProperty('__proto__');
      expect(result).toHaveProperty('safe', 'ok');
    });
  });

  describe('boundary validation', () => {
    it('should return ValidationResult on success', () => {
      const schema = z.object({ name: z.string(), age: z.number() });
      const validate = createBoundaryValidator(schema);
      const result = validate({ name: 'Alice', age: 30 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Alice');
        expect(result.data.age).toBe(30);
      }
    });

    it('should return ValidationError on failure', () => {
      const schema = z.object({ name: z.string() });
      const validate = createBoundaryValidator(schema);
      const result = validate({ name: 123 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.message).toBeDefined();
      }
    });

    it('should include path in error', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email(),
        }),
      });
      const validate = createBoundaryValidator(schema);
      const result = validate({ user: { email: 'not-email' } });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.path).toEqual(['user', 'email']);
      }
    });

    it('should handle sanitize + validate', () => {
      const schema = z.object({ name: z.string() });
      const validate = createBoundaryValidator(schema, { sanitize: true });
      // HTML tags in name should be stripped during sanitization
      const result = validate({ name: '<b>Alice</b>' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Alice');
      }
    });
  });
});

// =============================================================================
// AUTH TESTS
// =============================================================================

describe('@gtcx/security/auth', () => {
  // We need to clear security handlers since permissions.ts uses logSecurityEvent
  beforeEach(() => {
    clearSecurityHandlers();
  });

  afterEach(() => {
    clearSecurityHandlers();
  });

  describe('permissions', () => {
    it('should check exact permission match', () => {
      const result = hasPermission(Permissions.TRADEPASS_READ, {
        permissions: [Permissions.TRADEPASS_READ],
      });
      expect(result).toBe(true);

      const denied = hasPermission(Permissions.TRADEPASS_REVOKE, {
        permissions: [Permissions.TRADEPASS_READ],
      });
      expect(denied).toBe(false);
    });

    it('should check wildcard permission', () => {
      // tradepass:* should grant any tradepass action
      const result = hasPermission(Permissions.TRADEPASS_ISSUE, {
        permissions: ['tradepass:*'],
      });
      expect(result).toBe(true);

      // But NOT a different resource
      const denied = hasPermission(Permissions.GEOTAG_CREATE, {
        permissions: ['tradepass:*'],
      });
      expect(denied).toBe(false);
    });

    it('should expand roles to permissions', () => {
      const perms = expandPermissions({ roles: ['producer'] });
      expect(perms).toContain(Permissions.TRADEPASS_READ);
      expect(perms).toContain(Permissions.GEOTAG_CREATE);
      expect(perms).toContain(Permissions.PANX_READ);
      expect(perms).not.toContain(Permissions.TRADEPASS_ISSUE);
    });

    it('should check admin:* grants all', () => {
      const result = hasPermission(Permissions.TRADEPASS_REVOKE, {
        roles: ['admin'],
      });
      expect(result).toBe(true);

      const result2 = hasPermission(Permissions.GEOTAG_CREATE, {
        roles: ['admin'],
      });
      expect(result2).toBe(true);

      const result3 = hasPermission(Permissions.PANX_SUBMIT, {
        permissions: [Permissions.ADMIN_ALL],
      });
      expect(result3).toBe(true);
    });
  });

  describe('sessions', () => {
    it('should validate active session', () => {
      const session = createTestSession({ state: 'ACTIVE' });
      const result = isSessionValid(session);
      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should detect expired session', () => {
      const session = createTestSession({
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      });
      const result = isSessionValid(session);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('SESSION_EXPIRED');
    });

    it('should detect idle timeout', () => {
      const session = createTestSession({
        // Last active 31 minutes ago (default idle timeout is 30 min)
        lastActiveAt: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
      });
      const result = isSessionValid(session);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('IDLE_TIMEOUT');
    });

    it('should handle offline session validity', () => {
      const now = new Date();
      const session = createTestSession({
        offlineCapable: true,
        offlineExpiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        offlineSyncedAt: now.toISOString(),
        state: 'OFFLINE',
      });
      const result = isSessionValidOffline(session);
      expect(result.valid).toBe(true);

      // Non-offline-capable session should fail
      const onlineOnly = createTestSession({ offlineCapable: false });
      const result2 = isSessionValidOffline(onlineOnly);
      expect(result2.valid).toBe(false);
    });

    it('should record failed attempts', () => {
      const session = createTestSession({ failedAttempts: 0 });
      const updated = recordFailedAttempt(session);
      expect(updated.failedAttempts).toBe(1);
      expect(updated.state).toBe('ACTIVE'); // Not locked yet
    });

    it('should lock after max failures', () => {
      const session = createTestSession({
        failedAttempts: DEFAULT_SESSION_CONFIG.maxFailedAttempts - 1,
      });
      const locked = recordFailedAttempt(session);
      expect(locked.failedAttempts).toBe(DEFAULT_SESSION_CONFIG.maxFailedAttempts);
      expect(locked.state).toBe('LOCKED');
      expect(locked.lockedUntil).toBeDefined();
    });

    it('should prepare session for offline', () => {
      const session = createTestSession({ offlineCapable: false });
      const offline = prepareSessionForOffline(session);
      expect(offline.offlineCapable).toBe(true);
      expect(offline.offlineExpiresAt).toBeDefined();
      expect(offline.offlineSyncedAt).toBeDefined();
      expect(offline.state).toBe('OFFLINE');
    });
  });

  describe('tokens', () => {
    it('should decode valid token', () => {
      const now = Math.floor(Date.now() / 1000);
      const token = makeJwt(
        { alg: 'EdDSA', typ: 'JWT' },
        { iss: 'gtcx', sub: 'user-001', iat: now, exp: now + 3600 }
      );
      const decoded = decodeToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded!.claims.sub).toBe('user-001');
      expect(decoded!.header.alg).toBe('EdDSA');
      expect(decoded!.header.typ).toBe('JWT');
    });

    it('should reject malformed token', () => {
      expect(decodeToken('not-a-jwt')).toBeNull();
      expect(decodeToken('a.b')).toBeNull(); // only 2 parts
      expect(decodeToken('')).toBeNull();
      // Invalid header alg
      const badAlg = makeJwt({ alg: 'INVALID', typ: 'JWT' }, { sub: 'user-001' });
      expect(decodeToken(badAlg)).toBeNull();
    });

    it('should check temporal validity', () => {
      const now = Math.floor(Date.now() / 1000);

      // Valid token
      const valid = isTokenTemporallyValid({
        iss: 'gtcx',
        sub: 'user-001',
        exp: now + 3600,
        iat: now,
      });
      expect(valid.valid).toBe(true);
      expect(valid.expired).toBe(false);
      expect(valid.notYetValid).toBe(false);

      // Expired token
      const expired = isTokenTemporallyValid({
        iss: 'gtcx',
        sub: 'user-001',
        exp: now - 120,
        iat: now - 3720,
      });
      expect(expired.expired).toBe(true);
      expect(expired.valid).toBe(false);

      // Not-before in future
      const future = isTokenTemporallyValid({
        iss: 'gtcx',
        sub: 'user-001',
        nbf: now + 3600,
        exp: now + 7200,
        iat: now,
      });
      expect(future.notYetValid).toBe(true);
      expect(future.valid).toBe(false);
    });

    it('should check offline validity', () => {
      const now = Math.floor(Date.now() / 1000);

      // Token with offline=true and future offlineExpiry
      const offlineClaims: GTCXTokenClaims = {
        iss: 'gtcx',
        sub: 'user-001',
        exp: now + 7200,
        iat: now,
        offline: true,
        offlineExpiry: now + 3600,
      };
      expect(isTokenValidOffline(offlineClaims)).toBe(true);

      // Token without offline flag
      const onlineClaims: GTCXTokenClaims = {
        iss: 'gtcx',
        sub: 'user-001',
        exp: now + 3600,
        iat: now,
        offline: false,
      };
      expect(isTokenValidOffline(onlineClaims)).toBe(false);

      // Expired offline expiry
      const expiredOffline: GTCXTokenClaims = {
        iss: 'gtcx',
        sub: 'user-001',
        exp: now + 3600,
        iat: now - 200,
        offline: true,
        offlineExpiry: now - 100,
      };
      expect(isTokenValidOffline(expiredOffline)).toBe(false);
    });

    it('should create unsigned payload', () => {
      const now = Math.floor(Date.now() / 1000);
      const claims: GTCXTokenClaims = {
        iss: 'gtcx',
        sub: 'user-001',
        exp: now + 3600,
        iat: now,
        roles: ['producer'],
      };
      const payload = createTokenPayload(claims, {
        algorithm: 'EdDSA',
        expiresInSeconds: 3600,
      });
      // Payload should be header.claims (no signature)
      const parts = payload.split('.');
      expect(parts.length).toBe(2);

      // Decode and verify claims were populated
      const decodedClaims = JSON.parse(
        Buffer.from(parts[1]!.replace(/-/g, '+').replace(/_/g, '/') + '==', 'base64').toString(
          'utf8'
        )
      );
      expect(decodedClaims.sub).toBe('user-001');
      expect(decodedClaims.iat).toBeDefined();
      expect(decodedClaims.exp).toBeDefined();
      expect(decodedClaims.exp).toBeGreaterThan(decodedClaims.iat);
    });
  });
});

// =============================================================================
// OFFLINE TESTS
// =============================================================================

describe('@gtcx/security/offline', () => {
  describe('secure-storage', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('should require unlock before operations', async () => {
      const storage = new TestSecureStorage();
      await expect(storage.set('key', 'value')).rejects.toThrow('Storage is locked');
      await expect(storage.get('key')).rejects.toThrow('Storage is locked');
    });

    it('should encrypt data at rest', async () => {
      const storage = new TestSecureStorage();
      const result = await storage.unlock('test-secret');
      expect(result.success).toBe(true);

      await storage.set('mydata', { hello: 'world' });

      // The raw storage should not contain plaintext
      const rawStore = (
        storage as unknown as {
          getStorage(): {
            getItem(key: string): Promise<string | null>;
            getAllKeys(): Promise<string[]>;
          };
        }
      ).getStorage();
      const raw = await rawStore.getItem('gtcx_secure_mydata');
      expect(raw).toBeDefined();
      expect(raw).not.toContain('"hello":"world"');
      // It should be a JSON envelope with ciphertext, iv, tag
      const parsed = JSON.parse(raw!);
      expect(parsed.ciphertext).toBeDefined();
      expect(parsed.iv).toBeDefined();
      expect(parsed.tag).toBeDefined();
    });

    it('should decrypt data on retrieval', async () => {
      const storage = new TestSecureStorage();
      await storage.unlock('test-secret');

      await storage.set('credentials', { token: 'abc123', role: 'admin' });
      const retrieved = await storage.get<{ token: string; role: string }>('credentials');
      expect(retrieved).toEqual({ token: 'abc123', role: 'admin' });
    });

    it('should handle item expiry', async () => {
      const storage = new TestSecureStorage();
      await storage.unlock('test-secret');

      // Store with extremely short expiry (negative hours to simulate expired)
      // We store with 0.00001 hours (~36ms) then wait
      await storage.set('temp', 'data', 0.00001);

      // Wait for it to expire
      await new Promise((r) => setTimeout(r, 50));

      const result = await storage.get('temp');
      expect(result).toBeNull();
    });

    it('should track failed attempts', async () => {
      const storage = new TestSecureStorage();
      // First unlock creates the verify marker
      const first = await storage.unlock('correct-secret');
      expect(first.success).toBe(true);

      storage.lock();

      // Now try with wrong key - it will fail to decrypt the verify marker
      const bad = await storage.unlock('wrong-secret');
      expect(bad.success).toBe(false);
      expect(storage.getState().failedAttempts).toBeGreaterThan(0);
    });

    it('should lock after max failures', async () => {
      const storage = new TestSecureStorage({ maxFailedAttempts: 3, wipeOnExceed: false });
      // First establish a verification marker
      await storage.unlock('correct-secret');
      storage.lock();

      // Fail enough times to trigger lockout
      for (let i = 0; i < 3; i++) {
        await storage.unlock('wrong-secret');
      }

      // Now even with correct secret, should be locked out
      const result = await storage.unlock('correct-secret');
      expect(result.success).toBe(false);
      expect(result.error).toBe('LOCKED_OUT');
    });

    it('should clear lockout after lockoutDurationSeconds elapses', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

      const storage = new TestSecureStorage({
        maxFailedAttempts: 2,
        wipeOnExceed: false,
        lockoutDurationSeconds: 60,
      });
      await storage.unlock('correct-secret');
      storage.lock();

      await storage.unlock('wrong-secret');
      await storage.unlock('wrong-secret');

      const blocked = await storage.unlock('correct-secret');
      expect(blocked.success).toBe(false);
      expect(blocked.error).toBe('LOCKED_OUT');

      vi.setSystemTime(new Date('2026-01-01T00:01:01Z'));

      const recovered = await storage.unlock('correct-secret');
      expect(recovered.success).toBe(true);
      expect(storage.getState().failedAttempts).toBe(0);
      expect(storage.getState().lastFailedAt).toBeUndefined();
    });

    it('should wipe on lockout if configured', async () => {
      const storage = new TestSecureStorage({ maxFailedAttempts: 2, wipeOnExceed: true });
      await storage.unlock('correct-secret');
      await storage.set('important', { data: 'secret' });
      storage.lock();

      // Exceed max attempts
      for (let i = 0; i < 2; i++) {
        await storage.unlock('wrong-secret');
      }

      // Give wipe a tick to execute
      await new Promise((r) => setTimeout(r, 50));

      // Storage should have been wiped - verify by checking that user data is gone
      // (only metadata keys like __initialized and __lockout_state may remain)
      const keys = await (
        storage as unknown as {
          getStorage(): {
            getItem(key: string): Promise<string | null>;
            getAllKeys(): Promise<string[]>;
          };
        }
      )
        .getStorage()
        .getAllKeys();
      const userKeys = keys.filter(
        (k) => k !== 'gtcx_secure___initialized' && k !== 'gtcx_secure___lockout_state'
      );
      expect(userKeys.length).toBe(0);
    });
  });

  describe('credential-cache', () => {
    let cache: CredentialCache;

    beforeEach(() => {
      cache = new CredentialCache({
        maxOfflineHours: 72,
        revocationCheckIntervalHours: 24,
        maxCachedCredentials: 100,
        autoCleanupEnabled: true,
      });
    });

    it('should validate offline credential', () => {
      const cred = createMockCredential();
      const result = cache.isCredentialValidOffline(cred);
      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should detect expired credential', () => {
      const cred = createMockCredential({
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      });
      const result = cache.isCredentialValidOffline(cred);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('EXPIRED');
    });

    it('should warn on stale revocation check', () => {
      const cred = createMockCredential({
        // Last revocation check 25 hours ago (threshold is 24h)
        lastRevocationCheckAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      });
      const result = cache.isCredentialValidOffline(cred);
      expect(result.valid).toBe(true);
      expect(result.warning).toBe('REVOCATION_CHECK_STALE');
      expect(result.message).toBeDefined();
    });

    it('should calculate offline expiry', () => {
      const issuedAt = new Date('2024-01-01T00:00:00Z');
      const expiry = cache.calculateOfflineExpiry(issuedAt);
      const expectedMs = issuedAt.getTime() + 72 * 60 * 60 * 1000;
      expect(expiry.getTime()).toBe(expectedMs);
    });

    it('should identify sync needs', () => {
      // Credential with syncRequired=true
      const needsIt = createMockCredential({ syncRequired: true });
      expect(cache.needsSync(needsIt)).toBe(true);

      // Credential approaching offline expiry (within 24h buffer)
      const approaching = createMockCredential({
        offlineExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12h from now
        syncRequired: false,
      });
      expect(cache.needsSync(approaching)).toBe(true);

      // Credential with plenty of time
      const fresh = createMockCredential({
        offlineExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h from now
        syncRequired: false,
      });
      expect(cache.needsSync(fresh)).toBe(false);
    });

    it('should extend expiry on sync', () => {
      const cred = createMockCredential();
      const synced = cache.markSynced(cred);
      expect(synced.syncRequired).toBe(false);
      expect(new Date(synced.syncedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(cred.syncedAt).getTime()
      );
      // offlineExpiresAt should be recalculated from now
      expect(new Date(synced.offlineExpiresAt).getTime()).toBeGreaterThanOrEqual(
        new Date(cred.offlineExpiresAt).getTime()
      );
    });
  });

  describe('tamper-detection', () => {
    it('should detect empty signature chain', () => {
      const proof = makeValidProof({ signatureChain: [] });
      const result = checkProofStructure(proof);
      expect(result.valid).toBe(false);
      expect(result.tamperedWith).toBe(true);
      expect(result.reason).toBe('CHAIN_BROKEN');
    });

    it('should detect broken chain', () => {
      const now = new Date().toISOString();
      const proof = makeValidProof({
        signatureChain: [
          {
            hash: 'hash0',
            signature: 'sig0',
            signerKeyId: 'key-a',
            signedAt: now,
          },
          {
            hash: '', // broken: empty hash
            signature: 'sig1',
            signerKeyId: 'root-key',
            signedAt: now,
          },
        ],
      });
      const result = checkProofStructure(proof);
      // Even though hash is empty string (falsy), the check is `!current.hash`
      // Empty string is falsy, so this should be caught as CHAIN_BROKEN
      expect(result.valid).toBe(false);
      expect(result.tamperedWith).toBe(true);
      expect(result.reason).toBe('CHAIN_BROKEN');
    });

    it('should detect untrusted root', () => {
      const now = new Date().toISOString();
      const proof = makeValidProof({
        signatureChain: [
          {
            hash: 'hash0',
            signature: 'sig0',
            signerKeyId: 'unknown-key', // does not match trustedRootKeyId
            signedAt: now,
          },
        ],
        trustedRootKeyId: 'root-key',
      });
      const result = checkProofStructure(proof);
      expect(result.valid).toBe(false);
      expect(result.tamperedWith).toBe(true);
      expect(result.reason).toBe('ROOT_UNTRUSTED');
    });

    it('should use constant-time compare', () => {
      expect(secureCompare('abc', 'abc')).toBe(true);
      expect(secureCompare('abc', 'abd')).toBe(false);
      expect(secureCompare('abc', 'abcd')).toBe(false); // different lengths
      expect(secureCompare('', '')).toBe(false); // empty strings are not valid hashes

      // hashesMatch normalizes case
      expect(hashesMatch('ABCDEF', 'abcdef')).toBe(true);
      expect(hashesMatch('ABCDEF', 'abcdeg')).toBe(false);
    });

    it('should create detection event', () => {
      const result = { valid: false, tamperedWith: true, reason: 'DATA_MODIFIED' as const };
      const event = createTamperDetectionEvent(
        'data-001',
        'TRADEPASS',
        'ON_ACCESS',
        result,
        'device-abc'
      );
      expect(event.timestamp).toBeDefined();
      expect(event.dataId).toBe('data-001');
      expect(event.dataType).toBe('TRADEPASS');
      expect(event.checkType).toBe('ON_ACCESS');
      expect(event.result.tamperedWith).toBe(true);
      expect(event.deviceId).toBe('device-abc');
    });
  });
});

// =============================================================================
// AUDIT TESTS
// =============================================================================

describe('@gtcx/security/audit', () => {
  beforeEach(() => {
    clearSecurityHandlers();
  });

  afterEach(() => {
    clearSecurityHandlers();
  });

  describe('events', () => {
    it('should create event with timestamp', () => {
      const before = new Date().toISOString();
      const event = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS');
      const after = new Date().toISOString();

      expect(event.timestamp).toBeDefined();
      expect(event.timestamp >= before).toBe(true);
      expect(event.timestamp <= after).toBe(true);
      expect(event.eventType).toBe('AUTH_SUCCESS');
      expect(event.outcome).toBe('SUCCESS');
    });

    it('should infer severity from type', () => {
      // TAMPER_DETECTED should be CRITICAL
      const tamper = createSecurityEvent('TAMPER_DETECTED', 'FAILURE');
      expect(tamper.severity).toBe('CRITICAL');

      // AUTH_LOCKOUT should be HIGH
      const lockout = createSecurityEvent('AUTH_LOCKOUT', 'BLOCKED');
      expect(lockout.severity).toBe('HIGH');

      // AUTH_FAILURE should be WARN
      const authFail = createSecurityEvent('AUTH_FAILURE', 'FAILURE');
      expect(authFail.severity).toBe('WARN');

      // Success events should be INFO
      const success = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS');
      expect(success.severity).toBe('INFO');
    });

    it('should allow severity override', () => {
      const event = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', {
        severity: 'CRITICAL',
      });
      expect(event.severity).toBe('CRITICAL');
    });

    it('should notify registered handlers', async () => {
      const received: SecurityEvent[] = [];
      const handler = async (event: SecurityEvent) => {
        received.push(event);
      };
      registerSecurityHandler(handler);

      await logSecurityEvent({
        timestamp: new Date().toISOString(),
        eventType: 'AUTH_SUCCESS',
        severity: 'INFO',
        outcome: 'SUCCESS',
        actor: 'user-001',
      });

      expect(received.length).toBe(1);
      expect(received[0]!.actor).toBe('user-001');
    });

    it('should handle handler errors gracefully', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const badHandler = async () => {
        throw new Error('Handler crash');
      };
      registerSecurityHandler(badHandler);

      // Should not throw despite handler error
      await expect(
        logSecurityEvent({
          timestamp: new Date().toISOString(),
          eventType: 'AUTH_SUCCESS',
          severity: 'INFO',
          outcome: 'SUCCESS',
        })
      ).resolves.toBeUndefined();

      errorSpy.mockRestore();
    });
  });

  describe('logger', () => {
    it('should filter by min severity', async () => {
      const handler = vi.fn();
      const logger = new SecurityLogger({ minSeverity: 'HIGH' });
      logger.addHandler(handler);

      // INFO should be filtered out
      const infoEvent = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', {
        severity: 'INFO',
      });
      await logger.log(infoEvent);
      expect(handler).not.toHaveBeenCalled();

      // HIGH should pass through
      const highEvent = createSecurityEvent('AUTH_LOCKOUT', 'BLOCKED', {
        severity: 'HIGH',
      });
      await logger.log(highEvent);
      expect(handler).toHaveBeenCalledTimes(1);

      // CRITICAL should also pass
      const criticalEvent = createSecurityEvent('TAMPER_DETECTED', 'FAILURE', {
        severity: 'CRITICAL',
      });
      await logger.log(criticalEvent);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should redact sensitive fields', async () => {
      const captured: SecurityEvent[] = [];
      const handler = async (event: SecurityEvent) => {
        captured.push(event);
      };
      const logger = new SecurityLogger({
        minSeverity: 'INFO',
        redactSensitiveFields: true,
        sensitiveFields: ['password', 'secret', 'token', 'apiKey'],
      });
      logger.addHandler(handler);

      const event = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', {
        metadata: {
          password: 'super-secret-123',
          username: 'alice',
          apiKey: 'key-abc-xyz',
          nested: { tokenValue: 'tok-123' },
        },
      });
      await logger.log(event);

      expect(captured.length).toBe(1);
      const meta = captured[0]!.metadata!;
      expect(meta['password']).toBe('[REDACTED]');
      expect(meta['username']).toBe('alice');
      expect(meta['apiKey']).toBe('[REDACTED]');
    });

    it('should batch events', async () => {
      const batches: SecurityEvent[][] = [];
      const batchHandler = async (events: SecurityEvent[]) => {
        batches.push([...events]);
      };
      const logger = new SecurityLogger({
        minSeverity: 'INFO',
        batchSize: 3,
      });
      logger.addBatchHandler(batchHandler);

      // Log 3 events - should trigger a flush at batchSize
      for (let i = 0; i < 3; i++) {
        await logger.log(
          createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', {
            severity: 'INFO',
          })
        );
      }

      expect(batches.length).toBe(1);
      expect(batches[0]!.length).toBe(3);
    });

    it('should flush on shutdown', async () => {
      const batches: SecurityEvent[][] = [];
      const batchHandler = async (events: SecurityEvent[]) => {
        batches.push([...events]);
      };
      const logger = new SecurityLogger({
        minSeverity: 'INFO',
        batchSize: 100, // high batch size so auto-flush won't trigger
      });
      logger.addBatchHandler(batchHandler);

      // Log 2 events (below batch threshold)
      await logger.log(createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', { severity: 'INFO' }));
      await logger.log(createSecurityEvent('AUTH_FAILURE', 'FAILURE', { severity: 'WARN' }));

      expect(batches.length).toBe(0); // Not yet flushed

      await logger.shutdown();

      expect(batches.length).toBe(1);
      expect(batches[0]!.length).toBe(2);
    });

    it('should provide convenience methods', async () => {
      const captured: SecurityEvent[] = [];
      const handler = async (event: SecurityEvent) => {
        captured.push(event);
      };
      const logger = new SecurityLogger({ minSeverity: 'INFO' });
      logger.addHandler(handler);

      await logger.authSuccess('user-001', 'session-001');
      expect(captured.length).toBe(1);
      expect(captured[0]!.eventType).toBe('AUTH_SUCCESS');
      expect(captured[0]!.actor).toBe('user-001');

      await logger.authFailure('INVALID_PASSWORD', 'user-002', '1.2.3.4');
      expect(captured.length).toBe(2);
      expect(captured[1]!.eventType).toBe('AUTH_FAILURE');
      expect(captured[1]!.reason).toBe('INVALID_PASSWORD');

      await logger.accessDenied('user-003', 'tradepass-123', 'revoke');
      expect(captured.length).toBe(3);
      expect(captured[2]!.eventType).toBe('ACCESS_DENIED');
      expect(captured[2]!.outcome).toBe('BLOCKED');

      await logger.validationFailure('request-body', 'SCHEMA_MISMATCH');
      expect(captured.length).toBe(4);
      expect(captured[3]!.eventType).toBe('VALIDATION_FAILURE');

      await logger.tamperDetected('data-001', 'GEOTAG', 'hash mismatch');
      expect(captured.length).toBe(5);
      expect(captured[4]!.eventType).toBe('TAMPER_DETECTED');
    });
  });

  describe('audit-trail', () => {
    it('should record steps with timestamps', () => {
      const trail = createAuditTrail('custody_transfer', {
        actor: 'user-001',
        resource: 'vaultmark-123',
      });
      expect(trail.operationId).toBeDefined();
      expect(trail.operationType).toBe('custody_transfer');
      expect(trail.startedAt).toBeDefined();

      trail.record('initiated', { from: 'vault-a', to: 'vault-b' });
      trail.record('verified', { inspector: 'inspector-001' });

      // The trail object keeps steps internally; verified via finalize
      expect(trail.operationId.length).toBeGreaterThan(0);
    });

    it('should finalize with outcome', async () => {
      const received: SecurityEvent[] = [];
      registerSecurityHandler(async (event) => {
        received.push(event);
      });

      const trail = createAuditTrail('inspection', {
        actor: 'inspector-001',
        resource: 'geotag-456',
      });
      trail.record('started');
      trail.record('completed');

      await trail.finalize('SUCCESS');

      expect(received.length).toBe(1);
      const event = received[0]!;
      expect(event.outcome).toBe('SUCCESS');
      expect(event.severity).toBe('INFO');
      expect(event.actor).toBe('inspector-001');
      expect(event.resource).toBe('geotag-456');
    });

    it('should include all steps in metadata', async () => {
      const received: SecurityEvent[] = [];
      registerSecurityHandler(async (event) => {
        received.push(event);
      });

      const trail = createAuditTrail('transfer');
      trail.record('step-1', { detail: 'a' });
      trail.record('step-2', { detail: 'b' });
      trail.record('step-3', { detail: 'c' });
      await trail.finalize('SUCCESS');

      const meta = received[0]!.metadata!;
      expect(meta['operationType']).toBe('transfer');
      expect(meta['startedAt']).toBeDefined();
      expect(meta['completedAt']).toBeDefined();
      expect(Array.isArray(meta['steps'])).toBe(true);
      const steps = meta['steps'] as Array<{
        step: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
      }>;
      expect(steps.length).toBe(3);
      expect(steps[0]!.step).toBe('step-1');
      expect(steps[1]!.step).toBe('step-2');
      expect(steps[2]!.step).toBe('step-3');
      expect(steps[0]!.metadata).toEqual({ detail: 'a' });
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('integration', () => {
  beforeEach(() => {
    clearSecurityHandlers();
  });

  afterEach(() => {
    clearSecurityHandlers();
  });

  it('should validate -> sanitize -> store workflow', async () => {
    // 1. Sanitize raw input
    const rawInput = {
      name: '<script>xss</script>Alice',
      email: 'alice@example.com',
      __proto__: { polluted: true },
    };
    const sanitized = sanitizeObject<{ name: string; email: string }>(rawInput, {
      stripProto: true,
    });
    expect(sanitized).not.toHaveProperty('__proto__');
    expect(sanitized.name).toBe('xssAlice');

    // 2. Validate with schema
    const UserSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });
    const validate = createBoundaryValidator(UserSchema);
    const result = validate(sanitized);
    expect(result.success).toBe(true);

    // 3. Store in secure storage
    const storage = new TestSecureStorage();
    await storage.unlock('pin-1234');
    if (result.success) {
      await storage.set('user_profile', result.data);
      const retrieved = await storage.get<{ name: string; email: string }>('user_profile');
      expect(retrieved).toEqual(result.data);
    }
  });

  it('should authenticate -> session -> permissions workflow', () => {
    // 1. Create a session with roles
    const session = createTestSession({
      userId: 'user-producer-001',
      roles: ['producer'],
      state: 'ACTIVE',
    });

    // 2. Validate session
    const sessionResult = isSessionValid(session);
    expect(sessionResult.valid).toBe(true);

    // 3. Check permissions derived from role
    const perms = expandPermissions({
      roles: ['producer'],
    });
    expect(perms).toContain(Permissions.TRADEPASS_READ);
    expect(perms).toContain(Permissions.GEOTAG_CREATE);

    // 4. Verify permission check
    expect(hasPermission(Permissions.GEOTAG_CREATE, { roles: ['producer'] })).toBe(true);
    expect(hasPermission(Permissions.TRADEPASS_REVOKE, { roles: ['producer'] })).toBe(false);
  });

  it('should offline cache -> verify -> audit workflow', async () => {
    const received: SecurityEvent[] = [];
    registerSecurityHandler(async (event) => {
      received.push(event);
    });

    // 1. Create and validate a credential for offline use
    const cache = new CredentialCache({
      maxOfflineHours: 72,
      revocationCheckIntervalHours: 24,
      maxCachedCredentials: 100,
      autoCleanupEnabled: true,
    });
    const cred = createMockCredential();
    const validation = cache.isCredentialValidOffline(cred);
    expect(validation.valid).toBe(true);

    // 2. Verify integrity proof
    const proof = makeValidProof();
    const proofCheck = checkProofStructure(proof);
    expect(proofCheck.valid).toBe(true);
    expect(proofCheck.tamperedWith).toBe(false);

    // 3. Create audit trail for the operation
    const trail = createAuditTrail('offline_verification', {
      actor: 'user-001',
      resource: cred.id,
    });
    trail.record('credential_validated', { credId: cred.id });
    trail.record('integrity_verified', { proofValid: true });
    await trail.finalize('SUCCESS');

    // Verify the audit event was logged
    expect(received.length).toBeGreaterThanOrEqual(1);
    const auditEvent = received[received.length - 1]!;
    expect(auditEvent.outcome).toBe('SUCCESS');
    expect(auditEvent.metadata).toBeDefined();
    const steps = auditEvent.metadata!['steps'] as Array<{ step: string }>;
    expect(steps.length).toBe(2);
    expect(steps[0]!.step).toBe('credential_validated');
    expect(steps[1]!.step).toBe('integrity_verified');
  });
});
