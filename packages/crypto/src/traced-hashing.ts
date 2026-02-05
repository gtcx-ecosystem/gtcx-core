// ============================================================================
// TRACED HASHING OPERATIONS
// SHA-256/512 hashing with operation logging
// ============================================================================

import { traced } from '@gtcx/ai';

import {
  hash256 as baseHash256,
  hash512 as baseHash512,
  hash as baseHash,
  hashObject as baseHashObject,
  doubleHash256 as baseDoubleHash256,
  verifyHash as baseVerifyHash,
  createCommitment as baseCreateCommitment,
  verifyCommitment as baseVerifyCommitment,
  generateSalt as baseGenerateSalt,
  combineHashes as baseCombineHashes,
  type HashAlgorithm,
} from './hashing';

// ============================================================================
// TRACED HASHING OPERATIONS
// ============================================================================

/**
 * SHA-256 hash (traced)
 */
export const tracedHash256 = traced(
  (input: string | Uint8Array): string => baseHash256(input),
  'crypto.hash256',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false, // Hashes can be sensitive
    metadata: { algorithm: 'SHA-256' },
  }
);

/**
 * SHA-512 hash (traced)
 */
export const tracedHash512 = traced(
  (input: string | Uint8Array): string => baseHash512(input),
  'crypto.hash512',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'SHA-512' },
  }
);

/**
 * Generic hash with algorithm selection (traced)
 */
export const tracedHash = traced(
  (input: string | Uint8Array, algorithm: HashAlgorithm = 'sha256'): string =>
    baseHash(input, algorithm),
  'crypto.hash',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
  }
);

/**
 * Hash a JavaScript object deterministically (traced)
 */
export const tracedHashObject = traced(
  (obj: unknown): string => baseHashObject(obj),
  'crypto.hashObject',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
  }
);

/**
 * Double SHA-256 (traced)
 */
export const tracedDoubleHash256 = traced(
  (input: string | Uint8Array): string => baseDoubleHash256(input),
  'crypto.doubleHash256',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'SHA-256-double' },
  }
);

/**
 * Verify a hash matches expected value (traced)
 */
export const tracedVerifyHashValue = traced(
  (
    input: string | Uint8Array,
    expectedHash: string,
    algorithm: HashAlgorithm = 'sha256'
  ): boolean => baseVerifyHash(input, expectedHash, algorithm),
  'crypto.verifyHashValue',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log success/failure
  }
);

/**
 * Create a commitment (hash of value + salt) (traced)
 */
export const tracedCreateCommitment = traced(
  (value: string, salt: string): string => baseCreateCommitment(value, salt),
  'crypto.createCommitment',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
  }
);

/**
 * Verify a commitment (traced)
 */
export const tracedVerifyCommitment = traced(
  (value: string, salt: string, commitment: string): boolean =>
    baseVerifyCommitment(value, salt, commitment),
  'crypto.verifyCommitment',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true,
  }
);

/**
 * Generate cryptographic salt (traced)
 */
export const tracedGenerateSalt = traced(
  (length: number = 32): string => baseGenerateSalt(length),
  'crypto.generateSalt',
  {
    category: 'crypto',
    logInput: true,
    logOutput: false, // Never log salt values
    metadata: { purpose: 'salt-generation' },
  }
);

/**
 * Combine multiple hashes into one (traced)
 */
export const tracedCombineHashes = traced(
  (...hashes: string[]): string => baseCombineHashes(...hashes),
  'crypto.combineHashes',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    sanitizeOutput: (input: unknown) => {
      const args = input as string[];
      return {
        hashCount: args.length,
      };
    },
  }
);
