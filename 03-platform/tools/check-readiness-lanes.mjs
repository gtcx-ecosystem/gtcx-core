#!/usr/bin/env node
/**
 * Validates five-lane readiness SSOT: latest.json, required indexes, forbidden deprecated phrases in audit hub files.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];

function readJson(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    failures.push(`Missing: ${rel}`);
    return null;
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const latest = readJson('01-docs/05-audit/latest.json');
if (latest) {
  const lanes = latest.lanes ?? {};
  const required = [
    'engineeringCompletenessQuality',
    'internalCompliance',
    'industryCompliance',
    'bankGrade',
    'gtmReadiness',
  ];
  for (const key of required) {
    if (!lanes[key]) failures.push(`latest.json missing lanes.${key}`);
  }
  const ic = lanes.industryCompliance;
  if (ic && !ic.industryComplianceTier) {
    failures.push('latest.json: industryCompliance.industryComplianceTier required');
  }
  if (ic?.index && !existsSync(join(root, ic.index))) {
    failures.push(`latest.json industry index missing: ${ic.index}`);
  }
  const gtm = lanes.gtmReadiness;
  if (gtm?.gtmReadinessTier && !gtm.gtmReadinessTier.library) {
    failures.push('latest.json: gtmReadiness.gtmReadinessTier.library required');
  }
  const internal = lanes.internalCompliance;
  const domains = internal?.readinessOutcome?.domains;
  if (!domains?.repoHygieneOrganization) {
    failures.push('latest.json: internalCompliance.readinessOutcome.domains incomplete');
  }
  if (latest.ratingScales?.externalDependent) {
    failures.push('latest.json: remove deprecated ratingScales.externalDependent');
  }
  if (lanes.externalDependentCompliance) {
    failures.push('latest.json: remove deprecated lanes.externalDependentCompliance');
  }
  if (lanes.gtm) {
    failures.push('latest.json: rename lanes.gtm to gtmReadiness');
  }
}

const requiredIndexes = [
  '01-docs/05-audit/readiness-model.md',
  '01-docs/05-audit/internal-compliance-2026-06-05.md',
  '01-docs/05-audit/industry-compliance-2026-06-05.md',
  '01-docs/05-audit/global-compliance-rating-2026-06-05.md',
  '01-docs/05-audit/gtm-readiness-2026-06-05.md',
  '01-docs/01-agents/readiness-and-audit-lanes.md',
];

if (latest && !latest.globalComplianceRating?.tier) {
  failures.push('latest.json: globalComplianceRating.tier required (GCR-T0–T4)');
}
if (latest && !latest.globalComplianceRating?.status) {
  failures.push('latest.json: globalComplianceRating.status required');
}

for (const rel of requiredIndexes) {
  if (!existsSync(join(root, rel))) failures.push(`Missing required index: ${rel}`);
}

const forbiddenPath = join(root, '01-docs/05-audit/external-dependent-compliance-2026-06-05.md');
if (existsSync(forbiddenPath)) {
  failures.push('Remove deprecated 01-docs/05-audit/external-dependent-compliance-2026-06-05.md');
}

// Hub files that must not use deprecated lane language (guide doc lists deprecated terms intentionally).
const hubFiles = [
  'README.md',
  '01-docs/README.md',
  '01-docs/05-audit/README.md',
  '01-docs/overview/README.md',
];

const forbiddenPhrases = [
  { pattern: /external-dependent compliance/i, hint: 'Use Industry Compliance' },
  { pattern: /\| 5 GTM \|/i, hint: 'Use GTM-Readiness in lane tables' },
  { pattern: /internal compliance.*~9\.6/i, hint: 'Use 9.0 composite + domains' },
];

for (const rel of hubFiles) {
  const p = join(root, rel);
  if (!existsSync(p)) continue;
  const text = readFileSync(p, 'utf8');
  for (const { pattern, hint } of forbiddenPhrases) {
    if (pattern.test(text)) failures.push(`${rel}: forbidden phrase (${hint})`);
  }
}

if (failures.length) {
  console.error('Readiness lanes check failed:\n');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log('Readiness lanes check passed (SSOT + indexes + anti-drift hub scan).');
