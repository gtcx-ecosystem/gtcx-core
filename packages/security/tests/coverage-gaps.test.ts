/**
 * Tests targeting uncovered lines in @gtcx/security
 *
 * Closes coverage gaps identified in audit 2026-03-19:
 * - audit/events.ts: severityColor(), dev console logging
 * - audit/logger.ts: consoleLogHandler(), jsonLogHandler()
 * - auth/tokens.ts: assembleToken(), createTokenPayload with offline
 * - offline/tamper-detection.ts: createIntegrityProofStructure(), isProofStructureValid()
 * - offline/types.ts: schema + defaults
 * - validation/schemas.ts: createPaginatedSchema(), createApiResponseSchema()
 */

import { generateKeyPair, sign } from '@gtcx/crypto';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { z } from 'zod';

import {
  createSecurityEvent,
  logSecurityEvent,
  registerSecurityHandler,
  clearSecurityHandlers,
} from '../src/audit/events';
import { consoleLogHandler, jsonLogHandler } from '../src/audit/logger';
import {
  assembleToken,
  createTokenPayload,
  decodeToken,
  verifyTokenSignature,
} from '../src/auth/tokens';
import {
  createIntegrityProofStructure,
  isProofStructureValid,
} from '../src/offline/tamper-detection';
import {
  OfflineSecurityConfigSchema,
  DEFAULT_OFFLINE_CONFIG as TypesDefaultConfig,
  CachedCredentialSchema as TypesCachedCredentialSchema,
} from '../src/offline/types';
import { createPaginatedSchema, createApiResponseSchema } from '../src/validation/schemas';

describe('logSecurityEvent — development console output', () => {
  const originalEnv = process.env['NODE_ENV'];

  afterEach(() => {
    process.env['NODE_ENV'] = originalEnv;
    clearSecurityHandlers();
  });

  it('should log to console in development mode', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('AUTH_SUCCESS', { outcome: 'SUCCESS' });

    expect(consoleSpy).toHaveBeenCalled();
    const logArgs = consoleSpy.mock.calls[0]!.join(' ');
    expect(logArgs).toContain('SECURITY');
    expect(logArgs).toContain('AUTH_SUCCESS');
    consoleSpy.mockRestore();
  });

  it('should log CRITICAL severity with red color', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('TAMPER_DETECTED', {
      outcome: 'BLOCKED',
      severity: 'CRITICAL',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logArgs = consoleSpy.mock.calls[0]![0] as string;
    expect(logArgs).toContain('\x1b[31m'); // Red
    consoleSpy.mockRestore();
  });

  it('should log HIGH severity with yellow color', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('DATA_DELETED', {
      outcome: 'SUCCESS',
      severity: 'HIGH',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logArgs = consoleSpy.mock.calls[0]![0] as string;
    expect(logArgs).toContain('\x1b[33m'); // Yellow
    consoleSpy.mockRestore();
  });

  it('should log WARN severity with magenta color', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('AUTH_FAILURE', {
      outcome: 'FAILURE',
      severity: 'WARN',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logArgs = consoleSpy.mock.calls[0]![0] as string;
    expect(logArgs).toContain('\x1b[35m'); // Magenta
    consoleSpy.mockRestore();
  });

  it('should log INFO severity with cyan color', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('AUTH_SUCCESS', {
      outcome: 'SUCCESS',
      severity: 'INFO',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logArgs = consoleSpy.mock.calls[0]![0] as string;
    expect(logArgs).toContain('\x1b[36m'); // Cyan
    consoleSpy.mockRestore();
  });

  it('should include actor and resource when present', async () => {
    process.env['NODE_ENV'] = 'development';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await logSecurityEvent('AUTH_SUCCESS', {
      outcome: 'SUCCESS',
      actor: 'user-123',
      resource: 'credential-456',
      reason: 'VALID_TOKEN',
    });

    const logArgs = consoleSpy.mock.calls[0]!.join(' ');
    expect(logArgs).toContain('actor=user-123');
    expect(logArgs).toContain('resource=credential-456');
    expect(logArgs).toContain('reason=VALID_TOKEN');
    consoleSpy.mockRestore();
  });

  it('should handle handler dispatch errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    registerSecurityHandler(async () => {
      throw new Error('handler failed');
    });

    await logSecurityEvent('AUTH_SUCCESS', { outcome: 'SUCCESS' });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('handler dispatch failed'),
      expect.any(Error)
    );
    errorSpy.mockRestore();
  });
});

// --- audit/logger.ts — consoleLogHandler, jsonLogHandler ---

describe('consoleLogHandler', () => {
  it('should use console.error for CRITICAL severity', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const event = createSecurityEvent('TAMPER_DETECTED', 'BLOCKED', { severity: 'CRITICAL' });

    consoleLogHandler(event);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('CRITICAL'), event);
    spy.mockRestore();
  });

  it('should use console.warn for HIGH severity', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const event = createSecurityEvent('DATA_DELETED', 'SUCCESS', { severity: 'HIGH' });

    consoleLogHandler(event);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('HIGH'), event);
    spy.mockRestore();
  });

  it('should use console.warn for WARN severity', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const event = createSecurityEvent('AUTH_FAILURE', 'FAILURE', { severity: 'WARN' });

    consoleLogHandler(event);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('WARN'), event);
    spy.mockRestore();
  });

  it('should use console.log for INFO severity', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const event = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS', { severity: 'INFO' });

    consoleLogHandler(event);

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('INFO'), event);
    spy.mockRestore();
  });
});

describe('jsonLogHandler', () => {
  it('should output JSON-formatted event', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const event = createSecurityEvent('AUTH_SUCCESS', 'SUCCESS');

    jsonLogHandler(event);

    const output = spy.mock.calls[0]![0] as string;
    const parsed = JSON.parse(output);
    expect(parsed.eventType).toBe('AUTH_SUCCESS');
    expect(parsed.outcome).toBe('SUCCESS');
    spy.mockRestore();
  });
});

// --- auth/tokens.ts — assembleToken, createTokenPayload with offline ---

describe('assembleToken', () => {
  it('should assemble token with Uint8Array signature', () => {
    const payload = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0In0';
    const sigBytes = new Uint8Array([1, 2, 3, 4, 5]);
    const token = assembleToken(payload, sigBytes);

    expect(token).toContain(payload);
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
    // Signature part should be base64url (no +, /, =)
    expect(parts[2]).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('should assemble token with base64url-encoded string signature', () => {
    const payload = 'header.claims';
    const sig = 'abc123_-'; // valid base64url
    const token = assembleToken(payload, sig);

    expect(token).toBe('header.claims.abc123_-');
  });

  it('should encode non-base64url string signature', () => {
    const payload = 'header.claims';
    const sig = 'has+slash/and=padding'; // not base64url
    const token = assembleToken(payload, sig);

    const parts = token.split('.');
    expect(parts).toHaveLength(3);
    // Should be re-encoded to base64url
    expect(parts[2]).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe('createTokenPayload — offline options', () => {
  it('should include offline claims when offlineExpiresInSeconds set', () => {
    const payload = createTokenPayload({ sub: 'user-1' }, { offlineExpiresInSeconds: 7200 });

    const token = assembleToken(payload, 'test-sig');
    const decoded = decodeToken(token);

    expect(decoded).not.toBeNull();
    expect(decoded!.claims.offline).toBe(true);
    expect(decoded!.claims.offlineExpiry).toBeDefined();
  });

  it('should include keyId in header when provided', () => {
    const payload = createTokenPayload({ sub: 'user-1' }, { keyId: 'key-abc-123' });

    const token = assembleToken(payload, 'test-sig');
    const decoded = decodeToken(token);

    expect(decoded).not.toBeNull();
    expect(decoded!.header.kid).toBe('key-abc-123');
  });

  it('should use ES256K algorithm when specified', () => {
    const payload = createTokenPayload({ sub: 'user-1' }, { algorithm: 'ES256K' });

    const token = assembleToken(payload, 'test-sig');
    const decoded = decodeToken(token);

    expect(decoded).not.toBeNull();
    expect(decoded!.header.alg).toBe('ES256K');
  });
});

// --- offline/tamper-detection.ts ---

describe('createIntegrityProofStructure', () => {
  it('should create proof structure with required fields', () => {
    const proof = createIntegrityProofStructure(
      'data-001',
      'COMMODITY_LOT',
      'abc123hash',
      'root-key-001'
    );

    expect(proof.dataId).toBe('data-001');
    expect(proof.dataType).toBe('COMMODITY_LOT');
    expect(proof.dataHash).toBe('abc123hash');
    expect(proof.hashAlgorithm).toBe('SHA-256');
    expect(proof.trustedRootKeyId).toBe('root-key-001');
    expect(proof.createdAt).toBeDefined();
    expect(proof.lastVerifiedAt).toBeDefined();
  });

  it('should set createdAt and lastVerifiedAt to same ISO timestamp', () => {
    const proof = createIntegrityProofStructure('d', 't', 'h', 'r');
    expect(proof.createdAt).toBe(proof.lastVerifiedAt);
    // Should be valid ISO datetime
    expect(new Date(proof.createdAt).toISOString()).toBe(proof.createdAt);
  });
});

describe('isProofStructureValid', () => {
  it('should return true for valid proof', () => {
    const proof = {
      dataId: 'data-001',
      dataType: 'LOT',
      dataHash: 'abc',
      hashAlgorithm: 'SHA-256' as const,
      signatureChain: [
        {
          hash: 'abc',
          signature: 'sig',
          signerKeyId: 'key-1',
          signedAt: new Date().toISOString(),
        },
      ],
      trustedRootKeyId: 'key-1',
      createdAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
    };

    expect(isProofStructureValid(proof)).toBe(true);
  });

  it('should return false for invalid proof (missing fields)', () => {
    expect(isProofStructureValid({ dataId: 'only-this' })).toBe(false);
  });

  it('should return false for non-object input', () => {
    expect(isProofStructureValid(null)).toBe(false);
    expect(isProofStructureValid('string')).toBe(false);
    expect(isProofStructureValid(42)).toBe(false);
  });
});

// --- offline/types.ts — schema validation + defaults ---

describe('OfflineSecurityConfigSchema', () => {
  it('should validate correct config', () => {
    const result = OfflineSecurityConfigSchema.safeParse(TypesDefaultConfig);
    expect(result.success).toBe(true);
  });

  it('should reject maxOfflineHours below 1', () => {
    const result = OfflineSecurityConfigSchema.safeParse({
      ...TypesDefaultConfig,
      maxOfflineHours: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject maxOfflineHours above 168', () => {
    const result = OfflineSecurityConfigSchema.safeParse({
      ...TypesDefaultConfig,
      maxOfflineHours: 200,
    });
    expect(result.success).toBe(false);
  });

  it('should reject maxFailedAttempts below 3', () => {
    const result = OfflineSecurityConfigSchema.safeParse({
      ...TypesDefaultConfig,
      maxFailedAttempts: 1,
    });
    expect(result.success).toBe(false);
  });

  it('should have correct default values', () => {
    expect(TypesDefaultConfig.storageEncryption).toBe('AES-256-GCM');
    expect(TypesDefaultConfig.keyDerivation).toBe('ARGON2ID');
    expect(TypesDefaultConfig.argon2Memory).toBe(65536);
    expect(TypesDefaultConfig.argon2Iterations).toBe(3);
    expect(TypesDefaultConfig.maxOfflineHours).toBe(72);
    expect(TypesDefaultConfig.maxFailedAttempts).toBe(10);
    expect(TypesDefaultConfig.wipeOnExceed).toBe(true);
  });
});

describe('CachedCredentialSchema (types)', () => {
  it('should validate correct credential', () => {
    const result = TypesCachedCredentialSchema.safeParse({
      id: 'cred-1',
      data: { name: 'test' },
      cachedAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      lastUsedAt: Date.now(),
      dataHash: 'hash123',
      signatureChain: ['sig1', 'sig2'],
      needsSync: false,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const result = TypesCachedCredentialSchema.safeParse({ id: 'cred-1' });
    expect(result.success).toBe(false);
  });
});

// --- validation/schemas.ts ---

describe('createPaginatedSchema', () => {
  it('should create a valid paginated schema', () => {
    const schema = createPaginatedSchema(z.string());

    const valid = schema.safeParse({
      items: ['a', 'b', 'c'],
      total: 10,
      page: 1,
      pageSize: 3,
      hasMore: true,
    });
    expect(valid.success).toBe(true);
  });

  it('should reject negative total', () => {
    const schema = createPaginatedSchema(z.string());
    const result = schema.safeParse({
      items: [],
      total: -1,
      page: 1,
      pageSize: 10,
      hasMore: false,
    });
    expect(result.success).toBe(false);
  });

  it('should reject page 0', () => {
    const schema = createPaginatedSchema(z.string());
    const result = schema.safeParse({
      items: [],
      total: 0,
      page: 0,
      pageSize: 10,
      hasMore: false,
    });
    expect(result.success).toBe(false);
  });

  it('should reject pageSize over 100', () => {
    const schema = createPaginatedSchema(z.number());
    const result = schema.safeParse({
      items: [],
      total: 0,
      page: 1,
      pageSize: 101,
      hasMore: false,
    });
    expect(result.success).toBe(false);
  });
});

describe('createApiResponseSchema', () => {
  it('should create valid API response schema', () => {
    const schema = createApiResponseSchema(z.object({ name: z.string() }));

    const valid = schema.safeParse({
      success: true,
      data: { name: 'test' },
    });
    expect(valid.success).toBe(true);
  });

  it('should accept response with meta', () => {
    const schema = createApiResponseSchema(z.string());

    const valid = schema.safeParse({
      success: true,
      data: 'hello',
      meta: {
        requestId: '550e8400-e29b-41d4-a716-446655440000',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
    expect(valid.success).toBe(true);
  });

  it('should reject success: false', () => {
    const schema = createApiResponseSchema(z.string());
    const result = schema.safeParse({
      success: false,
      data: 'hello',
    });
    expect(result.success).toBe(false);
  });
});

// --- auth/tokens.ts — verifyTokenSignature ---

describe('verifyTokenSignature', () => {
  it('accepts a properly signed token', async () => {
    const keyPair = await generateKeyPair('Ed25519');
    const payload = createTokenPayload({ sub: 'user-1', iss: 'gtcx' });
    const signature = sign(payload, keyPair.privateKey);
    const token = assembleToken(payload, signature);

    const result = verifyTokenSignature(token, keyPair.publicKey);
    expect(result.valid).toBe(true);
    expect(result.claims?.sub).toBe('user-1');
    expect(result.error).toBeUndefined();
  });

  it('rejects a token with tampered payload', async () => {
    const keyPair = await generateKeyPair('Ed25519');
    const payload = createTokenPayload({ sub: 'user-1' });
    const signature = sign(payload, keyPair.privateKey);
    const token = assembleToken(payload, signature);

    // Tamper: replace the claims segment
    const parts = token.split('.');
    const tamperedClaims = createTokenPayload({ sub: 'admin' }).split('.')[1];
    const tampered = `${parts[0]}.${tamperedClaims}.${parts[2]}`;

    const result = verifyTokenSignature(tampered, keyPair.publicKey);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid signature');
  });

  it('rejects a token with wrong public key', async () => {
    const keyPair1 = await generateKeyPair('Ed25519');
    const keyPair2 = await generateKeyPair('Ed25519');
    const payload = createTokenPayload({ sub: 'user-1' });
    const signature = sign(payload, keyPair1.privateKey);
    const token = assembleToken(payload, signature);

    const result = verifyTokenSignature(token, keyPair2.publicKey);
    expect(result.valid).toBe(false);
  });

  it('rejects an expired token', async () => {
    const keyPair = await generateKeyPair('Ed25519');
    const payload = createTokenPayload({ sub: 'user-1' }, { expiresInSeconds: -120 });
    const signature = sign(payload, keyPair.privateKey);
    const token = assembleToken(payload, signature);

    const result = verifyTokenSignature(token, keyPair.publicKey);
    expect(result.valid).toBe(false);
    expect(result.expired).toBe(true);
    expect(result.error).toBe('Token has expired');
  });

  it('rejects malformed token strings', () => {
    const result = verifyTokenSignature('not-a-jwt', 'aabbccdd');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid token format');
  });
});
