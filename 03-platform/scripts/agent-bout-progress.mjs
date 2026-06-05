#!/usr/bin/env node
/**
 * Print bout progress gauge (human or JSON).
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildProgressGauge } from './lib/agent-bout-progress-gauge.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JSON_OUT = process.argv.includes('--json');

const gauge = buildProgressGauge(ROOT);
if (!gauge) {
  console.error('agent:bout-progress: missing .baseline/bout-progress.config.json');
  process.exit(1);
}

if (JSON_OUT) {
  console.log(JSON.stringify(gauge, null, 2));
  process.exit(0);
}

console.log(`=== Bout progress gauge — ${gauge.repo} ===\n`);
console.log(gauge.reportMarkdown);
console.log(`\nConfig: .baseline/bout-progress.config.json`);
console.log(`Normative: ${gauge.normativeDoc}`);
