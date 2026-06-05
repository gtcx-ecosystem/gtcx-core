import type { PredicateURI, EvidenceType } from './predicates';
// CLAIM STRUCTURE (Predicate + Value + Evidence)
// ============================================================================

/**
 * A claim is an assertion about a subject using a predicate
 */
export interface Claim {
  /** Unique claim identifier */
  id: string;
  /** Subject of the claim (DID) */
  subject: string;
  /** Predicate URI */
  predicate: PredicateURI;
  /** Value of the claim (matches predicate schema) */
  value: unknown;
  /** Evidence supporting the claim */
  evidence: ClaimEvidence[];
  /** Attestor who made the claim */
  attestor: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** When the claim was issued */
  issuedAt: number;
  /** When the claim expires */
  validUntil?: number;
  /** Cryptographic proof */
  proof: ClaimProof;
}

/**
 * Evidence attached to a claim
 */
export interface ClaimEvidence {
  type: EvidenceType;
  hash: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Cryptographic proof for a claim
 */
export interface ClaimProof {
  type: 'Ed25519Signature2020' | 'EcdsaSecp256k1Signature2019';
  created: string;
  verificationMethod: string;
  proofValue: string;
}

// ============================================================================
