// ============================================================================
// AGENTIC PROVENANCE TYPES
// Shared trust/provenance metadata for autonomous and AI-assisted outputs
// across the GTCX ecosystem.
//
// Principle: no consequential AI-derived action proceeds without
// machine-readable provenance and an explicit review policy.
// ============================================================================

/**
 * Trust level assigned to an AI-derived output.
 *
 * - verified:   High confidence, complete evidence, no degradation
 * - tentative:  Moderate confidence or partial evidence
 * - uncertain:  Low confidence, stale data, or model uncertainty
 * - rejected:   Below minimum threshold or policy violation
 */
export type TrustLevel = 'verified' | 'tentative' | 'uncertain' | 'rejected';

/**
 * Reference to a single piece of evidence that contributed to an
 * AI-derived output.
 */
export interface EvidenceRef {
  /** Unique identifier for this evidence item */
  evidenceId: string;
  /** Classification of evidence (e.g. 'sensor', 'document', 'oracle', 'human') */
  evidenceType: string;
  /** Source system or authority that provided the evidence */
  source: string;
  /** Unix timestamp (ms) when the evidence was captured/attested */
  timestamp: number;
  /** Relevance score (0–1) computed by the inference system */
  relevanceScore: number;
  /** Optional URI for retrieving the full evidence record */
  uri?: string | undefined;
}

/**
 * Chain-of-custody record for a single decision in a multi-step
 * reasoning process.
 */
export interface DecisionProvenance {
  /** Unique identifier for this decision step */
  decisionId: string;
  /** Semantic type of the decision (e.g. 'anomaly_detection', 'risk_scoring') */
  decisionType: string;
  /** Unix timestamp (ms) when the decision was made */
  timestamp: number;
  /** Identity of the actor (model, service, or human) that made the decision */
  actor: string;
  /** Hash of the inputs that fed this decision step */
  inputHash: string;
  /** Hash of the outputs produced by this decision step */
  outputHash: string;
  /** Parent decision in the chain, if any */
  parentDecisionId?: string | undefined;
}

/**
 * Versioned methodology descriptor so consumers can reason about
 * which framework, version, and configuration produced an output.
 */
export interface MethodologyVersion {
  /** Framework name (e.g. 'cortex', 'anisa', 'sentinel') */
  framework: string;
  /** Semantic version of the framework */
  version: string;
  /** Hash of the configuration that produced this output */
  configurationHash: string;
}

/**
 * Core provenance envelope attached to every AI-derived output.
 *
 * This structure is intentionally serializable and hashable so that
 * downstream policy gates can evaluate it without re-running inference.
 */
export interface AgenticProvenance {
  /** Computed trust level for this output */
  trustLevel: TrustLevel;
  /** Confidence score (0–1) */
  confidence: number;
  /** References to evidence that contributed to this output */
  evidenceRefs: EvidenceRef[];
  /** Methodology that produced this output */
  methodologyVersion: MethodologyVersion;
  /** Whether human review is required before acting on this output */
  requiresHumanReview: boolean;
  /** Chain of decisions that led to this output */
  decisionProvenance: DecisionProvenance;
  /** Identity of the human reviewer, if already reviewed */
  reviewedBy?: string | undefined;
  /** Unix timestamp (ms) when the human review occurred */
  reviewedAt?: number | undefined;
}

// ============================================================================
// REVIEW THRESHOLDS
// ============================================================================

/** Named review-threshold conditions used by policy gates. */
export type ReviewThresholdCondition =
  | 'high_impact_compliance'
  | 'model_uncertainty'
  | 'stale_or_partial_evidence'
  | 'jurisdictional_edge_case';

/**
 * A single review threshold that policy gates evaluate against an
 * {@link AgenticProvenance} record.
 */
export interface ReviewThreshold {
  /** Named condition identifier */
  condition: ReviewThresholdCondition;
  /** Minimum confidence required to avoid triggering this threshold */
  minConfidence: number;
  /** Role required to clear a review triggered by this threshold */
  requiredReviewerRole: string;
  /** Escalation level when this threshold fires */
  escalationLevel: 'none' | 'review' | 'approval' | 'urgent';
  /** Optional human-readable explanation */
  description?: string | undefined;
}

/**
 * Default review thresholds aligned with GTCX operational policy.
 *
 * Packages may override individual thresholds at runtime, but these
 * defaults provide a safe baseline.
 */
export const DefaultReviewThresholds: ReviewThreshold[] = [
  {
    condition: 'high_impact_compliance',
    minConfidence: 0.9,
    requiredReviewerRole: 'compliance_officer',
    escalationLevel: 'approval',
    description:
      'High-impact compliance decisions require near-certain confidence and must be approved by a compliance officer.',
  },
  {
    condition: 'model_uncertainty',
    minConfidence: 0.6,
    requiredReviewerRole: 'ai_reviewer',
    escalationLevel: 'review',
    description: 'Model uncertainty is flagged when confidence is low or evidence is sparse.',
  },
  {
    condition: 'stale_or_partial_evidence',
    minConfidence: 0.75,
    requiredReviewerRole: 'domain_expert',
    escalationLevel: 'review',
    description: 'Evidence older than 24 hours or with coverage below 80% triggers review.',
  },
  {
    condition: 'jurisdictional_edge_case',
    minConfidence: 0.85,
    requiredReviewerRole: 'legal_reviewer',
    escalationLevel: 'approval',
    description: 'Cross-jurisdictional decisions with no local validator require legal approval.',
  },
];

// ============================================================================
// PROVENANCE POLICY
// ============================================================================

/** Action that a policy gate can take on an AI-derived output. */
export type ProvenancePolicyAction = 'allow' | 'block' | 'escalate' | 'audit';

/**
 * A policy that evaluates {@link AgenticProvenance} records and
 * decides whether an AI-derived action may proceed.
 */
export interface ProvenancePolicy {
  /** Thresholds evaluated in order */
  thresholds: ReviewThreshold[];
  /** Default action when no threshold fires */
  defaultAction: ProvenancePolicyAction;
}

/**
 * Result of evaluating a {@link ProvenancePolicy} against an
 * {@link AgenticProvenance} record.
 */
export interface ProvenanceEvaluation {
  /** Action decided by the policy gate */
  action: ProvenancePolicyAction;
  /** Thresholds that fired during evaluation */
  triggeredThresholds: ReviewThreshold[];
  /** Whether human review is required before proceeding */
  reviewRequired: boolean;
  /** Human-readable explanation of the decision */
  explanation: string;
}

// ============================================================================
// POLICY EVALUATION FUNCTIONS
// ============================================================================

/**
 * Evaluate a provenance record against a policy.
 *
 * Thresholds are tested in order. The first threshold whose condition
 * is met determines the action (`escalate`). If no threshold fires,
 * the {@link ProvenancePolicy.defaultAction} is returned.
 */
export function evaluateProvenancePolicy(
  provenance: AgenticProvenance,
  policy: ProvenancePolicy
): ProvenanceEvaluation {
  const triggered: ReviewThreshold[] = [];

  for (const threshold of policy.thresholds) {
    if (thresholdFires(provenance, threshold)) {
      triggered.push(threshold);
    }
  }

  if (provenance.trustLevel === 'rejected') {
    return {
      action: 'block',
      triggeredThresholds: triggered,
      reviewRequired: true,
      explanation: `Blocked: trust level is '${provenance.trustLevel}' (confidence ${provenance.confidence.toFixed(2)}).`,
    };
  }

  if (triggered.length > 0) {
    const highest = triggered.reduce((a, b) =>
      escalationRank(a.escalationLevel) > escalationRank(b.escalationLevel) ? a : b
    );
    return {
      action: highest.escalationLevel === 'urgent' ? 'block' : 'escalate',
      triggeredThresholds: triggered,
      reviewRequired: true,
      explanation: `Escalated: ${triggered.length} threshold(s) fired. Highest escalation: '${highest.escalationLevel}' (${highest.condition}).`,
    };
  }

  return {
    action: policy.defaultAction,
    triggeredThresholds: [],
    reviewRequired: false,
    explanation: `Allowed: no thresholds fired. Trust level '${provenance.trustLevel}', confidence ${provenance.confidence.toFixed(2)}.`,
  };
}

/**
 * Determine whether an {@link AgenticProvenance} record should
 * require human review given a set of review thresholds.
 */
export function shouldRequireHumanReview(
  provenance: AgenticProvenance,
  thresholds: ReviewThreshold[] = DefaultReviewThresholds
): boolean {
  if (provenance.requiresHumanReview) return true;
  if (provenance.trustLevel === 'rejected') return true;
  if (provenance.trustLevel === 'uncertain') return true;
  return thresholds.some((t) => thresholdFires(provenance, t));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function thresholdFires(provenance: AgenticProvenance, threshold: ReviewThreshold): boolean {
  // Confidence check
  if (provenance.confidence < threshold.minConfidence) return true;

  // High-impact compliance: require verified trust
  if (threshold.condition === 'high_impact_compliance' && provenance.trustLevel !== 'verified') {
    return true;
  }

  // Model uncertainty: low confidence or sparse evidence
  if (
    threshold.condition === 'model_uncertainty' &&
    (provenance.confidence < 0.6 || provenance.evidenceRefs.length < 2)
  ) {
    return true;
  }

  // Stale or partial evidence
  if (threshold.condition === 'stale_or_partial_evidence') {
    const now = Date.now();
    const hasStale = provenance.evidenceRefs.some((e) => now - e.timestamp > 24 * 60 * 60 * 1000);
    const coverage = provenance.evidenceRefs.reduce((sum, e) => sum + e.relevanceScore, 0);
    if (hasStale || coverage < 0.8) return true;
  }

  // Jurisdictional edge case — heuristic: cross-source with no dominant local source
  if (threshold.condition === 'jurisdictional_edge_case') {
    const sources = new Set(provenance.evidenceRefs.map((e) => e.source));
    if (sources.size >= 3) return true;
  }

  return false;
}

function escalationRank(level: ReviewThreshold['escalationLevel']): number {
  switch (level) {
    case 'none':
      return 0;
    case 'review':
      return 1;
    case 'approval':
      return 2;
    case 'urgent':
      return 3;
  }
}
