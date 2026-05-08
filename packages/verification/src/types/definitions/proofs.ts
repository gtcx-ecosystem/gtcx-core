import type { Certificate, CertificateLocation } from './certificates';
import type { Claim } from './claims';
import type { GeneratedQRCode } from './qr';
// ============================================================================
// PROOF BUNDLE TYPES
// ============================================================================

/**
 * Bundled proof combining multiple verification elements
 */
export interface ProofBundle {
  id: string;
  type: 'location' | 'photo' | 'workflow' | 'certificate';
  timestamp: number;
  proofs: {
    cryptographicProof: CryptographicProofRef;
    locationProof?: LocationProofRef | undefined;
    photoProofs?: PhotoProofRef[] | undefined;
  };
  certificate?: Certificate | undefined;
  qrCode?: GeneratedQRCode | undefined;
  /** Claims included in this bundle */
  claims?: Claim[] | undefined;
}

export interface CryptographicProofRef {
  algorithm: string;
  dataHash: string;
  signature: string;
  publicKey: string;
}

export interface LocationProofRef {
  id: string;
  coordinates: CertificateLocation;
  hash: string;
}

export interface PhotoProofRef {
  id: string;
  uri: string;
  hash: string;
  timestamp: number;
}

// ============================================================================
