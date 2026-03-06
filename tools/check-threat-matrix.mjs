#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const matrixPath = path.join(rootDir, 'SOP/2-docs/3-engineering/security/threat-control-matrix.md');

if (!fs.existsSync(matrixPath)) {
  console.error(`Missing threat-control matrix: ${path.relative(rootDir, matrixPath)}`);
  process.exit(1);
}

const raw = fs.readFileSync(matrixPath, 'utf8');
const lines = raw.split('\n');

const dataRows = lines
  .filter((line) => line.trim().startsWith('|'))
  .filter((line) => !line.includes('---'))
  .slice(1); // skip header row

if (dataRows.length === 0) {
  console.error('Threat matrix contains no data rows.');
  process.exit(1);
}

const missing = [];
const invalid = [];
let evidenceCount = 0;

for (const row of dataRows) {
  const cols = row.split('|').map((c) => c.trim());
  if (cols.length < 6) {
    invalid.push(`Malformed row: ${row}`);
    continue;
  }

  const controlId = cols[1];
  const evidence = cols[5];
  if (!evidence || evidence === '-') {
    invalid.push(`Control ${controlId} has no evidence path.`);
    continue;
  }

  const evidencePaths = evidence
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (evidencePaths.length === 0) {
    invalid.push(`Control ${controlId} has empty evidence entries.`);
    continue;
  }

  for (const evidencePath of evidencePaths) {
    const normalized = evidencePath.replace(/`/g, '');
    const absolutePath = path.join(rootDir, normalized);
    if (!fs.existsSync(absolutePath)) {
      missing.push(`${controlId}: missing evidence file ${normalized}`);
      continue;
    }
    evidenceCount += 1;
  }
}

if (invalid.length > 0 || missing.length > 0) {
  console.error('Threat matrix validation failed:\n');
  for (const msg of [...invalid, ...missing]) {
    console.error(`- ${msg}`);
  }
  process.exit(1);
}

console.log(
  `Threat matrix validation passed (${dataRows.length} controls, ${evidenceCount} evidence references).`
);
