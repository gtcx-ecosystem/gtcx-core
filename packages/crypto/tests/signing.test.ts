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

  it('serializes object message as sorted-key JSON', () => {
    const kp = generateKeyPair('Ed25519');
    const data = { z: 1, a: 2 };
    const signed = createSignedMessage(data, kp.privateKey, kp.publicKey);
    // Object.keys sorts: ['z','a'] sorted -> ['a','z']
    expect(signed.message).toBe(JSON.stringify(data, ['a', 'z']));
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
