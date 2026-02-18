// ============================================================================
// PREDICATE SCHEMAS
// Zod schemas for the 40 WorkProof predicate types and 7 value variants
// ============================================================================

import { z } from 'zod';

// ─── Predicate Type Enum ──────────────────────────────────────────────────────

/** All 40 WorkProof predicate type keys */
export const WorkProofPredicateTypeSchema = z.enum([
  // Identity (5)
  'IdentityVerified',
  'RoleHeld',
  'EmploymentActive',
  'TenureAchieved',
  'CommunityMembership',
  // Production (5)
  'CommodityProduced',
  'QuantityVerified',
  'QualityGraded',
  'OriginAuthenticated',
  'MethodCompliant',
  // Location (4)
  'SiteVerified',
  'GeofenceCompliant',
  'LocationConsistent',
  'EnvironmentalCompliance',
  // Compliance (5)
  'InspectionPassed',
  'StandardMet',
  'GCIScoreRecorded',
  'ViolationFree',
  'LicenseValid',
  // Financial (5)
  'PaymentReceived',
  'LoanDisbursed',
  'RepaymentCompleted',
  'SavingsDeposited',
  'TaxWithheld',
  // Learning (5)
  'ModuleCompleted',
  'AssessmentPassed',
  'CertificationEarned',
  'SkillDemonstrated',
  'MentorshipProvided',
  // Performance (4)
  'ConsistencyMaintained',
  'QualityThresholdMet',
  'ProductivityTarget',
  'ReliabilityScore',
  // Community (5)
  'PeerEndorsement',
  'ElderAttestation',
  'CooperativeMembership',
  'CommunityContribution',
  'MentorshipReceived',
]);

export const PredicateCategorySchema = z.enum([
  'Identity',
  'Production',
  'Location',
  'Compliance',
  'Financial',
  'Learning',
  'Performance',
  'Community',
]);

// ─── Predicate Value Schemas ──────────────────────────────────────────────────

export const VerificationMethodSchema = z.enum([
  'measured',
  'calculated',
  'attested',
  'ai_estimated',
]);

export const BooleanValueSchema = z.object({
  kind: z.literal('boolean'),
  value: z.boolean(),
});

export const NumericValueSchema = z.object({
  kind: z.literal('numeric'),
  value: z.number().finite(),
  unit: z.string().optional(),
  precision: z.number().int().nonnegative().optional(),
  verificationMethod: VerificationMethodSchema.optional(),
});

export const RangeValueSchema = z
  .object({
    kind: z.literal('range'),
    min: z.number().finite(),
    max: z.number().finite(),
    unit: z.string().optional(),
  })
  .refine((v) => v.min <= v.max, { message: 'min must be <= max' });

export const EnumValueSchema = z
  .object({
    kind: z.literal('enum'),
    value: z.string(),
    allowedValues: z.array(z.string()).min(1),
  })
  .refine((v) => v.allowedValues.includes(v.value), {
    message: 'value must be one of allowedValues',
  });

export const HashAlgorithmSchema = z.enum(['sha256', 'sha512', 'keccak256']);

export const HashValueSchema = z.object({
  kind: z.literal('hash'),
  algorithm: HashAlgorithmSchema,
  value: z.string().min(1),
});

export const LocalizedValueSchema = z
  .object({
    kind: z.literal('localized'),
    value: z.record(z.string()),
    defaultLocale: z.string().min(2),
  })
  .refine((v) => v.defaultLocale in v.value, {
    message: 'defaultLocale must exist in value map',
  });

// CompositeValue uses z.lazy for recursion
const BaseCompositeValueSchema = z.object({
  kind: z.literal('composite'),
  components: z
    .record(z.lazy((): z.ZodTypeAny => PredicateValueSchema))
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'components must have at least one entry',
    }),
});

/**
 * Discriminated union of all 7 predicate value types.
 * Uses z.union (not z.discriminatedUnion) because CompositeValue
 * contains a z.lazy() reference which is incompatible with discriminatedUnion.
 */
export const PredicateValueSchema: z.ZodType = z.union([
  BooleanValueSchema,
  NumericValueSchema,
  RangeValueSchema,
  EnumValueSchema,
  HashValueSchema,
  LocalizedValueSchema,
  BaseCompositeValueSchema,
]);
