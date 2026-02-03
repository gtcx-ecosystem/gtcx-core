// ============================================================================
// LOT MODEL
// Physical commodity lot representation
// ============================================================================

import type { 
  CommodityType, 
  LotOrigin, 
  LotSpecifications, 
  LotStatus,
  CustodyChain 
} from '../protocols/vaultmark';

export interface Lot {
  id: string;
  referenceNumber: string;
  commodity: CommodityType;
  origin: LotOrigin;
  specifications: LotSpecifications;
  custody: CustodyChain;
  compliance: LotCompliance;
  certifications: LotCertification[];
  pricing?: LotPricing;
  status: LotStatus;
  visibility: LotVisibility;
  createdAt: number;
  updatedAt: number;
}

export interface LotCompliance {
  gciScore: number;
  tier: string;
  evaluatedAt: number;
  attestationId?: string;
  flags: ComplianceFlag[];
}

export interface ComplianceFlag {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: number;
  resolvedAt?: number;
}

export interface LotCertification {
  id: string;
  type: CertificationType;
  issuer: string;
  issuedAt: number;
  expiresAt?: number;
  documentUrl?: string;
  verified: boolean;
}

export type CertificationType =
  | 'origin'
  | 'assay'
  | 'conflict_free'
  | 'environmental'
  | 'labor'
  | 'export'
  | 'import'
  | 'custom';

export interface LotPricing {
  spotPrice: number;
  askingPrice?: number;
  currency: string;
  pricePerUnit: number;
  unit: string;
  updatedAt: number;
}

export type LotVisibility =
  | 'private'
  | 'organization'
  | 'marketplace'
  | 'public';

export interface LotSummary {
  id: string;
  referenceNumber: string;
  commodity: CommodityType;
  weight: number;
  unit: string;
  origin: {
    country: string;
    region: string;
  };
  complianceTier: string;
  status: LotStatus;
}
