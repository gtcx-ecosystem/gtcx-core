#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const failures = [];

let json;
try {
  json = JSON.parse(
    execSync('node scripts/agent-next-work.mjs', { cwd: ROOT, encoding: 'utf8' }),
  );
} catch (e) {
  failures.push(`agent-next-work: ${e.message}`);
}

const lf = json?.launchFocus;
if (!lf) failures.push('launchFocus missing');
if (lf?.schema !== 'gtcx.launchFocus.v1') failures.push('invalid launch schema');
if (!lf?.northStar?.outcome) failures.push('northStar.outcome missing');
if (!lf?.workSet?.implement && !lf?.workSet?.plan) failures.push('workSet empty');
if (!['implement', 'plan', 'witness'].includes(lf?.sessionMode)) {
  failures.push(`invalid sessionMode: ${lf?.sessionMode}`);
}
if (!existsSync(join(ROOT, '.baseline/launch-focus.json'))) {
  failures.push('missing .baseline/launch-focus.json');
}

if (failures.length) {
  console.error('[agent:launch:check] FAILED');
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log('[agent:launch:check] OK', JSON.stringify(lf.workSetCounts, null, 0));
