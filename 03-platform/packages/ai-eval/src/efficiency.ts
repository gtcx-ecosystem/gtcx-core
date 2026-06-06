import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { EfficiencyResult } from './types';

interface SessionFrontmatter {
  tokens_used?: number;
  duration_ms?: number;
  tasks_completed?: number;
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1]) return {};
  const lines = match[1].split('\n');
  const result: Record<string, unknown> = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      if (!isNaN(Number(value))) {
        result[key] = Number(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

function collectSessions(repo: string): SessionFrontmatter[] {
  const sessionsDir = join(repo, '01-docs/01-agents/sessions');
  if (!existsSync(sessionsDir)) return [];

  const sessions: SessionFrontmatter[] = [];
  try {
    const stdout = execSync(`find ${sessionsDir} -name "*.md" -type f 2>/dev/null || echo ""`, {
      encoding: 'utf-8',
    });
    const fileList = stdout.trim().split('\n').filter(Boolean);
    for (const file of fileList) {
      try {
        const content = readFileSync(file, 'utf-8');
        const fm = parseFrontmatter(content);
        if (fm.tokens_used || fm.duration_ms) {
          sessions.push({
            tokens_used: Number(fm.tokens_used) || 0,
            duration_ms: Number(fm.duration_ms) || 0,
            tasks_completed: Number(fm.tasks_completed) || 1,
          });
        }
      } catch {
        /* empty */
      }
    }
  } catch {
    /* empty */
  }

  return sessions;
}

export async function evaluateEfficiency(
  repo: string,
  _baseline?: string
): Promise<EfficiencyResult> {
  const sessions = collectSessions(repo);

  if (sessions.length === 0) {
    return {
      tokens_per_task: 0,
      baseline_tokens_per_task: 0,
      tokens_delta_pct: 0,
      duration_per_task_ms: 0,
      baseline_duration_ms: 0,
      duration_delta_pct: 0,
      threshold_tokens_pct: 10,
      threshold_duration_pct: 20,
      status: 'WARN',
    };
  }

  const totalTokens = sessions.reduce((s, sess) => s + (sess.tokens_used || 0), 0);
  const totalDuration = sessions.reduce((s, sess) => s + (sess.duration_ms || 0), 0);
  const totalTasks = sessions.reduce((s, sess) => s + (sess.tasks_completed || 1), 0);

  const tokensPerTask = totalTasks > 0 ? totalTokens / totalTasks : 0;
  const durationPerTask = totalTasks > 0 ? totalDuration / totalTasks : 0;

  let baselineTokens = tokensPerTask;
  let baselineDuration = durationPerTask;
  if (_baseline && existsSync(_baseline)) {
    try {
      const baseline = JSON.parse(readFileSync(_baseline, 'utf-8'));
      baselineTokens = baseline.efficiency?.tokens_per_task ?? tokensPerTask;
      baselineDuration = baseline.efficiency?.duration_per_task_ms ?? durationPerTask;
    } catch {
      /* empty */
    }
  }

  const tokensDeltaPct =
    baselineTokens > 0 ? ((tokensPerTask - baselineTokens) / baselineTokens) * 100 : 0;
  const durationDeltaPct =
    baselineDuration > 0 ? ((durationPerTask - baselineDuration) / baselineDuration) * 100 : 0;

  const status = tokensDeltaPct > 10 || durationDeltaPct > 20 ? 'FAIL' : 'PASS';

  return {
    tokens_per_task: Math.round(tokensPerTask),
    baseline_tokens_per_task: Math.round(baselineTokens),
    tokens_delta_pct: Math.round(tokensDeltaPct * 100) / 100,
    duration_per_task_ms: Math.round(durationPerTask),
    baseline_duration_ms: Math.round(baselineDuration),
    duration_delta_pct: Math.round(durationDeltaPct * 100) / 100,
    threshold_tokens_pct: 10,
    threshold_duration_pct: 20,
    status,
  };
}
