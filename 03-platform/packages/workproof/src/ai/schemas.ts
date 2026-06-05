// ============================================================================
// AI VALIDATION SCHEMAS
// Zod schemas for AI validation types
// ============================================================================

import { z } from 'zod';

import { WorkProofPredicateTypeSchema } from '../predicates/schemas';

export const AIPredicateValidationSchema = z.object({
  predicateType: WorkProofPredicateTypeSchema,
  validationModels: z.array(z.string().min(1)).min(1),
  anomalyScore: z.number().min(0).max(1),
  consistencyScore: z.number().min(0).max(1),
  evidenceQuality: z.number().min(0).max(1),
  humanReviewRequired: z.boolean(),
  validationExplanation: z.string(),
  validatedAt: z.number().int().positive(),
});

export const ValidationAgentRoleSchema = z.enum([
  'primary_validator',
  'anomaly_detector',
  'consistency_checker',
  'fraud_scorer',
  'satellite_correlator',
]);

export const ValidationAgentSchema = z.object({
  agentId: z.string().min(1),
  model: z.string().min(1),
  role: ValidationAgentRoleSchema,
  confidence: z.number().min(0).max(1),
  processingMs: z.number().nonnegative(),
});

export const WorkProofAIValidationResultSchema = z.object({
  workProofId: z.string().min(1),
  overallAnomalyScore: z.number().min(0).max(1),
  overallConfidence: z.number().min(0).max(1),
  predicateValidations: z.array(AIPredicateValidationSchema),
  agents: z.array(ValidationAgentSchema).min(1),
  humanReviewRequired: z.boolean(),
  flaggedReasons: z.array(z.string()),
  validatedAt: z.number().int().positive(),
});
