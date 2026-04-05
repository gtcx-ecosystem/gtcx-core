import { describe, expect, it } from 'vitest';

import { hash256 } from '../src/hashing';
import { generateKeyPair } from '../src/keys';
import {
  sign,
  verify,
  signHash,
  verifyHash,
  createSignedMessage,
  verifySignedMessage,
  batchVerify,
  secureWipe,
} from '../src/signing';

describe('sign and verify', () => {
  it('round-trips with a valid Ed25519 key pair (string message)', () => {
    const kp = generateKeyPair('Ed25519');
    const message = 'hello world';
    const signature = sign(message, kp.privateKey);
    expect(verify(message, signature, kp.publicKey)).toBe(true);
  });

  it('round-trips with Uint8Array message', () => {
    const kp = generateKeyPair('Ed25519');
    const message = new TextEncoder().encode('binary data');
    const signature = sign(message, kp.privateKey);
    expect(verify(message, signature, kp.publicKey)).toBe(true);
  });

  it('produces a 128-char hex signature (64 bytes)', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('test', kp.privateKey);
    expect(signature).toMatch(/^[0-9a-f]{128}$/);
  });

  it('rejects a tampered message', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('original message', kp.privateKey);
    expect(verify('tampered message', signature, kp.publicKey)).toBe(false);
  });

  it('rejects a wrong public key', () => {
    const kp1 = generateKeyPair('Ed25519');
    const kp2 = generateKeyPair('Ed25519');
    const signature = sign('test message', kp1.privateKey);
    expect(verify('test message', signature, kp2.publicKey)).toBe(false);
  });

  it('verify returns false for garbage signature', () => {
    const kp = generateKeyPair('Ed25519');
    expect(verify('test', 'not-a-signature', kp.publicKey)).toBe(false);
  });

  it('verify returns false for garbage public key', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('test', kp.privateKey);
    expect(verify('test', signature, 'deadbeef')).toBe(false);
  });

  it('signs and verifies an empty string message', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('', kp.privateKey);
    expect(signature).toMatch(/^[0-9a-f]{128}$/);
    expect(verify('', signature, kp.publicKey)).toBe(true);
  });

  it('signs and verifies an empty Uint8Array message', () => {
    const kp = generateKeyPair('Ed25519');
    const emptyBytes = new Uint8Array(0);
    const signature = sign(emptyBytes, kp.privateKey);
    expect(signature).toMatch(/^[0-9a-f]{128}$/);
    expect(verify(emptyBytes, signature, kp.publicKey)).toBe(true);
  });

  it('empty string and empty Uint8Array produce the same signature', () => {
    const kp = generateKeyPair('Ed25519');
    const sigFromString = sign('', kp.privateKey);
    const sigFromBytes = sign(new Uint8Array(0), kp.privateKey);
    expect(sigFromString).toBe(sigFromBytes);
  });

  it('signs and verifies a very large message (1 MB)', () => {
    const kp = generateKeyPair('Ed25519');
    const largeMessage = 'A'.repeat(1024 * 1024); // 1 MB
    const signature = sign(largeMessage, kp.privateKey);
    expect(signature).toMatch(/^[0-9a-f]{128}$/);
    expect(verify(largeMessage, signature, kp.publicKey)).toBe(true);
  });

  it('verify returns false for a truncated (wrong-length) signature', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('test', kp.privateKey);
    const truncated = signature.substring(0, 64); // half the signature
    expect(verify('test', truncated, kp.publicKey)).toBe(false);
  });

  it('verify returns false for an empty signature string', () => {
    const kp = generateKeyPair('Ed25519');
    expect(verify('test', '', kp.publicKey)).toBe(false);
  });

  it('verify returns false for an empty public key string', () => {
    const kp = generateKeyPair('Ed25519');
    const signature = sign('test', kp.privateKey);
    expect(verify('test', signature, '')).toBe(false);
  });
});

describe('signHash and verifyHash', () => {
  it('round-trips with a valid hash', () => {
    const kp = generateKeyPair('Ed25519');
    const h = hash256('some data');
    const signature = signHash(h, kp.privateKey);
    expect(verifyHash(h, signature, kp.publicKey)).toBe(true);
  });

  it('rejects a different hash', () => {
    const kp = generateKeyPair('Ed25519');
    const h1 = hash256('data one');
    const h2 = hash256('data two');
    const signature = signHash(h1, kp.privateKey);
    expect(verifyHash(h2, signature, kp.publicKey)).toBe(false);
  });

  it('rejects a wrong public key', () => {
    const kp1 = generateKeyPair('Ed25519');
    const kp2 = generateKeyPair('Ed25519');
    const h = hash256('test');
    const signature = signHash(h, kp1.privateKey);
    expect(verifyHash(h, signature, kp2.publicKey)).toBe(false);
  });

  it('verifyHash returns false for garbage inputs', () => {
    expect(verifyHash('bad', 'bad', 'bad')).toBe(false);
  });
});

describe('createSignedMessage and verifySignedMessage', () => {
  it('round-trips with a string payload', () => {
    const kp = generateKeyPair('Ed25519');
    const signed = createSignedMessage('hello', kp.privateKey, kp.publicKey);
    const result = verifySignedMessage(signed);
    expect(result.valid).toBe(true);
    expect(result.publicKey).toBe(kp.publicKey);
    expect(result.error).toBeUndefined();
  });

  it('round-trips with an object payload', () => {
    const kp = generateKeyPair('Ed25519');
    const data = { name: 'Alice', amount: 100 };
    const signed = createSignedMessage(data, kp.privateKey, kp.publicKey);
    const result = verifySignedMessage(signed);
    expect(result.valid).toBe(true);
  });

  it('includes timestamp', () => {
    const kp = generateKeyPair('Ed25519');
    const before = Date.now();
    const signed = createSignedMessage('test', kp.privateKey, kp.publicKey);
    const after = Date.now();
    expect(signed.timestamp).toBeGreaterThanOrEqual(before);
    expect(signed.timestamp).toBeLessThanOrEqual(after);
  });

  it('serializes object message with deterministic deep-sorted keys', () => {
    const kp = generateKeyPair('Ed25519');
    const data = { z: 1, a: 2 };
    const signed = createSignedMessage(data, kp.privateKey, kp.publicKey);
    expect(signed.message).toBe('{"a":2,"z":1}');
  });

  it('produces identical signatures for nested objects regardless of key order', () => {
    const kp = generateKeyPair('Ed25519');
    const data1 = { a: { z: 1, a: 2 }, b: 1 };
    const data2 = { b: 1, a: { a: 2, z: 1 } };
    const signed1 = createSignedMessage(data1, kp.privateKey, kp.publicKey);
    const signed2 = createSignedMessage(data2, kp.privateKey, kp.publicKey);
    expect(signed1.message).toBe(signed2.message);
    expect(signed1.signature).toBe(signed2.signature);
  });

  it('rejects tampered signed message', () => {
    const kp = generateKeyPair('Ed25519');
    const signed = createSignedMessage('original', kp.privateKey, kp.publicKey);
    signed.message = 'tampered';
    const result = verifySignedMessage(signed);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid signature');
  });

  it('rejects signed message with wrong public key', () => {
    const kp1 = generateKeyPair('Ed25519');
    const kp2 = generateKeyPair('Ed25519');
    const signed = createSignedMessage('test', kp1.privateKey, kp1.publicKey);
    signed.publicKey = kp2.publicKey;
    const result = verifySignedMessage(signed);
    expect(result.valid).toBe(false);
  });
});

describe('batchVerify', () => {
  it('returns all true for valid signatures', () => {
    const kp = generateKeyPair('Ed25519');
    const items = ['msg1', 'msg2', 'msg3'].map((msg) => ({
      message: msg,
      signature: sign(msg, kp.privateKey),
      publicKey: kp.publicKey,
    }));
    const results = batchVerify(items);
    expect(results).toEqual([true, true, true]);
  });

  it('returns correct mix of valid and invalid', () => {
    const kp1 = generateKeyPair('Ed25519');
    const kp2 = generateKeyPair('Ed25519');

    const validSig = sign('valid', kp1.privateKey);
    const invalidSig = sign('wrong', kp1.privateKey);

    const results = batchVerify([
      { message: 'valid', signature: validSig, publicKey: kp1.publicKey },
      { message: 'tampered', signature: invalidSig, publicKey: kp1.publicKey },
      { message: 'valid', signature: validSig, publicKey: kp2.publicKey },
    ]);
    expect(results).toEqual([true, false, false]);
  });

  it('returns empty array for empty input', () => {
    expect(batchVerify([])).toEqual([]);
  });
});

describe('secureWipe', () => {
  it('zeroes all bytes in a Uint8Array', () => {
    const buffer = new Uint8Array([1, 2, 3, 4, 5]);
    secureWipe(buffer);
    expect(buffer).toEqual(new Uint8Array([0, 0, 0, 0, 0]));
  });

  it('handles empty buffer', () => {
    const buffer = new Uint8Array(0);
    secureWipe(buffer);
    expect(buffer).toEqual(new Uint8Array(0));
  });

  it('handles single-byte buffer', () => {
    const buffer = new Uint8Array([0xff]);
    secureWipe(buffer);
    expect(buffer).toEqual(new Uint8Array([0]));
  });
});

describe('sign with invalid private key', () => {
  it('throws for invalid private key hex', () => {
    expect(() => sign('test', 'not-valid-hex')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Secp256k1 signing — ensures Ed25519-only sign/verify works with Secp256k1
// keys at the key-generation level (sign/verify are Ed25519-only by design)
// ---------------------------------------------------------------------------

describe('Secp256k1 key generation interop', () => {
  it('generates valid Secp256k1 key pairs', () => {
    const kp = generateKeyPair('Secp256k1');
    expect(kp.algorithm).toBe('Secp256k1');
    expect(kp.publicKey).toMatch(/^[a-f0-9]+$/);
    expect(kp.privateKey).toMatch(/^[a-f0-9]+$/);
    // Secp256k1 compressed public key = 33 bytes = 66 hex chars
    expect(kp.publicKey.length).toBe(66);
    // Private key = 32 bytes = 64 hex chars
    expect(kp.privateKey.length).toBe(64);
  });

  it('generates unique Secp256k1 key pairs', () => {
    const kp1 = generateKeyPair('Secp256k1');
    const kp2 = generateKeyPair('Secp256k1');
    expect(kp1.privateKey).not.toBe(kp2.privateKey);
    expect(kp1.publicKey).not.toBe(kp2.publicKey);
  });
});

// ---------------------------------------------------------------------------
// FIPS P-256 backend — node:crypto ECDSA via OpenSSL
// ---------------------------------------------------------------------------

describe('P256 FIPS backend (node:crypto)', () => {
  it('generates P256 key pair', () => {
    const kp = generateKeyPair('P256');
    expect(kp.algorithm).toBe('P256');
    expect(kp.publicKey).toBeTruthy();
    expect(kp.privateKey).toBeTruthy();
  });

  it('signs and verifies with P256', () => {
    const kp = generateKeyPair('P256');
    const message = 'FIPS compliance test';
    const signature = sign(message, kp.privateKey, { algorithm: 'P256' });
    const valid = verify(message, signature, kp.publicKey, { algorithm: 'P256' });
    expect(valid).toBe(true);
  });

  it('rejects tampered message with P256', () => {
    const kp = generateKeyPair('P256');
    const signature = sign('original', kp.privateKey, { algorithm: 'P256' });
    const valid = verify('tampered', signature, kp.publicKey, { algorithm: 'P256' });
    expect(valid).toBe(false);
  });

  it('rejects wrong key with P256', () => {
    const kp1 = generateKeyPair('P256');
    const kp2 = generateKeyPair('P256');
    const signature = sign('message', kp1.privateKey, { algorithm: 'P256' });
    const valid = verify('message', signature, kp2.publicKey, { algorithm: 'P256' });
    expect(valid).toBe(false);
  });

  it('generates unique P256 key pairs', () => {
    const kp1 = generateKeyPair('P256');
    const kp2 = generateKeyPair('P256');
    expect(kp1.privateKey).not.toBe(kp2.privateKey);
    expect(kp1.publicKey).not.toBe(kp2.publicKey);
  });
});
