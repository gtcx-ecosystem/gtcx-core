import { describe, expect, it, vi } from 'vitest';

import { hash256, hash512, doubleHash256 } from '../src/hashing';
import { generateKeyPair, derivePublicKey, keyFormats } from '../src/keys';
import * as nativeLoader from '../src/native-loader';
import { generateMerkleProof } from '../src/proofs';
import type { MerkleTree } from '../src/proofs';
import { sign, verify, verifyHash } from '../src/signing';

describe('branch coverage gaps', () => {
  // -------------------------------------------------------------------------
  // hashing.ts — pure-JS fallback when native crypto is unavailable
  // -------------------------------------------------------------------------
  it('covers hash256, hash512 and doubleHash256 fallback branches', () => {
    const spy = vi.spyOn(nativeLoader, 'getNativeCrypto').mockReturnValue(null);
    expect(hash256('test')).toMatch(/^[0-9a-f]{64}$/);
    expect(hash512('test')).toMatch(/^[0-9a-f]{128}$/);
    expect(doubleHash256('test')).toMatch(/^[0-9a-f]{64}$/);
    spy.mockRestore();
  });

  // -------------------------------------------------------------------------
  // keys.ts — FIPS-mode defaults and global fallback branches
  // -------------------------------------------------------------------------
  it('defaults generateKeyPair to P256 in FIPS mode when no algorithm given', async () => {
    const { resetFipsMode } = await import('../src/fips');
    process.env['GTCX_FIPS_MODE'] = 'true';
    resetFipsMode();
    const kp = generateKeyPair();
    expect(kp.algorithm).toBe('P256');
    delete process.env['GTCX_FIPS_MODE'];
    resetFipsMode();
  });

  it('defaults derivePublicKey to P256 in FIPS mode and throws', async () => {
    const { resetFipsMode } = await import('../src/fips');
    process.env['GTCX_FIPS_MODE'] = 'true';
    resetFipsMode();
    expect(() => derivePublicKey('aa'.repeat(32))).toThrow('P256 keys use DER encoding');
    delete process.env['GTCX_FIPS_MODE'];
    resetFipsMode();
  });

  it('covers Ed25519 generateKeyPair when native bindings are unavailable', () => {
    const spy = vi.spyOn(nativeLoader, 'getNativeCrypto').mockReturnValue(null);
    const kp = generateKeyPair('Ed25519');
    expect(kp.algorithm).toBe('Ed25519');
    expect(kp.publicKey).toMatch(/^[0-9a-f]{64}$/);
    expect(kp.privateKey).toMatch(/^[0-9a-f]{64}$/);
    spy.mockRestore();
  });

  it('covers keyFormats.toBase64 when btoa is unavailable', () => {
    const original = globalThis.btoa;
    // @ts-expect-error — intentionally removing btoa for fallback branch
    delete globalThis.btoa;
    try {
      const hex = 'abcd1234';
      const b64 = keyFormats.toBase64(hex);
      expect(typeof b64).toBe('string');
      expect(b64).toBe(Buffer.from('abcd1234', 'hex').toString('base64'));
    } finally {
      globalThis.btoa = original;
    }
  });

  it('covers keyFormats.fromBase64 when atob is unavailable', () => {
    const original = globalThis.atob;
    // @ts-expect-error — intentionally removing atob for fallback branch
    delete globalThis.atob;
    try {
      const hex = 'abcd1234';
      const b64 = keyFormats.toBase64(hex);
      const back = keyFormats.fromBase64(b64);
      expect(back).toBe(hex);
    } finally {
      globalThis.atob = original;
    }
  });

  // -------------------------------------------------------------------------
  // signing.ts — native-unavailable and TypeError rethrow branches
  // -------------------------------------------------------------------------
  it('covers sign and verify fallback branches when native is unavailable', () => {
    const spy = vi.spyOn(nativeLoader, 'getNativeCrypto').mockReturnValue(null);
    const kp = generateKeyPair('Ed25519');
    const signature = sign('hello', kp.privateKey);
    expect(verify('hello', signature, kp.publicKey)).toBe(true);
    spy.mockRestore();
  });

  it('covers verifyHash rethrow on TypeError from native verify', () => {
    const spy = vi.spyOn(nativeLoader, 'getNativeCrypto').mockReturnValue({
      verify: () => {
        throw new TypeError('native verify failure');
      },
    } as any);
    expect(() => verifyHash('aa'.repeat(32), 'bb'.repeat(32), 'cc'.repeat(32))).toThrow(TypeError);
    spy.mockRestore();
  });

  // -------------------------------------------------------------------------
  // proofs.ts — odd-layer and sparse-layer edge cases
  // -------------------------------------------------------------------------
  it('covers generateMerkleProof with a falsy layer', () => {
    const tree: MerkleTree = {
      root: 'root',
      leaves: ['leaf0'],
      layers: [undefined as unknown as string[], ['root']],
    };
    const proof = generateMerkleProof(tree, 0);
    expect(proof.siblings).toEqual([]);
  });

  it('covers generateMerkleProof else-if false branch (sparse layer)', () => {
    const tree: MerkleTree = {
      root: 'root2',
      leaves: ['leaf0', 'leaf1', 'leaf2'],
      layers: [['hash0', undefined as unknown as string, 'hash2'], ['root'], ['root2']],
    };
    // leafIndex 0: sibling is a hole at index 1, siblingIndex < length so else-if is false
    const proof = generateMerkleProof(tree, 0);
    expect(proof.siblings.length).toBe(1); // third layer self-pair
  });

  it('covers generateMerkleProof selfHash undefined branch', () => {
    const tree: MerkleTree = {
      root: 'root2',
      leaves: ['leaf0'],
      layers: [[undefined as unknown as string], ['root'], ['root2']],
    };
    const proof = generateMerkleProof(tree, 0);
    expect(proof.siblings.length).toBe(1); // third layer self-pair
  });
});
