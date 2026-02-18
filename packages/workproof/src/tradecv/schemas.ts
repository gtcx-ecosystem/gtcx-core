// ============================================================================
// TRADECV SCHEMAS
// Zod schemas for TradeCV aggregation model
// ============================================================================

import { z } from 'zod';

/**
 * Mirrors ComplianceTier from @gtcx/types/protocols/gci — keep in sync.
 * Defined locally because @gtcx/types has no Zod dependency.
 */
export const ComplianceTierSchema = z.enum([
  'platinum',
  'gold',
  'silver',
  'bronze',
  'pending',
  'blocked',
]);

export const GCITrendSchema = z.enum(['improving', 'stable', 'declining']);

export const TradeCVAffiliationSchema = z.object({
  type: z.enum(['cooperative', 'association', 'union', 'other']),
  id: z.string().min(1),
  role: z.string().min(1),
  since: z.string().min(1),
});

export const TradeCVProfileSchema = z.object({
  tradepassId: z.string().min(1),
  displayName: z.string().min(1),
  displayNameLocalized: z.record(z.string()).optional(),
  memberSince: z.string().min(1),
  tenureMonths: z.number().int().nonnegative(),
  commodityPrimary: z.string().min(1),
  rolePrimary: z.string().min(1),
  employerDID: z.string().optional(),
  affiliations: z.array(TradeCVAffiliationSchema),
});

export const ProductionStatsSchema = z.object({
  totalProofs: z.number().int().nonnegative(),
  totalValueUSD: z.number().nonnegative().optional(),
  commodityBreakdown: z.record(z.number().nonnegative()),
  averageQualityScore: z.number().min(0).max(1),
  consistencyScore: z.number().min(0).max(1),
  lastProductionDate: z.string().optional(),
});

export const FinancialStatsSchema = z.object({
  totalPaymentsVerified: z.number().int().nonnegative(),
  totalAmountUSD: z.number().nonnegative().optional(),
  loansReceived: z.number().int().nonnegative(),
  loansRepaid: z.number().int().nonnegative(),
  repaymentRate: z.number().min(0).max(1),
  currentCreditLimit: z.number().nonnegative().optional(),
  savingsBalance: z.number().nonnegative().optional(),
});

export const LearningStatsSchema = z.object({
  modulesCompleted: z.number().int().nonnegative(),
  certificationsEarned: z.number().int().nonnegative(),
  skillsVerified: z.array(z.string()),
  trainingHours: z.number().nonnegative(),
  mentorshipsProvided: z.number().int().nonnegative(),
});

export const CommunityStatsSchema = z.object({
  peerEndorsements: z.number().int().nonnegative(),
  elderAttestations: z.number().int().nonnegative(),
  cooperativeMemberships: z.array(z.string()),
  contributionScore: z.number().min(0).max(100),
  mentorshipHours: z.number().nonnegative(),
});

export const TradeCVSummarySchema = z.object({
  gciScore: z.number().min(0).max(100),
  gciTier: ComplianceTierSchema,
  gciTrend: GCITrendSchema,
  production: ProductionStatsSchema,
  financial: FinancialStatsSchema,
  learning: LearningStatsSchema,
  community: CommunityStatsSchema,
});

export const CareerTrajectorySchema = z.enum([
  'ascending',
  'stable',
  'declining',
  'insufficient_data',
]);

export const RiskProfileSchema = z.enum(['low', 'medium', 'high', 'unknown']);

export const NetworkPositionSchema = z.enum([
  'central',
  'peripheral',
  'isolated',
  'emerging_leader',
]);

export const TradeCVDerivedMetricsSchema = z.object({
  reliabilityScore: z.number().min(0).max(100),
  careerTrajectory: CareerTrajectorySchema,
  riskProfile: RiskProfileSchema,
  networkPosition: NetworkPositionSchema,
  aiConfidence: z.number().min(0).max(1),
});

export const TradeCVPredictionsSchema = z.object({
  defaultProbability30d: z.number().min(0).max(1),
  defaultProbability90d: z.number().min(0).max(1),
  expectedProductionValue30d: z.number().nonnegative().optional(),
  gciTrend: GCITrendSchema,
  promotionReadiness: z.number().min(0).max(1),
});

export const TradeCVVisualRepresentationSchema = z.object({
  iconSummaryUri: z.string().optional(),
  audioNarrationUris: z.record(z.string()).optional(),
  colorCode: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be hex color'),
  tierBadge: ComplianceTierSchema,
});

export const TradeCVSchema = z.object({
  tradeCVId: z.string().min(1),
  version: z.literal('2.1'),
  holder: z.string().min(1),
  generatedAt: z.number().int().positive(),
  profile: TradeCVProfileSchema,
  summary: TradeCVSummarySchema,
  derivedMetrics: TradeCVDerivedMetricsSchema,
  predictions: TradeCVPredictionsSchema,
  visual: TradeCVVisualRepresentationSchema,
  workProofCount: z.number().int().nonnegative(),
  lastWorkProofDate: z.string().optional(),
  signature: z.string().optional(),
});
