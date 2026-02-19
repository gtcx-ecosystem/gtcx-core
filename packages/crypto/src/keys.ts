// ============================================================================
// KEY MANAGEMENT
// Key generation, derivation, and storage utilities
// ============================================================================

import { ed25519 } from '@noble/curves/ed25519';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export type KeyAlgorithm = 'Ed25519' | 'Secp256k1';

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
 * Generate a new key pair
 * @param algorithm - 'Ed25519' (default) or 'Secp256k1'
 */
export function generateKeyPair(algorithm: KeyAlgorithm = 'Ed25519'): KeyPairResult {
  if (algorithm === 'Secp256k1') {
    const privateKey = secp256k1.utils.randomPrivateKey();
    const publicKey = secp256k1.getPublicKey(privateKey);

    return {
      publicKey: bytesToHex(publicKey),
      privateKey: bytesToHex(privateKey),
      algorithm: 'Secp256k1',
    };
  }

  // Default: Ed25519
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);

  return {
    publicKey: bytesToHex(publicKey),
    privateKey: bytesToHex(privateKey),
    algorithm: 'Ed25519',
  };
}

/**
 * Derive public key from private key
 */
export function derivePublicKey(
  privateKeyHex: string,
  algorithm: KeyAlgorithm = 'Ed25519'
): string {
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
    const bytes = Buffer.from(base64, 'base64');
    return bytesToHex(new Uint8Array(bytes));
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
