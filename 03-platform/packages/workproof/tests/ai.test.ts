import { describe, it, expect } from 'vitest';

import {
  AIPredicateValidationSchema,
  ValidationAgentRoleSchema,
  WorkProofAIValidationResultSchema,
} from '../src/ai/schemas';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validAgent = {
  agentId: 'agent-001',
  model: 'gpt-4-turbo',
  role: 'primary_validator' as const,
  confidence: 0.92,
  processingMs: 350,
};

const validPredicateValidation = {
  predicateType: 'IdentityVerified' as const,
  validationModels: ['gpt-4-turbo'],
  anomalyScore: 0.05,
  consistencyScore: 0.98,
  evidenceQuality: 0.9,
  humanReviewRequired: false,
  validationExplanation: 'All identity checks passed with high confidence.',
  validatedAt: 1704067200000,
};

const validResult = {
  workProofId: 'wp-001',
  overallAnomalyScore: 0.1,
  overallConfidence: 0.95,
  predicateValidations: [validPredicateValidation],
  agents: [validAgent],
  humanReviewRequired: false,
  flaggedReasons: [],
  validatedAt: 1704067200000,
};

// ---------------------------------------------------------------------------
// WorkProofAIValidationResultSchema
// ---------------------------------------------------------------------------

describe('WorkProofAIValidationResultSchema', () => {
  it('accepts a full valid result and checks parsed fields', () => {
    const result = WorkProofAIValidationResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.workProofId).toBe('wp-001');
      expect(result.data.overallAnomalyScore).toBe(0.1);
      expect(result.data.overallConfidence).toBe(0.95);
      expect(result.data.predicateValidations).toHaveLength(1);
      expect(result.data.agents).toHaveLength(1);
      expect(result.data.humanReviewRequired).toBe(false);
      expect(result.data.flaggedReasons).toEqual([]);
      expect(result.data.validatedAt).toBe(1704067200000);
    }
  });

  it('accepts overallAnomalyScore at 0', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallAnomalyScore: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.overallAnomalyScore).toBe(0);
  });

  it('accepts overallAnomalyScore at 1', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallAnomalyScore: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.overallAnomalyScore).toBe(1);
  });

  it('rejects overallAnomalyScore > 1', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallAnomalyScore: 1.01,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_big');
  });

  it('rejects overallAnomalyScore < 0', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallAnomalyScore: -0.01,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });

  it('accepts overallConfidence at 0', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallConfidence: 0,
    });
    expect(result.success).toBe(true);
  });

  it('accepts overallConfidence at 1', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallConfidence: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects overallConfidence > 1', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallConfidence: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects overallConfidence < 0', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({
      ...validResult,
      overallConfidence: -0.1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty agents array (min 1)', () => {
    const result = WorkProofAIValidationResultSchema.safeParse({ ...validResult, agents: [] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });
});

// ---------------------------------------------------------------------------
// ValidationAgentRoleSchema
// ---------------------------------------------------------------------------

describe('ValidationAgentRoleSchema', () => {
  const ALL_ROLES = [
    'primary_validator',
    'anomaly_detector',
    'consistency_checker',
    'fraud_scorer',
    'satellite_correlator',
  ] as const;

  it.each(ALL_ROLES)('accepts agent role "%s"', (role) => {
    const result = ValidationAgentRoleSchema.safeParse(role);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(role);
  });

  it('rejects an invalid agent role', () => {
    const result = ValidationAgentRoleSchema.safeParse('hacker');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AIPredicateValidationSchema
// ---------------------------------------------------------------------------

describe('AIPredicateValidationSchema', () => {
  it('accepts a valid predicate validation and checks parsed fields', () => {
    const result = AIPredicateValidationSchema.safeParse(validPredicateValidation);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.predicateType).toBe('IdentityVerified');
      expect(result.data.validationModels).toEqual(['gpt-4-turbo']);
      expect(result.data.anomalyScore).toBe(0.05);
      expect(result.data.consistencyScore).toBe(0.98);
      expect(result.data.evidenceQuality).toBe(0.9);
      expect(result.data.humanReviewRequired).toBe(false);
      expect(result.data.validationExplanation).toBe(
        'All identity checks passed with high confidence.'
      );
      expect(result.data.validatedAt).toBe(1704067200000);
    }
  });

  it('rejects anomalyScore > 1 in predicate validation', () => {
    const result = AIPredicateValidationSchema.safeParse({
      ...validPredicateValidation,
      anomalyScore: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects anomalyScore < 0 in predicate validation', () => {
    const result = AIPredicateValidationSchema.safeParse({
      ...validPredicateValidation,
      anomalyScore: -0.1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts boundary scores at 0 and 1', () => {
    const data = {
      ...validPredicateValidation,
      anomalyScore: 0,
      consistencyScore: 1,
      evidenceQuality: 0,
    };
    const result = AIPredicateValidationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('rejects empty validationModels array', () => {
    const result = AIPredicateValidationSchema.safeParse({
      ...validPredicateValidation,
      validationModels: [],
    });
    expect(result.success).toBe(false);
  });
});
