// ============================================================================
// PREDICATE REGISTRY
// Canonical WorkProof predicate definitions (47 predicates across 9 categories)
// Each entry is a full PredicateDefinition from @gtcx/verification
// ============================================================================

import type { PredicateURI } from '@gtcx/verification';

import type { WorkProofPredicateType } from './types';

function uri(category: string, name: string): PredicateURI {
  return `tradepass://workproof/${category}/${name}` as PredicateURI;
}

/** Canonical URIs for all 47 WorkProof predicate types */
export const WORKPROOF_PREDICATE_URIS: Record<WorkProofPredicateType, PredicateURI> = {
  // Identity
  IdentityVerified: uri('identity', 'verified'),
  RoleHeld: uri('identity', 'role-held'),
  EmploymentActive: uri('identity', 'employment-active'),
  TenureAchieved: uri('identity', 'tenure-achieved'),
  CommunityMembership: uri('identity', 'community-membership'),
  // Production
  CommodityProduced: uri('production', 'commodity-produced'),
  QuantityVerified: uri('production', 'quantity-verified'),
  QualityGraded: uri('production', 'quality-graded'),
  OriginAuthenticated: uri('production', 'origin-authenticated'),
  MethodCompliant: uri('production', 'method-compliant'),
  // Location
  SiteVerified: uri('location', 'site-verified'),
  GeofenceCompliant: uri('location', 'geofence-compliant'),
  LocationConsistent: uri('location', 'location-consistent'),
  EnvironmentalCompliance: uri('location', 'environmental-compliance'),
  // Compliance
  InspectionPassed: uri('compliance', 'inspection-passed'),
  StandardMet: uri('compliance', 'standard-met'),
  GCIScoreRecorded: uri('compliance', 'gci-score-recorded'),
  ViolationFree: uri('compliance', 'violation-free'),
  LicenseValid: uri('compliance', 'license-valid'),
  // Financial
  PaymentReceived: uri('financial', 'payment-received'),
  LoanDisbursed: uri('financial', 'loan-disbursed'),
  RepaymentCompleted: uri('financial', 'repayment-completed'),
  SavingsDeposited: uri('financial', 'savings-deposited'),
  TaxWithheld: uri('financial', 'tax-withheld'),
  // Learning
  ModuleCompleted: uri('learning', 'module-completed'),
  AssessmentPassed: uri('learning', 'assessment-passed'),
  CertificationEarned: uri('learning', 'certification-earned'),
  SkillDemonstrated: uri('learning', 'skill-demonstrated'),
  MentorshipProvided: uri('learning', 'mentorship-provided'),
  // Performance
  ConsistencyMaintained: uri('performance', 'consistency-maintained'),
  QualityThresholdMet: uri('performance', 'quality-threshold-met'),
  ProductivityTarget: uri('performance', 'productivity-target'),
  ReliabilityScore: uri('performance', 'reliability-score'),
  // Community
  PeerEndorsement: uri('community', 'peer-endorsement'),
  ElderAttestation: uri('community', 'elder-attestation'),
  CooperativeMembership: uri('community', 'cooperative-membership'),
  CommunityContribution: uri('community', 'community-contribution'),
  MentorshipReceived: uri('community', 'mentorship-received'),
  // Entity
  EntityRegistered: uri('entity', 'registered'),
  SanctionsCleared: uri('entity', 'sanctions-cleared'),
  PepCleared: uri('entity', 'pep-cleared'),
  AdverseMediaCleared: uri('entity', 'adverse-media-cleared'),
  BeneficialOwnershipDisclosed: uri('entity', 'beneficial-ownership-disclosed'),
  AccreditationHeld: uri('entity', 'accreditation-held'),
  EntityRecognized: uri('entity', 'recognized'),
  IssuedBy: uri('entity', 'issued-by'),
  OwnershipChain: uri('entity', 'ownership-chain'),
};
