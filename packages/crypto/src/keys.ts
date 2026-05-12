// ============================================================================
// KEY MANAGEMENT
// Key generation, derivation, and storage utilities
// ============================================================================

import { ed25519 } from '@noble/curves/ed25519';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

import { isFipsMode, fipsWarn } from './fips';
import { fipsGenerateKeyPair } from './fips-backend';
import { getNativeCrypto } from './native-loader';

export type KeyAlgorithm = 'Ed25519' | 'Secp256k1' | 'P256';

/**
 * Result of key pair generation.
 *
 * WARNING: `privateKey` is a hex-encoded string. JavaScript strings are immutable
 * and cannot be securely wiped from memory. Callers MUST:
 * 1. Never pass `KeyPairResult` to `JSON.stringify()` or logging functions
 * 2. Transfer the private key to secure storage immediately
 * 3. Use `@gtcx/identity` which wraps private keys as non-enumerable properties
 */
export interface KeyPairResult {
  publicKey: string;
  privateKey: string;
  algorithm: KeyAlgorithm;
}

export interface DerivedKey {
  key: string;
  path: string;
  index: number;
}

/**
 * Generate a new key pair.
 *
 * In FIPS mode (`GTCX_FIPS_MODE=true`), defaults to Secp256k1 (FIPS 186-4).
 * Ed25519 is still available but triggers a FIPS compliance warning.
 *
 * @param algorithm - 'Ed25519' or 'Secp256k1'. Defaults to Secp256k1 in FIPS mode, Ed25519 otherwise.
 */
export function generateKeyPair(algorithm?: KeyAlgorithm): KeyPairResult {
  const algo = algorithm ?? (isFipsMode() ? 'P256' : 'Ed25519');

  if (algo === 'Ed25519' && isFipsMode()) {
    fipsWarn('Ed25519 (noble-curves)', 'P256 via node:crypto (FIPS-validated)');
  }

  if (algo === 'Secp256k1' && isFipsMode()) {
    fipsWarn('Secp256k1 (noble-curves)', 'P256 via node:crypto (FIPS-validated)');
  }

  // FIPS-validated P-256 via node:crypto (routes through OpenSSL FIPS provider)
  if (algo === 'P256') {
    const kp = fipsGenerateKeyPair();
    return {
      publicKey: kp.publicKey,
      privateKey: kp.privateKey,
      algorithm: 'P256',
    };
  }

  if (algo === 'Secp256k1') {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey);

    return {
      publicKey: bytesToHex(publicKey),
      privateKey: bytesToHex(privateKey),
      algorithm: 'Secp256k1',
    };
  }

  // Default: Ed25519
  const native = getNativeCrypto();
  if (native) {
    const nativePair = native.generateKeyPair();
    return {
      publicKey: nativePair.publicKey,
      privateKey: nativePair.privateKey,
      algorithm: 'Ed25519',
    };
  }

  /* c8 ignore start -- pure-JS fallback; unreachable when native crypto is available */
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);

  return {
    publicKey: bytesToHex(publicKey),
    privateKey: bytesToHex(privateKey),
    algorithm: 'Ed25519',
  };
  /* c8 ignore stop */
}

/**
 * Derive public key from private key.
 *
 * In FIPS mode, defaults to P256.
 *
 * Note: P256 keys use DER encoding (PKCS8/SPKI) — derivePublicKey is not
 * applicable since the public key is embedded in the DER structure. Use
 * generateKeyPair('P256') instead.
 */
export function derivePublicKey(privateKeyHex: string, algorithm?: KeyAlgorithm): string {
  if (algorithm === undefined) {
    algorithm = isFipsMode() ? 'P256' : 'Ed25519';
  }

  if (algorithm === 'P256') {
    /* c8 ignore next 3 -- error path tested in keys.test.ts */
    throw new Error(
      'P256 keys use DER encoding — use generateKeyPair("P256") to get both keys. ' +
        'derivePublicKey is not supported for P256.'
    );
  }

  const privateKey = hexToBytes(privateKeyHex);

  if (algorithm === 'Secp256k1') {
    const publicKey = secp256k1.getPublicKey(privateKey);
    return bytesToHex(publicKey);
  }

  const publicKey = ed25519.getPublicKey(privateKey);
  return bytesToHex(publicKey);
}

/**
 * Validate a public key format
 */
export function isValidPublicKey(
  publicKeyHex: string,
  algorithm: KeyAlgorithm = 'Ed25519'
): boolean {
  try {
    const bytes = hexToBytes(publicKeyHex);

    if (algorithm === 'Secp256k1') {
      // Secp256k1 compressed public key is 33 bytes, uncompressed is 65
      return bytes.length === 33 || bytes.length === 65;
    }

    // Ed25519 public key is 32 bytes
    return bytes.length === 32;
  } catch {
    return false;
  }
}

/**
 * Validate a private key format
 */
export function isValidPrivateKey(privateKeyHex: string): boolean {
  try {
    const bytes = hexToBytes(privateKeyHex);
    return bytes.length === 32 || bytes.length === 64;
  } catch {
    return false;
  }
}

/**
 * Generate a deterministic key ID from public key
 */
export function generateKeyId(publicKeyHex: string): string {
  return `did:gtcx:${publicKeyHex.substring(0, 16)}`;
}

/**
 * Convert key to different formats
 */
export const keyFormats = {
  toBytes: (hex: string): Uint8Array => hexToBytes(hex),
  toHex: (bytes: Uint8Array): string => bytesToHex(bytes),
  toBase64: (hex: string): string => {
    const bytes = hexToBytes(hex);
    // Use btoa for browser/RN compatibility
    if (typeof btoa !== 'undefined') {
      return btoa(String.fromCharCode(...bytes));
    }
    /* c8 ignore next -- browser/RN fallback; btoa is defined in Node.js 20+ */
    return Buffer.from(bytes).toString('base64');
  },
  fromBase64: (base64: string): string => {
    // Use atob for browser/RN compatibility
    if (typeof atob !== 'undefined') {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytesToHex(bytes);
    }
    /* c8 ignore start -- browser/RN fallback; atob is defined in Node.js 20+ */
    const bytes = Buffer.from(base64, 'base64');
    return bytesToHex(new Uint8Array(bytes));
    /* c8 ignore stop */
  },
};

/**
 * Get the expected public key length for an algorithm
 */
export function getPublicKeyLength(algorithm: KeyAlgorithm): number {
  return algorithm === 'Secp256k1' ? 33 : 32;
}

/**
 * Compress a Secp256k1 public key
 */
export function compressPublicKey(publicKeyHex: string): string {
  const bytes = hexToBytes(publicKeyHex);

  // Already compressed
  if (bytes.length === 33) {
    return publicKeyHex;
  }

  // Compress 65-byte key to 33-byte
  if (bytes.length === 65) {
    const lastByte = bytes[64];
    /* c8 ignore next 2 -- defensive check; bytes.length === 65 guarantees bytes[64] exists */
    if (lastByte === undefined) {
      throw new Error('Invalid public key format');
    }
    const prefix = lastByte % 2 === 0 ? 0x02 : 0x03;
    const compressed = new Uint8Array(33);
    compressed[0] = prefix;
    compressed.set(bytes.slice(1, 33), 1);
    return bytesToHex(compressed);
  }

  throw new Error('Invalid public key length for compression');
}
