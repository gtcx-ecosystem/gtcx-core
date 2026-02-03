// ============================================================================
// GCI PROTOCOL TYPES
// Compliance & Policy Evaluation
// ============================================================================

/**
 * Compliance policy definition
 */
export interface CompliancePolicy {
  id: string;
  name: string;
  version: string;
  jurisdiction: string;
  effectiveDate: string;
  expirationDate?: string;
  rules: ComplianceRule[];
  metadata: PolicyMetadata;
}

export interface PolicyMetadata {
  authority: string;
  description: string;
  tags: string[];
  updatedAt: number;
}

/**
 * Individual compliance rule
 */
export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: RuleType;
  condition: RuleCondition;
  weight: number;
  required: boolean;
  remediation?: string;
}

export type RuleType =
  | 'identity'
  | 'location'
  | 'documentation'
  | 'financial'
  | 'environmental'
  | 'labor'
  | 'safety'
  | 'custom';

export interface RuleCondition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
  nested?: RuleCondition[];
}

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in'
  | 'exists'
  | 'and'
  | 'or';

/**
 * Compliance evaluation result
 */
export interface ComplianceEvaluation {
  id: string;
  subjectId: string;
  subjectType: 'tradepass' | 'lot' | 'site' | 'transaction';
  policyId: string;
  policyVersion: string;
  evaluatedAt: number;
  score: ComplianceScore;
  ruleResults: RuleResult[];
  attestation?: ComplianceAttestation;
}

export interface ComplianceScore {
  overall: number; // 0-100
  byCategory: Record<RuleType, number>;
  tier: ComplianceTier;
  trend?: 'improving' | 'stable' | 'declining';
}

export type ComplianceTier = 
  | 'platinum' // 95-100
  | 'gold'     // 85-94
  | 'silver'   // 70-84
  | 'bronze'   // 50-69
  | 'pending'  // < 50 or incomplete
  | 'blocked'; // critical failure

export interface RuleResult {
  ruleId: string;
  passed: boolean;
  score: number;
  evidence?: string;
  message?: string;
  remediation?: string;
}

/**
 * Compliance attestation - signed statement of compliance
 */
export interface ComplianceAttestation {
  id: string;
  evaluationId: string;
  attestedBy: string;
  attestedAt: number;
  validUntil: number;
  signature: string;
  publicKey: string;
}

/**
 * Policy registry for managing active policies
 */
export interface PolicyRegistry {
  jurisdiction: string;
  activePolicies: CompliancePolicy[];
  lastUpdated: number;
  nextReview: number;
}
