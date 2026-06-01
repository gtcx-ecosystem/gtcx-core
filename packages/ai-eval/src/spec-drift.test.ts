import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { describe, it, expect } from 'vitest';

import { evaluateSpecDrift } from './spec-drift';

describe('evaluateSpecDrift', () => {
  it('flags stale README odd-length-hex blocker', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gtcx-spec-drift-'));
    writeFileSync(
      join(dir, 'README.md'),
      '- `@gtcx/crypto-native` odd-length-hex NAPI boundary edge case (Sprint 2 fix)\n'
    );
    const findings = evaluateSpecDrift(dir);
    expect(findings.some((f) => f.rule_id === 'spec-drift-readme-hex')).toBe(true);
  });

  it('passes when README has no stale blockers', () => {
    const dir = mkdtempSync(join(tmpdir(), 'gtcx-spec-drift-'));
    writeFileSync(join(dir, 'README.md'), '# GTCX Core\n\n21 / 21 packages on npm.\n');
    const findings = evaluateSpecDrift(dir);
    expect(findings).toHaveLength(0);
  });
});
