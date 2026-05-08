// Re-export from @gtcx/types
import type {
  CommodityType,
  ResourceContext,
  GeologicalContext,
  SiteReference,
  CustodyEntry,
  SettlementRecord,
} from '@gtcx/types';

export type {
  CommodityType,
  ResourceContext,
  GeologicalContext,
  SiteReference,
  CustodyEntry,
  SettlementRecord,
};

// Domain-specific type definitions
export * from './definitions/primitives';
export * from './definitions/predicates';
export * from './definitions/claims';
export * from './definitions/qr';
export * from './definitions/certificates';
export * from './definitions/templates';
export * from './definitions/proofs';
export * from './definitions/commodities';
