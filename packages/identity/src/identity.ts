// ============================================================================
// IDENTITY GENERATION
// Create and manage digital identities for GTCX participants
// ============================================================================

import { generateKeyPair } from '@gtcx/crypto';
import { hash256 } from '@gtcx/crypto';
import type {
  DigitalIdentity,
  EnhancedIdentity,
  SecurityLevel,
  IdentityMetadata,
  KeyDerivationParams,
  MultiKeyPairs,
} from '@gtcx/types';

/**
 * Options for identity creation
 */
export interface CreateIdentityOptions {
  securityLevel?: SecurityLevel;
  metadata?: Partial<IdentityMetadata>;
  algorithm?: 'Ed25519' | 'Secp256k1';
  enableMultiSig?: boolean;
}

/**
 * Result of identity creation
 * Includes private key that must be stored securely
 */
export interface IdentityCreationResult {
  identity: DigitalIdentity;
  privateKey: string; // Hex-encoded - caller must store securely
}

export interface EnhancedIdentityCreationResult {
  identity: EnhancedIdentity;
  privateKeys: {
    ed25519: string;
    secp256k1?: string;
  };
}

/**
 * Generate a unique identity ID
 */
export function generateIdentityId(prefix: string = 'GTCX'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Create a standard digital identity
 * 
 * @example
 * ```typescript
 * const { identity, privateKey } = await createIdentity({
 *   securityLevel: 'standard',
 *   metadata: { userRole: 'miner', deviceId: 'abc123' }
 * });
 * // Store privateKey in secure storage immediately
 * await secureStore.set(identity.privateKeyRef, privateKey);
 * ```
 */
export async function createIdentity(
  options: CreateIdentityOptions = {}
): Promise<IdentityCreationResult> {
  const {
    securityLevel = 'standard',
    metadata = {},
    algorithm = 'Ed25519',
  } = options;

  // Generate cryptographic key pair
  const keyPair = await generateKeyPair(algorithm);
  
  // Generate unique identity ID
  const id = generateIdentityId();
  const privateKeyRef = `gtcx_identity_${id}`;
  
  // Create fingerprint from public key
  const fingerprint = hash256(keyPair.publicKey).substring(0, 16);

  const identity: DigitalIdentity = {
    id,
    publicKey: keyPair.publicKey,
    privateKeyRef,
    createdAt: Date.now(),
    securityLevel,
    metadata: {
      fingerprint,
      ...metadata,
    },
  };

  return {
    identity,
    privateKey: keyPair.privateKey,
  };
}

/**
 * Create an enhanced identity with multi-signature support
 * Used for military-grade security requirements
 */
export async function createEnhancedIdentity(
  options: CreateIdentityOptions & {
    keyDerivation?: Partial<KeyDerivationParams>;
  } = {}
): Promise<EnhancedIdentityCreationResult> {
  const {
    securityLevel = 'military',
    metadata = {},
    keyDerivation,
  } = options;

  // Generate Ed25519 key pair (primary)
  const ed25519KeyPair = await generateKeyPair('Ed25519');
  
  // Generate Secp256k1 key pair (secondary)
  const secp256k1KeyPair = await generateKeyPair('Secp256k1');

  // Generate unique identity ID
  const id = generateIdentityId('MIL');
  const ed25519KeyRef = `gtcx_ed25519_${id}`;
  const secp256k1KeyRef = `gtcx_secp256k1_${id}`;

  // Create quantum-resistant hash
  const combinedKeys = ed25519KeyPair.publicKey + secp256k1KeyPair.publicKey;
  const quantumHash = hash256(hash256(combinedKeys) + Date.now().toString());

  // Create fingerprint
  const fingerprint = hash256(ed25519KeyPair.publicKey).substring(0, 16);

  const multiKeyPairs: MultiKeyPairs = {
    ed25519: {
      algorithm: 'Ed25519',
      publicKey: ed25519KeyPair.publicKey,
      privateKeyRef: ed25519KeyRef,
      createdAt: Date.now(),
    },
    secp256k1: {
      algorithm: 'Secp256k1',
      publicKey: secp256k1KeyPair.publicKey,
      privateKeyRef: secp256k1KeyRef,
      createdAt: Date.now(),
    },
  };

  const identity: EnhancedIdentity = {
    id,
    publicKey: ed25519KeyPair.publicKey, // Primary key
    privateKeyRef: ed25519KeyRef,
    createdAt: Date.now(),
    securityLevel,
    metadata: {
      fingerprint,
      ...metadata,
    },
    multiKeyPairs,
    quantumResistantHash: quantumHash,
    keyDerivation: keyDerivation ? {
      algorithm: keyDerivation.algorithm ?? 'Argon2',
      iterations: keyDerivation.iterations ?? 100000,
      salt: keyDerivation.salt ?? generateIdentityId('SALT'),
    } : undefined,
  };

  return {
    identity,
    privateKeys: {
      ed25519: ed25519KeyPair.privateKey,
      secp256k1: secp256k1KeyPair.privateKey,
    },
  };
}

/**
 * Validate identity structure
 */
export function validateIdentity(identity: DigitalIdentity): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!identity.id) errors.push('Missing identity ID');
  if (!identity.publicKey) errors.push('Missing public key');
  if (!identity.privateKeyRef) errors.push('Missing private key reference');
  if (!identity.createdAt) errors.push('Missing creation timestamp');
  
  if (identity.publicKey && identity.publicKey.length < 64) {
    errors.push('Invalid public key length');
  }

  if (identity.expiresAt && identity.expiresAt < Date.now()) {
    errors.push('Identity has expired');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if identity has expired
 */
export function isIdentityExpired(identity: DigitalIdentity): boolean {
  if (!identity.expiresAt) return false;
  return identity.expiresAt < Date.now();
}

/**
 * Create a derived identity from existing identity
 * Useful for creating role-specific or context-specific identities
 */
export async function deriveIdentity(
  parentIdentity: DigitalIdentity,
  context: string,
  options: Partial<CreateIdentityOptions> = {}
): Promise<IdentityCreationResult> {
  const derivedMetadata = {
    ...parentIdentity.metadata,
    ...options.metadata,
    parentIdentityId: parentIdentity.id,
    derivationContext: context,
  };

  return createIdentity({
    ...options,
    securityLevel: options.securityLevel ?? parentIdentity.securityLevel,
    metadata: derivedMetadata,
  });
}
