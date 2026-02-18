// ============================================================================
// AI VALIDATION TYPES
// Types for AI-native WorkProof validation layer (spec §4)
// ============================================================================

import type { WorkProofPredicateType } from '../predicates/types';

/** AI validation result for a single predicate */
export interface AIPredicateValidation {
  predicateType: WorkProofPredicateType;
  validationModels: string[];
  anomalyScore: number; // 0-1, higher = more anomalous
  consistencyScore: number; // 0-1, cross-reference consistency
  evidenceQuality: number; // 0-1, aggregated from AIQualityAssessment
  humanReviewRequired: boolean;
  validationExplanation: string;
  validatedAt: number; // unix ms
}

/** Role of a validation agent in the ensemble */
export type ValidationAgentRole =
  | 'primary_validator'
  | 'anomaly_detector'
  | 'consistency_checker'
  | 'fraud_scorer'
  | 'satellite_correlator';

/** Individual validation agent contribution */
export interface ValidationAgent {
  agentId: string;
  model: string;
  role: ValidationAgentRole;
  confidence: number; // 0-1
  processingMs: number;
}

/** Complete AI validation result for a WorkProof */
export interface WorkProofAIValidationResult {
  workProofId: string;
  overallAnomalyScore: number; // 0-1
  overallConfidence: number; // 0-1
  predicateValidations: AIPredicateValidation[];
  agents: ValidationAgent[];
  humanReviewRequired: boolean;
  flaggedReasons: string[];
  validatedAt: number; // unix ms
}
