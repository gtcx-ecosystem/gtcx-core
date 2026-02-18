/**
 * Integration tests: Error propagation across package boundaries
 *
 * Tests that errors from one package are properly handled and
 * propagated through the pipeline.
 */
import {
  sign,
  verify,
  hash256,
  generateKeyPair,
  buildMerkleTree,
  generateMerkleProof,
  verifyMerkleProof,
} from '@gtcx/crypto';
import {
  createIdentity,
  validateIdentity,
  isIdentityExpired,
  createDID,
  parseDID,
  isValidDID,
} from '@gtcx/identity';
import {
  createBoundaryValidator,
  sanitizeString,
  sanitizeObject,
  UuidSchema,
  Hash256Schema,
} from '@gtcx/security';
import {
  validateCertificateInput,
  verifyCertificateStructure,
  createProofBundle,
  verifyProofBundleStructure,
  createCryptographicProofRef,
  createLocationProof,
  parseProofBundle,
  parseQRData,
} from '@gtcx/verification';
import { describe, it, expect } from 'vitest';

describe('Error propagation: Invalid crypto inputs', () => {
  it('sign with invalid key propagates cleanly', () => {
    expect(() => sign('message', 'invalid-hex')).toThrow();
  });

  it('sign with wrong-length key propagates cleanly', () => {
    expect(() => sign('message', 'aabb')).toThrow();
  });

  it('verify with corrupted signature returns false (no throw)', async () => {
    const { identity } = await createIdentity();
    const corruptedSig = 'ff'.repeat(64); // 64 bytes of 0xFF

    // verify should return false, not throw
    expect(verify('message', corruptedSig, identity.publicKey)).toBe(false);
  });

  it('verify with wrong-format public key returns false', () => {
    const kp = generateKeyPair();
    const sig = sign('test', kp.privateKey);
    // Truncated public key
    expect(verify('test', sig, kp.publicKey.slice(0, 32))).toBe(false);
  });
});

describe('Error propagation: Identity validation failures', () => {
  it('validates identity with missing fields', () => {
    const incomplete = {
      id: 'test-id',
      publicKey: 'abc',
      // missing required fields
    };
    const result = validateIdentity(incomplete as never);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('non-expired identity passes expiration check', async () => {
    const { identity } = await createIdentity();
    // No expiresAt set — should not be expired
    expect(isIdentityExpired(identity)).toBe(false);
  });

  it('manually expired identity is detected', async () => {
    const { identity } = await createIdentity();
    identity.expiresAt = Date.now() - 60_000;
    expect(isIdentityExpired(identity)).toBe(true);
  });
});

describe('Error propagation: Certificate validation failures', () => {
  it('rejects certificate input with missing location', () => {
    const input = {
      templateId: 'location',
      userRole: 'inspector',
      deviceId: 'device-001',
      // missing location
    };
    const result = validateCertificateInput(input as never);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects certificate input with invalid template', () => {
    const input = {
      templateId: 'nonexistent-template',
      location: { latitude: 0, longitude: 0, accuracy: 5, timestamp: Date.now() },
      userRole: 'inspector',
      deviceId: 'device-001',
    };
    // getEffectiveTemplate throws for unknown templates
    expect(() => validateCertificateInput(input as never)).toThrow();
  });

  it('unsigned certificate fails structure verification', () => {
    const incomplete = {
      id: 'cert-001',
      type: 'location',
      // missing signature and other required fields
    };
    const result = verifyCertificateStructure(incomplete as never);
    expect(result.valid).toBe(false);
  });
});

describe('Error propagation: Proof bundle validation failures', () => {
  it('proof bundle with missing crypto proof fails validation', () => {
    const incomplete = {
      id: 'proof-001',
      type: 'location',
      timestamp: Date.now(),
      proofs: {
        // missing cryptographicProof
      },
    };
    const result = verifyProofBundleStructure(incomplete as never);
    expect(result.valid).toBe(false);
  });

  it('malformed serialized proof bundle returns null on parse', () => {
    expect(parseProofBundle('not-json')).toBeNull();
    expect(parseProofBundle('{}')).toBeNull(); // valid JSON but fails schema validation
  });

  it('malformed QR data returns null on parse', () => {
    expect(parseQRData('not-valid-qr-data')).toBeNull();
  });
});

describe('Error propagation: Security boundary validation', () => {
  it('sanitizes malicious string input', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = sanitizeString(malicious);
    expect(sanitized).not.toContain('<script>');
  });

  it('sanitizes deeply nested objects', () => {
    const dirty = {
      name: 'test',
      nested: {
        __proto__: 'attack',
        value: 'clean',
      },
    };
    const clean = sanitizeObject(dirty);
    expect(clean).toBeDefined();
  });

  it('boundary validator rejects invalid UUID format', () => {
    const validateUuid = createBoundaryValidator(UuidSchema);
    const result = validateUuid('not-a-uuid');
    expect(result.success).toBe(false);
  });

  it('boundary validator accepts valid hash256', () => {
    const validateHash = createBoundaryValidator(Hash256Schema);
    const validHash = hash256('test-data');
    const result = validateHash(validHash);
    expect(result.success).toBe(true);
  });

  it('boundary validator rejects truncated hash', () => {
    const validateHash = createBoundaryValidator(Hash256Schema);
    const result = validateHash('abc123');
    expect(result.success).toBe(false);
  });
});

describe('Error propagation: Cross-package tamper detection', () => {
  it('tampered Merkle proof fails verification', async () => {
    const identities = await Promise.all(Array.from({ length: 4 }, () => createIdentity()));
    const ids = identities.map((r) => r.identity.id);

    const tree = buildMerkleTree(ids);
    const proof = generateMerkleProof(tree, 1);

    // Tamper with the leaf
    const tampered = { ...proof, leaf: hash256('tampered') };
    expect(verifyMerkleProof(tampered)).toBe(false);
  });

  it('signature from different identity fails cross-verification', async () => {
    const alice = await createIdentity();
    const bob = await createIdentity();

    const message = 'cross-identity-message';
    const aliceSig = sign(message, alice.privateKey);

    // Create a proof bundle with Alice's signature but Bob's key — should be inconsistent
    const cryptoProof = createCryptographicProofRef(
      hash256(message),
      aliceSig,
      bob.identity.publicKey // wrong key!
    );

    // The bundle will be structurally valid...
    createProofBundle({
      type: 'location',
      cryptographicProof: cryptoProof,
      locationProof: createLocationProof({
        coordinates: {
          latitude: 6.2,
          longitude: -1.6,
          accuracy: 5,
          timestamp: Date.now(),
        },
        signature: aliceSig,
        publicKey: bob.identity.publicKey,
      }),
    });

    // ...but the signature won't verify cryptographically
    expect(verify(message, aliceSig, bob.identity.publicKey)).toBe(false);
    expect(verify(message, aliceSig, alice.identity.publicKey)).toBe(true);
  });
});

describe('Error propagation: DID resolution edge cases', () => {
  it('parseDID returns null for malformed DID', () => {
    expect(parseDID('')).toBeNull();
    expect(parseDID('did:')).toBeNull();
    expect(parseDID('did:btc:abc')).not.toBeNull(); // valid DID syntax, wrong method
  });

  it('isValidDID rejects non-GTCX DIDs', () => {
    expect(isValidDID('did:btc:abc')).toBe(false);
    expect(isValidDID('did:gtcx:valid')).toBe(true);
  });

  it('DID created from identity is always valid', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);
    expect(isValidDID(did)).toBe(true);

    const parsed = parseDID(did);
    expect(parsed).not.toBeNull();
    expect(parsed!.method).toBe('gtcx');
  });
});
