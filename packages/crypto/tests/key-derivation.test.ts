import { describe, it, expect } from 'vitest';

import { deriveKeyPbkdf2 } from '../src/key-derivation';

/**
 * RFC 6070 publishes PBKDF2-HMAC-SHA1 vectors. RFC 7914 §11 publishes
 * PBKDF2-HMAC-SHA256 reference vectors which the spec we shipped requires.
 * The vectors below are the widely-cited RFC 7914 §11 SHA-256 set plus a
 * couple of zero-iteration and short-input edge cases the mobile team needs
 * for PIN hashing.
 */
describe('deriveKeyPbkdf2 — RFC 7914 §11 PBKDF2-HMAC-SHA256 vectors', () => {
  it('passwd / salt / 1 iter / 64 bytes', async () => {
    const hex = await deriveKeyPbkdf2({
      password: 'passwd',
      salt: 'salt',
      iterations: 1,
      keyLengthBits: 64 * 8,
    });
    expect(hex).toBe(
      '55ac046e56e3089fec1691c22544b605' +
        'f94185216dde0465e68b9d57c20dacbc' +
        '49ca9cccf179b645991664b39d77ef31' +
        '7c71b845b1e30bd509112041d3a19783'
    );
  });

  it('Password / NaCl / 80000 iter / 64 bytes', async () => {
    const hex = await deriveKeyPbkdf2({
      password: 'Password',
      salt: 'NaCl',
      iterations: 80_000,
      keyLengthBits: 64 * 8,
    });
    expect(hex).toBe(
      '4ddcd8f60b98be21830cee5ef22701f9' +
        '641a4418d04c0414aeff08876b34ab56' +
        'a1d425a1225833549adb841b51c9b317' +
        '6a272bdebba1d078478f62b397f33c8d'
    );
  });
});

describe('deriveKeyPbkdf2 — mobile PIN-hash use case', () => {
  it('PIN-shape input at 100k iterations returns 256-bit hex', async () => {
    const hex = await deriveKeyPbkdf2({
      password: 'pin:123456:did:gtcx:tp_test',
      salt: 'did:gtcx:tp_test',
      iterations: 100_000,
      keyLengthBits: 256,
    });
    expect(hex).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic across two calls with identical inputs', async () => {
    const args = {
      password: 'pin:000000:did:gtcx:operator',
      salt: 'did:gtcx:operator',
      iterations: 1000,
      keyLengthBits: 256,
    };
    const a = await deriveKeyPbkdf2(args);
    const b = await deriveKeyPbkdf2(args);
    expect(a).toBe(b);
  });

  it('produces different output when the salt changes', async () => {
    const base = {
      password: 'pin:111111:did:gtcx:operator',
      iterations: 1000,
      keyLengthBits: 256,
    };
    const a = await deriveKeyPbkdf2({ ...base, salt: 'salt-one' });
    const b = await deriveKeyPbkdf2({ ...base, salt: 'salt-two' });
    expect(a).not.toBe(b);
  });

  it('produces different output when the password changes', async () => {
    const base = {
      salt: 'did:gtcx:operator',
      iterations: 1000,
      keyLengthBits: 256,
    };
    const a = await deriveKeyPbkdf2({ ...base, password: 'pin:111111' });
    const b = await deriveKeyPbkdf2({ ...base, password: 'pin:111112' });
    expect(a).not.toBe(b);
  });
});

describe('deriveKeyPbkdf2 — output length', () => {
  it('defaults to 256 bits (64 hex chars)', async () => {
    const hex = await deriveKeyPbkdf2({
      password: 'pw',
      salt: 's',
      iterations: 100,
    });
    expect(hex).toHaveLength(64);
  });

  it.each([
    [128, 32],
    [160, 40],
    [256, 64],
    [384, 96],
    [512, 128],
  ])('keyLengthBits=%i produces %i hex chars', async (bits, chars) => {
    const hex = await deriveKeyPbkdf2({
      password: 'pw',
      salt: 's',
      iterations: 100,
      keyLengthBits: bits,
    });
    expect(hex).toHaveLength(chars);
  });
});

describe('deriveKeyPbkdf2 — input validation', () => {
  it('rejects non-string password', async () => {
    await expect(
      deriveKeyPbkdf2({ password: 123 as unknown as string, salt: 's', iterations: 1 })
    ).rejects.toThrow(/password must be a string/);
  });

  it('rejects non-string salt', async () => {
    await expect(
      deriveKeyPbkdf2({ password: 'p', salt: null as unknown as string, iterations: 1 })
    ).rejects.toThrow(/salt must be a string/);
  });

  it('rejects zero iterations', async () => {
    await expect(deriveKeyPbkdf2({ password: 'p', salt: 's', iterations: 0 })).rejects.toThrow(
      /positive integer/
    );
  });

  it('rejects negative iterations', async () => {
    await expect(deriveKeyPbkdf2({ password: 'p', salt: 's', iterations: -1 })).rejects.toThrow(
      /positive integer/
    );
  });

  it('rejects fractional iterations', async () => {
    await expect(deriveKeyPbkdf2({ password: 'p', salt: 's', iterations: 1.5 })).rejects.toThrow(
      /positive integer/
    );
  });

  it('rejects keyLengthBits not a multiple of 8', async () => {
    await expect(
      deriveKeyPbkdf2({ password: 'p', salt: 's', iterations: 1, keyLengthBits: 100 })
    ).rejects.toThrow(/multiple of 8/);
  });

  it('rejects zero keyLengthBits', async () => {
    await expect(
      deriveKeyPbkdf2({ password: 'p', salt: 's', iterations: 1, keyLengthBits: 0 })
    ).rejects.toThrow(/multiple of 8/);
  });
});
