// ============================================================================
// TRACED DIGITAL SIGNATURES
// Ed25519 signing and verification with operation logging
// ============================================================================
//
// This module provides traced versions of all signing operations for:
// - Debugging complex verification workflows
// - Training AI models on operational data
// - Audit trails for compliance
// - Performance optimization
//
// Usage:
//   import { tracedSign, tracedVerify } from '@gtcx/crypto/traced';
// ============================================================================

import {
  sign as baseSign,
  signHash as baseSignHash,
  verify as baseVerify,
  verifyHash as baseVerifyHash,
  createSignedMessage as baseCreateSignedMessage,
  verifySignedMessage as baseVerifySignedMessage,
  batchVerify as baseBatchVerify,
  type SignatureResult,
  type VerificationResult,
} from './signing';
import { traced, createCategoryLogger } from './tracing.js';

// Create crypto-specific logger
const cryptoLog = createCategoryLogger('crypto');

// ============================================================================
// TRACED SIGNING OPERATIONS
// ============================================================================

/**
 * Sign a message with Ed25519 (traced)
 *
 * Traced version of sign() that logs operation details for debugging
 * and AI analysis. Does NOT log the private key or full message content.
 *
 * @param message - Message to sign
 * @param privateKeyHex - Private key in hex format
 * @returns Signature in hex format
 */
export const tracedSign = traced(
  (message: string | Uint8Array, privateKeyHex: string): string => {
    return baseSign(message, privateKeyHex);
  },
  'crypto.sign',
  {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: false, // Don't log signatures (could be sensitive)
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Sign a hash directly (traced)
 */
export const tracedSignHash = traced(
  (hash: string, privateKeyHex: string): string => {
    return baseSignHash(hash, privateKeyHex);
  },
  'crypto.signHash',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Verify a signature (traced)
 *
 * Traced version that logs verification attempts. Useful for debugging
 * failed verifications and analyzing verification patterns.
 */
export const tracedVerify = traced(
  (message: string | Uint8Array, signatureHex: string, publicKeyHex: string): boolean => {
    return baseVerify(message, signatureHex, publicKeyHex);
  },
  'crypto.verify',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log success/failure
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Verify a signature against a hash (traced)
 */
export const tracedVerifyHash = traced(
  (hashHex: string, signatureHex: string, publicKeyHex: string): boolean => {
    return baseVerifyHash(hashHex, signatureHex, publicKeyHex);
  },
  'crypto.verifyHash',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Create a complete signed message object (traced)
 */
export const tracedCreateSignedMessage = traced(
  (data: unknown, privateKeyHex: string, publicKeyHex: string): SignatureResult => {
    return baseCreateSignedMessage(data, privateKeyHex, publicKeyHex);
  },
  'crypto.createSignedMessage',
  {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Verify a signed message object (traced)
 */
export const tracedVerifySignedMessage = traced(
  (signedMessage: SignatureResult): VerificationResult => {
    return baseVerifySignedMessage(signedMessage);
  },
  'crypto.verifySignedMessage',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
  }
);

/**
 * Batch verify multiple signatures (traced)
 */
export const tracedBatchVerify = traced(
  (
    items: Array<{
      message: string | Uint8Array;
      signature: string;
      publicKey: string;
    }>
  ): boolean[] => {
    return baseBatchVerify(items);
  },
  'crypto.batchVerify',
  {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
    sanitizeOutput: (output: unknown) => {
      const results = output as boolean[];
      return {
        total: results.length,
        valid: results.filter(Boolean).length,
        invalid: results.filter((r) => !r).length,
      };
    },
  }
);

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Log a signing operation for audit purposes
 */
export function logSigningOperation(metadata: {
  operation: 'sign' | 'verify';
  publicKeyId?: string;
  success: boolean;
  context?: string;
}): void {
  if (metadata.success) {
    cryptoLog.info(`${metadata.operation}`, {
      publicKeyId: metadata.publicKeyId,
      context: metadata.context,
    });
  } else {
    cryptoLog.warn(`${metadata.operation}.failed`, {
      publicKeyId: metadata.publicKeyId,
      context: metadata.context,
    });
  }
}
