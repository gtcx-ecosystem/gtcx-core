#!/usr/bin/env node
/**
 * CI: bout-progress.config.json valid + gauge computes.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  BOUT_PROGRESS_CONFIG,
  BOUT_PROGRESS_DOC,
  buildProgressGauge,
} from './lib/agent-bout-progress-gauge.mjs';

const ROOT = process.cwd();
const failures = [];

if (!existsSync(join(ROOT, BOUT_PROGRESS_CONFIG))) {
  failures.push(`missing ${BOUT_PROGRESS_CONFIG}`);
}
if (!existsSync(join(ROOT, BOUT_PROGRESS_DOC))) {
  failures.push(`missing ${BOUT_PROGRESS_DOC}`);
}

const gauge = buildProgressGauge(ROOT, { applyLatestJson: false });
if (!gauge) {
  failures.push('buildProgressGauge returned null');
} else {
  if (gauge.schema !== 'gtcx.boutProgressGauge.v1') failures.push('invalid gauge schema');
  if (typeof gauge.composite !== 'number') failures.push('composite not computed');
  if (!gauge.weights || Object.keys(gauge.weights).length === 0) {
    failures.push('weights empty');
  }
  for (const [key, w] of Object.entries(gauge.weights ?? {})) {
    if (!gauge.dimensions[key]) failures.push(`weight key missing dimension: ${key}`);
    if (typeof w !== 'number') failures.push(`invalid weight for ${key}`);
  }
  for (const task of gauge.tasks) {
    if (!task.id) failures.push('task missing id');
    if (!task.doneWhen) failures.push(`task ${task.id ?? '?'} missing doneWhen`);
  }
}

if (failures.length) {
  console.error('[agent:bout-progress:check] FAILED');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `[agent:bout-progress:check] OK composite=${gauge.composite} tasks=${gauge.tasks.length}`,
);
