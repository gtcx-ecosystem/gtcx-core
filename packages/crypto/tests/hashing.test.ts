import {
  hash256,
  hash512,
  hash,
  hashObject,
  doubleHash256,
  verifyHash,
  createCommitment,
  verifyCommitment,
  generateSalt,
  combineHashes,
} from '../src/hashing';

describe('hash256', () => {
  it('returns a 64-char hex string (32 bytes)', () => {
    const result = hash256('test');
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic for the same input', () => {
    expect(hash256('hello')).toBe(hash256('hello'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hash256('hello')).not.toBe(hash256('world'));
  });

  it('accepts Uint8Array input', () => {
    const bytes = new TextEncoder().encode('test');
    const fromString = hash256('test');
    const fromBytes = hash256(bytes);
    expect(fromBytes).toBe(fromString);
  });

  it('hashes an empty string input', () => {
    const result = hash256('');
    expect(result).toMatch(/^[0-9a-f]{64}$/);
    expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('hashes an empty Uint8Array', () => {
    const result = hash256(new Uint8Array(0));
    expect(result).toMatch(/^[0-9a-f]{64}$/);
    expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('matches known SHA-256 test vector for "abc"', () => {
    expect(hash256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('matches known SHA-256 test vector for empty input', () => {
    expect(hash256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('produces the same hash for string and equivalent Uint8Array', () => {
    const testString = 'determinism check';
    const testBytes = new TextEncoder().encode(testString);
    expect(hash256(testString)).toBe(hash256(testBytes));
  });
});

describe('hash512', () => {
  it('returns a 128-char hex string (64 bytes)', () => {
    const result = hash512('test');
    expect(result).toMatch(/^[0-9a-f]{128}$/);
  });

  it('is deterministic for the same input', () => {
    expect(hash512('hello')).toBe(hash512('hello'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hash512('hello')).not.toBe(hash512('world'));
  });

  it('accepts Uint8Array input', () => {
    const bytes = new TextEncoder().encode('test');
    expect(hash512(bytes)).toBe(hash512('test'));
  });
});

describe('hash256 vs hash512', () => {
  it('produce different outputs for the same input', () => {
    const h256 = hash256('same input');
    const h512 = hash512('same input');
    expect(h256).not.toBe(h512);
    expect(h256.length).not.toBe(h512.length);
  });
});

describe('hash (with algorithm parameter)', () => {
  it('defaults to sha256', () => {
    expect(hash('test')).toBe(hash256('test'));
  });

  it('works with sha256', () => {
    expect(hash('test', 'sha256')).toBe(hash256('test'));
  });

  it('works with sha512', () => {
    expect(hash('test', 'sha512')).toBe(hash512('test'));
  });

  it('throws for unsupported algorithm', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => hash('test', 'md5' as any)).toThrow('Unsupported hash algorithm');
  });
});

describe('hashObject', () => {
  it('is deterministic for the same object', () => {
    const obj = { name: 'Alice', age: 30 };
    expect(hashObject(obj)).toBe(hashObject(obj));
  });

  it('produces same hash regardless of key insertion order', () => {
    const obj1 = { b: 2, a: 1 };
    const obj2 = { a: 1, b: 2 };
    // Note: hashObject uses Object.keys(obj).sort(), so it sorts the top-level keys
    // Both objects have the same keys, so sorted JSON should be the same
    expect(hashObject(obj1)).toBe(hashObject(obj2));
  });

  it('produces different hashes for different objects', () => {
    expect(hashObject({ a: 1 })).not.toBe(hashObject({ a: 2 }));
  });

  it('returns a valid sha256 hex string', () => {
    expect(hashObject({ key: 'value' })).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('doubleHash256', () => {
  it('differs from a single hash', () => {
    const single = hash256('test');
    const double = doubleHash256('test');
    expect(double).not.toBe(single);
  });

  it('is deterministic', () => {
    expect(doubleHash256('data')).toBe(doubleHash256('data'));
  });

  it('returns a 64-char hex string', () => {
    expect(doubleHash256('input')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('accepts Uint8Array input', () => {
    const bytes = new TextEncoder().encode('test');
    expect(doubleHash256(bytes)).toBe(doubleHash256('test'));
  });
});

describe('verifyHash', () => {
  it('returns true for correct hash', () => {
    const data = 'verify me';
    const h = hash256(data);
    expect(verifyHash(data, h)).toBe(true);
  });

  it('returns false for incorrect hash', () => {
    expect(verifyHash('data', 'aa'.repeat(32))).toBe(false);
  });

  it('works with sha512 algorithm', () => {
    const data = 'test512';
    const h = hash512(data);
    expect(verifyHash(data, h, 'sha512')).toBe(true);
    expect(verifyHash(data, h, 'sha256')).toBe(false);
  });

  it('is case-insensitive for expected hash', () => {
    const data = 'case test';
    const h = hash256(data);
    expect(verifyHash(data, h.toUpperCase())).toBe(true);
  });
});

describe('createCommitment and verifyCommitment', () => {
  it('round-trips correctly', () => {
    const data = 'secret data';
    const salt = 'random-salt';
    const commitment = createCommitment(data, salt);
    expect(verifyCommitment(data, salt, commitment)).toBe(true);
  });

  it('rejects wrong data', () => {
    const salt = 'salt';
    const commitment = createCommitment('correct', salt);
    expect(verifyCommitment('wrong', salt, commitment)).toBe(false);
  });

  it('rejects wrong salt', () => {
    const data = 'data';
    const commitment = createCommitment(data, 'correct-salt');
    expect(verifyCommitment(data, 'wrong-salt', commitment)).toBe(false);
  });

  it('returns a valid sha256 hex string', () => {
    expect(createCommitment('data', 'salt')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is case-insensitive for commitment verification', () => {
    const commitment = createCommitment('data', 'salt');
    expect(verifyCommitment('data', 'salt', commitment.toUpperCase())).toBe(true);
  });
});

describe('generateSalt', () => {
  it('returns hex string of correct length (default 32 bytes = 64 hex chars)', () => {
    const salt = generateSalt();
    expect(salt).toMatch(/^[0-9a-f]{64}$/);
  });

  it('respects custom length parameter', () => {
    const salt = generateSalt(16);
    expect(salt).toMatch(/^[0-9a-f]{32}$/); // 16 bytes = 32 hex chars
  });

  it('generates unique values', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    expect(salt1).not.toBe(salt2);
  });
});

describe('combineHashes', () => {
  it('is deterministic for the same inputs', () => {
    const h1 = hash256('a');
    const h2 = hash256('b');
    expect(combineHashes(h1, h2)).toBe(combineHashes(h1, h2));
  });

  it('is order-dependent (concatenates in given order for second-preimage resistance)', () => {
    const h1 = hash256('first');
    const h2 = hash256('second');
    expect(combineHashes(h1, h2)).not.toBe(combineHashes(h2, h1));
  });

  it('returns a valid sha256 hex string', () => {
    expect(combineHashes(hash256('a'), hash256('b'))).toMatch(/^[0-9a-f]{64}$/);
  });

  it('works with more than two hashes', () => {
    const h1 = hash256('a');
    const h2 = hash256('b');
    const h3 = hash256('c');
    const combined = combineHashes(h1, h2, h3);
    expect(combined).toMatch(/^[0-9a-f]{64}$/);
    expect(combined).not.toBe(combineHashes(h3, h1, h2)); // order-dependent
  });
});
