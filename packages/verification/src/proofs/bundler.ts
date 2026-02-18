// ============================================================================
// PROOF BUNDLER - UNIVERSAL (Platform-Agnostic)
// Combines multiple verification elements into exportable bundles
// ============================================================================

import { randomUUID } from 'node:crypto';

import { hash256 } from '@gtcx/crypto';

import type {
  ProofBundle,
  Certificate,
  GeneratedQRCode,
  CryptographicProofRef,
  LocationProofRef,
  PhotoProofRef,
  CertificateLocation,
} from '../types';
import { ProofBundleSchema } from '../types/schemas';

/**
 * Generate unique proof bundle ID
 */
export function generateProofBundleId(): string {
  return `proof_${randomUUID()}`;
}

/**
 * Input for creating a location proof
 */
export interface LocationProofInput {
  coordinates: CertificateLocation;
  signature: string;
  publicKey: string;
  algorithm?: string;
}

/**
 * Create a location proof reference
 */
export function createLocationProof(input: LocationProofInput): LocationProofRef {
  const dataToHash = JSON.stringify({
    coordinates: input.coordinates,
    timestamp: input.coordinates.timestamp,
  });

  return {
    id: `loc_${randomUUID()}`,
    coordinates: input.coordinates,
    hash: hash256(dataToHash),
  };
}

/**
 * Input for creating a photo proof
 */
export interface PhotoProofInput {
  uri: string;
  fileHash: string;
  timestamp: number;
}

/**
 * Create a photo proof reference
 */
export function createPhotoProof(input: PhotoProofInput): PhotoProofRef {
  return {
    id: `photo_${randomUUID()}`,
    uri: input.uri,
    hash: input.fileHash,
    timestamp: input.timestamp,
  };
}

/**
 * Create a cryptographic proof reference
 */
export function createCryptographicProofRef(
  dataHash: string,
  signature: string,
  publicKey: string,
  algorithm: string = 'Ed25519-SHA256'
): CryptographicProofRef {
  return {
    algorithm,
    dataHash,
    signature,
    publicKey,
  };
}

/**
 * Input for creating a proof bundle
 */
export interface CreateProofBundleInput {
  type: ProofBundle['type'];
  cryptographicProof: CryptographicProofRef;
  locationProof?: LocationProofRef;
  photoProofs?: PhotoProofRef[];
  certificate?: Certificate;
  qrCode?: GeneratedQRCode;
}

/**
 * Create a proof bundle combining multiple verification elements
 */
export function createProofBundle(input: CreateProofBundleInput): ProofBundle {
  return {
    id: generateProofBundleId(),
    type: input.type,
    timestamp: Date.now(),
    proofs: {
      cryptographicProof: input.cryptographicProof,
      locationProof: input.locationProof,
      photoProofs: input.photoProofs,
    },
    certificate: input.certificate,
    qrCode: input.qrCode,
  };
}

/**
 * Verify proof bundle integrity (structural only)
 * Cryptographic verification must be done by platform-specific code
 */
export function verifyProofBundleStructure(bundle: ProofBundle): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!bundle.id) {
    errors.push('Missing bundle ID');
  }

  if (!bundle.type) {
    errors.push('Missing bundle type');
  }

  if (!bundle.timestamp) {
    errors.push('Missing timestamp');
  }

  if (!bundle.proofs?.cryptographicProof) {
    errors.push('Missing cryptographic proof');
  } else {
    const cp = bundle.proofs.cryptographicProof;
    if (!cp.algorithm) errors.push('Missing algorithm in cryptographic proof');
    if (!cp.dataHash) errors.push('Missing dataHash in cryptographic proof');
    if (!cp.signature) errors.push('Missing signature in cryptographic proof');
    if (!cp.publicKey) errors.push('Missing publicKey in cryptographic proof');
  }

  // Type-specific validation
  if (bundle.type === 'location' && !bundle.proofs.locationProof) {
    errors.push('Location bundle requires locationProof');
  }

  if (
    bundle.type === 'photo' &&
    (!bundle.proofs.photoProofs || bundle.proofs.photoProofs.length === 0)
  ) {
    errors.push('Photo bundle requires at least one photoProof');
  }

  if (bundle.type === 'certificate' && !bundle.certificate) {
    errors.push('Certificate bundle requires certificate');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Serialize proof bundle for export
 */
export function serializeProofBundle(bundle: ProofBundle): string {
  return JSON.stringify(bundle, null, 2);
}

/**
 * Parse proof bundle from serialized string with schema validation.
 * Returns null if JSON parsing or schema validation fails.
 */
export function parseProofBundle(
  serialized: string,
  onError?: (error: unknown) => void
): ProofBundle | null {
  let raw: unknown;
  try {
    raw = JSON.parse(serialized);
  } catch (error) {
    onError?.(error);
    return null;
  }
  const result = ProofBundleSchema.safeParse(raw);
  if (!result.success) {
    onError?.(result.error);
    return null;
  }
  return result.data as ProofBundle;
}

/**
 * Calculate hash of entire proof bundle
 */
export function hashProofBundle(bundle: ProofBundle): string {
  return hash256(JSON.stringify(bundle));
}

/**
 * Extract all hashes from a proof bundle
 */
export function extractProofHashes(bundle: ProofBundle): string[] {
  const hashes: string[] = [];

  if (bundle.proofs.cryptographicProof?.dataHash) {
    hashes.push(bundle.proofs.cryptographicProof.dataHash);
  }

  if (bundle.proofs.locationProof?.hash) {
    hashes.push(bundle.proofs.locationProof.hash);
  }

  if (bundle.proofs.photoProofs) {
    for (const photo of bundle.proofs.photoProofs) {
      if (photo.hash) {
        hashes.push(photo.hash);
      }
    }
  }

  return hashes;
}

/**
 * Get bundle summary for display
 */
export function getProofBundleSummary(bundle: ProofBundle): {
  id: string;
  type: string;
  timestamp: string;
  hasLocation: boolean;
  photoCount: number;
  hasCertificate: boolean;
  hasQRCode: boolean;
} {
  return {
    id: bundle.id,
    type: bundle.type,
    timestamp: new Date(bundle.timestamp).toISOString(),
    hasLocation: !!bundle.proofs.locationProof,
    photoCount: bundle.proofs.photoProofs?.length ?? 0,
    hasCertificate: !!bundle.certificate,
    hasQRCode: !!bundle.qrCode,
  };
}
