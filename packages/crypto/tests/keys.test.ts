import { describe, expect, it } from 'vitest';

import {
  generateKeyPair,
  derivePublicKey,
  isValidPublicKey,
  isValidPrivateKey,
  generateKeyId,
  compressPublicKey,
  keyFormats,
  getPublicKeyLength,
} from '../src/keys';

describe('generateKeyPair', () => {
  it('returns valid Ed25519 key pair by default', () => {
    const kp = generateKeyPair();
    expect(kp.algorithm).toBe('Ed25519');
    expect(kp.publicKey).toMatch(/^[0-9a-f]{64}$/);
    expect(kp.privateKey).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns valid Ed25519 key pair when explicitly specified', () => {
    const kp = generateKeyPair('Ed25519');
    expect(kp.algorithm).toBe('Ed25519');
    expect(kp.publicKey).toHaveLength(64); // 32 bytes hex
    expect(kp.privateKey).toHaveLength(64);
  });

  it('returns valid Secp256k1 key pair', () => {
    const kp = generateKeyPair('Secp256k1');
    expect(kp.algorithm).toBe('Secp256k1');
    expect(kp.privateKey).toMatch(/^[0-9a-f]{64}$/); // 32 bytes
    // Public key is either 33 bytes (compressed, 66 hex) or 65 bytes (uncompressed, 130 hex)
    expect([66, 130]).toContain(kp.publicKey.length);
  });

  it('generates unique key pairs on each call', () => {
    const kp1 = generateKeyPair();
    const kp2 = generateKeyPair();
    expect(kp1.publicKey).not.toBe(kp2.publicKey);
    expect(kp1.privateKey).not.toBe(kp2.privateKey);
  });
});

describe('derivePublicKey', () => {
  it('derives matching public key for Ed25519', () => {
    const kp = generateKeyPair('Ed25519');
    const derived = derivePublicKey(kp.privateKey, 'Ed25519');
    expect(derived).toBe(kp.publicKey);
  });

  it('derives matching public key for Secp256k1', () => {
    const kp = generateKeyPair('Secp256k1');
    const derived = derivePublicKey(kp.privateKey, 'Secp256k1');
    expect(derived).toBe(kp.publicKey);
  });

  it('defaults to Ed25519 algorithm', () => {
    const kp = generateKeyPair('Ed25519');
    const derived = derivePublicKey(kp.privateKey);
    expect(derived).toBe(kp.publicKey);
  });
});

describe('isValidPublicKey', () => {
  it('accepts a valid Ed25519 public key', () => {
    const kp = generateKeyPair('Ed25519');
    expect(isValidPublicKey(kp.publicKey, 'Ed25519')).toBe(true);
  });

  it('accepts a valid Secp256k1 public key', () => {
    const kp = generateKeyPair('Secp256k1');
    expect(isValidPublicKey(kp.publicKey, 'Secp256k1')).toBe(true);
  });

  it('defaults to Ed25519 validation', () => {
    const kp = generateKeyPair('Ed25519');
    expect(isValidPublicKey(kp.publicKey)).toBe(true);
  });

  it('rejects garbage strings', () => {
    expect(isValidPublicKey('not-a-key')).toBe(false);
    expect(isValidPublicKey('')).toBe(false);
    expect(isValidPublicKey('zzzz')).toBe(false);
  });

  it('rejects wrong-length hex for Ed25519', () => {
    // 16 bytes (too short)
    expect(isValidPublicKey('aa'.repeat(16), 'Ed25519')).toBe(false);
    // 33 bytes (too long for Ed25519)
    expect(isValidPublicKey('aa'.repeat(33), 'Ed25519')).toBe(false);
  });

  it('accepts compressed (33-byte) Secp256k1 key', () => {
    expect(isValidPublicKey('02' + 'aa'.repeat(32), 'Secp256k1')).toBe(true);
  });

  it('accepts uncompressed (65-byte) Secp256k1 key', () => {
    expect(isValidPublicKey('04' + 'aa'.repeat(64), 'Secp256k1')).toBe(true);
  });

  it('rejects wrong-length hex for Secp256k1', () => {
    expect(isValidPublicKey('aa'.repeat(32), 'Secp256k1')).toBe(false);
  });
});

describe('isValidPrivateKey', () => {
  it('accepts a valid 32-byte private key', () => {
    const kp = generateKeyPair('Ed25519');
    expect(isValidPrivateKey(kp.privateKey)).toBe(true);
  });

  it('accepts a 64-byte hex string (64 bytes)', () => {
    expect(isValidPrivateKey('ab'.repeat(64))).toBe(true);
  });

  it('rejects garbage strings', () => {
    expect(isValidPrivateKey('not-a-key')).toBe(false);
    expect(isValidPrivateKey('')).toBe(false);
    expect(isValidPrivateKey('zzzz')).toBe(false);
  });

  it('rejects wrong-length hex', () => {
    expect(isValidPrivateKey('aa'.repeat(16))).toBe(false);
    expect(isValidPrivateKey('aa'.repeat(48))).toBe(false);
  });
});

describe('generateKeyId', () => {
  it('returns a deterministic ID for the same key', () => {
    const kp = generateKeyPair();
    const id1 = generateKeyId(kp.publicKey);
    const id2 = generateKeyId(kp.publicKey);
    expect(id1).toBe(id2);
  });

  it('returns a did:gtcx: prefixed string', () => {
    const kp = generateKeyPair();
    const id = generateKeyId(kp.publicKey);
    expect(id).toMatch(/^did:gtcx:[0-9a-f]{16}$/);
  });

  it('uses the first 16 chars of the public key', () => {
    const kp = generateKeyPair();
    const id = generateKeyId(kp.publicKey);
    expect(id).toBe(`did:gtcx:${kp.publicKey.substring(0, 16)}`);
  });

  it('produces different IDs for different keys', () => {
    const kp1 = generateKeyPair();
    const kp2 = generateKeyPair();
    expect(generateKeyId(kp1.publicKey)).not.toBe(generateKeyId(kp2.publicKey));
  });
});

describe('compressPublicKey', () => {
  it('returns the same key if already 33 bytes (compressed)', () => {
    const hex33 = '02' + 'aa'.repeat(32);
    expect(compressPublicKey(hex33)).toBe(hex33);
  });

  it('compresses a 65-byte uncompressed key to 33 bytes', () => {
    generateKeyPair('Secp256k1');
    // The noble library may return compressed or uncompressed; build an uncompressed key manually
    // Prefix 04 + 64 bytes X + 64 bytes Y (even last byte)
    const uncompressedEven = '04' + 'ab'.repeat(32) + 'cd'.repeat(31) + 'ce'; // last byte 0xce is even
    const compressed = compressPublicKey(uncompressedEven);
    expect(compressed).toHaveLength(66); // 33 bytes in hex
    expect(compressed.startsWith('02')).toBe(true); // even -> 02 prefix
  });

  it('uses 03 prefix for odd last byte', () => {
    const uncompressedOdd = '04' + 'ab'.repeat(32) + 'cd'.repeat(31) + 'cf'; // last byte 0xcf is odd
    const compressed = compressPublicKey(uncompressedOdd);
    expect(compressed).toHaveLength(66);
    expect(compressed.startsWith('03')).toBe(true);
  });

  it('throws for invalid length', () => {
    expect(() => compressPublicKey('aa'.repeat(20))).toThrow('Invalid public key length');
  });
});

describe('keyFormats', () => {
  it('toBytes/toHex round-trip', () => {
    const kp = generateKeyPair();
    const bytes = keyFormats.toBytes(kp.publicKey);
    const hex = keyFormats.toHex(bytes);
    expect(hex).toBe(kp.publicKey);
  });

  it('toBase64/fromBase64 round-trip', () => {
    const kp = generateKeyPair();
    const b64 = keyFormats.toBase64(kp.publicKey);
    const hex = keyFormats.fromBase64(b64);
    expect(hex).toBe(kp.publicKey);
  });

  it('toBase64 returns a valid base64 string', () => {
    const kp = generateKeyPair();
    const b64 = keyFormats.toBase64(kp.publicKey);
    expect(b64).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it('toBytes returns Uint8Array of correct length for Ed25519', () => {
    const kp = generateKeyPair('Ed25519');
    const bytes = keyFormats.toBytes(kp.publicKey);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(32);
  });
});

describe('getPublicKeyLength', () => {
  it('returns 32 for Ed25519', () => {
    expect(getPublicKeyLength('Ed25519')).toBe(32);
  });

  it('returns 33 for Secp256k1', () => {
    expect(getPublicKeyLength('Secp256k1')).toBe(33);
  });
});
