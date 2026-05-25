// ============================================================================
// PREDICATE TYPES
// Full predicate taxonomy for WorkProof v2.2
// 9 categories, 47 predicate types, 7 value variants
// ============================================================================

// ─── Category-Grouped Predicate Types ─────────────────────────────────────────

export type IdentityPredicateType =
  | 'IdentityVerified'
  | 'RoleHeld'
  | 'EmploymentActive'
  | 'TenureAchieved'
  | 'CommunityMembership';

export type ProductionPredicateType =
  | 'CommodityProduced'
  | 'QuantityVerified'
  | 'QualityGraded'
  | 'OriginAuthenticated'
  | 'MethodCompliant';

export type LocationPredicateType =
  | 'SiteVerified'
  | 'GeofenceCompliant'
  | 'LocationConsistent'
  | 'EnvironmentalCompliance';

export type CompliancePredicateType =
  | 'InspectionPassed'
  | 'StandardMet'
  | 'GCIScoreRecorded'
  | 'ViolationFree'
  | 'LicenseValid';

export type FinancialPredicateType =
  | 'PaymentReceived'
  | 'LoanDisbursed'
  | 'RepaymentCompleted'
  | 'SavingsDeposited'
  | 'TaxWithheld';

export type LearningPredicateType =
  | 'ModuleCompleted'
  | 'AssessmentPassed'
  | 'CertificationEarned'
  | 'SkillDemonstrated'
  | 'MentorshipProvided';

export type PerformancePredicateType =
  | 'ConsistencyMaintained'
  | 'QualityThresholdMet'
  | 'ProductivityTarget'
  | 'ReliabilityScore';

export type CommunityPredicateType =
  | 'PeerEndorsement'
  | 'ElderAttestation'
  | 'CooperativeMembership'
  | 'CommunityContribution'
  | 'MentorshipReceived';

export type EntityPredicateType =
  | 'EntityRegistered'
  | 'SanctionsCleared'
  | 'PepCleared'
  | 'AdverseMediaCleared'
  | 'BeneficialOwnershipDisclosed'
  | 'AccreditationHeld'
  | 'EntityRecognized'
  | 'IssuedBy'
  | 'OwnershipChain';

/** Union of all 47 WorkProof predicate types */
export type WorkProofPredicateType =
  | IdentityPredicateType
  | ProductionPredicateType
  | LocationPredicateType
  | CompliancePredicateType
  | FinancialPredicateType
  | LearningPredicateType
  | PerformancePredicateType
  | CommunityPredicateType
  | EntityPredicateType;

// ─── Predicate Value Variants (discriminated by 'kind') ───────────────────────

export interface BooleanValue {
  kind: 'boolean';
  value: boolean;
}

export interface NumericValue {
  kind: 'numeric';
  value: number;
  unit?: string;
  precision?: number;
  verificationMethod?: 'measured' | 'calculated' | 'attested' | 'ai_estimated';
}

export interface RangeValue {
  kind: 'range';
  min: number;
  max: number;
  unit?: string;
}

export interface EnumValue {
  kind: 'enum';
  value: string;
  allowedValues: string[];
}

export interface HashValue {
  kind: 'hash';
  algorithm: 'sha256' | 'sha512' | 'keccak256';
  value: string;
}

export interface LocalizedValue {
  kind: 'localized';
  value: Record<string, string>;
  defaultLocale: string;
}

export interface CompositeValue {
  kind: 'composite';
  components: Record<string, PredicateValue>;
}

/** Discriminated union of all predicate value types */
export type PredicateValue =
  | BooleanValue
  | NumericValue
  | RangeValue
  | EnumValue
  | HashValue
  | LocalizedValue
  | CompositeValue;

// ─── Predicate Category Metadata ──────────────────────────────────────────────

/** Predicate category for grouping and querying */
export type PredicateCategory =
  | 'Identity'
  | 'Production'
  | 'Location'
  | 'Compliance'
  | 'Financial'
  | 'Learning'
  | 'Performance'
  | 'Community'
  | 'Entity';

/** Maps each predicate type to its category */
export const PREDICATE_CATEGORIES: Record<WorkProofPredicateType, PredicateCategory> = {
  IdentityVerified: 'Identity',
  RoleHeld: 'Identity',
  EmploymentActive: 'Identity',
  TenureAchieved: 'Identity',
  CommunityMembership: 'Identity',
  CommodityProduced: 'Production',
  QuantityVerified: 'Production',
  QualityGraded: 'Production',
  OriginAuthenticated: 'Production',
  MethodCompliant: 'Production',
  SiteVerified: 'Location',
  GeofenceCompliant: 'Location',
  LocationConsistent: 'Location',
  EnvironmentalCompliance: 'Location',
  InspectionPassed: 'Compliance',
  StandardMet: 'Compliance',
  GCIScoreRecorded: 'Compliance',
  ViolationFree: 'Compliance',
  LicenseValid: 'Compliance',
  PaymentReceived: 'Financial',
  LoanDisbursed: 'Financial',
  RepaymentCompleted: 'Financial',
  SavingsDeposited: 'Financial',
  TaxWithheld: 'Financial',
  ModuleCompleted: 'Learning',
  AssessmentPassed: 'Learning',
  CertificationEarned: 'Learning',
  SkillDemonstrated: 'Learning',
  MentorshipProvided: 'Learning',
  ConsistencyMaintained: 'Performance',
  QualityThresholdMet: 'Performance',
  ProductivityTarget: 'Performance',
  ReliabilityScore: 'Performance',
  PeerEndorsement: 'Community',
  ElderAttestation: 'Community',
  CooperativeMembership: 'Community',
  CommunityContribution: 'Community',
  MentorshipReceived: 'Community',
  EntityRegistered: 'Entity',
  SanctionsCleared: 'Entity',
  PepCleared: 'Entity',
  AdverseMediaCleared: 'Entity',
  BeneficialOwnershipDisclosed: 'Entity',
  AccreditationHeld: 'Entity',
  EntityRecognized: 'Entity',
  IssuedBy: 'Entity',
  OwnershipChain: 'Entity',
};
