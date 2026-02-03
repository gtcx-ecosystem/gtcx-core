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

// Re-export types from central types
export type {
  ProofBundle,
  CryptographicProofRef,
  LocationProofRef,
  PhotoProofRef,
} from '../types';
