import { describe, it, expect } from 'vitest';

import {
  TrustLevelSchema,
  EvidenceRefSchema,
  DecisionProvenanceSchema,
  MethodologyVersionSchema,
  AgenticProvenanceSchema,
  ReviewThresholdSchema,
  ProvenancePolicySchema,
} from '../src/provenance';

describe('TrustLevelSchema', () => {
  it('accepts valid trust levels', () => {
    expect(TrustLevelSchema.safeParse('verified').success).toBe(true);
    expect(TrustLevelSchema.safeParse('tentative').success).toBe(true);
    expect(TrustLevelSchema.safeParse('uncertain').success).toBe(true);
    expect(TrustLevelSchema.safeParse('rejected').success).toBe(true);
  });

  it('rejects invalid trust levels', () => {
    expect(TrustLevelSchema.safeParse('full').success).toBe(false);
    expect(TrustLevelSchema.safeParse('').success).toBe(false);
  });
});

describe('EvidenceRefSchema', () => {
  it('accepts a valid evidence reference', () => {
    const result = EvidenceRefSchema.safeParse({
      evidenceId: 'ev-1',
      evidenceType: 'sensor',
      source: 'oracle-a',
      timestamp: Date.now(),
      relevanceScore: 0.85,
      uri: 'https://example.com/ev/1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects relevanceScore outside 0–1', () => {
    const result = EvidenceRefSchema.safeParse({
      evidenceId: 'ev-1',
      evidenceType: 'sensor',
      source: 'oracle-a',
      timestamp: Date.now(),
      relevanceScore: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

describe('AgenticProvenanceSchema', () => {
  it('accepts a complete valid record', () => {
    const result = AgenticProvenanceSchema.safeParse({
      trustLevel: 'verified',
      confidence: 0.92,
      evidenceRefs: [
        {
          evidenceId: 'ev-1',
          evidenceType: 'document',
          source: 'local-validator',
          timestamp: Date.now(),
          relevanceScore: 0.9,
        },
      ],
      methodologyVersion: {
        framework: 'cortex',
        version: '2.1.0',
        configurationHash: 'sha256:abc',
      },
      requiresHumanReview: false,
      decisionProvenance: {
        decisionId: 'd-1',
        decisionType: 'anomaly_detection',
        timestamp: Date.now(),
        actor: 'cortex-model-v2',
        inputHash: 'sha256:in',
        outputHash: 'sha256:out',
      },
      reviewedBy: 'alice',
      reviewedAt: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = AgenticProvenanceSchema.safeParse({
      trustLevel: 'verified',
      confidence: 0.5,
    });
    expect(result.success).toBe(false);
  });
});

describe('ReviewThresholdSchema', () => {
  it('accepts a valid threshold', () => {
    const result = ReviewThresholdSchema.safeParse({
      condition: 'high_impact_compliance',
      minConfidence: 0.9,
      requiredReviewerRole: 'compliance_officer',
      escalationLevel: 'approval',
      description: 'High-impact compliance decisions require approval.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid condition', () => {
    const result = ReviewThresholdSchema.safeParse({
      condition: 'invalid_condition',
      minConfidence: 0.5,
      requiredReviewerRole: 'reviewer',
      escalationLevel: 'review',
    });
    expect(result.success).toBe(false);
  });
});

describe('ProvenancePolicySchema', () => {
  it('accepts a valid policy', () => {
    const result = ProvenancePolicySchema.safeParse({
      thresholds: [
        {
          condition: 'model_uncertainty',
          minConfidence: 0.6,
          requiredReviewerRole: 'ai_reviewer',
          escalationLevel: 'review',
        },
      ],
      defaultAction: 'allow',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid default action', () => {
    const result = ProvenancePolicySchema.safeParse({
      thresholds: [],
      defaultAction: 'approve',
    });
    expect(result.success).toBe(false);
  });
});
