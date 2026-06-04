#!/usr/bin/env node
/**
 * Execution bout status — (re)provision Class R drain plan from P22 sources.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  attachExecutionBout,
  buildExecutionBout,
  readRepoContext,
  writeBoutState,
} from './lib/agent-execution-bout.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const JSON_OUT = process.argv.includes('--json');

let nextWork = {};
try {
  const raw = execSync('node scripts/agent-next-work.mjs', {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  nextWork = JSON.parse(raw);
} catch (error) {
  const msg = error.stderr?.toString() || error.message;
  console.error(`[agent:bout] agent:next-work failed: ${msg}`);
  process.exit(1);
}

if (JSON_OUT) {
  console.log(JSON.stringify(nextWork.executionBout ?? {}, null, 2));
  process.exit(0);
}

const bout = nextWork.executionBout ?? buildExecutionBout({
  repoRoot: ROOT,
  nextWork,
  ...readRepoContext(ROOT),
});
writeBoutState(ROOT, bout);

console.log('=== Execution bout (intrinsic — P22 extension) ===\n');
console.log(`Plan: ${bout.id}`);
console.log(`Class R remaining: ${bout.stories?.length ?? 0} (current: ${bout.currentStoryId ?? 'none'})`);
console.log(`Bout complete: ${bout.boutComplete}`);
console.log(`Backlog clear: ${bout.backlogClear}`);
if (bout.stories?.length) {
  console.log('\nStories:');
  for (const s of bout.stories) {
    console.log(`  - [${s.status}] ${s.storyId}: ${s.title}`);
  }
}
if (bout.humanOnly?.length) {
  console.log('\nHuman only (Class S):');
  for (const h of bout.humanOnly) {
    console.log(`  - ${h.storyId}: ${h.title}`);
  }
}
console.log(`\nNormative: ${bout.normativeDoc}`);
console.log(`State: ${bout.statePath}\n`);
