// ============================================================================
// TRUST REGISTRY TYPES
// Issuer trust levels and governance (spec §8)
// ============================================================================

import type { WorkProofType } from '../workproof/types';

/** Issuer trust classification */
export type IssuerTrustLevel =
  | 'sovereign' // Government / regulatory body
  | 'licensed' // Licensed operating company
  | 'accredited' // Accredited organization
  | 'community'; // Community-level attestor

/** Criteria for trust registry admission */
export interface AdmissionCriteria {
  requiredDocuments: string[];
  minimumOperationalYears?: number;
  jurisdictions: string[];
  commodityRestrictions?: string[];
}

/** Individual entry in the trust registry */
export interface TrustRegistryEntry {
  issuerDID: string;
  issuerName: string;
  trustLevel: IssuerTrustLevel;
  admissionCriteria: AdmissionCriteria;
  isActive: boolean;
  admittedAt: number; // unix ms
  expiresAt?: number;
  revokedAt?: number;
  revokeReason?: string;
  supportedProofTypes: WorkProofType[];
  metadata?: Record<string, unknown>;
}

/** The trust registry */
export interface TrustRegistry {
  registryId: string;
  version: string;
  updatedAt: number; // unix ms
  entries: TrustRegistryEntry[];
}
