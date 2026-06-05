// ============================================================================
// PROVENANCE SCHEMAS
// Zod schemas for runtime validation of AgenticProvenance types
// ============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const TrustLevelSchema = z.enum(['verified', 'tentative', 'uncertain', 'rejected']);

export const EvidenceRefSchema = z.object({
  evidenceId: z.string().min(1),
  evidenceType: z.string().min(1),
  source: z.string().min(1),
  timestamp: z.number().int().nonnegative(),
  relevanceScore: z.number().min(0).max(1),
  uri: z.string().optional(),
});

export const DecisionProvenanceSchema = z.object({
  decisionId: z.string().min(1),
  decisionType: z.string().min(1),
  timestamp: z.number().int().nonnegative(),
  actor: z.string().min(1),
  inputHash: z.string().min(1),
  outputHash: z.string().min(1),
  parentDecisionId: z.string().optional(),
});

export const MethodologyVersionSchema = z.object({
  framework: z.string().min(1),
  version: z.string().min(1),
  configurationHash: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Core envelope
// ---------------------------------------------------------------------------

export const AgenticProvenanceSchema = z.object({
  trustLevel: TrustLevelSchema,
  confidence: z.number().min(0).max(1),
  evidenceRefs: z.array(EvidenceRefSchema),
  methodologyVersion: MethodologyVersionSchema,
  requiresHumanReview: z.boolean(),
  decisionProvenance: DecisionProvenanceSchema,
  reviewedBy: z.string().optional(),
  reviewedAt: z.number().int().nonnegative().optional(),
});

// ---------------------------------------------------------------------------
// Policy schemas
// ---------------------------------------------------------------------------

export const ReviewThresholdConditionSchema = z.enum([
  'high_impact_compliance',
  'model_uncertainty',
  'stale_or_partial_evidence',
  'jurisdictional_edge_case',
]);

export const ReviewThresholdSchema = z.object({
  condition: ReviewThresholdConditionSchema,
  minConfidence: z.number().min(0).max(1),
  requiredReviewerRole: z.string().min(1),
  escalationLevel: z.enum(['none', 'review', 'approval', 'urgent']),
  description: z.string().optional(),
});

export const ProvenancePolicyActionSchema = z.enum(['allow', 'block', 'escalate', 'audit']);

export const ProvenancePolicySchema = z.object({
  thresholds: z.array(ReviewThresholdSchema),
  defaultAction: ProvenancePolicyActionSchema,
});

export const ProvenanceEvaluationSchema = z.object({
  action: ProvenancePolicyActionSchema,
  triggeredThresholds: z.array(ReviewThresholdSchema),
  reviewRequired: z.boolean(),
  explanation: z.string(),
});
