#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const scorecardPath = path.join(rootDir, 'artifacts/ai-scorecard.json');
const maxAgeDays = Number(process.env.AI_SCORECARD_MAX_AGE_DAYS ?? '14');

function fail(message) {
  console.error(`AI scorecard check failed: ${message}`);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(scorecardPath)) {
    fail(
      `missing ${path.relative(rootDir, scorecardPath)} — run pnpm ai:evaluate --output artifacts/ai-scorecard.json`
    );
  }

  let scorecard;
  try {
    scorecard = JSON.parse(fs.readFileSync(scorecardPath, 'utf8'));
  } catch (error) {
    fail(`invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!scorecard.meta?.timestamp) {
    fail('scorecard missing meta.timestamp');
  }
  if (!scorecard.summary?.overall_status) {
    fail('scorecard missing summary.overall_status');
  }

  const generatedAt = Date.parse(scorecard.meta.timestamp);
  if (Number.isNaN(generatedAt)) {
    fail(`invalid meta.timestamp: ${scorecard.meta.timestamp}`);
  }

  const ageMs = Date.now() - generatedAt;
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  if (ageMs > maxAgeMs) {
    fail(
      `scorecard older than ${maxAgeDays} days (${scorecard.meta.timestamp}) — regenerate with pnpm ai:evaluate`
    );
  }

  console.log(
    `AI scorecard OK: ${path.relative(rootDir, scorecardPath)} (${scorecard.summary.overall_status}, ${scorecard.meta.timestamp})`
  );
}

main();
