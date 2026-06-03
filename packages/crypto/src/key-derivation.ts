// ============================================================================
// KEY DERIVATION
// Password-based key derivation primitives for the protocol.
// ============================================================================

import { bytesToHex } from '@noble/hashes/utils.js';

export interface Pbkdf2Params {
  /** Arbitrary string input. May be low-entropy (e.g. a 6-digit PIN). */
  password: string;
  /** Caller-provided salt. Should be unique per derivation. */
  salt: string;
  /** Iteration count. Mobile PIN-hashing uses 100_000. */
  iterations: number;
  /** Output length in bits. Defaults to 256. Must be a positive multiple of 8. */
  keyLengthBits?: number;
}

/**
 * PBKDF2-HMAC-SHA256 key derivation. Returns hex-encoded derived key.
 *
 * Tuned for short, low-entropy inputs (e.g. 6-digit PINs) where a high
 * iteration count is the only useful cost lever against brute-force.
 *
 * Implementation uses the runtime's `crypto.subtle.deriveBits` via WebCrypto,
 * which is available in Node 20+ (where it routes through OpenSSL/aws-lc-rs
 * and is therefore FIPS-compatible under our existing FIPS validation, CMVP
 * #4816) and in every supported browser. If `crypto.subtle.deriveBits` is
 * unavailable, this throws a typed `Error` at call time — there is no
 * non-PBKDF2-spec fallback in the canonical package, by deliberate choice:
 * a silent fallback to iterated SHA-256 would not produce RFC 7914 §11
 * outputs and would create a regulator-visible discrepancy between consumers.
 *
 * **Runtime requirements:**
 *
 * - Node 20+ — `globalThis.crypto.subtle` is built in; no action required.
 * - Modern browsers — WebCrypto is built in; no action required.
 * - **React Native (Hermes via Expo)** — WebCrypto is NOT shipped by default.
 *   Install a polyfill that populates `globalThis.crypto.subtle` before any
 *   call into this function. Recommended: `react-native-quick-crypto` (full
 *   WebCrypto surface). Import the polyfill at app boot (e.g. in your root
 *   `_layout.tsx`) so `subtle.importKey` and `subtle.deriveBits` resolve.
 *   Validate with the RFC 7914 §11 test vectors in
 *   `packages/crypto/tests/key-derivation.test.ts` from the RN runtime
 *   before relying on this in production.
 * - Older Node / restricted environments — call may throw; either upgrade
 *   the runtime or pre-validate with `globalThis.crypto?.subtle?.deriveBits`.
 *
 * @throws TypeError when params are invalid (non-positive iterations, non-byte-aligned key length, etc.)
 * @throws Error when `crypto.subtle.deriveBits` is unavailable in the runtime
 *
 * @example
 * ```ts
 * import { deriveKeyPbkdf2 } from '@gtcx/crypto';
 * const hex = await deriveKeyPbkdf2({
 *   password: 'pin:123456:did:gtcx:tp_abc',
 *   salt: 'did:gtcx:tp_abc',
 *   iterations: 100_000,
 *   keyLengthBits: 256,
 * });
 * // hex is 64 chars (256 bits / 4 bits per hex char)
 * ```
 */
export async function deriveKeyPbkdf2(params: Pbkdf2Params): Promise<string> {
  const { password, salt, iterations } = params;
  const keyLengthBits = params.keyLengthBits ?? 256;

  if (typeof password !== 'string') {
    throw new TypeError('deriveKeyPbkdf2: password must be a string');
  }
  if (typeof salt !== 'string') {
    throw new TypeError('deriveKeyPbkdf2: salt must be a string');
  }
  if (!Number.isInteger(iterations) || iterations <= 0) {
    throw new TypeError('deriveKeyPbkdf2: iterations must be a positive integer');
  }
  if (!Number.isInteger(keyLengthBits) || keyLengthBits <= 0 || keyLengthBits % 8 !== 0) {
    throw new TypeError('deriveKeyPbkdf2: keyLengthBits must be a positive multiple of 8');
  }

  const subtle = globalThis.crypto?.subtle;
  if (
    !subtle ||
    typeof subtle.importKey !== 'function' ||
    typeof subtle.deriveBits !== 'function'
  ) {
    throw new Error(
      'deriveKeyPbkdf2: crypto.subtle.deriveBits is unavailable in this runtime. ' +
        'PBKDF2 requires Node 20+ or a WebCrypto-capable browser.'
    );
  }

  const encoder = new TextEncoder();
  const baseKey = await subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derived = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    keyLengthBits
  );
  return bytesToHex(new Uint8Array(derived));
}
