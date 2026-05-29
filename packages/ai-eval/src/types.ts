export interface AIScorecardMeta {
  repo: string;
  agent_id: string;
  session_id?: string;
  timestamp: string;
  baseline_ref: string;
  current_ref: string;
}

export interface DimensionResult {
  status: 'PASS' | 'FAIL' | 'WARN';
}

export interface AccuracyResult extends DimensionResult {
  pass_rate: number;
  baseline_pass_rate: number;
  delta: number;
  threshold: number;
  packages: Array<{
    name: string;
    pass_rate: number;
    threshold: number;
    status: 'PASS' | 'FAIL';
  }>;
}

export interface SafetyFinding {
  rule_id: string;
  file: string;
  severity: 'block' | 'warn';
  message: string;
}

export interface SafetyResult extends DimensionResult {
  violations: number;
  findings: SafetyFinding[];
}

export interface EfficiencyResult extends DimensionResult {
  tokens_per_task: number;
  baseline_tokens_per_task: number;
  tokens_delta_pct: number;
  duration_per_task_ms: number;
  baseline_duration_ms: number;
  duration_delta_pct: number;
  threshold_tokens_pct: number;
  threshold_duration_pct: number;
}

export interface ContextUtilizationResult extends DimensionResult {
  utilization_score: number;
  avg_context_tokens: number;
  max_context_tokens: number;
  truncation_events: number;
  target_score: number;
}

export interface AIScorecard {
  meta: AIScorecardMeta;
  summary: {
    overall_status: 'PASS' | 'FAIL' | 'WARN';
    dimensions_scored: number;
    dimensions_passed: number;
    dimensions_failed: number;
  };
  accuracy: AccuracyResult;
  safety: SafetyResult;
  efficiency: EfficiencyResult;
  context_utilization: ContextUtilizationResult;
}

export interface EvaluateOptions {
  repo: string;
  agentId?: string;
  sessionId?: string;
  baseline?: string;
  output?: string;
  dimensions?: string[];
  strict?: boolean;
}
