import type { ProofBundle, Certificate, GeneratedQRCode, CryptographicProofRef, LocationProofRef, PhotoProofRef, CertificateLocation } from '../types';
/**
 * Generate unique proof bundle ID
 */
export declare function generateProofBundleId(): string;
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
export declare function createLocationProof(input: LocationProofInput): LocationProofRef;
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
export declare function createPhotoProof(input: PhotoProofInput): PhotoProofRef;
/**
 * Create a cryptographic proof reference
 */
export declare function createCryptographicProofRef(dataHash: string, signature: string, publicKey: string, algorithm?: string): CryptographicProofRef;
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
export declare function createProofBundle(input: CreateProofBundleInput): ProofBundle;
/**
 * Verify proof bundle integrity (structural only)
 * Cryptographic verification must be done by platform-specific code
 */
export declare function verifyProofBundleStructure(bundle: ProofBundle): {
    valid: boolean;
    errors: string[];
};
/**
 * Serialize proof bundle for export
 */
export declare function serializeProofBundle(bundle: ProofBundle): string;
/**
 * Parse proof bundle from serialized string
 */
export declare function parseProofBundle(serialized: string): ProofBundle | null;
/**
 * Calculate hash of entire proof bundle
 */
export declare function hashProofBundle(bundle: ProofBundle): string;
/**
 * Extract all hashes from a proof bundle
 */
export declare function extractProofHashes(bundle: ProofBundle): string[];
/**
 * Get bundle summary for display
 */
export declare function getProofBundleSummary(bundle: ProofBundle): {
    id: string;
    type: string;
    timestamp: string;
    hasLocation: boolean;
    photoCount: number;
    hasCertificate: boolean;
    hasQRCode: boolean;
};
//# sourceMappingURL=bundler.d.ts.map