/**
 * @gtcx/security - Tamper Detection
 *
 * Detect tampering with locally stored data.
 * Implements P8 (Offline-First) and P9 (Security) principles.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// =============================================================================
// INTEGRITY PROOF SCHEMA
// =============================================================================

/**
 * Integrity proof for tamper detection
 */
export const IntegrityProofSchema = z.object({
  // Data identification
  dataId: z.string(),
  dataType: z.string(),

  // Hash of the protected data
  dataHash: z.string(),
  hashAlgorithm: z.literal('SHA-256').default('SHA-256'),

  // Signature chain to trusted root
  signatureChain: z.array(
    z.object({
      hash: z.string(), // Hash that was signed
      signature: z.string(),
      signerKeyId: z.string(),
      signedAt: z.string().datetime(),
    })
  ),

  // Trusted root key ID
  trustedRootKeyId: z.string(),

  // Timing
  createdAt: z.string().datetime(),
  lastVerifiedAt: z.string().datetime(),
});

export type IntegrityProof = z.infer<typeof IntegrityProofSchema>;

// =============================================================================
// TAMPER DETECTION RESULT
// =============================================================================

export interface TamperCheckResult {
  valid: boolean;
  tamperedWith: boolean;
  reason?:
    | 'DATA_MODIFIED'
    | 'HASH_MISMATCH'
    | 'SIGNATURE_INVALID'
    | 'CHAIN_BROKEN'
    | 'ROOT_UNTRUSTED'
    | 'PROOF_MISSING';
  details?: string;
}

// =============================================================================
// TAMPER DETECTION UTILITIES
// =============================================================================

/**
 * Create integrity proof structure
 * NOTE: Actual hashing/signing should use @gtcx/crypto
 */
export function createIntegrityProofStructure(
  dataId: string,
  dataType: string,
  dataHash: string,
  trustedRootKeyId: string
): Omit<IntegrityProof, 'signatureChain'> {
  const now = new Date().toISOString();
  return {
    dataId,
    dataType,
    dataHash,
    hashAlgorithm: 'SHA-256',
    trustedRootKeyId,
    createdAt: now,
    lastVerifiedAt: now,
  };
}

/**
 * Check if integrity proof structure is valid
 */
export function isProofStructureValid(proof: unknown): proof is IntegrityProof {
  try {
    IntegrityProofSchema.parse(proof);
    return true;
  } catch {
    return false;
  }
}

/**
 * Basic tamper check (structure only)
 * Full verification requires @gtcx/crypto for signature verification
 */
export function checkProofStructure(proof: IntegrityProof): TamperCheckResult {
  // Check signature chain exists
  if (!proof.signatureChain || proof.signatureChain.length === 0) {
    return {
      valid: false,
      tamperedWith: true,
      reason: 'CHAIN_BROKEN',
      details: 'Signature chain is empty',
    };
  }

  // Check chain connects to root
  const lastSigner = proof.signatureChain[proof.signatureChain.length - 1]!;
  if (lastSigner.signerKeyId !== proof.trustedRootKeyId) {
    return {
      valid: false,
      tamperedWith: true,
      reason: 'ROOT_UNTRUSTED',
      details: 'Signature chain does not connect to trusted root',
    };
  }

  // Check chain continuity (each hash should be of previous signature)
  for (let i = 1; i < proof.signatureChain.length; i++) {
    const current = proof.signatureChain[i]!;
    const previous = proof.signatureChain[i - 1]!;
    // The hash in current should reference the previous signature
    // This is structural check only - cryptographic check needs @gtcx/crypto
    if (!current.hash || !previous.signature) {
      return {
        valid: false,
        tamperedWith: true,
        reason: 'CHAIN_BROKEN',
        details: `Chain broken at index ${i}`,
      };
    }
  }

  return {
    valid: true,
    tamperedWith: false,
  };
}

// =============================================================================
// HASH COMPARISON UTILITIES
// =============================================================================

/**
 * Constant-time string comparison to prevent timing attacks.
 * When lengths differ, pads the shorter string and still performs
 * a full constant-time comparison to avoid leaking length information.
 */
export function secureCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length);
  // Two empty strings should not be considered a valid match —
  // this function is for comparing hashes/digests, not arbitrary secrets.
  if (maxLen === 0) {
    return false;
  }

  let result = a.length ^ b.length; // Non-zero if lengths differ
  for (let i = 0; i < maxLen; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  return result === 0;
}

/**
 * Compare two hashes securely
 */
export function hashesMatch(hash1: string, hash2: string): boolean {
  // Normalize to lowercase
  const normalized1 = hash1.toLowerCase();
  const normalized2 = hash2.toLowerCase();
  return secureCompare(normalized1, normalized2);
}

// =============================================================================
// AUDIT TRAIL FOR TAMPER DETECTION
// =============================================================================

/**
 * Tamper detection event for audit logging
 */
export interface TamperDetectionEvent {
  timestamp: string;
  dataId: string;
  dataType: string;
  checkType: 'SCHEDULED' | 'ON_ACCESS' | 'MANUAL';
  result: TamperCheckResult;
  deviceId?: string | undefined;
  location?:
    | {
        latitude: number;
        longitude: number;
      }
    | undefined;
}

/**
 * Create tamper detection event for logging
 */
export function createTamperDetectionEvent(
  dataId: string,
  dataType: string,
  checkType: 'SCHEDULED' | 'ON_ACCESS' | 'MANUAL',
  result: TamperCheckResult,
  deviceId?: string
): TamperDetectionEvent {
  return {
    timestamp: new Date().toISOString(),
    dataId,
    dataType,
    checkType,
    result,
    deviceId,
  };
}
