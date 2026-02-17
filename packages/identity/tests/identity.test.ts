import type { DigitalIdentity } from '@gtcx/types';
import { describe, it, expect } from 'vitest';

import {
  generateIdentityId,
  createIdentity,
  createEnhancedIdentity,
  validateIdentity,
  isIdentityExpired,
  deriveIdentity,
} from '../src/identity';

// ---------------------------------------------------------------------------
// generateIdentityId
// ---------------------------------------------------------------------------
describe('generateIdentityId', () => {
  it('returns a string with the default GTCX prefix', () => {
    const id = generateIdentityId();
    expect(id).toBeTypeOf('string');
    expect(id.startsWith('GTCX_')).toBe(true);
  });

  it('uses a custom prefix when provided', () => {
    const id = generateIdentityId('CUSTOM');
    expect(id.startsWith('CUSTOM_')).toBe(true);
  });

  it('generates unique IDs across calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateIdentityId()));
    expect(ids.size).toBe(50);
  });

  it('contains timestamp and random segments separated by underscores', () => {
    const id = generateIdentityId();
    const parts = id.split('_');
    // prefix_timestamp_random
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe('GTCX');
    // timestamp and random parts should be uppercase alphanumeric
    expect(parts[1]).toMatch(/^[A-Z0-9]+$/);
    expect(parts[2]).toMatch(/^[A-Z0-9]+$/);
  });
});

// ---------------------------------------------------------------------------
// createIdentity
// ---------------------------------------------------------------------------
describe('createIdentity', () => {
  it('returns a valid identity and privateKey with defaults', async () => {
    const result = await createIdentity();

    expect(result).toHaveProperty('identity');
    expect(result).toHaveProperty('privateKey');
    expect(result.privateKey).toBeTypeOf('string');
    expect(result.privateKey.length).toBeGreaterThan(0);

    const { identity } = result;
    expect(identity.id).toBeTypeOf('string');
    expect(identity.id.startsWith('GTCX_')).toBe(true);
    expect(identity.publicKey).toBeTypeOf('string');
    expect(identity.publicKey.length).toBeGreaterThanOrEqual(64);
    expect(identity.privateKeyRef).toBe(`gtcx_identity_${identity.id}`);
    expect(identity.createdAt).toBeTypeOf('number');
    expect(identity.securityLevel).toBe('standard');
    expect(identity.metadata.fingerprint).toBeTypeOf('string');
    expect(identity.metadata.fingerprint!.length).toBe(16);
  });

  it('creates identity with Secp256k1 algorithm', async () => {
    const result = await createIdentity({ algorithm: 'Secp256k1' });

    expect(result.identity.publicKey).toBeTypeOf('string');
    // Secp256k1 compressed public key is 33 bytes = 66 hex chars
    expect(result.identity.publicKey.length).toBe(66);
    expect(result.privateKey).toBeTypeOf('string');
    expect(result.privateKey.length).toBeGreaterThan(0);
  });

  it('creates identity with enhanced security level', async () => {
    const result = await createIdentity({ securityLevel: 'enhanced' });
    expect(result.identity.securityLevel).toBe('enhanced');
  });

  it('includes custom metadata', async () => {
    const result = await createIdentity({
      metadata: { userRole: 'miner', deviceId: 'dev-123' },
    });
    expect(result.identity.metadata.userRole).toBe('miner');
    expect(result.identity.metadata.deviceId).toBe('dev-123');
    // fingerprint should still be present
    expect(result.identity.metadata.fingerprint).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// createEnhancedIdentity
// ---------------------------------------------------------------------------
describe('createEnhancedIdentity', () => {
  it('returns both ed25519 and secp256k1 private keys', async () => {
    const result = await createEnhancedIdentity();

    expect(result.privateKeys.ed25519).toBeTypeOf('string');
    expect(result.privateKeys.ed25519.length).toBeGreaterThan(0);
    expect(result.privateKeys.secp256k1).toBeTypeOf('string');
    expect(result.privateKeys.secp256k1!.length).toBeGreaterThan(0);
  });

  it('has MIL prefix by default', async () => {
    const result = await createEnhancedIdentity();
    expect(result.identity.id.startsWith('MIL_')).toBe(true);
  });

  it('defaults to military security level', async () => {
    const result = await createEnhancedIdentity();
    expect(result.identity.securityLevel).toBe('military');
  });

  it('has multiKeyPairs with ed25519 and secp256k1 entries', async () => {
    const result = await createEnhancedIdentity();
    const { multiKeyPairs } = result.identity;

    expect(multiKeyPairs.ed25519).toBeDefined();
    expect(multiKeyPairs.ed25519.algorithm).toBe('Ed25519');
    expect(multiKeyPairs.ed25519.publicKey).toBeTypeOf('string');
    expect(multiKeyPairs.ed25519.publicKey.length).toBeGreaterThanOrEqual(64);
    expect(multiKeyPairs.ed25519.privateKeyRef).toContain('gtcx_ed25519_');

    expect(multiKeyPairs.secp256k1).toBeDefined();
    expect(multiKeyPairs.secp256k1!.algorithm).toBe('Secp256k1');
    expect(multiKeyPairs.secp256k1!.publicKey).toBeTypeOf('string');
    expect(multiKeyPairs.secp256k1!.publicKey.length).toBe(66);
    expect(multiKeyPairs.secp256k1!.privateKeyRef).toContain('gtcx_secp256k1_');
  });

  it('has multiSignature support via multiKeyPairs', async () => {
    const result = await createEnhancedIdentity();
    // Enhanced identity supports multi-signature through having multiple key pairs
    expect(result.identity.multiKeyPairs).toBeDefined();
    expect(result.identity.multiKeyPairs.ed25519).toBeDefined();
    expect(result.identity.multiKeyPairs.secp256k1).toBeDefined();
  });

  it('has a quantumResistantHash', async () => {
    const result = await createEnhancedIdentity();
    expect(result.identity.quantumResistantHash).toBeTypeOf('string');
    // SHA-256 produces 64 hex chars
    expect(result.identity.quantumResistantHash!.length).toBe(64);
  });

  it('sets keyDerivation when params are provided', async () => {
    const result = await createEnhancedIdentity({
      keyDerivation: { algorithm: 'Scrypt', iterations: 50000 },
    });
    expect(result.identity.keyDerivation).toBeDefined();
    expect(result.identity.keyDerivation!.algorithm).toBe('Scrypt');
    expect(result.identity.keyDerivation!.iterations).toBe(50000);
    expect(result.identity.keyDerivation!.salt).toBeTypeOf('string');
    expect(result.identity.keyDerivation!.salt.length).toBe(64); // 32 bytes hex-encoded
  });

  it('keyDerivation is undefined when not provided', async () => {
    const result = await createEnhancedIdentity();
    expect(result.identity.keyDerivation).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateIdentity
// ---------------------------------------------------------------------------
describe('validateIdentity', () => {
  it('accepts a valid identity', async () => {
    const { identity } = await createIdentity();
    const result = validateIdentity(identity);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects identity missing id', () => {
    const identity = {
      id: '',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing identity ID');
  });

  it('rejects identity missing publicKey', () => {
    const identity = {
      id: 'test-id',
      publicKey: '',
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing public key');
  });

  it('rejects identity missing privateKeyRef', () => {
    const identity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: '',
      createdAt: Date.now(),
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing private key reference');
  });

  it('rejects identity missing createdAt', () => {
    const identity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: 0,
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing creation timestamp');
  });

  it('rejects identity with short publicKey', () => {
    const identity = {
      id: 'test-id',
      publicKey: 'abc123', // too short (< 64 chars)
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid public key length');
  });

  it('reports multiple errors at once', () => {
    const identity = {
      id: '',
      publicKey: '',
      privateKeyRef: '',
      createdAt: 0,
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(4);
  });

  it('reports expired identity as an error', () => {
    const identity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      expiresAt: Date.now() - 1000,
      securityLevel: 'standard' as const,
      metadata: {},
    };
    const result = validateIdentity(identity);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Identity has expired');
  });
});

// ---------------------------------------------------------------------------
// isIdentityExpired
// ---------------------------------------------------------------------------
describe('isIdentityExpired', () => {
  it('returns false for a non-expired identity', () => {
    const identity: DigitalIdentity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      expiresAt: Date.now() + 60_000, // 1 minute in the future
      securityLevel: 'standard',
      metadata: {},
    };
    expect(isIdentityExpired(identity)).toBe(false);
  });

  it('returns true for an expired identity', () => {
    const identity: DigitalIdentity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: Date.now() - 120_000,
      expiresAt: Date.now() - 60_000, // 1 minute in the past
      securityLevel: 'standard',
      metadata: {},
    };
    expect(isIdentityExpired(identity)).toBe(true);
  });

  it('returns false when no expiresAt is set', () => {
    const identity: DigitalIdentity = {
      id: 'test-id',
      publicKey: 'a'.repeat(64),
      privateKeyRef: 'ref',
      createdAt: Date.now(),
      securityLevel: 'standard',
      metadata: {},
    };
    expect(isIdentityExpired(identity)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// deriveIdentity
// ---------------------------------------------------------------------------
describe('deriveIdentity', () => {
  it('creates a child identity with parent reference in metadata', async () => {
    const { identity: parent } = await createIdentity();
    const result = await deriveIdentity(parent, 'role:admin');

    expect(result.identity.id).toBeTypeOf('string');
    expect(result.identity.id).not.toBe(parent.id);
    expect(result.privateKey).toBeTypeOf('string');

    // Should have parent identity reference
    expect((result.identity.metadata as Record<string, unknown>).parentIdentityId).toBe(parent.id);
    expect((result.identity.metadata as Record<string, unknown>).derivationContext).toBe(
      'role:admin'
    );
  });

  it('inherits securityLevel from parent by default', async () => {
    const { identity: parent } = await createIdentity({ securityLevel: 'enhanced' });
    const result = await deriveIdentity(parent, 'delegation');

    expect(result.identity.securityLevel).toBe('enhanced');
  });

  it('allows overriding securityLevel', async () => {
    const { identity: parent } = await createIdentity({ securityLevel: 'standard' });
    const result = await deriveIdentity(parent, 'upgrade', { securityLevel: 'military' });

    expect(result.identity.securityLevel).toBe('military');
  });

  it('preserves parent metadata in child', async () => {
    const { identity: parent } = await createIdentity({
      metadata: { userRole: 'supervisor' },
    });
    const result = await deriveIdentity(parent, 'sub-role');

    expect((result.identity.metadata as Record<string, unknown>).userRole).toBe('supervisor');
    expect(result.identity.metadata.fingerprint).toBeTypeOf('string');
  });

  it('child option metadata can override parent metadata', async () => {
    const { identity: parent } = await createIdentity({
      metadata: { userRole: 'supervisor' },
    });
    const result = await deriveIdentity(parent, 'sub-role', {
      metadata: { userRole: 'auditor' },
    });

    expect((result.identity.metadata as Record<string, unknown>).userRole).toBe('auditor');
  });
});
