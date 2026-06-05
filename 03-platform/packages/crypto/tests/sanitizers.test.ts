import { describe, expect, it } from 'vitest';

import {
  sanitizeCombineHashesOutput,
  sanitizeGenerateKeyPairOutput,
  sanitizeDerivePublicKeyOutput,
  sanitizeGenerateKeyIdOutput,
  sanitizeBatchVerifyOutput,
} from '../src';

describe('crypto sanitizers', () => {
  describe('sanitizeCombineHashesOutput', () => {
    it('returns hash count', () => {
      const result = sanitizeCombineHashesOutput(['a', 'b', 'c']);
      expect(result).toEqual({ hashCount: 3 });
    });
  });

  describe('sanitizeGenerateKeyPairOutput', () => {
    it('returns algorithm and public key length', () => {
      const result = sanitizeGenerateKeyPairOutput({
        algorithm: 'Ed25519',
        publicKey: '0x'.padEnd(66, '0'),
        privateKey: 'secret',
      });
      expect(result).toEqual({
        algorithm: 'Ed25519',
        publicKeyLength: 66,
      });
    });
  });

  describe('sanitizeDerivePublicKeyOutput', () => {
    it('returns public key length', () => {
      const result = sanitizeDerivePublicKeyOutput('0xabcd');
      expect(result).toEqual({ publicKeyLength: 6 });
    });
  });

  describe('sanitizeGenerateKeyIdOutput', () => {
    it('returns key id prefix', () => {
      const result = sanitizeGenerateKeyIdOutput('did:gtcx:1234567890');
      expect(result).toEqual({ keyIdPrefix: 'did:gtcx...' });
    });
  });

  describe('sanitizeBatchVerifyOutput', () => {
    it('returns totals for mixed results', () => {
      const result = sanitizeBatchVerifyOutput([true, false, true, true]);
      expect(result).toEqual({ total: 4, valid: 3, invalid: 1 });
    });

    it('returns zeros for empty array', () => {
      const result = sanitizeBatchVerifyOutput([]);
      expect(result).toEqual({ total: 0, valid: 0, invalid: 0 });
    });
  });
});
