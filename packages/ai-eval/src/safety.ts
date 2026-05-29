import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { SafetyResult, SafetyFinding } from './types';

interface SafetyRule {
  id: string;
  pattern: string;
  required_approver: string;
  severity: 'block' | 'warn';
}

interface SafetyRules {
  version: string;
  rules: SafetyRule[];
}

function loadSafetyRules(repo: string): SafetyRules | null {
  const paths = [join(repo, 'docs/agents/safety-rules.json'), join(repo, 'safety-rules.json')];
  for (const p of paths) {
    if (existsSync(p)) {
      try {
        return JSON.parse(readFileSync(p, 'utf-8')) as SafetyRules;
      } catch {
        /* empty */
      }
    }
  }
  return null;
}

function getChangedFiles(repo: string, baselineRef: string): string[] {
  try {
    const stdout = execSync(`git diff --name-only ${baselineRef} HEAD`, {
      cwd: repo,
      encoding: 'utf-8',
    });
    return stdout.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function matchPattern(file: string, pattern: string): boolean {
  // Simple glob-to-regex conversion
  const regex = pattern
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.')
    .replace(/\{\{GLOBSTAR\}\}/g, '.*');
  try {
    return new RegExp(regex).test(file);
  } catch {
    return file.includes(pattern.replace(/\*\*/g, '').replace(/\*/g, ''));
  }
}

function checkApprovals(
  repo: string,
  _baselineRef: string
): Array<{ file: string; approvers: string[] }> {
  const approvals: Array<{ file: string; approvers: string[] }> = [];
  try {
    // Try to get PR reviews if in CI
    const prNumber = process.env.GITHUB_PR_NUMBER;
    if (prNumber) {
      const stdout = execSync(`gh pr view ${prNumber} --json reviews`, {
        cwd: repo,
        encoding: 'utf-8',
      });
      const data = JSON.parse(stdout);
      const approvers = (data.reviews || [])
        .filter((r: { state: string }) => r.state === 'APPROVED')
        .map((r: { author: { login: string } }) => r.author.login);
      return [{ file: 'PR', approvers }];
    }
  } catch {
    /* empty */
  }

  return approvals;
}

export async function evaluateSafety(
  repo: string,
  baselineRef: string = 'main'
): Promise<SafetyResult> {
  const rules = loadSafetyRules(repo);
  if (!rules) {
    return {
      violations: 0,
      status: 'WARN',
      findings: [
        {
          rule_id: 'missing-rules',
          file: 'safety-rules.json',
          severity: 'warn',
          message: 'No safety-rules.json found in repo',
        },
      ],
    };
  }

  const changedFiles = getChangedFiles(repo, baselineRef);
  const approvals = checkApprovals(repo, baselineRef);
  const findings: SafetyFinding[] = [];

  for (const file of changedFiles) {
    for (const rule of rules.rules) {
      if (matchPattern(file, rule.pattern)) {
        // Check if required approver is in approvals
        const hasApproval = approvals.some((a) =>
          a.approvers.some((app) =>
            app.toLowerCase().includes(rule.required_approver.toLowerCase())
          )
        );

        if (!hasApproval && approvals.length > 0) {
          findings.push({
            rule_id: rule.id,
            file,
            severity: rule.severity,
            message: `${file} modified without ${rule.required_approver} approval`,
          });
        } else if (approvals.length === 0) {
          // Local run or no PR data — flag as warning
          findings.push({
            rule_id: rule.id,
            file,
            severity: 'warn',
            message: `${file} matches ${rule.id} — verify ${rule.required_approver} review manually`,
          });
        }
      }
    }
  }

  const violations = findings.filter((f) => f.severity === 'block').length;
  const status = violations > 0 ? 'FAIL' : findings.length > 0 ? 'WARN' : 'PASS';

  return { violations, status, findings };
}
