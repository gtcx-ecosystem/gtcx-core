// ============================================================================
// TRADECV TYPES
// Aggregated professional identity model (spec §7)
// ============================================================================

import type { ComplianceTier } from '@gtcx/types';

/** Producer profile within a TradeCV */
export interface TradeCVProfile {
  tradepassId: string; // DID of the holder
  displayName: string;
  displayNameLocalized?: Record<string, string>;
  memberSince: string; // ISO date
  tenureMonths: number;
  commodityPrimary: string;
  rolePrimary: string;
  employerDID?: string;
  affiliations: TradeCVAffiliation[];
}

export interface TradeCVAffiliation {
  type: 'cooperative' | 'association' | 'union' | 'other';
  id: string; // DID
  role: string;
  since: string; // ISO date
}

/** Production statistics */
export interface ProductionStats {
  totalProofs: number;
  totalValueUSD?: number;
  commodityBreakdown: Record<string, number>;
  averageQualityScore: number; // 0-1
  consistencyScore: number; // 0-1
  lastProductionDate?: string;
}

/** Financial statistics */
export interface FinancialStats {
  totalPaymentsVerified: number;
  totalAmountUSD?: number;
  loansReceived: number;
  loansRepaid: number;
  repaymentRate: number; // 0-1
  currentCreditLimit?: number;
  savingsBalance?: number;
}

/** Learning statistics */
export interface LearningStats {
  modulesCompleted: number;
  certificationsEarned: number;
  skillsVerified: string[];
  trainingHours: number;
  mentorshipsProvided: number;
}

/** Community statistics */
export interface CommunityStats {
  peerEndorsements: number;
  elderAttestations: number;
  cooperativeMemberships: string[];
  contributionScore: number; // 0-100
  mentorshipHours: number;
}

/** Aggregated summary */
export interface TradeCVSummary {
  gciScore: number; // 0-100
  gciTier: ComplianceTier;
  gciTrend: 'improving' | 'stable' | 'declining';
  production: ProductionStats;
  financial: FinancialStats;
  learning: LearningStats;
  community: CommunityStats;
}

/** AI-derived metrics */
export interface TradeCVDerivedMetrics {
  reliabilityScore: number; // 0-100
  careerTrajectory: 'ascending' | 'stable' | 'declining' | 'insufficient_data';
  riskProfile: 'low' | 'medium' | 'high' | 'unknown';
  networkPosition: 'central' | 'peripheral' | 'isolated' | 'emerging_leader';
  aiConfidence: number; // 0-1
}

/** Forward-looking predictions */
export interface TradeCVPredictions {
  defaultProbability30d: number; // 0-1
  defaultProbability90d: number; // 0-1
  expectedProductionValue30d?: number;
  gciTrend: 'improving' | 'stable' | 'declining';
  promotionReadiness: number; // 0-1
}

/** Visual representation for low-literacy access */
export interface TradeCVVisualRepresentation {
  iconSummaryUri?: string;
  audioNarrationUris?: Record<string, string>;
  colorCode: string; // hex color
  tierBadge: ComplianceTier;
}

/** The complete TradeCV aggregation */
export interface TradeCV {
  tradeCVId: string;
  version: '2.1';
  holder: string; // DID
  generatedAt: number; // unix ms
  profile: TradeCVProfile;
  summary: TradeCVSummary;
  derivedMetrics: TradeCVDerivedMetrics;
  predictions: TradeCVPredictions;
  visual: TradeCVVisualRepresentation;
  workProofCount: number;
  lastWorkProofDate?: string;
  signature?: string;
}
