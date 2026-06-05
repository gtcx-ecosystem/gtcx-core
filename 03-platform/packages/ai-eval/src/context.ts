import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { ContextUtilizationResult } from './types';

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

function countTruncationEvents(content: string): number {
  const truncationPatterns = [
    /context\s+truncated/gi,
    /truncated\s+at\s+\d+/gi,
    /output\s+truncated/gi,
    /\[\.\.\.\]/g,
  ];
  let count = 0;
  for (const pattern of truncationPatterns) {
    const matches = content.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

export async function evaluateContextUtilization(repo: string): Promise<ContextUtilizationResult> {
  const sessionsDir = join(repo, 'docs/agents/sessions');
  if (!existsSync(sessionsDir)) {
    return {
      utilization_score: 0,
      avg_context_tokens: 0,
      max_context_tokens: 131072,
      truncation_events: 0,
      target_score: 0.7,
      status: 'WARN',
    };
  }

  let totalContextTokens = 0;
  let totalTruncations = 0;
  let sessionCount = 0;
  const maxContextTokens = 131072;

  try {
    const stdout = execSync(`find ${sessionsDir} -name "*.md" -type f 2>/dev/null || echo ""`, {
      encoding: 'utf-8',
    });
    const fileList = stdout.trim().split('\n').filter(Boolean);
    for (const file of fileList) {
      try {
        const content = readFileSync(file, 'utf-8');
        const fm = parseFrontmatter(content);
        const contextTokens = Number(fm.context_tokens) || 0;
        if (contextTokens > 0) {
          totalContextTokens += contextTokens;
          sessionCount++;
        }
        totalTruncations += countTruncationEvents(content);
      } catch {
        /* empty */
      }
    }
  } catch {
    /* empty */
  }

  if (sessionCount === 0) {
    return {
      utilization_score: 0,
      avg_context_tokens: 0,
      max_context_tokens: maxContextTokens,
      truncation_events: totalTruncations,
      target_score: 0.7,
      status: 'WARN',
    };
  }

  const avgContextTokens = totalContextTokens / sessionCount;
  const utilization = avgContextTokens / maxContextTokens;
  let score = 1.0 - Math.abs(utilization - 0.7) / 0.7;
  score = Math.max(0, Math.min(1, score));
  score -= totalTruncations * 0.1;
  score = Math.max(0, score);

  const status = score >= 0.7 ? 'PASS' : score >= 0.5 ? 'WARN' : 'FAIL';

  return {
    utilization_score: Math.round(score * 100) / 100,
    avg_context_tokens: Math.round(avgContextTokens),
    max_context_tokens: maxContextTokens,
    truncation_events: totalTruncations,
    target_score: 0.7,
    status,
  };
}
