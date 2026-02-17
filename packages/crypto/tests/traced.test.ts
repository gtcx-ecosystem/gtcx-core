import { describe, it, expect } from 'vitest';

// ============================================================================
// Base functions (for comparison)
// ============================================================================
import {
  hash256,
  hash512,
  hash,
  hashObject,
  doubleHash256,
  verifyHash as verifyHashValue,
  createCommitment,
  verifyCommitment,
  combineHashes,
} from '../src/hashing';
import {
  generateKeyPair,
  derivePublicKey,
  isValidPublicKey,
  isValidPrivateKey,
  generateKeyId,
  compressPublicKey,
} from '../src/keys';
import {
  sign,
  verify,
  signHash,
  verifyHash as verifySignatureHash,
  createSignedMessage,
  verifySignedMessage,
  batchVerify,
} from '../src/signing';
import {
  tracedSign,
  tracedSignHash,
  tracedVerify,
  tracedVerifyHash,
  tracedCreateSignedMessage,
  tracedVerifySignedMessage,
  tracedBatchVerify,
  logSigningOperation,
} from '../src/traced';
import {
  tracedHash256,
  tracedHash512,
  tracedHash,
  tracedHashObject,
  tracedDoubleHash256,
  tracedVerifyHashValue,
  tracedCreateCommitment,
  tracedVerifyCommitment,
  tracedGenerateSalt,
  tracedCombineHashes,
} from '../src/traced-hashing';
import {
  tracedGenerateKeyPair,
  tracedDerivePublicKey,
  tracedIsValidPublicKey,
  tracedIsValidPrivateKey,
  tracedGenerateKeyId,
  tracedCompressPublicKey,
  logKeyEvent,
} from '../src/traced-keys';

// ============================================================================
// Traced hashing functions
// ============================================================================

// ============================================================================
// HELPER: generate a fresh Ed25519 key pair for each test group
// ============================================================================
function freshKeyPair() {
  return generateKeyPair('Ed25519');
}

// ============================================================================
// TRACED SIGNING OPERATIONS
// ============================================================================
describe('traced signing operations', () => {
  describe('tracedSign', () => {
    it('produces the same signature as base sign (string message)', () => {
      const kp = freshKeyPair();
      const message = 'hello traced world';
      const baseSig = sign(message, kp.privateKey);
      const tracedSig = tracedSign(message, kp.privateKey);
      expect(tracedSig).toBe(baseSig);
    });

    it('produces the same signature as base sign (Uint8Array message)', () => {
      const kp = freshKeyPair();
      const message = new TextEncoder().encode('binary traced');
      const baseSig = sign(message, kp.privateKey);
      const tracedSig = tracedSign(message, kp.privateKey);
      expect(tracedSig).toBe(baseSig);
    });

    it('produces a valid 128-char hex signature', () => {
      const kp = freshKeyPair();
      const sig = tracedSign('test', kp.privateKey);
      expect(sig).toMatch(/^[0-9a-f]{128}$/);
    });

    it('signature can be verified by base verify', () => {
      const kp = freshKeyPair();
      const msg = 'cross-verify';
      const sig = tracedSign(msg, kp.privateKey);
      expect(verify(msg, sig, kp.publicKey)).toBe(true);
    });
  });

  describe('tracedSignHash', () => {
    it('produces the same signature as base signHash', () => {
      const kp = freshKeyPair();
      const h = hash256('data to hash');
      const baseSig = signHash(h, kp.privateKey);
      const tracedSig = tracedSignHash(h, kp.privateKey);
      expect(tracedSig).toBe(baseSig);
    });

    it('resulting signature verifies against the hash', () => {
      const kp = freshKeyPair();
      const h = hash256('more data');
      const sig = tracedSignHash(h, kp.privateKey);
      expect(verifySignatureHash(h, sig, kp.publicKey)).toBe(true);
    });
  });

  describe('tracedVerify', () => {
    it('returns true for a valid signature (string message)', () => {
      const kp = freshKeyPair();
      const msg = 'verify me';
      const sig = sign(msg, kp.privateKey);
      expect(tracedVerify(msg, sig, kp.publicKey)).toBe(true);
    });

    it('returns true for a valid signature (Uint8Array message)', () => {
      const kp = freshKeyPair();
      const msg = new TextEncoder().encode('verify binary');
      const sig = sign(msg, kp.privateKey);
      expect(tracedVerify(msg, sig, kp.publicKey)).toBe(true);
    });

    it('returns false for a tampered message', () => {
      const kp = freshKeyPair();
      const sig = sign('original', kp.privateKey);
      expect(tracedVerify('tampered', sig, kp.publicKey)).toBe(false);
    });

    it('returns false for a wrong public key', () => {
      const kp1 = freshKeyPair();
      const kp2 = freshKeyPair();
      const sig = sign('msg', kp1.privateKey);
      expect(tracedVerify('msg', sig, kp2.publicKey)).toBe(false);
    });

    it('returns false for garbage signature (does not throw)', () => {
      const kp = freshKeyPair();
      expect(tracedVerify('msg', 'not-hex', kp.publicKey)).toBe(false);
    });

    it('produces the same result as base verify', () => {
      const kp = freshKeyPair();
      const msg = 'consistent';
      const sig = sign(msg, kp.privateKey);
      expect(tracedVerify(msg, sig, kp.publicKey)).toBe(verify(msg, sig, kp.publicKey));
    });
  });

  describe('tracedVerifyHash', () => {
    it('returns true for a valid hash signature', () => {
      const kp = freshKeyPair();
      const h = hash256('hash-verify');
      const sig = signHash(h, kp.privateKey);
      expect(tracedVerifyHash(h, sig, kp.publicKey)).toBe(true);
    });

    it('returns false for mismatched hash', () => {
      const kp = freshKeyPair();
      const h1 = hash256('one');
      const h2 = hash256('two');
      const sig = signHash(h1, kp.privateKey);
      expect(tracedVerifyHash(h2, sig, kp.publicKey)).toBe(false);
    });

    it('returns false for garbage inputs', () => {
      expect(tracedVerifyHash('bad', 'bad', 'bad')).toBe(false);
    });
  });

  describe('tracedCreateSignedMessage', () => {
    it('creates a valid signed message (string payload)', () => {
      const kp = freshKeyPair();
      const signed = tracedCreateSignedMessage('hello', kp.privateKey, kp.publicKey);
      expect(signed.signature).toMatch(/^[0-9a-f]{128}$/);
      expect(signed.publicKey).toBe(kp.publicKey);
      expect(signed.message).toBe('hello');
      expect(typeof signed.timestamp).toBe('number');
    });

    it('creates a valid signed message (object payload)', () => {
      const kp = freshKeyPair();
      const data = { foo: 'bar', num: 42 };
      const signed = tracedCreateSignedMessage(data, kp.privateKey, kp.publicKey);
      expect(signed.message).toBe(JSON.stringify(data, ['foo', 'num']));
    });

    it('result is verifiable by base verifySignedMessage', () => {
      const kp = freshKeyPair();
      const signed = tracedCreateSignedMessage('cross check', kp.privateKey, kp.publicKey);
      const result = verifySignedMessage(signed);
      expect(result.valid).toBe(true);
    });

    it('result is verifiable by tracedVerifySignedMessage', () => {
      const kp = freshKeyPair();
      const signed = tracedCreateSignedMessage({ a: 1 }, kp.privateKey, kp.publicKey);
      const result = tracedVerifySignedMessage(signed);
      expect(result.valid).toBe(true);
      expect(result.publicKey).toBe(kp.publicKey);
      expect(result.error).toBeUndefined();
    });
  });

  describe('tracedVerifySignedMessage', () => {
    it('returns valid for a correct signed message', () => {
      const kp = freshKeyPair();
      const signed = createSignedMessage('original', kp.privateKey, kp.publicKey);
      const result = tracedVerifySignedMessage(signed);
      expect(result.valid).toBe(true);
    });

    it('returns invalid for tampered message', () => {
      const kp = freshKeyPair();
      const signed = createSignedMessage('original', kp.privateKey, kp.publicKey);
      signed.message = 'tampered';
      const result = tracedVerifySignedMessage(signed);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid signature');
    });

    it('produces same result as base verifySignedMessage', () => {
      const kp = freshKeyPair();
      const signed = createSignedMessage('test', kp.privateKey, kp.publicKey);
      const baseResult = verifySignedMessage(signed);
      const tracedResult = tracedVerifySignedMessage(signed);
      expect(tracedResult.valid).toBe(baseResult.valid);
      expect(tracedResult.publicKey).toBe(baseResult.publicKey);
      expect(tracedResult.error).toBe(baseResult.error);
    });
  });

  describe('tracedBatchVerify', () => {
    it('returns all true for valid signatures', () => {
      const kp = freshKeyPair();
      const items = ['a', 'b', 'c'].map((msg) => ({
        message: msg,
        signature: sign(msg, kp.privateKey),
        publicKey: kp.publicKey,
      }));
      expect(tracedBatchVerify(items)).toEqual([true, true, true]);
    });

    it('returns correct mix of valid and invalid', () => {
      const kp1 = freshKeyPair();
      const kp2 = freshKeyPair();
      const validSig = sign('valid', kp1.privateKey);
      const wrongSig = sign('wrong', kp1.privateKey);
      const results = tracedBatchVerify([
        { message: 'valid', signature: validSig, publicKey: kp1.publicKey },
        { message: 'tampered', signature: wrongSig, publicKey: kp1.publicKey },
        { message: 'valid', signature: validSig, publicKey: kp2.publicKey },
      ]);
      expect(results).toEqual([true, false, false]);
    });

    it('returns empty array for empty input', () => {
      expect(tracedBatchVerify([])).toEqual([]);
    });

    it('produces same results as base batchVerify', () => {
      const kp = freshKeyPair();
      const items = ['x', 'y'].map((msg) => ({
        message: msg,
        signature: sign(msg, kp.privateKey),
        publicKey: kp.publicKey,
      }));
      expect(tracedBatchVerify(items)).toEqual(batchVerify(items));
    });
  });
});

// ============================================================================
// TRACED KEY OPERATIONS
// ============================================================================
describe('traced key operations', () => {
  describe('tracedGenerateKeyPair', () => {
    it('generates an Ed25519 key pair by default', () => {
      const kp = tracedGenerateKeyPair();
      expect(kp.algorithm).toBe('Ed25519');
      expect(kp.publicKey).toMatch(/^[0-9a-f]{64}$/);
      expect(kp.privateKey).toMatch(/^[0-9a-f]{64}$/);
    });

    it('generates an Ed25519 key pair when explicitly specified', () => {
      const kp = tracedGenerateKeyPair('Ed25519');
      expect(kp.algorithm).toBe('Ed25519');
      expect(kp.publicKey).toHaveLength(64);
      expect(kp.privateKey).toHaveLength(64);
    });

    it('generates a Secp256k1 key pair', () => {
      const kp = tracedGenerateKeyPair('Secp256k1');
      expect(kp.algorithm).toBe('Secp256k1');
      expect(kp.privateKey).toHaveLength(64);
      // Secp256k1 uncompressed public key is 65 bytes = 130 hex chars
      expect(kp.publicKey.length).toBeGreaterThanOrEqual(66); // compressed=66, uncompressed=130
    });

    it('generated keys can sign and verify', () => {
      const kp = tracedGenerateKeyPair('Ed25519');
      const sig = sign('traced key test', kp.privateKey);
      expect(verify('traced key test', sig, kp.publicKey)).toBe(true);
    });

    it('generates unique key pairs on each call', () => {
      const kp1 = tracedGenerateKeyPair();
      const kp2 = tracedGenerateKeyPair();
      expect(kp1.privateKey).not.toBe(kp2.privateKey);
      expect(kp1.publicKey).not.toBe(kp2.publicKey);
    });
  });

  describe('tracedDerivePublicKey', () => {
    it('derives same public key as base derivePublicKey for Ed25519', () => {
      const kp = generateKeyPair('Ed25519');
      const basePub = derivePublicKey(kp.privateKey, 'Ed25519');
      const tracedPub = tracedDerivePublicKey(kp.privateKey, 'Ed25519');
      expect(tracedPub).toBe(basePub);
    });

    it('derives same public key as base derivePublicKey for Secp256k1', () => {
      const kp = generateKeyPair('Secp256k1');
      const basePub = derivePublicKey(kp.privateKey, 'Secp256k1');
      const tracedPub = tracedDerivePublicKey(kp.privateKey, 'Secp256k1');
      expect(tracedPub).toBe(basePub);
    });

    it('defaults to Ed25519 when no algorithm specified', () => {
      const kp = generateKeyPair('Ed25519');
      const derived = tracedDerivePublicKey(kp.privateKey);
      expect(derived).toBe(kp.publicKey);
    });
  });

  describe('tracedIsValidPublicKey', () => {
    it('returns true for a valid Ed25519 public key', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedIsValidPublicKey(kp.publicKey, 'Ed25519')).toBe(true);
    });

    it('returns true for a valid Secp256k1 public key', () => {
      const kp = generateKeyPair('Secp256k1');
      expect(tracedIsValidPublicKey(kp.publicKey, 'Secp256k1')).toBe(true);
    });

    it('returns false for invalid hex', () => {
      expect(tracedIsValidPublicKey('not-hex')).toBe(false);
    });

    it('returns false for wrong-length key', () => {
      expect(tracedIsValidPublicKey('aabb')).toBe(false);
    });

    it('produces same result as base isValidPublicKey', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedIsValidPublicKey(kp.publicKey)).toBe(isValidPublicKey(kp.publicKey));
      expect(tracedIsValidPublicKey('bad')).toBe(isValidPublicKey('bad'));
    });
  });

  describe('tracedIsValidPrivateKey', () => {
    it('returns true for a valid 32-byte private key', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedIsValidPrivateKey(kp.privateKey)).toBe(true);
    });

    it('returns false for garbage input', () => {
      expect(tracedIsValidPrivateKey('not-a-key')).toBe(false);
    });

    it('returns false for wrong-length key', () => {
      expect(tracedIsValidPrivateKey('aabb')).toBe(false);
    });

    it('produces same result as base isValidPrivateKey', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedIsValidPrivateKey(kp.privateKey)).toBe(isValidPrivateKey(kp.privateKey));
      expect(tracedIsValidPrivateKey('zz')).toBe(isValidPrivateKey('zz'));
    });
  });

  describe('tracedGenerateKeyId', () => {
    it('produces same result as base generateKeyId', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedGenerateKeyId(kp.publicKey)).toBe(generateKeyId(kp.publicKey));
    });

    it('returns a DID-formatted key ID', () => {
      const kp = generateKeyPair('Ed25519');
      const keyId = tracedGenerateKeyId(kp.publicKey);
      expect(keyId).toMatch(/^did:gtcx:[0-9a-f]{16}$/);
    });

    it('is deterministic for the same public key', () => {
      const kp = generateKeyPair('Ed25519');
      expect(tracedGenerateKeyId(kp.publicKey)).toBe(tracedGenerateKeyId(kp.publicKey));
    });
  });

  describe('tracedCompressPublicKey', () => {
    it('produces same result as base compressPublicKey for already-compressed key', () => {
      generateKeyPair('Ed25519');
      // Ed25519 keys are 32 bytes, compressPublicKey with 33-byte input returns as-is
      // For a 32-byte key, compression will throw. Use Secp256k1 instead.
      const kpSecp = generateKeyPair('Secp256k1');
      const baseResult = compressPublicKey(kpSecp.publicKey);
      const tracedResult = tracedCompressPublicKey(kpSecp.publicKey);
      expect(tracedResult).toBe(baseResult);
    });

    it('throws for invalid key length (same as base)', () => {
      expect(() => tracedCompressPublicKey('aabb')).toThrow(
        'Invalid public key length for compression'
      );
      expect(() => compressPublicKey('aabb')).toThrow('Invalid public key length for compression');
    });
  });
});

// ============================================================================
// TRACED HASHING OPERATIONS
// ============================================================================
describe('traced hashing operations', () => {
  describe('tracedHash256', () => {
    it('produces same result as base hash256 (string)', () => {
      const input = 'hello hash256';
      expect(tracedHash256(input)).toBe(hash256(input));
    });

    it('produces same result as base hash256 (Uint8Array)', () => {
      const input = new TextEncoder().encode('binary hash256');
      expect(tracedHash256(input)).toBe(hash256(input));
    });

    it('returns a 64-char hex string', () => {
      expect(tracedHash256('test')).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic', () => {
      expect(tracedHash256('same input')).toBe(tracedHash256('same input'));
    });

    it('different inputs produce different hashes', () => {
      expect(tracedHash256('input A')).not.toBe(tracedHash256('input B'));
    });
  });

  describe('tracedHash512', () => {
    it('produces same result as base hash512', () => {
      const input = 'hello hash512';
      expect(tracedHash512(input)).toBe(hash512(input));
    });

    it('returns a 128-char hex string', () => {
      expect(tracedHash512('test')).toMatch(/^[0-9a-f]{128}$/);
    });

    it('works with Uint8Array input', () => {
      const input = new TextEncoder().encode('binary 512');
      expect(tracedHash512(input)).toBe(hash512(input));
    });
  });

  describe('tracedHash', () => {
    it('defaults to sha256 and matches base hash', () => {
      const input = 'default algo';
      expect(tracedHash(input)).toBe(hash(input));
    });

    it('produces same result with sha256 algorithm', () => {
      const input = 'sha256 explicit';
      expect(tracedHash(input, 'sha256')).toBe(hash(input, 'sha256'));
    });

    it('produces same result with sha512 algorithm', () => {
      const input = 'sha512 explicit';
      expect(tracedHash(input, 'sha512')).toBe(hash(input, 'sha512'));
    });

    it('sha256 and sha512 produce different outputs', () => {
      const input = 'same input';
      expect(tracedHash(input, 'sha256')).not.toBe(tracedHash(input, 'sha512'));
    });
  });

  describe('tracedHashObject', () => {
    it('produces same result as base hashObject', () => {
      const obj = { name: 'Alice', age: 30 };
      expect(tracedHashObject(obj)).toBe(hashObject(obj));
    });

    it('is deterministic regardless of key order', () => {
      const a = { z: 1, a: 2 };
      const b = { a: 2, z: 1 };
      expect(tracedHashObject(a)).toBe(tracedHashObject(b));
    });

    it('handles nested objects', () => {
      const obj = { outer: { inner: 'value' } };
      expect(tracedHashObject(obj)).toBe(hashObject(obj));
    });

    it('handles arrays', () => {
      const obj = { items: [1, 2, 3] };
      expect(tracedHashObject(obj)).toBe(hashObject(obj));
    });

    it('different objects produce different hashes', () => {
      expect(tracedHashObject({ a: 1 })).not.toBe(tracedHashObject({ a: 2 }));
    });
  });

  describe('tracedDoubleHash256', () => {
    it('produces same result as base doubleHash256', () => {
      const input = 'double hash me';
      expect(tracedDoubleHash256(input)).toBe(doubleHash256(input));
    });

    it('differs from single hash256', () => {
      const input = 'test';
      expect(tracedDoubleHash256(input)).not.toBe(tracedHash256(input));
    });

    it('returns a 64-char hex string', () => {
      expect(tracedDoubleHash256('test')).toMatch(/^[0-9a-f]{64}$/);
    });

    it('works with Uint8Array input', () => {
      const input = new TextEncoder().encode('binary double');
      expect(tracedDoubleHash256(input)).toBe(doubleHash256(input));
    });
  });

  describe('tracedVerifyHashValue', () => {
    it('returns true when hash matches', () => {
      const input = 'verify me';
      const expected = hash256(input);
      expect(tracedVerifyHashValue(input, expected)).toBe(true);
    });

    it('returns false when hash does not match', () => {
      expect(tracedVerifyHashValue('input', 'wrong_hash')).toBe(false);
    });

    it('produces same result as base verifyHash', () => {
      const input = 'test';
      const expected = hash256(input);
      expect(tracedVerifyHashValue(input, expected, 'sha256')).toBe(
        verifyHashValue(input, expected, 'sha256')
      );
    });

    it('works with sha512', () => {
      const input = 'sha512 verify';
      const expected = hash512(input);
      expect(tracedVerifyHashValue(input, expected, 'sha512')).toBe(true);
    });

    it('returns false for sha256 hash checked as sha512', () => {
      const input = 'algorithm mismatch';
      const sha256Hash = hash256(input);
      expect(tracedVerifyHashValue(input, sha256Hash, 'sha512')).toBe(false);
    });
  });

  describe('tracedCreateCommitment and tracedVerifyCommitment', () => {
    it('creates same commitment as base createCommitment', () => {
      const value = 'secret';
      const salt = 'random-salt';
      expect(tracedCreateCommitment(value, salt)).toBe(createCommitment(value, salt));
    });

    it('commitment can be verified by tracedVerifyCommitment', () => {
      const value = 'my-secret';
      const salt = 'my-salt';
      const commitment = tracedCreateCommitment(value, salt);
      expect(tracedVerifyCommitment(value, salt, commitment)).toBe(true);
    });

    it('commitment can be verified by base verifyCommitment', () => {
      const value = 'cross-check';
      const salt = 'cross-salt';
      const commitment = tracedCreateCommitment(value, salt);
      expect(verifyCommitment(value, salt, commitment)).toBe(true);
    });

    it('base commitment can be verified by tracedVerifyCommitment', () => {
      const value = 'reverse-check';
      const salt = 'reverse-salt';
      const commitment = createCommitment(value, salt);
      expect(tracedVerifyCommitment(value, salt, commitment)).toBe(true);
    });

    it('returns false for wrong value', () => {
      const commitment = tracedCreateCommitment('correct', 'salt');
      expect(tracedVerifyCommitment('wrong', 'salt', commitment)).toBe(false);
    });

    it('returns false for wrong salt', () => {
      const commitment = tracedCreateCommitment('value', 'correct-salt');
      expect(tracedVerifyCommitment('value', 'wrong-salt', commitment)).toBe(false);
    });
  });

  describe('tracedGenerateSalt', () => {
    it('generates a hex string of default length (32 bytes = 64 hex chars)', () => {
      const salt = tracedGenerateSalt();
      expect(salt).toMatch(/^[0-9a-f]{64}$/);
    });

    it('generates a hex string of specified length', () => {
      const salt = tracedGenerateSalt(16);
      expect(salt).toMatch(/^[0-9a-f]{32}$/);
    });

    it('generates unique salts on each call', () => {
      const salt1 = tracedGenerateSalt();
      const salt2 = tracedGenerateSalt();
      expect(salt1).not.toBe(salt2);
    });

    it('returned salt length matches requested byte count', () => {
      for (const len of [8, 16, 32, 64]) {
        const salt = tracedGenerateSalt(len);
        expect(salt).toHaveLength(len * 2); // hex is 2 chars per byte
      }
    });
  });

  describe('tracedCombineHashes', () => {
    it('produces same result as base combineHashes', () => {
      const h1 = hash256('a');
      const h2 = hash256('b');
      expect(tracedCombineHashes(h1, h2)).toBe(combineHashes(h1, h2));
    });

    it('order matters', () => {
      const h1 = hash256('x');
      const h2 = hash256('y');
      expect(tracedCombineHashes(h1, h2)).not.toBe(tracedCombineHashes(h2, h1));
    });

    it('works with three or more hashes', () => {
      const h1 = hash256('1');
      const h2 = hash256('2');
      const h3 = hash256('3');
      expect(tracedCombineHashes(h1, h2, h3)).toBe(combineHashes(h1, h2, h3));
    });

    it('returns a 64-char hex string', () => {
      const result = tracedCombineHashes(hash256('a'), hash256('b'));
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });
  });
});

// ============================================================================
// ERROR PROPAGATION
// ============================================================================
describe('error propagation', () => {
  it('tracedSign throws for invalid private key hex', () => {
    expect(() => tracedSign('msg', 'not-valid-hex')).toThrow();
  });

  it('tracedSignHash throws for invalid hash hex', () => {
    const kp = freshKeyPair();
    expect(() => tracedSignHash('not-valid-hex', kp.privateKey)).toThrow();
  });

  it('tracedDerivePublicKey throws for invalid private key', () => {
    expect(() => tracedDerivePublicKey('zzzz')).toThrow();
  });

  it('tracedCompressPublicKey throws for invalid length', () => {
    expect(() => tracedCompressPublicKey('aabbccdd')).toThrow(
      'Invalid public key length for compression'
    );
  });

  it('tracedVerify does not throw for invalid inputs (returns false)', () => {
    expect(tracedVerify('msg', 'bad-sig', 'bad-key')).toBe(false);
  });

  it('tracedVerifyHash does not throw for invalid inputs (returns false)', () => {
    expect(tracedVerifyHash('bad', 'bad', 'bad')).toBe(false);
  });

  it('tracedIsValidPublicKey does not throw for garbage (returns false)', () => {
    expect(tracedIsValidPublicKey('zzz')).toBe(false);
  });

  it('tracedIsValidPrivateKey does not throw for garbage (returns false)', () => {
    expect(tracedIsValidPrivateKey('zzz')).toBe(false);
  });
});

// ============================================================================
// LOGGING UTILITIES
// ============================================================================
describe('logSigningOperation', () => {
  it('does not throw for successful operation', () => {
    expect(() =>
      logSigningOperation({
        operation: 'sign',
        success: true,
        publicKeyId: 'kid-1',
        context: 'test',
      })
    ).not.toThrow();
  });

  it('does not throw for failed operation', () => {
    expect(() =>
      logSigningOperation({
        operation: 'verify',
        success: false,
        publicKeyId: 'kid-2',
        context: 'fail test',
      })
    ).not.toThrow();
  });

  it('does not throw without optional fields', () => {
    expect(() => logSigningOperation({ operation: 'sign', success: true })).not.toThrow();
    expect(() => logSigningOperation({ operation: 'verify', success: false })).not.toThrow();
  });
});

describe('logKeyEvent', () => {
  it('does not throw for generated event', () => {
    expect(() =>
      logKeyEvent({ type: 'generated', keyId: 'did:gtcx:12345678', algorithm: 'Ed25519' })
    ).not.toThrow();
  });

  it('does not throw for rotated event', () => {
    expect(() =>
      logKeyEvent({
        type: 'rotated',
        keyId: 'did:gtcx:abcdef01',
        algorithm: 'Ed25519',
        context: 'rotation',
      })
    ).not.toThrow();
  });

  it('does not throw for revoked event', () => {
    expect(() =>
      logKeyEvent({ type: 'revoked', keyId: 'did:gtcx:deadbeef', algorithm: 'Secp256k1' })
    ).not.toThrow();
  });

  it('does not throw for imported event', () => {
    expect(() =>
      logKeyEvent({ type: 'imported', keyId: 'did:gtcx:aabbccdd', algorithm: 'Ed25519' })
    ).not.toThrow();
  });

  it('does not throw for expired event', () => {
    expect(() =>
      logKeyEvent({ type: 'expired', keyId: 'did:gtcx:11223344', algorithm: 'Ed25519' })
    ).not.toThrow();
  });
});

// ============================================================================
// FULL ROUND-TRIP: traced sign -> traced verify
// ============================================================================
describe('full round-trip with traced functions only', () => {
  it('tracedSign + tracedVerify round-trips correctly', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    const msg = 'full round trip';
    const sig = tracedSign(msg, kp.privateKey);
    expect(tracedVerify(msg, sig, kp.publicKey)).toBe(true);
  });

  it('tracedSignHash + tracedVerifyHash round-trips correctly', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    const h = tracedHash256('data to sign');
    const sig = tracedSignHash(h, kp.privateKey);
    expect(tracedVerifyHash(h, sig, kp.publicKey)).toBe(true);
  });

  it('tracedCreateSignedMessage + tracedVerifySignedMessage round-trips correctly', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    const signed = tracedCreateSignedMessage(
      { action: 'transfer', amount: 100 },
      kp.privateKey,
      kp.publicKey
    );
    const result = tracedVerifySignedMessage(signed);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('tracedCreateCommitment + tracedVerifyCommitment round-trips correctly', () => {
    const salt = tracedGenerateSalt();
    const value = 'committed-value';
    const commitment = tracedCreateCommitment(value, salt);
    expect(tracedVerifyCommitment(value, salt, commitment)).toBe(true);
  });

  it('tracedHash + tracedVerifyHashValue round-trips correctly', () => {
    const input = 'verify this hash';
    const h = tracedHash(input, 'sha256');
    expect(tracedVerifyHashValue(input, h, 'sha256')).toBe(true);
  });

  it('tracedGenerateKeyPair keys pass validation', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    expect(tracedIsValidPublicKey(kp.publicKey, 'Ed25519')).toBe(true);
    expect(tracedIsValidPrivateKey(kp.privateKey)).toBe(true);
  });

  it('tracedDerivePublicKey matches generated public key', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    const derived = tracedDerivePublicKey(kp.privateKey, 'Ed25519');
    expect(derived).toBe(kp.publicKey);
  });

  it('tracedGenerateKeyId produces consistent ID for derived public key', () => {
    const kp = tracedGenerateKeyPair('Ed25519');
    const keyId = tracedGenerateKeyId(kp.publicKey);
    const derived = tracedDerivePublicKey(kp.privateKey, 'Ed25519');
    expect(tracedGenerateKeyId(derived)).toBe(keyId);
  });
});
