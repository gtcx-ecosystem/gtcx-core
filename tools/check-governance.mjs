#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const codeownersPath = path.join(rootDir, '.github/CODEOWNERS');
const ciWorkflowPath = path.join(rootDir, '.github/workflows/ci.yml');
const releaseWorkflowPath = path.join(rootDir, '.github/workflows/release.yml');

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function ensureFile(filePath, failures) {
  if (!fs.existsSync(filePath)) {
    failures.push(`Missing required file: ${path.relative(rootDir, filePath)}`);
    return false;
  }
  return true;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const failures = [];

if (!ensureFile(packageJsonPath, failures)) {
  console.error('Governance policy check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const pkg = JSON.parse(readText(packageJsonPath));
const scripts = pkg.scripts ?? {};

const requiredScripts = [
  'architecture:check',
  'security:threat-matrix',
  'perf:update-history',
  'perf:check-budgets',
  'api:check',
  'api:check:release',
  'test:coverage:critical',
  'provenance:generate',
  'quality:kpi:collect',
  'quality:kpi:export',
  'docs:check-links',
  'quality:governance:check',
];

for (const scriptName of requiredScripts) {
  if (!scripts[scriptName]) {
    failures.push(`package.json missing required script: "${scriptName}"`);
  }
}

let codeownersRaw = '';
if (ensureFile(codeownersPath, failures)) {
  codeownersRaw = readText(codeownersPath);
}

const requiredCodeownersEntries = [
  '/.github/workflows/',
  '/quality/',
  '/packages/crypto/',
  '/packages/domain/',
  '/packages/security/',
  '/packages/services/',
  '/packages/verification/',
  '/rust/',
];

for (const entry of requiredCodeownersEntries) {
  const pattern = new RegExp(`^\\s*${escapeRegExp(entry)}\\s+@`, 'm');
  if (!pattern.test(codeownersRaw)) {
    failures.push(`CODEOWNERS missing required protected path entry: "${entry}"`);
  }
}

let ciRaw = '';
if (ensureFile(ciWorkflowPath, failures)) {
  ciRaw = readText(ciWorkflowPath);
}

let releaseRaw = '';
if (ensureFile(releaseWorkflowPath, failures)) {
  releaseRaw = readText(releaseWorkflowPath);
}

function checkWorkflowStepNames(raw, workflowLabel, stepNames) {
  for (const stepName of stepNames) {
    if (!raw.includes(`name: ${stepName}`)) {
      failures.push(`${workflowLabel} missing required step: "${stepName}"`);
    }
  }
}

function checkWorkflowCommands(raw, workflowLabel, commands) {
  for (const command of commands) {
    if (!raw.includes(command)) {
      failures.push(`${workflowLabel} missing required command: "${command}"`);
    }
  }
}

checkWorkflowStepNames(ciRaw, 'CI workflow', [
  'Architecture boundaries',
  'Governance policy validation',
  'Threat matrix validation',
  'Update benchmark history snapshot',
  'Performance budget validation',
  'Upload performance report artifact',
  'Critical package coverage',
  'API surface baseline check',
  'Upload API surface report artifact',
  'Generate provenance manifest',
  'Upload provenance artifact',
  'Collect KPI history',
  'Export KPI metrics',
  'Upload KPI metrics artifact',
  'Generate API docs',
  'Validate markdown links',
]);

checkWorkflowCommands(ciRaw, 'CI workflow', [
  'pnpm architecture:check',
  'pnpm quality:governance:check',
  'pnpm security:threat-matrix',
  'pnpm perf:update-history',
  'PERF_ENFORCE_TREND=true pnpm perf:check-budgets',
  'pnpm perf:check-budgets',
  'pnpm test:coverage:critical',
  'pnpm api:check',
  'pnpm provenance:generate',
  'pnpm quality:kpi:collect',
  'pnpm quality:kpi:export',
  'pnpm run docs',
  'pnpm docs:check-links',
]);

checkWorkflowStepNames(releaseRaw, 'Release workflow', [
  'Architecture boundaries',
  'Governance policy validation',
  'Threat matrix validation',
  'Update benchmark history snapshot',
  'Performance budget validation',
  'Upload performance report artifact',
  'Critical package coverage',
  'API surface baseline check',
  'Upload API surface report artifact',
  'Generate provenance manifest',
  'Upload provenance artifact',
  'Collect KPI history',
  'Export KPI metrics',
  'Upload KPI metrics artifact',
  'Generate API docs',
  'Validate markdown links',
]);

checkWorkflowCommands(releaseRaw, 'Release workflow', [
  'pnpm architecture:check',
  'pnpm quality:governance:check',
  'pnpm security:threat-matrix',
  'pnpm perf:update-history',
  'PERF_ENFORCE_TREND=true pnpm perf:check-budgets',
  'pnpm perf:check-budgets',
  'pnpm test:coverage:critical',
  'pnpm api:check',
  'pnpm provenance:generate',
  'pnpm quality:kpi:collect',
  'pnpm quality:kpi:export',
  'pnpm run docs',
  'pnpm docs:check-links',
]);

if (failures.length > 0) {
  console.error('Governance policy check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Governance policy check passed (${requiredScripts.length} scripts, ${requiredCodeownersEntries.length} CODEOWNERS entries, 2 workflows).`
);
