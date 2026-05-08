import { describe, it, expect } from 'vitest';

import {
  type AgenticProvenance,
  type ProvenancePolicy,
  type ReviewThreshold,
  DefaultReviewThresholds,
  evaluateProvenancePolicy,
  shouldRequireHumanReview,
  type TrustLevel,
} from '../src/common/provenance';

function makeProvenance(overrides: {
  trustLevel?: TrustLevel;
  confidence?: number;
  evidenceRefsCount?: number;
  requiresHumanReview?: boolean;
}): AgenticProvenance {
  return {
    trustLevel: overrides.trustLevel ?? 'verified',
    confidence: overrides.confidence ?? 0.95,
    evidenceRefs: Array.from({ length: overrides.evidenceRefsCount ?? 3 }, (_, i) => ({
      evidenceId: `ev-${i}`,
      evidenceType: 'sensor',
      source: 'local-validator',
      timestamp: Date.now(),
      relevanceScore: 0.9,
    })),
    methodologyVersion: {
      framework: 'test',
      version: '1.0.0',
      configurationHash: 'abc123',
    },
    requiresHumanReview: overrides.requiresHumanReview ?? false,
    decisionProvenance: {
      decisionId: 'd-1',
      decisionType: 'test',
      timestamp: Date.now(),
      actor: 'test-model',
      inputHash: 'in-hash',
      outputHash: 'out-hash',
    },
  };
}

describe('AgenticProvenance types', () => {
  it('can construct a full provenance record', () => {
    const p = makeProvenance({});
    expect(p.trustLevel).toBe('verified');
    expect(p.confidence).toBe(0.95);
    expect(p.evidenceRefs).toHaveLength(3);
    expect(p.requiresHumanReview).toBe(false);
  });
});

describe('DefaultReviewThresholds', () => {
  it('contains 4 predefined thresholds', () => {
    expect(DefaultReviewThresholds).toHaveLength(4);
    const conditions = DefaultReviewThresholds.map((t) => t.condition);
    expect(conditions).toContain('high_impact_compliance');
    expect(conditions).toContain('model_uncertainty');
    expect(conditions).toContain('stale_or_partial_evidence');
    expect(conditions).toContain('jurisdictional_edge_case');
  });
});

describe('evaluateProvenancePolicy', () => {
  const policy: ProvenancePolicy = {
    thresholds: DefaultReviewThresholds,
    defaultAction: 'allow',
  };

  it('allows verified high-confidence results', () => {
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.95 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('allow');
    expect(result.reviewRequired).toBe(false);
    expect(result.triggeredThresholds).toHaveLength(0);
  });

  it('blocks rejected trust level regardless of confidence', () => {
    const p = makeProvenance({ trustLevel: 'rejected', confidence: 0.99 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('block');
    expect(result.reviewRequired).toBe(true);
  });

  it('escalates low confidence on compliance decisions', () => {
    const p = makeProvenance({ trustLevel: 'tentative', confidence: 0.5 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('escalate');
    expect(result.reviewRequired).toBe(true);
    expect(result.triggeredThresholds.length).toBeGreaterThan(0);
  });

  it('escalates when model uncertainty threshold fires', () => {
    const p = makeProvenance({ trustLevel: 'tentative', confidence: 0.55, evidenceRefsCount: 1 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('escalate');
    const modelUncertain = result.triggeredThresholds.find(
      (t) => t.condition === 'model_uncertainty'
    );
    expect(modelUncertain).toBeDefined();
  });

  it('blocks on urgent escalation level', () => {
    const urgentPolicy: ProvenancePolicy = {
      thresholds: [
        {
          condition: 'high_impact_compliance',
          minConfidence: 0.99,
          requiredReviewerRole: 'officer',
          escalationLevel: 'urgent',
        },
      ],
      defaultAction: 'allow',
    };
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.5 });
    const result = evaluateProvenancePolicy(p, urgentPolicy);
    expect(result.action).toBe('block');
  });
});

describe('shouldRequireHumanReview', () => {
  it('returns false for verified high-confidence results', () => {
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.95 });
    expect(shouldRequireHumanReview(p)).toBe(false);
  });

  it('returns true when provenance explicitly requires review', () => {
    const p = makeProvenance({
      trustLevel: 'verified',
      confidence: 0.95,
      requiresHumanReview: true,
    });
    expect(shouldRequireHumanReview(p)).toBe(true);
  });

  it('returns true for rejected trust level', () => {
    const p = makeProvenance({ trustLevel: 'rejected', confidence: 0.2 });
    expect(shouldRequireHumanReview(p)).toBe(true);
  });

  it('returns true for uncertain trust level', () => {
    const p = makeProvenance({ trustLevel: 'uncertain', confidence: 0.4 });
    expect(shouldRequireHumanReview(p)).toBe(true);
  });

  it('returns true when custom threshold fires', () => {
    const custom: ReviewThreshold[] = [
      {
        condition: 'high_impact_compliance',
        minConfidence: 0.99,
        requiredReviewerRole: 'x',
        escalationLevel: 'review',
      },
    ];
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.9 });
    expect(shouldRequireHumanReview(p, custom)).toBe(true);
  });
});
