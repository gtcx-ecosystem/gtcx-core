/**
 * Property-based tests for cryptographic primitives.
 *
 * Closes the "TS-side property-based testing thin" finding from the
 * 2026-05-10 external assessment. Example-based tests verify specific
 * inputs; property-based tests verify universal invariants — the
 * appropriate discipline for a cryptographic library where edge-case
 * inputs determine correctness.
 *
 * Each property runs with `numRuns: 100` by default (fast-check default
 * is 100; explicit for clarity). Properties that exercise expensive
 * operations (key generation) cap at the same value to keep CI fast.
 */

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  hash256,
  hash512,
  doubleHash256,
  createCommitment,
  verifyCommitment,
  constantTimeEqual,
  generateSalt,
} from '../src/hashing';
import { generateKeyPair, derivePublicKey, isValidPublicKey, isValidPrivateKey } from '../src/keys';
import { sign, verify } from '../src/signing';

// ---------------------------------------------------------------------------
// Ed25519 signature properties
// ---------------------------------------------------------------------------

describe('Ed25519 signing properties', () => {
  it('sign-then-verify roundtrips for any byte sequence', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 1024 }), (messageBytes) => {
        const message = Buffer.from(messageBytes).toString('hex');
        const keyPair = generateKeyPair();
        const signature = sign(message, keyPair.privateKey);
        return verify(message, signature, keyPair.publicKey);
      }),
      { numRuns: 100 }
    );
  });

  it('verification fails for any modified message', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 1, maxLength: 512 }),
        fc.uint8Array({ minLength: 1, maxLength: 512 }),
        (a, b) => {
          fc.pre(Buffer.compare(a, b) !== 0);
          const message = Buffer.from(a).toString('hex');
          const tampered = Buffer.from(b).toString('hex');
          const keyPair = generateKeyPair();
          const signature = sign(message, keyPair.privateKey);
          return !verify(tampered, signature, keyPair.publicKey);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('signing is deterministic — same key + message produces identical signatures', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 256 }), (messageBytes) => {
        const message = Buffer.from(messageBytes).toString('hex');
        const keyPair = generateKeyPair();
        const sig1 = sign(message, keyPair.privateKey);
        const sig2 = sign(message, keyPair.privateKey);
        return sig1 === sig2;
      }),
      { numRuns: 50 }
    );
  });

  it('verification fails when the wrong public key is supplied', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 256 }), (messageBytes) => {
        const message = Buffer.from(messageBytes).toString('hex');
        const signer = generateKeyPair();
        const otherKey = generateKeyPair();
        // Statistically impossible for two random keypairs to collide
        fc.pre(signer.publicKey !== otherKey.publicKey);
        const signature = sign(message, signer.privateKey);
        return !verify(message, signature, otherKey.publicKey);
      }),
      { numRuns: 50 }
    );
  });

  it('signature is exactly 128 hex chars (64 bytes) for any message', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 4096 }), (messageBytes) => {
        const message = Buffer.from(messageBytes).toString('hex');
        const keyPair = generateKeyPair();
        const signature = sign(message, keyPair.privateKey);
        return signature.length === 128 && /^[0-9a-f]+$/i.test(signature);
      }),
      { numRuns: 100 }
    );
  });

  it('generated keypair has 64-hex-char public key and 64-hex-char private key', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const keyPair = generateKeyPair();
        return (
          keyPair.publicKey.length === 64 &&
          keyPair.privateKey.length === 64 &&
          /^[0-9a-f]+$/i.test(keyPair.publicKey) &&
          /^[0-9a-f]+$/i.test(keyPair.privateKey) &&
          isValidPublicKey(keyPair.publicKey) &&
          isValidPrivateKey(keyPair.privateKey)
        );
      }),
      { numRuns: 50 }
    );
  });

  it('derivePublicKey is deterministic and matches generated keypair', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const keyPair = generateKeyPair();
        const derived1 = derivePublicKey(keyPair.privateKey);
        const derived2 = derivePublicKey(keyPair.privateKey);
        return derived1 === derived2 && derived1 === keyPair.publicKey;
      }),
      { numRuns: 50 }
    );
  });
});

// ---------------------------------------------------------------------------
// Hashing properties
// ---------------------------------------------------------------------------

describe('Hashing properties', () => {
  it('hash256 is deterministic — same input produces same output', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 1024 }), (data) => {
        const a = hash256(data);
        const b = hash256(data);
        return a === b;
      }),
      { numRuns: 100 }
    );
  });

  it('hash256 output is exactly 64 hex chars (32 bytes)', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 4096 }), (data) => {
        const h = hash256(data);
        return h.length === 64 && /^[0-9a-f]+$/i.test(h);
      }),
      { numRuns: 100 }
    );
  });

  it('hash512 output is exactly 128 hex chars (64 bytes)', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 0, maxLength: 4096 }), (data) => {
        const h = hash512(data);
        return h.length === 128 && /^[0-9a-f]+$/i.test(h);
      }),
      { numRuns: 100 }
    );
  });

  it('hash256 and hash512 produce distinct outputs for any non-empty input', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 512 }), (data) => {
        // Different output lengths guarantee distinctness, but compare
        // the first 64 chars to catch any accidental sha512-truncated-to-256
        // pathology.
        return hash256(data).slice(0, 64) !== hash512(data).slice(0, 64);
      }),
      { numRuns: 50 }
    );
  });

  it('different inputs produce different hash256 outputs (collision-resistance probe)', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 1, maxLength: 256 }),
        fc.uint8Array({ minLength: 1, maxLength: 256 }),
        (a, b) => {
          fc.pre(Buffer.compare(a, b) !== 0);
          return hash256(a) !== hash256(b);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('doubleHash256(x) differs from hash256(x) for non-trivial inputs', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 512 }), (data) => {
        // Extremely unlikely a single-hash output equals its double-hash.
        // Equivalent to hash256(h) === h for some h ∈ {hash256-outputs} —
        // a cosmic-ray-level coincidence in 256-bit space.
        return hash256(data) !== doubleHash256(data);
      }),
      { numRuns: 50 }
    );
  });

  it('hash256 of single byte input still produces 64-char output (no length leak)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 255 }), (byte) => {
        const data = new Uint8Array([byte]);
        const h = hash256(data);
        return h.length === 64;
      }),
      { numRuns: 50 }
    );
  });
});

// ---------------------------------------------------------------------------
// Commitment properties
// ---------------------------------------------------------------------------

describe('Commitment properties', () => {
  it('createCommitment + verifyCommitment roundtrip with the same salt', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 256 }),
        fc.uint8Array({ minLength: 16, maxLength: 64 }),
        (data, saltBytes) => {
          const salt = Buffer.from(saltBytes).toString('hex');
          const commitment = createCommitment(data, salt);
          return verifyCommitment(data, salt, commitment);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('verifyCommitment fails when the salt is wrong', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 256 }),
        fc.uint8Array({ minLength: 16, maxLength: 64 }),
        fc.uint8Array({ minLength: 16, maxLength: 64 }),
        (data, saltA, saltB) => {
          fc.pre(Buffer.compare(saltA, saltB) !== 0);
          const realSalt = Buffer.from(saltA).toString('hex');
          const wrongSalt = Buffer.from(saltB).toString('hex');
          const commitment = createCommitment(data, realSalt);
          return !verifyCommitment(data, wrongSalt, commitment);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('verifyCommitment fails when the data is wrong', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 256 }),
        fc.string({ minLength: 1, maxLength: 256 }),
        fc.uint8Array({ minLength: 16, maxLength: 64 }),
        (dataA, dataB, saltBytes) => {
          fc.pre(dataA !== dataB);
          const salt = Buffer.from(saltBytes).toString('hex');
          const commitment = createCommitment(dataA, salt);
          return !verifyCommitment(dataB, salt, commitment);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Constant-time equality properties
// ---------------------------------------------------------------------------

describe('constantTimeEqual properties', () => {
  it('returns true for any string compared to itself', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 256 }), (s) => {
        return constantTimeEqual(s, s);
      }),
      { numRuns: 100 }
    );
  });

  it('returns false for any pair of distinct equal-length strings', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 1, maxLength: 64 }),
        fc.uint8Array({ minLength: 1, maxLength: 64 }),
        (a, b) => {
          fc.pre(a.length === b.length && Buffer.compare(a, b) !== 0);
          const sa = Buffer.from(a).toString('hex');
          const sb = Buffer.from(b).toString('hex');
          return !constantTimeEqual(sa, sb);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('agrees with === on equal-length strings', () => {
    fc.assert(
      fc.property(
        fc.uint8Array({ minLength: 1, maxLength: 32 }),
        fc.uint8Array({ minLength: 1, maxLength: 32 }),
        (a, b) => {
          fc.pre(a.length === b.length);
          const sa = Buffer.from(a).toString('hex');
          const sb = Buffer.from(b).toString('hex');
          return constantTimeEqual(sa, sb) === (sa === sb);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Salt generation properties
// ---------------------------------------------------------------------------

describe('generateSalt properties', () => {
  it('produces hex output of the requested byte length × 2', () => {
    fc.assert(
      fc.property(fc.integer({ min: 8, max: 64 }), (byteLen) => {
        const salt = generateSalt(byteLen);
        return salt.length === byteLen * 2 && /^[0-9a-f]+$/i.test(salt);
      }),
      { numRuns: 50 }
    );
  });

  it('produces distinct salts on consecutive calls (CSPRNG sanity)', () => {
    // Not a formal randomness test — but back-to-back identical salts from
    // a CSPRNG would indicate a broken RNG. fast-check runs this 50 times
    // independently; any failure would be a strong signal.
    fc.assert(
      fc.property(fc.integer({ min: 16, max: 32 }), (byteLen) => {
        const a = generateSalt(byteLen);
        const b = generateSalt(byteLen);
        return a !== b;
      }),
      { numRuns: 50 }
    );
  });
});

// ---------------------------------------------------------------------------
// Smoke: invalid input rejection
// ---------------------------------------------------------------------------

describe('Input validation properties', () => {
  it('isValidPublicKey rejects strings that are not 64 hex chars', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }).filter((s) => {
          // Filter out any string that would happen to be valid 64-hex
          return s.length !== 64 || !/^[0-9a-f]+$/i.test(s);
        }),
        (s) => {
          return !isValidPublicKey(s);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('isValidPrivateKey rejects strings that are not 64 hex chars', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }).filter((s) => {
          return s.length !== 64 || !/^[0-9a-f]+$/i.test(s);
        }),
        (s) => {
          return !isValidPrivateKey(s);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Smoke: a trivial example test to confirm vitest sees this file as a test
// suite even if all property runs are filtered out by `fc.pre`.
// ---------------------------------------------------------------------------

describe('property-based test scaffolding', () => {
  it('imports load without error', () => {
    expect(typeof sign).toBe('function');
    expect(typeof verify).toBe('function');
    expect(typeof hash256).toBe('function');
    expect(typeof generateKeyPair).toBe('function');
  });
});
