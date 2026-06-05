import { describe, it, expect } from 'vitest';

import {
  type AgenticProvenance,
  type ProvenancePolicy,
  evaluateProvenancePolicy,
  shouldRequireHumanReview,
} from '../src/common/provenance';

function makeProvenance(overrides: {
  trustLevel?: AgenticProvenance['trustLevel'];
  confidence?: number;
  evidenceRefsCount?: number;
  sources?: string[];
}): AgenticProvenance {
  return {
    trustLevel: overrides.trustLevel ?? 'verified',
    confidence: overrides.confidence ?? 0.95,
    evidenceRefs: overrides.sources
      ? overrides.sources.map((source, i) => ({
          evidenceId: `ev-${i}`,
          evidenceType: 'sensor',
          source,
          timestamp: Date.now(),
          relevanceScore: 0.3,
        }))
      : Array.from({ length: overrides.evidenceRefsCount ?? 3 }, (_, i) => ({
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
    requiresHumanReview: false,
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

describe('provenance coverage gaps', () => {
  it('covers escalationRank none path', () => {
    // Need 2+ thresholds so reduce callback fires and calls escalationRank
    const policy: ProvenancePolicy = {
      thresholds: [
        {
          condition: 'high_impact_compliance',
          minConfidence: 0.99,
          requiredReviewerRole: 'officer',
          escalationLevel: 'none',
        },
        {
          condition: 'model_uncertainty',
          minConfidence: 0.99,
          requiredReviewerRole: 'ai_reviewer',
          escalationLevel: 'none',
        },
      ],
      defaultAction: 'allow',
    };
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.98 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('escalate');
    expect(result.reviewRequired).toBe(true);
  });

  it('covers escalationRank urgent path via triggered threshold', () => {
    const policy: ProvenancePolicy = {
      thresholds: [
        {
          condition: 'model_uncertainty',
          minConfidence: 0.99,
          requiredReviewerRole: 'ai_reviewer',
          escalationLevel: 'review',
        },
        {
          condition: 'high_impact_compliance',
          minConfidence: 0.99,
          requiredReviewerRole: 'officer',
          escalationLevel: 'urgent',
        },
      ],
      defaultAction: 'allow',
    };
    const p = makeProvenance({ trustLevel: 'verified', confidence: 0.98, evidenceRefsCount: 1 });
    const result = evaluateProvenancePolicy(p, policy);
    expect(result.action).toBe('block');
    expect(result.reviewRequired).toBe(true);
  });

  it('covers jurisdictional edge case confidence branch', () => {
    const policy: ProvenancePolicy = {
      thresholds: [
        {
          condition: 'jurisdictional_edge_case',
          minConfidence: 0.5,
          requiredReviewerRole: 'legal_reviewer',
          escalationLevel: 'approval',
        },
      ],
      defaultAction: 'allow',
    };
    const p = makeProvenance({
      trustLevel: 'verified',
      confidence: 0.4,
      sources: ['src-a', 'src-b', 'src-c'],
    });
    const result = shouldRequireHumanReview(p, policy.thresholds);
    expect(result).toBe(true);
  });
});
