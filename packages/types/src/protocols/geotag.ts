// ============================================================================
// GEOTAG PROTOCOL TYPES
// Location & Provenance Verification
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================

// ============================================================================
// COMMODITY & ASSET TYPES (Re-exported for convenience)
// ============================================================================

/**
 * Supported commodity types - extensible
 */
export type CommodityType = 
  | 'gold' 
  | 'silver' 
  | 'platinum' 
  | 'palladium'
  | 'copper' 
  | 'cobalt' 
  | 'lithium'
  | 'tantalum'
  | 'tungsten'
  | 'tin'
  | 'cocoa'
  | 'coffee'
  | 'cotton'
  | 'other';

/**
 * Measurement units - universal
 */
export type MeasurementUnit = 
  | 'g' 
  | 'kg' 
  | 'oz' 
  | 'troy_oz' 
  | 'lb' 
  | 'mt'
  | 'bag'
  | 'bale';

/**
 * Quality grades - universal
 */
export type QualityGrade = 'high' | 'medium' | 'low' | 'ungraded';

// ============================================================================
// CORE GEOTAG TYPES
// ============================================================================

/**
 * Geographic coordinates with metadata
 */
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

/**
 * Cryptographic proof for any GeoTag data
 */
export interface CryptographicProof {
  version: string;
  algorithm: 'Ed25519' | 'ECDSA-P256';
  dataHash: string;
  signature: string;
  publicKey: string;
  timestamp: number;
  proofType: GeoTagProofType;
  metadata: ProofMetadata;
}

export type GeoTagProofType = 
  | 'location' 
  | 'photo' 
  | 'document' 
  | 'workflow'
  | 'custody'
  | 'transfer';

export interface ProofMetadata {
  accuracy?: number;
  location?: GeoCoordinates;
  deviceId?: string;
  userRole?: string;
  workflowContext?: string;
  /** Commodity type for asset-related proofs */
  commodityType?: CommodityType;
  [key: string]: unknown;
}

/**
 * Location proof - cryptographically attested GPS capture
 */
export interface LocationProof {
  id: string;
  coordinates: GeoCoordinates;
  timestamp: number;
  deviceAttestation?: DeviceAttestation;
  cryptographicProof: CryptographicProof;
  resourceContext?: ResourceContext;
  /** @deprecated Use resourceContext instead */
  geologicalContext?: GeologicalContext;
}

export interface DeviceAttestation {
  deviceId: string;
  platform: 'ios' | 'android';
  integrityToken?: string;
  attestationTime: number;
}

/**
 * Resource context - COMMODITY-AGNOSTIC
 * Applies to any commodity extraction site
 */
export interface ResourceContext {
  /** Potential for the target commodity at this location */
  commodityPotential: 'high' | 'medium' | 'low' | 'none';
  /** Which commodity this assessment is for */
  commodityType?: CommodityType;
  /** Geological formation or agricultural zone */
  formation?: string;
  /** Confidence in the assessment (0-1) */
  confidence: number;
  /** Source of the assessment */
  source?: string;
}

/**
 * @deprecated Use ResourceContext instead
 * Kept for backwards compatibility
 */
export interface GeologicalContext {
  /** @deprecated Use commodityPotential in ResourceContext */
  goldPotential: 'high' | 'medium' | 'low' | 'none';
  formation?: string;
  confidence: number;
  source?: string;
}

/**
 * Photo evidence bound to location
 */
export interface PhotoEvidence {
  id: string;
  uri: string;
  hash: string;
  location: LocationProof;
  timestamp: number;
  metadata: PhotoMetadata;
  cryptographicProof: CryptographicProof;
}

export interface PhotoMetadata {
  workflowContext?: string;
  description?: string;
  category?: PhotoCategory;
  dimensions?: { width: number; height: number };
  fileSize?: number;
}

export type PhotoCategory =
  | 'site'
  | 'production'
  | 'equipment'
  | 'sample'
  | 'transport'
  | 'storage'
  | 'documentation';

/**
 * GeoTag capture session - groups related proofs
 */
export interface GeoTagSession {
  id: string;
  tradePassId: string;
  startTime: number;
  endTime?: number;
  locationProofs: LocationProof[];
  photoEvidence: PhotoEvidence[];
  workflowType: string;
  status: 'active' | 'completed' | 'cancelled';
  /** Commodity type for this session */
  commodityType?: CommodityType;
}

/**
 * Origin certificate - the final attestation
 * COMMODITY-AGNOSTIC - works for any commodity
 */
export interface OriginCertificate {
  certificateId: string;
  issuer: string;
  issuedTo: string;
  issuedAt: number;
  expiresAt?: number;
  lotData: LotData;
  locationProof: LocationProof;
  evidenceHashes: string[];
  resourceContext?: ResourceContext;
  /** @deprecated Use resourceContext instead */
  geologicalContext?: GeologicalContext;
  cryptographicProof: CryptographicProof;
  qrCode: string;
}

/**
 * Lot data - COMMODITY-AGNOSTIC
 */
export interface LotData {
  lotId: string;
  /** Commodity type (gold, silver, cocoa, etc.) */
  commodity: CommodityType;
  /** Commodity subtype (e.g., 'alluvial', 'lode', 'arabica') */
  commoditySubtype?: string;
  estimatedWeight: number;
  unit: MeasurementUnit;
  quality?: QualityGrade;
  /** Purity percentage (0-100), primarily for metals */
  purity?: number;
  discoveryDate: string;
  site?: SiteReference;
  /** Producer identifier (was: minerId) */
  producerId?: string;
}

export interface SiteReference {
  siteId: string;
  name: string;
  /** Site type (extraction-site, processing-site, etc.) */
  siteType?: string;
  region: string;
  country: string;
}

// ============================================================================
// TYPE ALIASES FOR PROTOCOL LAYER
// ============================================================================

/**
 * GeoTagData - Primary data structure for a verified location capture
 * Alias for GeoTagSession for protocol layer convenience
 */
export interface GeoTagData {
  id: string;
  tradePassId: string;
  coordinates: GeoCoordinates;
  timestamp: number;
  accuracy: number;
  altitude?: number;
  deviceAttestation?: DeviceAttestation;
  commodityType?: CommodityType;
  metadata?: Record<string, unknown>;
}

/**
 * GeoTagProof - Cryptographic proof for location verification
 */
export interface GeoTagProof {
  dataHash: string;
  signature: string;
  publicKey: string;
  algorithm: 'Ed25519' | 'ECDSA-P256';
  timestamp: number;
  proofType: GeoTagProofType;
}

/**
 * LocationClaim - A claim about a location that can be verified
 */
export interface LocationClaim {
  claimId: string;
  claimant: string;
  location: GeoCoordinates;
  timestamp: number;
  purpose: 'extraction' | 'processing' | 'transport' | 'custody' | 'other';
  evidence?: string[];
  verified: boolean;
  verifiedAt?: number;
  verifiedBy?: string;
}

/**
 * BoundingBox - Geographic boundary definition
 */
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
  /** Optional altitude bounds */
  minAltitude?: number;
  maxAltitude?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to migrate legacy GeologicalContext to ResourceContext
 */
export function migrateGeologicalContext(
  geo: GeologicalContext,
  commodityType: CommodityType = 'gold'
): ResourceContext {
  return {
    commodityPotential: geo.goldPotential,
    commodityType,
    formation: geo.formation,
    confidence: geo.confidence,
    source: geo.source,
  };
}

/**
 * Helper to create ResourceContext for any commodity
 */
export function createResourceContext(
  commodityType: CommodityType,
  potential: 'high' | 'medium' | 'low' | 'none',
  confidence: number,
  options?: {
    formation?: string;
    source?: string;
  }
): ResourceContext {
  return {
    commodityPotential: potential,
    commodityType,
    formation: options?.formation,
    confidence,
    source: options?.source,
  };
}
