// ============================================================================
// PROOFS MODULE - PUBLIC API
// ============================================================================

export {
  // ID generation
  generateProofBundleId,

  // Proof creation
  createLocationProof,
  createPhotoProof,
  createCryptographicProofRef,
  createProofBundle,

  // Verification
  verifyProofBundleStructure,

  // Serialization
  serializeProofBundle,
  parseProofBundle,

  // Utilities
  hashProofBundle,
  extractProofHashes,
  getProofBundleSummary,

  // Types
  type LocationProofInput,
  type PhotoProofInput,
  type CreateProofBundleInput,
} from './bundler';

export {
  DEFAULT_LAB_MERKLE_PATH_HEX,
  attachCommodityOriginZkProof,
  commodityOriginWitnessToProfileInput,
  commodityOriginZkProofRefToProfileProof,
  createCommodityOriginZkProofRef,
  verifyCommodityOriginZkProofCryptographic,
  verifyCommodityOriginZkProofStructure,
  type CommodityOriginWitnessLike,
} from './commodity-origin-zk';

// Re-export types from central types
export type {
  ProofBundle,
  CryptographicProofRef,
  LocationProofRef,
  PhotoProofRef,
  CommodityOriginZkProofRef,
  CommodityOriginProfileId,
} from '../types';
