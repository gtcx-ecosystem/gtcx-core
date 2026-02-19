#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const budgetsPath = path.join(rootDir, 'benchmarks/performance-budgets.json');
const latestPath = path.join(rootDir, 'benchmarks/latest-results.json');

if (!fs.existsSync(budgetsPath)) {
  console.error(`Missing budgets file: ${path.relative(rootDir, budgetsPath)}`);
  process.exit(1);
}
if (!fs.existsSync(latestPath)) {
  console.error(`Missing latest benchmark results: ${path.relative(rootDir, latestPath)}`);
  process.exit(1);
}

const budgets = JSON.parse(fs.readFileSync(budgetsPath, 'utf8'));
const latest = JSON.parse(fs.readFileSync(latestPath, 'utf8'));

const budgetMetrics = budgets.metrics ?? {};
const latestMetrics = latest.metrics ?? {};

const budgetKeys = Object.keys(budgetMetrics);
if (budgetKeys.length === 0) {
  console.error('Performance budgets file has no metrics.');
  process.exit(1);
}

const failures = [];
for (const key of budgetKeys) {
  const budget = Number(budgetMetrics[key]);
  const observed = Number(latestMetrics[key]);
  if (!Number.isFinite(budget) || budget <= 0) {
    failures.push(`${key}: invalid budget value "${budgetMetrics[key]}"`);
    continue;
  }
  if (!Number.isFinite(observed) || observed < 0) {
    failures.push(`${key}: missing or invalid observed value "${latestMetrics[key]}"`);
    continue;
  }
  if (observed > budget) {
    failures.push(`${key}: observed ${observed} exceeds budget ${budget}`);
  }
}

if (failures.length > 0) {
  console.error('Performance budget check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Performance budget check passed (${budgetKeys.length} metrics, baseline date ${latest.recordedAt ?? 'unknown'}).`
);
