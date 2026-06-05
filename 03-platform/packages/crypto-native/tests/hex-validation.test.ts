import { join } from 'node:path';

import fc from 'fast-check';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

/**
 * Regression suite for the NAPI-boundary hex validation introduced to close
 * the README-tracked "odd-length hex at NAPI boundary" issue. The validator
 * rejects malformed hex inputs at the JS layer with a typed TypeError so the
 * Rust side never receives invalid bytes (which previously caused panics or
 * silent corruption depending on the binding).
 *
 * Acceptance criterion per Sprint 2 task 2.1 of the engagement readiness
 * roadmap: every NAPI entry point that accepts hex throws a typed error on
 * invalid input — never panics, never silently corrupts.
 */
describe('crypto-native hex validation (NAPI boundary)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('assertHex helper', () => {
    it('exports assertHex as a typed validator', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.assertHex).toBeTypeOf('function');
      } finally {
        env.restore();
      }
    });

    it('accepts valid even-length lowercase hex', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex('aa', 'x')).not.toThrow();
        expect(() => assertHex('00ff', 'x')).not.toThrow();
        expect(() => assertHex('deadbeef', 'x')).not.toThrow();
      } finally {
        env.restore();
      }
    });

    it('accepts valid even-length uppercase and mixed-case hex', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex('AABB', 'x')).not.toThrow();
        expect(() => assertHex('DeAdBeEf', 'x')).not.toThrow();
      } finally {
        env.restore();
      }
    });

    it('throws on odd-length hex with descriptive label and length in message', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex('abc', 'privateKey')).toThrow(TypeError);
        expect(() => assertHex('abc', 'privateKey')).toThrow(/privateKey/);
        expect(() => assertHex('abc', 'privateKey')).toThrow(/even length/);
        expect(() => assertHex('abc', 'privateKey')).toThrow(/got 3/);
      } finally {
        env.restore();
      }
    });

    it('throws on empty string', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex('', 'sig')).toThrow(TypeError);
        expect(() => assertHex('', 'sig')).toThrow(/must not be empty/);
      } finally {
        env.restore();
      }
    });

    it('throws on non-hex characters', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex('zzzz', 'x')).toThrow(TypeError);
        expect(() => assertHex('zzzz', 'x')).toThrow(/0-9a-fA-F/);
        expect(() => assertHex('0x1234', 'x')).toThrow(/0-9a-fA-F/);
        expect(() => assertHex('abxy', 'x')).toThrow(/0-9a-fA-F/);
      } finally {
        env.restore();
      }
    });

    it('throws on non-string inputs with type in message', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        expect(() => assertHex(undefined, 'x')).toThrow(/expected hex string, got undefined/);
        expect(() => assertHex(null, 'x')).toThrow(/expected hex string, got object/);
        expect(() => assertHex(123, 'x')).toThrow(/expected hex string, got number/);
        expect(() => assertHex(Buffer.from('abc'), 'x')).toThrow(/expected hex string, got object/);
      } finally {
        env.restore();
      }
    });
  });

  describe('property-based — any even-length hex string is accepted', () => {
    it('never throws for any byte sequence converted to hex', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        fc.assert(
          fc.property(fc.uint8Array({ minLength: 1, maxLength: 256 }), (bytes) => {
            const hex = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, '0'))
              .join('');
            expect(() => assertHex(hex, 'x')).not.toThrow();
          }),
          { numRuns: 200 }
        );
      } finally {
        env.restore();
      }
    });
  });

  describe('property-based — any odd-length hex string is rejected', () => {
    it('always throws TypeError for odd lengths regardless of character set', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const { assertHex } = await import('../src/index');
        fc.assert(
          fc.property(
            fc.stringMatching(/^[0-9a-fA-F]+$/).filter((s) => s.length > 0 && s.length % 2 === 1),
            (oddHex) => {
              expect(() => assertHex(oddHex, 'x')).toThrow(TypeError);
              expect(() => assertHex(oddHex, 'x')).toThrow(/even length/);
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        env.restore();
      }
    });
  });

  describe('NAPI entry points reject invalid hex before reaching native code', () => {
    it('sign throws on odd-length privateKey without invoking native', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.sign(new Uint8Array([1]), 'abc')).toThrow(/privateKey.*even length/);
        expect(() => native.sign(new Uint8Array([1]), 'zz')).toThrow(/privateKey.*0-9a-fA-F/);
      } finally {
        env.restore();
      }
    });

    it('verify returns false on odd-length signature or publicKey (predicate semantics)', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.verify('abc', new Uint8Array([1]), 'aabb')).toBe(false);
        expect(native.verify('aabb', new Uint8Array([1]), 'def')).toBe(false);
        expect(native.verify('', new Uint8Array([1]), 'aabb')).toBe(false);
        expect(native.verify('zzzz', new Uint8Array([1]), 'aabb')).toBe(false);
      } finally {
        env.restore();
      }
    });

    it('deriveChildKey throws on odd-length parentKey', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.deriveChildKey!('abc', 0)).toThrow(/parentKey.*even length/);
      } finally {
        env.restore();
      }
    });

    it('derivePurposeKey throws on odd-length masterKey', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.derivePurposeKey!('abc', 'purpose')).toThrow(/masterKey.*even length/);
      } finally {
        env.restore();
      }
    });

    it('groth16ProveGciThreshold throws on odd-length proving or verifying key', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.groth16ProveGciThreshold!(1, 2, 'abc', 'aabb')).toThrow(
          /provingKey.*even length/
        );
        expect(() => native.groth16ProveGciThreshold!(1, 2, 'aabb', 'def')).toThrow(
          /verifyingKey.*even length/
        );
      } finally {
        env.restore();
      }
    });

    it('groth16VerifyProof returns false on odd-length proof or verifyingKey', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.groth16VerifyProof!('c', 'abc', 'aabb', '{}')).toBe(false);
        expect(native.groth16VerifyProof!('c', 'aabb', 'def', '{}')).toBe(false);
      } finally {
        env.restore();
      }
    });

    it('bulletproofsProveAmountRange throws on odd-length randomness', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.bulletproofsProveAmountRange!(1, 0, 10, 'abc')).toThrow(
          /randomness.*even length/
        );
      } finally {
        env.restore();
      }
    });

    it('bulletproofsVerifyAmountRange returns false on any odd-length proof element', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.bulletproofsVerifyAmountRange!(0, 10, 'abc', 'aabb', 'ccdd')).toBe(false);
        expect(native.bulletproofsVerifyAmountRange!(0, 10, 'aabb', 'def', 'ccdd')).toBe(false);
        expect(native.bulletproofsVerifyAmountRange!(0, 10, 'aabb', 'ccdd', 'fff')).toBe(false);
      } finally {
        env.restore();
      }
    });

    it('schnorrProveIdentityAttribute throws on odd-length subjectHash', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(() => native.schnorrProveIdentityAttribute!(new Uint8Array([1]), 'abc')).toThrow(
          /subjectHash.*even length/
        );
      } finally {
        env.restore();
      }
    });

    it('schnorrVerifyIdentityAttribute returns false on any odd-length component', async () => {
      const env = withMockPath('full-bindings.cjs');
      try {
        const native = await import('../src/index');
        expect(native.schnorrVerifyIdentityAttribute!('abc', 'aa', 'bb', 'cc')).toBe(false);
        expect(native.schnorrVerifyIdentityAttribute!('aa', 'abc', 'bb', 'cc')).toBe(false);
        expect(native.schnorrVerifyIdentityAttribute!('aa', 'bb', 'abc', 'cc')).toBe(false);
        expect(native.schnorrVerifyIdentityAttribute!('aa', 'bb', 'cc', 'abc')).toBe(false);
      } finally {
        env.restore();
      }
    });
  });
});
