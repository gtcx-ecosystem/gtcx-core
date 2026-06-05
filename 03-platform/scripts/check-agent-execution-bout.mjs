#!/usr/bin/env node
/**
 * Smoke: execution bout is provisioned and structurally valid.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const failures = [];

function fail(msg) {
  failures.push(msg);
}

let json;
try {
  json = JSON.parse(
    execSync('node 03-platform/scripts/agent-next-work.mjs', { cwd: ROOT, encoding: 'utf8' })
  );
} catch (error) {
  fail(`agent-next-work failed: ${error.message}`);
  report();
}

const bout = json?.executionBout;
if (!bout) fail('executionBout missing from agent:next-work output');
if (bout?.schema !== 'gtcx.executionBout.v1') fail(`invalid schema: ${bout?.schema}`);
if (!Array.isArray(bout?.stories)) fail('executionBout.stories must be array');
if (!Array.isArray(bout?.agentInstructions)) fail('executionBout.agentInstructions missing');
if (!bout?.policy?.endOfTurn) fail('executionBout.policy.endOfTurn missing');

const statePath = join(ROOT, '.baseline/execution-bout.json');
if (!existsSync(statePath)) fail('missing .baseline/execution-bout.json');

const state = JSON.parse(readFileSync(statePath, 'utf8'));
if (state.schema !== 'gtcx.executionBout.v1') fail('state file schema mismatch');

if (!existsSync(join(ROOT, '01-docs/04-ops/agent-execution-bout.md'))) {
  fail('missing 01-docs/04-ops/agent-execution-bout.md');
}

for (const line of bout?.agentInstructions ?? []) {
  if (/then STOP/i.test(line)) fail(`forbidden STOP instruction: ${line}`);
}

report();

function report() {
  if (failures.length) {
    console.error('[agent:bout:check] FAILED');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log('[agent:bout:check] OK');
  console.log(
    JSON.stringify(
      {
        stories: bout.stories.length,
        current: bout.currentStoryId,
        boutComplete: bout.boutComplete,
        backlogClear: bout.backlogClear,
      },
      null,
      2
    )
  );
}
