import { describe, it, expect } from 'vitest';

import { buildMeta, buildScorecard } from './scorecard';

const defaultAccuracy = {
  pass_rate: 0.99,
  baseline_pass_rate: 0.98,
  delta: 0.01,
  threshold: 0.95,
  status: 'PASS' as const,
  packages: [],
};

const defaultSafety = {
  violations: 0,
  status: 'PASS' as const,
  findings: [],
};

const defaultEfficiency = {
  tokens_per_task: 10000,
  baseline_tokens_per_task: 9500,
  tokens_delta_pct: 5.3,
  duration_per_task_ms: 300000,
  baseline_duration_ms: 280000,
  duration_delta_pct: 7.1,
  threshold_tokens_pct: 10,
  threshold_duration_pct: 20,
  status: 'PASS' as const,
};

const defaultContext = {
  utilization_score: 0.82,
  avg_context_tokens: 98304,
  max_context_tokens: 131072,
  truncation_events: 0,
  target_score: 0.7,
  status: 'PASS' as const,
};

describe('buildMeta', () => {
  it('creates meta with repo name', () => {
    const meta = buildMeta('test-repo', 'test-agent', 'session-1', 'main');
    expect(meta.repo).toBe('test-repo');
    expect(meta.agent_id).toBe('test-agent');
    expect(meta.session_id).toBe('session-1');
    expect(meta.baseline_ref).toBe('main');
    expect(meta.timestamp).toBeTruthy();
  });
});

describe('buildScorecard', () => {
  it('returns PASS when all dimensions pass', () => {
    const meta = buildMeta('test', 'agent', undefined, 'main');
    const scorecard = buildScorecard(
      meta,
      defaultAccuracy,
      defaultSafety,
      defaultEfficiency,
      defaultContext
    );
    expect(scorecard.summary.overall_status).toBe('PASS');
    expect(scorecard.summary.dimensions_passed).toBe(4);
    expect(scorecard.summary.dimensions_failed).toBe(0);
  });

  it('returns FAIL when one dimension fails', () => {
    const meta = buildMeta('test', 'agent', undefined, 'main');
    const scorecard = buildScorecard(
      meta,
      { ...defaultAccuracy, status: 'FAIL' as const, pass_rate: 0.9 },
      defaultSafety,
      defaultEfficiency,
      defaultContext
    );
    expect(scorecard.summary.overall_status).toBe('FAIL');
    expect(scorecard.summary.dimensions_passed).toBe(3);
    expect(scorecard.summary.dimensions_failed).toBe(1);
  });

  it('returns WARN when no failures but one warning', () => {
    const meta = buildMeta('test', 'agent', undefined, 'main');
    const scorecard = buildScorecard(meta, defaultAccuracy, defaultSafety, defaultEfficiency, {
      ...defaultContext,
      status: 'WARN' as const,
    });
    expect(scorecard.summary.overall_status).toBe('WARN');
    expect(scorecard.summary.dimensions_passed).toBe(3);
    expect(scorecard.summary.dimensions_failed).toBe(0);
  });
});
