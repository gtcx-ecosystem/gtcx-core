// ============================================================================
// IDENTITY GENERATION
// Create and manage digital identities for GTCX participants
// ============================================================================

import { createHash, randomUUID, randomBytes } from 'crypto';

import { generateKeyPair, hash256 } from '@gtcx/crypto';
import type {
  DigitalIdentity,
  EnhancedIdentity,
  SecurityLevel,
  IdentityMetadata,
  KeyDerivationParams,
  MultiKeyPairs,
} from '@gtcx/types';

export class IdentityError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'IdentityError';
  }
}

const VALID_SECURITY_LEVELS: SecurityLevel[] = ['standard', 'enhanced', 'military'];
const VALID_ALGORITHMS = ['Ed25519', 'Secp256k1'] as const;

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
  const random = randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
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
  const { securityLevel = 'standard', metadata = {}, algorithm = 'Ed25519' } = options;

  // Validate options
  if (securityLevel && !VALID_SECURITY_LEVELS.includes(securityLevel)) {
    throw new IdentityError(
      `Invalid securityLevel: ${securityLevel}. Must be one of: ${VALID_SECURITY_LEVELS.join(', ')}`,
      'INVALID_SECURITY_LEVEL'
    );
  }
  if (algorithm && !VALID_ALGORITHMS.includes(algorithm)) {
    throw new IdentityError(
      `Invalid algorithm: ${algorithm}. Must be one of: ${VALID_ALGORITHMS.join(', ')}`,
      'INVALID_ALGORITHM'
    );
  }
  if (metadata && typeof metadata !== 'object') {
    throw new IdentityError('metadata must be an object', 'INVALID_METADATA');
  }

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

  // Protect private key from accidental serialization
  const result: IdentityCreationResult = { identity } as IdentityCreationResult;
  Object.defineProperty(result, 'privateKey', {
    value: keyPair.privateKey,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return result;
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
  const { securityLevel = 'military', metadata = {}, keyDerivation } = options;

  // Generate Ed25519 key pair (primary)
  const ed25519KeyPair = await generateKeyPair('Ed25519');

  // Generate Secp256k1 key pair (secondary)
  const secp256k1KeyPair = await generateKeyPair('Secp256k1');

  // Generate unique identity ID
  const id = generateIdentityId('MIL');
  const ed25519KeyRef = `gtcx_ed25519_${id}`;
  const secp256k1KeyRef = `gtcx_secp256k1_${id}`;

  // Post-quantum hash binding (SHAKE-256, NIST SP 800-185)
  // SHAKE-256 is a SHA-3 extendable-output function resistant to Grover's algorithm
  const combinedKeys = ed25519KeyPair.publicKey + secp256k1KeyPair.publicKey;
  const postQuantumBinding = createHash('shake256', { outputLength: 32 })
    .update(combinedKeys)
    .update(Date.now().toString())
    .digest('hex');

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
    postQuantumHash: postQuantumBinding,
    keyDerivation: keyDerivation
      ? (() => {
          const salt = keyDerivation.salt ?? randomBytes(32).toString('hex');
          if (salt.length < 32) {
            throw new IdentityError(
              'Key derivation salt must be at least 16 bytes (32 hex chars)',
              'INVALID_SALT'
            );
          }
          return {
            algorithm: keyDerivation.algorithm ?? 'Argon2',
            iterations: keyDerivation.iterations ?? 100000,
            salt,
          };
        })()
      : undefined,
  };

  // Protect private keys from accidental serialization
  const privateKeys = {} as { ed25519: string; secp256k1: string };
  Object.defineProperty(privateKeys, 'ed25519', {
    value: ed25519KeyPair.privateKey,
    enumerable: false,
    configurable: false,
    writable: false,
  });
  Object.defineProperty(privateKeys, 'secp256k1', {
    value: secp256k1KeyPair.privateKey,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  const result: EnhancedIdentityCreationResult = { identity } as EnhancedIdentityCreationResult;
  Object.defineProperty(result, 'privateKeys', {
    value: privateKeys,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return result;
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
