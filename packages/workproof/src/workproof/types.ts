// ============================================================================
// WORKPROOF CORE TYPES
// W3C Verifiable Credential model for employment attestations
// 12 proof types mapping to spec §2.3
// ============================================================================

import type { VerifiableCredential, CredentialSubject } from '@gtcx/types';
import type { PredicateURI, ClaimProof } from '@gtcx/verification';

import type { WorkProofEvidenceItem } from '../evidence/types';
import type { WorkProofPredicateType, PredicateValue } from '../predicates/types';

/** The 12 canonical WorkProof types from spec §2.3 */
export type WorkProofType =
  | 'ProductionEvent'
  | 'PaymentReceived'
  | 'TrainingCompletion'
  | 'CertificationEarned'
  | 'ComplianceVerification'
  | 'RoleAssignment'
  | 'LoanRepayment'
  | 'MilestoneAchievement'
  | 'GCISnapshot'
  | 'TenureMark'
  | 'CommunityEndorsement'
  | 'TraditionalAuthorityAttestation';

/** A typed predicate claim within a WorkProof */
export interface WorkProofClaim {
  predicateType: WorkProofPredicateType;
  predicateURI: PredicateURI;
  value: PredicateValue;
  evidence: WorkProofEvidenceItem[];
  confidence: number; // 0-1
  issuedAt: number; // unix ms
  validUntil?: number; // unix ms
  proof: ClaimProof;
}

/** Credential subject for a WorkProof VC */
export interface WorkProofCredentialSubject extends CredentialSubject {
  proofType: WorkProofType;
  tradepassId: string; // DID of the holder (did:gtcx:tp_*)
  issuerId: string; // DID of the issuing entity
  issuerRole: string; // e.g. 'EmploymentOperator'
  commodityContext?: string; // commodity relevant to this proof
  siteId?: string; // site where activity occurred
  claims: WorkProofClaim[];
  metadata?: Record<string, unknown>;
}

/** Complete WorkProof — extends W3C VerifiableCredential */
export interface WorkProof extends VerifiableCredential {
  type: ['VerifiableCredential', 'WorkProof', ...string[]];
  credentialSubject: WorkProofCredentialSubject;
  workProofVersion: '2.1';
}
