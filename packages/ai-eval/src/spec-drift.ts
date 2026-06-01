import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { SafetyFinding } from './types';

/** Doc/spec consistency checks for customer-visible surfaces. */
export function evaluateSpecDrift(repo: string): SafetyFinding[] {
  const findings: SafetyFinding[] = [];
  const readmePath = join(repo, 'README.md');

  if (!existsSync(readmePath)) {
    return findings;
  }

  const readme = readFileSync(readmePath, 'utf8');

  if (/odd-length-hex.*NAPI boundary/i.test(readme) && /Sprint 2 fix/i.test(readme)) {
    findings.push({
      rule_id: 'spec-drift-readme-hex',
      file: 'README.md',
      severity: 'warn',
      message:
        'README still lists odd-length-hex as open blocker; fixed in @gtcx/crypto-native 0.4.0 (assertHex)',
    });
  }

  if (/18 of 21 packages live/i.test(readme) && !/21 \/ 21|21 of 21/i.test(readme)) {
    findings.push({
      rule_id: 'spec-drift-readme-npm',
      file: 'README.md',
      severity: 'warn',
      message: 'README understates npm publish count (expect 21/21 public packages)',
    });
  }

  const trustPortal = join(repo, 'docs/governance/trust-portal.md');
  if (existsSync(trustPortal)) {
    const portal = readFileSync(trustPortal, 'utf8');
    if (/\| `@gtcx\/resilience`\s+\| _pending_/i.test(portal)) {
      findings.push({
        rule_id: 'spec-drift-trust-portal-resilience',
        file: 'docs/governance/trust-portal.md',
        severity: 'warn',
        message: 'Trust portal still marks @gtcx/resilience as pending on npm',
      });
    }
  }

  return findings;
}
