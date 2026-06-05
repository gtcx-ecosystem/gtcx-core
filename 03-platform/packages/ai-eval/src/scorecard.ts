import { execSync } from 'child_process';

import type {
  AIScorecard,
  AIScorecardMeta,
  AccuracyResult,
  SafetyResult,
  EfficiencyResult,
  ContextUtilizationResult,
} from './types';

function getGitRef(repo: string): string {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: repo, encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

function getRepoName(repo: string): string {
  try {
    const remote = execSync('git remote get-url origin', { cwd: repo, encoding: 'utf-8' }).trim();
    const match = remote.match(/\/([^/]+?)(?:\.git)?$/);
    return match && match[1] ? match[1] : repo;
  } catch {
    return repo;
  }
}

export function buildMeta(
  repo: string,
  agentId?: string,
  sessionId?: string,
  baselineRef?: string
): AIScorecardMeta {
  return {
    repo: getRepoName(repo),
    agent_id: agentId || 'unknown',
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    baseline_ref: baselineRef || 'main',
    current_ref: getGitRef(repo),
  };
}

export function buildScorecard(
  meta: AIScorecardMeta,
  accuracy: AccuracyResult,
  safety: SafetyResult,
  efficiency: EfficiencyResult,
  context: ContextUtilizationResult
): AIScorecard {
  const dimensions = [accuracy, safety, efficiency, context];
  const passed = dimensions.filter((d) => d.status === 'PASS').length;
  const failed = dimensions.filter((d) => d.status === 'FAIL').length;

  let overallStatus: 'PASS' | 'FAIL' | 'WARN' = 'PASS';
  if (failed > 0) overallStatus = 'FAIL';
  else if (dimensions.some((d) => d.status === 'WARN')) overallStatus = 'WARN';

  return {
    meta,
    summary: {
      overall_status: overallStatus,
      dimensions_scored: dimensions.length,
      dimensions_passed: passed,
      dimensions_failed: failed,
    },
    accuracy,
    safety,
    efficiency,
    context_utilization: context,
  };
}
