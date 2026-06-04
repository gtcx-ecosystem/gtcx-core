#!/usr/bin/env node
/**
 * GTCX session start — forwards to baseline-os repo-session-core (SSOT).
 * Rolled out to ecosystem repos via ecosystem:rollout-agent-start.
 *
 * Full chain (INST-003 + gates): baseline start
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { findBaselineOsRoot } from '../../baseline-os/scripts/ecosystem/lib/resolve-baseline-os-root.mjs';

const baselineRoot = findBaselineOsRoot(process.cwd());
if (!baselineRoot) {
  console.error(
    'ERROR: baseline-os not found (side-by-side checkout or set GTCX_ECOSYSTEM_ROOT).',
  );
  console.error('Fallback: run `pnpm agent:next-work` and read docs/operations/agent-universal-instructions.md');
  process.exit(1);
}

const core = join(baselineRoot, 'scripts/ecosystem/repo-session-core.mjs');
const result = spawnSync(process.execPath, [core, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
});
process.exit(result.status ?? 1);
