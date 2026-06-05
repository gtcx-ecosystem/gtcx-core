/**
 * Predicate Registry
 *
 * Aggregates WorkProof predicate definitions from category modules.
 * Currently 57 predicates across 10 categories. To add a predicate, define
 * it in the appropriate category file under `definitions/` and re-export
 * it here.
 */

import type { PredicateDefinition } from '@gtcx/verification';

import {
  PeerEndorsement,
  ElderAttestation,
  CooperativeMembership,
  CommunityContribution,
  MentorshipReceived,
} from './definitions/community';
import {
  InspectionPassed,
  StandardMet,
  GCIScoreRecorded,
  ViolationFree,
  LicenseValid,
} from './definitions/compliance';
import {
  MiningLicenseValid,
  GoldBuyingLicenseValid,
  CooperativeRegistered,
  Traceability3tTagged,
  RegionalCertificationIcglrRcm,
  RegionalProtocolSignatory,
  PricePreciousMetalFix,
  ConflictZoneCleared,
  OriginSatelliteVerified,
  PhysicalSealAttested,
} from './definitions/continental';
import {
  EntityRegistered,
  SanctionsCleared,
  PepCleared,
  AdverseMediaCleared,
  BeneficialOwnershipDisclosed,
  AccreditationHeld,
  EntityRecognized,
  IssuedBy,
  OwnershipChain,
} from './definitions/entity';
import {
  PaymentReceived,
  LoanDisbursed,
  RepaymentCompleted,
  SavingsDeposited,
  TaxWithheld,
} from './definitions/financial';
import {
  IdentityVerified,
  RoleHeld,
  EmploymentActive,
  TenureAchieved,
  CommunityMembership,
} from './definitions/identity';
import {
  ModuleCompleted,
  AssessmentPassed,
  CertificationEarned,
  SkillDemonstrated,
  MentorshipProvided,
} from './definitions/learning';
import {
  SiteVerified,
  GeofenceCompliant,
  LocationConsistent,
  EnvironmentalCompliance,
} from './definitions/location';
import {
  ConsistencyMaintained,
  QualityThresholdMet,
  ProductivityTarget,
  ReliabilityScore,
} from './definitions/performance';
import {
  CommodityProduced,
  QuantityVerified,
  QualityGraded,
  OriginAuthenticated,
  MethodCompliant,
} from './definitions/production';
import type { WorkProofPredicateType } from './types';

export { WORKPROOF_PREDICATE_URIS } from './uri';

/** Full predicate definitions for all 57 WorkProof predicate types */
export const WORKPROOF_PREDICATES: Record<WorkProofPredicateType, PredicateDefinition> = {
  IdentityVerified,
  RoleHeld,
  EmploymentActive,
  TenureAchieved,
  CommunityMembership,
  CommodityProduced,
  QuantityVerified,
  QualityGraded,
  OriginAuthenticated,
  MethodCompliant,
  SiteVerified,
  GeofenceCompliant,
  LocationConsistent,
  EnvironmentalCompliance,
  InspectionPassed,
  StandardMet,
  GCIScoreRecorded,
  ViolationFree,
  LicenseValid,
  PaymentReceived,
  LoanDisbursed,
  RepaymentCompleted,
  SavingsDeposited,
  TaxWithheld,
  ModuleCompleted,
  AssessmentPassed,
  CertificationEarned,
  SkillDemonstrated,
  MentorshipProvided,
  ConsistencyMaintained,
  QualityThresholdMet,
  ProductivityTarget,
  ReliabilityScore,
  PeerEndorsement,
  ElderAttestation,
  CooperativeMembership,
  CommunityContribution,
  MentorshipReceived,
  EntityRegistered,
  SanctionsCleared,
  PepCleared,
  AdverseMediaCleared,
  BeneficialOwnershipDisclosed,
  AccreditationHeld,
  EntityRecognized,
  IssuedBy,
  OwnershipChain,
  MiningLicenseValid,
  GoldBuyingLicenseValid,
  CooperativeRegistered,
  Traceability3tTagged,
  RegionalCertificationIcglrRcm,
  RegionalProtocolSignatory,
  PricePreciousMetalFix,
  ConflictZoneCleared,
  OriginSatelliteVerified,
  PhysicalSealAttested,
};
