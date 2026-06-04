#!/usr/bin/env node
/**
 * Refresh dimension A from docs/audit/latest.json into bout-progress config.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BOUT_PROGRESS_CONFIG,
  loadBoutProgressConfig,
  overlayFromLatestJson,
} from './lib/agent-bout-progress-gauge.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = join(ROOT, BOUT_PROGRESS_CONFIG);

if (!existsSync(configPath)) {
  console.error('reconcile-bout-progress: missing config');
  process.exit(1);
}

const before = loadBoutProgressConfig(ROOT);
const after = overlayFromLatestJson(before, ROOT);
writeFileSync(configPath, `${JSON.stringify(after, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ ok: true, wrote: BOUT_PROGRESS_CONFIG }, null, 2));
