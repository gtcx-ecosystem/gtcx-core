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
    commodityOriginZkProof?: CommodityOriginZkProofRef | undefined;
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

/** Registry profile IDs for commodity-origin Groth16 proofs (DTF-5.2.2). */
export type CommodityOriginProfileId = 'gh-gold-origin' | 'gh-cocoa-origin' | 'zw-diamond-origin';

/** Groth16 commodity-origin proof attached to a verification proof bundle. */
export interface CommodityOriginZkProofRef {
  profileId: CommodityOriginProfileId;
  system: 'groth16';
  proofType: 'commodity_origin';
  proof: string;
  verifyingKey: string;
  publicInputsJson: string;
}

// ============================================================================
