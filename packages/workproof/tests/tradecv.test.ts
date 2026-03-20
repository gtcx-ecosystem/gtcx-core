import { describe, it, expect } from 'vitest';

import {
  TradeCVSchema,
  TradeCVProfileSchema,
  TradeCVSummarySchema,
  TradeCVDerivedMetricsSchema,
  TradeCVPredictionsSchema,
  TradeCVVisualRepresentationSchema,
  ComplianceTierSchema,
  GCITrendSchema,
  CareerTrajectorySchema,
  RiskProfileSchema,
  NetworkPositionSchema,
  ProductionStatsSchema,
  FinancialStatsSchema,
} from '../src/tradecv/schemas';

// ---------------------------------------------------------------------------
// Shared fixture
// ---------------------------------------------------------------------------

const validTradeCV = {
  tradeCVId: 'tcv-001',
  version: '2.1' as const,
  holder: 'did:gtcx:holder-001',
  generatedAt: 1704067200000,
  profile: {
    tradepassId: 'tp-001',
    displayName: 'Amani K.',
    memberSince: '2023-01-01',
    tenureMonths: 24,
    commodityPrimary: 'cobalt',
    rolePrimary: 'miner',
    affiliations: [
      {
        type: 'cooperative' as const,
        id: 'coop-001',
        role: 'member',
        since: '2023-06-01',
      },
    ],
  },
  summary: {
    gciScore: 78,
    gciTier: 'gold' as const,
    gciTrend: 'improving' as const,
    production: {
      totalProofs: 10,
      commodityBreakdown: { cobalt: 10 },
      averageQualityScore: 0.85,
      consistencyScore: 0.9,
    },
    financial: {
      totalPaymentsVerified: 5,
      loansReceived: 1,
      loansRepaid: 1,
      repaymentRate: 1.0,
    },
    learning: {
      modulesCompleted: 3,
      certificationsEarned: 1,
      skillsVerified: ['sorting', 'grading'],
      trainingHours: 20,
      mentorshipsProvided: 0,
    },
    community: {
      peerEndorsements: 4,
      elderAttestations: 1,
      cooperativeMemberships: ['coop-001'],
      contributionScore: 60,
      mentorshipHours: 0,
    },
  },
  derivedMetrics: {
    reliabilityScore: 85,
    careerTrajectory: 'ascending' as const,
    riskProfile: 'low' as const,
    networkPosition: 'central' as const,
    aiConfidence: 0.92,
  },
  predictions: {
    defaultProbability30d: 0.02,
    defaultProbability90d: 0.05,
    gciTrend: 'improving' as const,
    promotionReadiness: 0.7,
  },
  visual: {
    colorCode: '#22c55e',
    tierBadge: 'gold' as const,
  },
  workProofCount: 10,
};

// ---------------------------------------------------------------------------
// TradeCVSchema — full document
// ---------------------------------------------------------------------------

describe('TradeCVSchema', () => {
  it('accepts a full valid TradeCV and checks key parsed fields', () => {
    const result = TradeCVSchema.safeParse(validTradeCV);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tradeCVId).toBe('tcv-001');
      expect(result.data.version).toBe('2.1');
      expect(result.data.holder).toBe('did:gtcx:holder-001');
      expect(result.data.generatedAt).toBe(1704067200000);
      expect(result.data.workProofCount).toBe(10);
      expect(result.data.profile.tradepassId).toBe('tp-001');
      expect(result.data.summary.gciScore).toBe(78);
      expect(result.data.derivedMetrics.reliabilityScore).toBe(85);
      expect(result.data.predictions.defaultProbability30d).toBe(0.02);
      expect(result.data.visual.colorCode).toBe('#22c55e');
    }
  });

  it('rejects version other than "2.1"', () => {
    const result = TradeCVSchema.safeParse({ ...validTradeCV, version: '1.0' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('invalid_literal');
  });

  it('rejects version "2.0"', () => {
    const result = TradeCVSchema.safeParse({ ...validTradeCV, version: '2.0' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ComplianceTierSchema
// ---------------------------------------------------------------------------

describe('ComplianceTierSchema', () => {
  const allTiers = ['platinum', 'gold', 'silver', 'bronze', 'pending', 'blocked'] as const;

  it.each(allTiers)('accepts compliance tier "%s"', (tier) => {
    const result = ComplianceTierSchema.safeParse(tier);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(tier);
  });

  it('rejects invalid tier', () => {
    const result = ComplianceTierSchema.safeParse('diamond');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GCITrendSchema
// ---------------------------------------------------------------------------

describe('GCITrendSchema', () => {
  it.each(['improving', 'stable', 'declining'] as const)('accepts GCI trend "%s"', (trend) => {
    const result = GCITrendSchema.safeParse(trend);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(trend);
  });

  it('rejects invalid trend', () => {
    expect(GCITrendSchema.safeParse('skyrocketing').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TradeCVSummarySchema — gciScore bounds
// ---------------------------------------------------------------------------

describe('TradeCVSummarySchema', () => {
  it('accepts gciScore at 0', () => {
    const summary = { ...validTradeCV.summary, gciScore: 0 };
    const result = TradeCVSummarySchema.safeParse(summary);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.gciScore).toBe(0);
  });

  it('accepts gciScore at 100', () => {
    const summary = { ...validTradeCV.summary, gciScore: 100 };
    const result = TradeCVSummarySchema.safeParse(summary);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.gciScore).toBe(100);
  });

  it('rejects gciScore > 100', () => {
    const result = TradeCVSummarySchema.safeParse({ ...validTradeCV.summary, gciScore: 101 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_big');
  });

  it('rejects gciScore < 0', () => {
    const result = TradeCVSummarySchema.safeParse({ ...validTradeCV.summary, gciScore: -1 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });
});

// ---------------------------------------------------------------------------
// ProductionStatsSchema — commodityBreakdown nonnegative
// ---------------------------------------------------------------------------

describe('ProductionStatsSchema', () => {
  it('rejects negative value in commodityBreakdown', () => {
    const result = ProductionStatsSchema.safeParse({
      ...validTradeCV.summary.production,
      commodityBreakdown: { cobalt: -5 },
    });
    expect(result.success).toBe(false);
  });

  it('accepts zero in commodityBreakdown', () => {
    const result = ProductionStatsSchema.safeParse({
      ...validTradeCV.summary.production,
      commodityBreakdown: { cobalt: 0 },
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// FinancialStatsSchema — repaymentRate bounds
// ---------------------------------------------------------------------------

describe('FinancialStatsSchema', () => {
  it('accepts repaymentRate at 0', () => {
    const result = FinancialStatsSchema.safeParse({
      ...validTradeCV.summary.financial,
      repaymentRate: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.repaymentRate).toBe(0);
  });

  it('accepts repaymentRate at 1', () => {
    const result = FinancialStatsSchema.safeParse({
      ...validTradeCV.summary.financial,
      repaymentRate: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects repaymentRate > 1', () => {
    const result = FinancialStatsSchema.safeParse({
      ...validTradeCV.summary.financial,
      repaymentRate: 1.01,
    });
    expect(result.success).toBe(false);
  });

  it('rejects repaymentRate < 0', () => {
    const result = FinancialStatsSchema.safeParse({
      ...validTradeCV.summary.financial,
      repaymentRate: -0.1,
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CareerTrajectorySchema, RiskProfileSchema, NetworkPositionSchema
// ---------------------------------------------------------------------------

describe('CareerTrajectorySchema', () => {
  it.each(['ascending', 'stable', 'declining', 'insufficient_data'] as const)(
    'accepts career trajectory "%s"',
    (val) => {
      const result = CareerTrajectorySchema.safeParse(val);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(val);
    }
  );

  it('rejects invalid career trajectory', () => {
    expect(CareerTrajectorySchema.safeParse('meteoric').success).toBe(false);
  });
});

describe('RiskProfileSchema', () => {
  it.each(['low', 'medium', 'high', 'unknown'] as const)('accepts risk profile "%s"', (val) => {
    const result = RiskProfileSchema.safeParse(val);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(val);
  });

  it('rejects invalid risk profile', () => {
    expect(RiskProfileSchema.safeParse('extreme').success).toBe(false);
  });
});

describe('NetworkPositionSchema', () => {
  it.each(['central', 'peripheral', 'isolated', 'emerging_leader'] as const)(
    'accepts network position "%s"',
    (val) => {
      const result = NetworkPositionSchema.safeParse(val);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(val);
    }
  );

  it('rejects invalid network position', () => {
    expect(NetworkPositionSchema.safeParse('disconnected').success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TradeCVVisualRepresentationSchema — colorCode
// ---------------------------------------------------------------------------

describe('TradeCVVisualRepresentationSchema', () => {
  it('accepts valid hex colorCode', () => {
    const result = TradeCVVisualRepresentationSchema.safeParse({
      colorCode: '#ff00aa',
      tierBadge: 'silver',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.colorCode).toBe('#ff00aa');
  });

  it('rejects invalid colorCode format (no hash)', () => {
    const result = TradeCVVisualRepresentationSchema.safeParse({
      colorCode: 'ff00aa',
      tierBadge: 'silver',
    });
    expect(result.success).toBe(false);
  });

  it('rejects color name instead of hex', () => {
    const result = TradeCVVisualRepresentationSchema.safeParse({
      colorCode: 'red',
      tierBadge: 'silver',
    });
    expect(result.success).toBe(false);
  });

  it('rejects 3-char hex shorthand', () => {
    const result = TradeCVVisualRepresentationSchema.safeParse({
      colorCode: '#f0a',
      tierBadge: 'silver',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TradeCVPredictionsSchema — probability bounds
// ---------------------------------------------------------------------------

describe('TradeCVPredictionsSchema', () => {
  it('rejects defaultProbability30d > 1', () => {
    const result = TradeCVPredictionsSchema.safeParse({
      ...validTradeCV.predictions,
      defaultProbability30d: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects defaultProbability90d > 1', () => {
    const result = TradeCVPredictionsSchema.safeParse({
      ...validTradeCV.predictions,
      defaultProbability90d: 1.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects promotionReadiness > 1', () => {
    const result = TradeCVPredictionsSchema.safeParse({
      ...validTradeCV.predictions,
      promotionReadiness: 1.01,
    });
    expect(result.success).toBe(false);
  });

  it('accepts all probabilities at 0', () => {
    const data = {
      ...validTradeCV.predictions,
      defaultProbability30d: 0,
      defaultProbability90d: 0,
      promotionReadiness: 0,
    };
    const result = TradeCVPredictionsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TradeCVProfileSchema
// ---------------------------------------------------------------------------

describe('TradeCVProfileSchema', () => {
  it('accepts tenureMonths at 0 (nonnegative)', () => {
    const result = TradeCVProfileSchema.safeParse({ ...validTradeCV.profile, tenureMonths: 0 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tenureMonths).toBe(0);
  });

  it('rejects negative tenureMonths', () => {
    const result = TradeCVProfileSchema.safeParse({ ...validTradeCV.profile, tenureMonths: -1 });
    expect(result.success).toBe(false);
  });

  it('checks affiliations array structure', () => {
    const result = TradeCVProfileSchema.safeParse(validTradeCV.profile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.affiliations).toHaveLength(1);
      expect(result.data.affiliations[0]!.type).toBe('cooperative');
      expect(result.data.affiliations[0]!.id).toBe('coop-001');
    }
  });

  it('accepts empty affiliations array', () => {
    const result = TradeCVProfileSchema.safeParse({ ...validTradeCV.profile, affiliations: [] });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TradeCVDerivedMetricsSchema
// ---------------------------------------------------------------------------

describe('TradeCVDerivedMetricsSchema', () => {
  it('rejects reliabilityScore > 100', () => {
    const result = TradeCVDerivedMetricsSchema.safeParse({
      ...validTradeCV.derivedMetrics,
      reliabilityScore: 101,
    });
    expect(result.success).toBe(false);
  });

  it('rejects reliabilityScore < 0', () => {
    const result = TradeCVDerivedMetricsSchema.safeParse({
      ...validTradeCV.derivedMetrics,
      reliabilityScore: -1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts reliabilityScore at boundary 0', () => {
    const result = TradeCVDerivedMetricsSchema.safeParse({
      ...validTradeCV.derivedMetrics,
      reliabilityScore: 0,
    });
    expect(result.success).toBe(true);
  });

  it('accepts reliabilityScore at boundary 100', () => {
    const result = TradeCVDerivedMetricsSchema.safeParse({
      ...validTradeCV.derivedMetrics,
      reliabilityScore: 100,
    });
    expect(result.success).toBe(true);
  });
});
