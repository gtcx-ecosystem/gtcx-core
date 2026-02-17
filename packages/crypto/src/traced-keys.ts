// ============================================================================
// TRACED KEY OPERATIONS
// Key generation and derivation with operation logging
// ============================================================================

import {
  generateKeyPair as baseGenerateKeyPair,
  derivePublicKey as baseDerivePublicKey,
  isValidPublicKey as baseIsValidPublicKey,
  isValidPrivateKey as baseIsValidPrivateKey,
  generateKeyId as baseGenerateKeyId,
  compressPublicKey as baseCompressPublicKey,
  type KeyAlgorithm,
  type KeyPairResult,
} from './keys';
import { traced, createCategoryLogger } from './tracing.js';

const cryptoLog = createCategoryLogger('crypto');

// ============================================================================
// TRACED KEY OPERATIONS
// ============================================================================

/**
 * Generate a new key pair (traced)
 *
 * @description
 * Generates a new Ed25519 or secp256k1 key pair. The operation is logged
 * but private keys are NEVER included in logs.
 */
export const tracedGenerateKeyPair = traced(
  (algorithm: KeyAlgorithm = 'Ed25519'): KeyPairResult => {
    return baseGenerateKeyPair(algorithm);
  },
  'crypto.generateKeyPair',
  {
    category: 'crypto',
    logInput: true,
    logOutput: false, // Never log key material
    sanitizeOutput: (output: unknown) => {
      const result = output as KeyPairResult;
      return {
        algorithm: result.algorithm,
        publicKeyLength: result.publicKey.length,
      };
    },
  }
);

/**
 * Derive public key from private key (traced)
 */
export const tracedDerivePublicKey = traced(
  (privateKeyHex: string, algorithm: KeyAlgorithm = 'Ed25519'): string => {
    return baseDerivePublicKey(privateKeyHex, algorithm);
  },
  'crypto.derivePublicKey',
  {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: false, // Don't log public keys either
    sanitizeOutput: (output: unknown) => {
      const publicKey = output as string;
      return {
        publicKeyLength: publicKey.length,
      };
    },
  }
);

/**
 * Validate a public key (traced)
 */
export const tracedIsValidPublicKey = traced(
  (publicKeyHex: string, algorithm: KeyAlgorithm = 'Ed25519'): boolean => {
    return baseIsValidPublicKey(publicKeyHex, algorithm);
  },
  'crypto.isValidPublicKey',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log valid/invalid
  }
);

/**
 * Validate a private key (traced)
 */
export const tracedIsValidPrivateKey = traced(
  (privateKeyHex: string): boolean => {
    return baseIsValidPrivateKey(privateKeyHex);
  },
  'crypto.isValidPrivateKey',
  {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: true,
  }
);

/**
 * Generate a key ID from public key (traced)
 */
export const tracedGenerateKeyId = traced(
  (publicKeyHex: string): string => {
    return baseGenerateKeyId(publicKeyHex);
  },
  'crypto.generateKeyId',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    sanitizeOutput: (output: unknown) => {
      const keyId = output as string;
      return {
        keyIdPrefix: keyId.slice(0, 8) + '...',
      };
    },
  }
);

/**
 * Compress a public key (traced)
 */
export const tracedCompressPublicKey = traced(
  (publicKeyHex: string): string => {
    return baseCompressPublicKey(publicKeyHex);
  },
  'crypto.compressPublicKey',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
  }
);

// ============================================================================
// KEY LIFECYCLE LOGGING
// ============================================================================

/**
 * Log a key lifecycle event for audit purposes
 */
export function logKeyEvent(event: {
  type: 'generated' | 'imported' | 'rotated' | 'revoked' | 'expired';
  keyId: string;
  algorithm: KeyAlgorithm;
  context?: string;
}): void {
  cryptoLog.info(`key.${event.type}`, {
    keyIdPrefix: event.keyId.slice(0, 8) + '...',
    algorithm: event.algorithm,
    context: event.context,
  });
}
