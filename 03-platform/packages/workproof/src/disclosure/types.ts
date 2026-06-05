// ============================================================================
// DISCLOSURE TYPES
// Selective disclosure and threshold claims for privacy-preserving verification
// ============================================================================

import type { WorkProofPredicateType } from '../predicates/types';

/** Threshold comparison operators */
export type ThresholdOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'range';

/** A threshold claim — proves a property meets a condition without revealing exact value */
export interface ThresholdClaim {
  property: WorkProofPredicateType;
  operator: ThresholdOperator;
  threshold: number | [number, number]; // single value or [min, max] for 'range'
  unit?: string;
}

/** Disclosure granularity levels */
export type DisclosureLevel =
  | 'full' // Complete WorkProof history
  | 'summary' // Aggregated stats only
  | 'category' // One predicate category
  | 'threshold' // ZK threshold proofs only
  | 'single_credential'; // One specific WorkProof

/** Request for selective disclosure */
export interface SelectiveDisclosureRequest {
  requestId: string;
  requestorDID: string;
  subjectDID: string;
  disclosureLevel: DisclosureLevel;
  requestedCategories?: string[];
  requestedPredicates?: WorkProofPredicateType[];
  thresholdClaims?: ThresholdClaim[];
  purpose: string;
  expiresAt: number; // unix ms
}

/** Result of a threshold claim evaluation */
export interface ThresholdResult {
  claim: ThresholdClaim;
  satisfied: boolean;
  zkProofUri?: string; // optional ZK proof
}

/** Response to a selective disclosure request */
export interface SelectiveDisclosureResponse {
  requestId: string;
  disclosureLevel: DisclosureLevel;
  thresholdResults?: ThresholdResult[];
  generatedAt: number; // unix ms
  signature?: string;
}
