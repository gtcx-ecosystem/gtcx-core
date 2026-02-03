// ============================================================================
// HASHING UTILITIES
// SHA-256 and other hash functions
// ============================================================================

import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export type HashAlgorithm = 'sha256' | 'sha512';

/**
 * Hash data using SHA-256
 */
export function hash256(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' 
    ? new TextEncoder().encode(data)
    : data;
  return bytesToHex(sha256(bytes));
}

/**
 * Hash data using SHA-512
 */
export function hash512(data: string | Uint8Array): string {
  const bytes = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data;
  return bytesToHex(sha512(bytes));
}

/**
 * Hash with specified algorithm
 */
export function hash(data: string | Uint8Array, algorithm: HashAlgorithm = 'sha256'): string {
  switch (algorithm) {
    case 'sha256':
      return hash256(data);
    case 'sha512':
      return hash512(data);
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}

/**
 * Hash a JSON object (deterministic)
 */
export function hashObject(obj: unknown): string {
  const sortedJson = JSON.stringify(obj, Object.keys(obj as object).sort());
  return hash256(sortedJson);
}

/**
 * Double hash (hash of hash) - common in blockchain
 */
export function doubleHash256(data: string | Uint8Array): string {
  const firstHash = sha256(
    typeof data === 'string' ? new TextEncoder().encode(data) : data
  );
  return bytesToHex(sha256(firstHash));
}

/**
 * Verify a hash matches expected value
 */
export function verifyHash(
  data: string | Uint8Array,
  expectedHash: string,
  algorithm: HashAlgorithm = 'sha256'
): boolean {
  const computedHash = hash(data, algorithm);
  return computedHash === expectedHash.toLowerCase();
}

/**
 * Create a commitment (hash with salt)
 */
export function createCommitment(data: string, salt: string): string {
  return hash256(`${salt}:${data}`);
}

/**
 * Verify a commitment
 */
export function verifyCommitment(
  data: string,
  salt: string,
  commitment: string
): boolean {
  const computed = createCommitment(data, salt);
  return computed === commitment.toLowerCase();
}

/**
 * Generate a random salt
 */
export function generateSalt(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/**
 * Combine multiple hashes into one
 */
export function combineHashes(...hashes: string[]): string {
  const combined = hashes.sort().join('');
  return hash256(combined);
}
