import { join } from 'node:path';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockDir = join(__dirname, 'mock-native');

function withMockPath(mockFile: string) {
  const original = process.env['GTCX_CRYPTO_NATIVE_PATH'];
  process.env['GTCX_CRYPTO_NATIVE_PATH'] = join(mockDir, mockFile);
  return {
    restore: () => {
      if (original === undefined) {
        delete process.env['GTCX_CRYPTO_NATIVE_PATH'];
      } else {
        process.env['GTCX_CRYPTO_NATIVE_PATH'] = original;
      }
    },
  };
}

describe('crypto-native coverage gaps', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('full bindings — happy path', () => {
    it('loads and uses all required functions', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        const kp = native.generateKeyPair();
        expect(kp.privateKey).toBe('pk');
        expect(kp.publicKey).toBe('pub');

        const sig = native.sign(new Uint8Array([1, 2, 3]), 'pk');
        expect(sig).toBe('sig');

        const valid = native.verify('sig', new Uint8Array([1, 2, 3]), 'pub');
        expect(valid).toBe(true);

        const h256 = native.sha256(new Uint8Array([1]));
        expect(h256).toBe('sha256hash');

        const h512 = native.sha512(new Uint8Array([1]));
        expect(h512).toBe('sha512hash');
      } finally {
        env.restore();
      }
    });

    it('exposes optional functions when present', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.blake3Hash).toBeTypeOf('function');
        expect(native.blake3Hash!(new Uint8Array([1]))).toBe('blake3hash');

        expect(native.deriveChildKey).toBeTypeOf('function');
        expect(native.deriveChildKey!('parent', 0)).toBe('childkey');

        expect(native.derivePurposeKey).toBeTypeOf('function');
        expect(native.derivePurposeKey!('master', 'test')).toBe('purposekey');

        expect(native.version).toBeTypeOf('function');
        expect(native.version!()).toBe('1.0.0');
      } finally {
        env.restore();
      }
    });

    it('exposes ZKP functions when present', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.groth16GenerateKeys).toBeTypeOf('function');
        const keys = native.groth16GenerateKeys!('gci');
        expect(keys.circuit).toBe('gci');

        expect(native.groth16ProveGciThreshold).toBeTypeOf('function');
        const proof = native.groth16ProveGciThreshold!(50, 60, 'pk', 'vk');
        expect(proof.circuit).toBe('gci');

        expect(native.groth16VerifyProof).toBeTypeOf('function');
        expect(native.groth16VerifyProof!('gci', 'proof', 'vk', '{}')).toBe(true);

        expect(native.bulletproofsProveAmountRange).toBeTypeOf('function');
        const bp = native.bulletproofsProveAmountRange!(100, 0, 200, 'rand');
        expect(bp.commitment).toBe('commit');

        expect(native.bulletproofsVerifyAmountRange).toBeTypeOf('function');
        expect(native.bulletproofsVerifyAmountRange!(0, 200, 'c', 'l', 'h')).toBe(true);

        expect(native.schnorrProveIdentityAttribute).toBeTypeOf('function');
        const schnorr = native.schnorrProveIdentityAttribute!(new Uint8Array([1]), 'subj');
        expect(schnorr.subjectHash).toBe('subj');

        expect(native.schnorrVerifyIdentityAttribute).toBeTypeOf('function');
        expect(native.schnorrVerifyIdentityAttribute!('ah', 'sh', 'nc', 'resp')).toBe(true);
      } finally {
        env.restore();
      }
    });

    it('exports nativeBindings object', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.nativeBindings).toBeDefined();
        expect(native.nativeBindings.generateKeyPair).toBeTypeOf('function');
        expect(native.nativeBindings.sign).toBeTypeOf('function');
        expect(native.nativeBindings.verify).toBeTypeOf('function');
        expect(native.nativeBindings.sha256).toBeTypeOf('function');
        expect(native.nativeBindings.sha512).toBeTypeOf('function');
        expect(native.nativeBindings.blake3Hash).toBeTypeOf('function');
        expect(native.nativeBindings.deriveChildKey).toBeTypeOf('function');
        expect(native.nativeBindings.derivePurposeKey).toBeTypeOf('function');
        expect(native.nativeBindings.version).toBeTypeOf('function');
      } finally {
        env.restore();
      }
    });
  });

  describe('minimal bindings — alternate names', () => {
    it('uses alternate property names for generateKeyPair', async () => {
      const env = withMockPath('minimal-bindings.cjs');
      try {
        const native = await import('../src/index');
        const kp = native.generateKeyPair();
        expect(kp.privateKey).toBe('pk_alt');
        expect(kp.publicKey).toBe('pub_alt');
      } finally {
        env.restore();
      }
    });

    it('uses alternate property names for sign and verify', async () => {
      const env = withMockPath('minimal-bindings.cjs');
      try {
        const native = await import('../src/index');
        const sig = native.sign(new Uint8Array([1]), 'pk');
        expect(sig).toBe('sig_alt');
        const valid = native.verify('sig', new Uint8Array([1]), 'pub');
        expect(valid).toBe(true);
      } finally {
        env.restore();
      }
    });

    it('omits optional functions when not present', async () => {
      const env = withMockPath('minimal-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.blake3Hash).toBeUndefined();
        expect(native.deriveChildKey).toBeUndefined();
        expect(native.derivePurposeKey).toBeUndefined();
        expect(native.version).toBeUndefined();
        expect(native.groth16GenerateKeys).toBeUndefined();
        expect(native.groth16ProveGciThreshold).toBeUndefined();
        expect(native.groth16VerifyProof).toBeUndefined();
        expect(native.bulletproofsProveAmountRange).toBeUndefined();
        expect(native.bulletproofsVerifyAmountRange).toBeUndefined();
        expect(native.schnorrProveIdentityAttribute).toBeUndefined();
        expect(native.schnorrVerifyIdentityAttribute).toBeUndefined();
      } finally {
        env.restore();
      }
    });
  });

  describe('optional bindings — alternate camelCase names', () => {
    it('uses camelCase alternate names for optional functions', async () => {
      const env = withMockPath('optional-only-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.blake3Hash!(new Uint8Array([1]))).toBe('blake3hash_alt');
        expect(native.deriveChildKey!('p', 0)).toBe('childkey_alt');
        expect(native.derivePurposeKey!('m', 't')).toBe('purposekey_alt');
        expect(native.version!()).toBe('1.0.0_alt');
        expect(native.groth16GenerateKeys!('c').provingKey).toBe('pk_alt');
        expect(native.groth16ProveGciThreshold!(1, 2, 'p', 'v').circuit).toBe('gci_alt');
        expect(native.groth16VerifyProof!('c', 'p', 'v', '{}')).toBe(true);
        const bp = native.bulletproofsProveAmountRange!(1, 0, 10, 'r');
        expect(bp.commitment).toBe('commit_alt');
        expect(native.bulletproofsVerifyAmountRange!(0, 10, 'c', 'l', 'h')).toBe(true);
        const s = native.schnorrProveIdentityAttribute!(new Uint8Array([1]), 'subj');
        expect(s.attributeHash).toBe('ah_alt');
        expect(native.schnorrVerifyIdentityAttribute!('a', 's', 'n', 'r')).toBe(true);
      } finally {
        env.restore();
      }
    });
  });

  describe('error paths', () => {
    it('throws when generateKeyPair returns non-object', async () => {
      const env = withMockPath('bad-keypair-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.generateKeyPair()).toThrow('invalid value');
      } finally {
        env.restore();
      }
    });

    it('throws when generateKeyPair returns invalid key data', async () => {
      const env = withMockPath('invalid-keydata-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.generateKeyPair()).toThrow('invalid key data');
      } finally {
        env.restore();
      }
    });

    it('throws when a required function is missing', async () => {
      const env = withMockPath('missing-fn-bindings.cjs');
      try {
        await import('../src/index');
        expect.unreachable('should have thrown');
      } catch (err) {
        expect((err as Error).message).toContain('missing function');
      } finally {
        env.restore();
      }
    });
  });

  describe('loadRawBindings error paths', () => {
    it('reports candidate error when a file exists but throws on require', async () => {
      const env = withMockPath('throw-on-load-bindings.cjs');
      vi.doMock('node:fs', () => ({
        existsSync: (p: string) => p.includes('throw-on-load-bindings.cjs'),
      }));
      try {
        await import('../src/index');
        expect.unreachable('should have thrown');
      } catch (err) {
        const message = (err as Error).message;
        expect(message).toContain('Native bindings not found');
        expect(message).toContain('intentional-load-failure');
      } finally {
        env.restore();
        vi.doUnmock('node:fs');
      }
    });
  });

  describe('preflight check', () => {
    it('returns full pass when all checks succeed', async () => {
      const env = withMockPath('preflight-pass-bindings.cjs');
      try {
        const mod = await import('../src/preflight');
        const result = await mod.runPreflightCheck();
        expect(result.ok).toBe(true);
        expect(result.checks.load).toBe(true);
        expect(result.checks.hashing).toBe(true);
        expect(result.checks.signing).toBe(true);
        expect(result.version).toBe('1.0.0-mock');
        expect(result.platform).toBe(process.platform);
        expect(result.arch).toBe(process.arch);
        expect(result.error).toBeUndefined();
      } finally {
        env.restore();
      }
    });

    it('returns partial failure when hashing check fails', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const mod = await import('../src/preflight');
        const result = await mod.runPreflightCheck();
        expect(result.ok).toBe(false);
        expect(result.checks.load).toBe(true);
        expect(result.checks.hashing).toBe(false);
        expect(result.checks.signing).toBe(true);
        expect(result.error).toBeUndefined();
      } finally {
        env.restore();
      }
    });

    it('captures error when signing throws', async () => {
      const env = withMockPath('preflight-error-bindings.cjs');
      try {
        const mod = await import('../src/preflight');
        const result = await mod.runPreflightCheck();
        expect(result.ok).toBe(false);
        expect(result.checks.load).toBe(true);
        expect(result.checks.hashing).toBe(true);
        expect(result.checks.signing).toBe(false);
        expect(result.error).toContain('preflight-signing-error');
      } finally {
        env.restore();
      }
    });
  });

  describe('preflight CLI unit', () => {
    let stdoutSpy: ReturnType<typeof vi.spyOn>;
    let stderrSpy: ReturnType<typeof vi.spyOn>;
    let exitSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
      stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
      exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    });

    afterEach(() => {
      stdoutSpy.mockRestore();
      stderrSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('prints success and exits 0 on pass', async () => {
      const env = withMockPath('preflight-pass-bindings.cjs');
      try {
        const mod = await import('../src/preflight');
        await mod.runPreflightCli();
        expect(stdoutSpy).toHaveBeenCalledWith('✅ GTCX Native Pre-flight PASSED\n');
        expect(exitSpy).toHaveBeenCalledWith(0);
      } finally {
        env.restore();
      }
    });

    it('prints failure details and exits 1 on fail', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const mod = await import('../src/preflight');
        await mod.runPreflightCli();
        expect(stderrSpy).toHaveBeenCalledWith('❌ GTCX Native Pre-flight FAILED\n');
        expect(stdoutSpy).toHaveBeenCalledWith('   Check Details:\n');
        expect(exitSpy).toHaveBeenCalledWith(1);
      } finally {
        env.restore();
      }
    });
  });
});
