#!/usr/bin/env node
/**
 * Coverage regression gate for critical packages.
 *
 * Parses coverage-final.json (Istanbul format) and fails if any critical
 * package drops below the declared thresholds.
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const CRITICAL_PACKAGES = [
  {
    name: '@gtcx/crypto',
    dir: '03-platform/packages/crypto',
    thresholds: { statements: 85, branches: 80, functions: 90, lines: 85 },
  },
  {
    name: '@gtcx/domain',
    dir: '03-platform/packages/domain',
    thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
  },
  {
    name: '@gtcx/security',
    dir: '03-platform/packages/security',
    thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
  },
  {
    name: '@gtcx/services',
    dir: '03-platform/packages/services',
    thresholds: { statements: 90, branches: 75, functions: 85, lines: 90 },
  },
  {
    name: '@gtcx/verification',
    dir: '03-platform/packages/verification',
    thresholds: { statements: 90, branches: 80, functions: 85, lines: 95 },
  },
];

function computeCoverage(coveragePath) {
  if (!fs.existsSync(coveragePath)) {
    return null;
  }
  const data = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));

  let statementsTotal = 0;
  let statementsCovered = 0;
  let branchesTotal = 0;
  let branchesCovered = 0;
  let functionsTotal = 0;
  let functionsCovered = 0;
  let linesTotal = 0;
  let linesCovered = 0;

  for (const fileData of Object.values(data)) {
    const s = fileData.statementMap;
    const sHits = fileData.s;
    for (const key of Object.keys(s)) {
      statementsTotal++;
      if (sHits[key] > 0) statementsCovered++;
    }

    const b = fileData.branchMap;
    const bHits = fileData.b;
    for (const key of Object.keys(b)) {
      const branches = bHits[key];
      for (const hit of branches) {
        branchesTotal++;
        if (hit > 0) branchesCovered++;
      }
    }

    const f = fileData.fnMap;
    const fHits = fileData.f;
    for (const key of Object.keys(f)) {
      functionsTotal++;
      if (fHits[key] > 0) functionsCovered++;
    }

    const l = fileData.statementMap;
    const lHits = fileData.s;
    // Use unique lines from statement map
    const lineSet = new Map();
    for (const key of Object.keys(l)) {
      const line = l[key].start.line;
      lineSet.set(line, (lineSet.get(line) || 0) + lHits[key]);
    }
    for (const hit of lineSet.values()) {
      linesTotal++;
      if (hit > 0) linesCovered++;
    }
  }

  return {
    statements: statementsTotal === 0 ? 100 : (statementsCovered / statementsTotal) * 100,
    branches: branchesTotal === 0 ? 100 : (branchesCovered / branchesTotal) * 100,
    functions: functionsTotal === 0 ? 100 : (functionsCovered / functionsTotal) * 100,
    lines: linesTotal === 0 ? 100 : (linesCovered / linesTotal) * 100,
  };
}

const failures = [];

for (const pkg of CRITICAL_PACKAGES) {
  const coveragePath = path.join(rootDir, pkg.dir, 'coverage', 'coverage-final.json');
  const coverage = computeCoverage(coveragePath);

  if (!coverage) {
    failures.push(`${pkg.name}: no coverage data found at ${coveragePath}`);
    continue;
  }

  for (const [metric, threshold] of Object.entries(pkg.thresholds)) {
    const actual = coverage[metric];
    if (actual < threshold) {
      failures.push(`${pkg.name}: ${metric} ${actual.toFixed(2)}% < threshold ${threshold}%`);
    }
  }
}

if (failures.length > 0) {
  console.error('Coverage gate failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Coverage gate passed for ${CRITICAL_PACKAGES.length} critical packages.`);
