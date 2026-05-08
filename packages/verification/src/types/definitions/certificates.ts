import type { ResourceContext, GeologicalContext, CustodyEntry, SettlementRecord } from '@gtcx/types';

import type { Claim } from './claims';
import type { CertificateType, AssetCategory, CommodityType, CertificateSecurityLevel, MeasurementUnit, QualityGrade, AssetLifecycleState, OperatorRole, SiteReference } from './primitives';
// CERTIFICATE TYPES
// ============================================================================

/**
 * Location data for certificates
 */
export interface CertificateLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  timestamp: number;
}

/**
 * Environmental factors at time of capture
 */
export interface EnvironmentalFactors {
  satelliteCount: number;
  signalStrength: number;
  atmosphericConditions: string;
  multipathIndicator: boolean;
}

/**
 * Validation metrics for certificate
 */
export interface ValidationMetrics {
  isJammed: boolean;
  isSpoofed: boolean;
  confidenceLevel: number;
  integrityCheck: boolean;
}

// ResourceContext: imported from @gtcx/types (see top of file)
// GeologicalContext: imported from @gtcx/types (see top of file)

/**
 * Certificate metadata
 */
export interface CertificateMetadata {
  issuer: string;
  issuedAt: number;
  expiresAt?: number | undefined;
  userRole: string;
  deviceId: string;
  location: CertificateLocation;
  resourceContext?: ResourceContext | undefined;
  /** @deprecated Use resourceContext */
  geologicalContext?: GeologicalContext | undefined;
  environmentalFactors?: EnvironmentalFactors | undefined;
  validationMetrics?: ValidationMetrics | undefined;
}

/**
 * Multi-signature structure
 */
export interface MultiSignature {
  ed25519: string;
  secp256k1?: string | undefined;
}

/**
 * Certificate verification data
 */
export interface CertificateVerificationData {
  publicKey: string;
  signature: string;
  timestamp: number;
  entropyQuality?: number;
}

/**
 * Base certificate structure
 */
export interface Certificate {
  certificateId: string;
  version: string;
  type: CertificateType;
  securityLevel: CertificateSecurityLevel;
  metadata: CertificateMetadata;
  verificationData: CertificateVerificationData;
  createdAt: number;
}

/**
 * Standard certificate (single signature)
 */
export interface StandardCertificate extends Certificate {
  securityLevel: 'standard' | 'enhanced';
  dataHash: string;
  signature: string;
}

/**
 * Military-grade certificate (multi-signature, post-quantum)
 */
export interface MilitaryGradeCertificate extends Certificate {
  securityLevel: 'military' | 'post-quantum';
  postQuantumHash: string;
  multiSignature: MultiSignature;
  certificateData: {
    assetLotData?: AssetLotData | undefined;
    /** @deprecated Use assetLotData */
    goldLotData?: GoldLotData | undefined;
    photoHash?: string | undefined;
    photoEvidence?: PhotoEvidenceRef[] | undefined;
    workflowContext?: string | undefined;
    complianceData?: ComplianceData | undefined;
    custodyData?: CustodyEntry | undefined;
    settlementData?: SettlementRecord | undefined;
    /** Claims associated with this certificate */
    claims?: Claim[] | undefined;
  };
}

/**
 * Asset lot data - universal
 */
export interface AssetLotData {
  lotId?: string | undefined;
  commodityType: CommodityType;
  commoditySubtype?: string | undefined;
  category?: AssetCategory | undefined;
  estimatedWeight: number;
  unit: MeasurementUnit;
  quality?: QualityGrade | undefined;
  purity?: number | undefined;
  /** Current lifecycle state */
  state?: AssetLifecycleState | undefined;
  /** Previous state (for transitions) */
  previousState?: AssetLifecycleState | undefined;
  producerId?: string | undefined;
  operatorRole?: OperatorRole | undefined;
  discoveryDate?: string | undefined;
  siteId?: string | undefined;
  /** Site reference with full details */
  site?: SiteReference | undefined;
  attributes?: Record<string, unknown> | undefined;
}

// SiteReference: imported from @gtcx/types (see top of file)

/**
 * @deprecated Use AssetLotData with commodityType: 'gold'
 */
export interface GoldLotData {
  estimatedWeight: number;
  quality?: 'high' | 'medium' | 'low';
  purity?: number;
  /** @deprecated Use producerId in AssetLotData */
  miner?: string;
  discoveryDate?: string;
}

/**
 * Photo evidence reference
 */
export interface PhotoEvidenceRef {
  id: string;
  hash: string;
  timestamp: number;
}

/**
 * Compliance data
 */
export interface ComplianceData {
  permitNumber?: string;
  inspectorId?: string;
  complianceLevel?: string;
  notes?: string;
  /** GCI score if available */
  gciScore?: number;
  /** Associated claims */
  claims?: Claim[];
}

/**
 * Certificate verification result
 */
export interface CertificateVerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  confidence: number;
  details: string;
  checks: {
    hashValid: boolean;
    signatureValid: boolean;
    timestampValid: boolean;
    notExpired: boolean;
  };
}

