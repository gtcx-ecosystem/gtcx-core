#!/usr/bin/env node
// @ts-check
/**
 * Threat Matrix Validator — gtcx-core
 *
 * Reads 01-docs/09-security/threat-control-matrix.md, parses the Control Register,
 * and validates:
 *   1. All 12 controls (T01–T12) are present.
 *   2. The matrix file date is within the last 90 days.
 *   3. Controls marked ✅ have all referenced evidence files on disk.
 *   4. Controls marked ⚠️ or 🔴 have either evidence files on disk OR a
 *      corresponding remediation item in 01-docs/remediation/REMEDIATION_PLAN.md.
 *
 * Exit codes: 0 = all checks pass, 1 = any check fails.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MATRIX_PATH = '01-docs/09-security/threat-control-matrix.md';
const REMEDIATION_PATH = '01-docs/remediation/REMEDIATION_PLAN.md';
const EXPECTED_CONTROLS = 12;
const STALE_DAYS = 90;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const STATUS_PASS = '✅';
const STATUS_WARN = '⚠️';
const STATUS_FAIL = '🔴';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fatal(message) {
  console.error(`FATAL: ${message}`);
  process.exit(1);
}

function error(message) {
  console.error(`  ❌ ${message}`);
}

function warn(message) {
  console.warn(`  ⚠️  ${message}`);
}

function ok(message) {
  console.log(`  ✅ ${message}`);
}

function info(message) {
  console.log(`  ℹ️  ${message}`);
}

/**
 * Extract backtick-quoted file paths from an evidence cell.
 * e.g. "`foo.ts`, `bar.md`" => ["foo.ts", "bar.md"]
 */
function parseEvidencePaths(cell) {
  const paths = [];
  const re = /`([^`]+)`/g;
  let m;
  while ((m = re.exec(cell)) !== null) {
    paths.push(m[1].trim());
  }
  return paths;
}

/**
 * Parse the Control Register markdown table into an array of control objects.
 */
function parseControlRegister(content) {
  const lines = content.split(/\r?\n/);
  const controls = [];
  let inTable = false;

  for (const line of lines) {
    // Detect table header row
    if (line.startsWith('| #   | Threat')) {
      inTable = true;
      continue;
    }
    // Skip separator row
    if (inTable && line.match(/^\|[\s\-:]+\|/)) {
      continue;
    }
    // End of table
    if (inTable && !line.trim().startsWith('|')) {
      break;
    }
    if (inTable) {
      const parts = line
        .split('|')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      // Expected columns: #, Threat, Control, Status, Evidence, Last Verified
      if (parts.length >= 5) {
        const id = parts[0];
        const threat = parts[1];
        const control = parts[2];
        const status = parts[3];
        const evidenceCell = parts[4] || '';
        const lastVerified = parts[5] || '';
        const evidencePaths = parseEvidencePaths(evidenceCell);
        controls.push({
          id,
          threat,
          control,
          status,
          evidencePaths,
          lastVerified,
          rawEvidence: evidenceCell,
        });
      }
    }
  }

  return controls;
}

/**
 * Extract the matrix file date from the front-matter block at the top of the
 * markdown file (line like "> **Date:** 2026-05-12").
 */
function parseMatrixDate(content) {
  const m = content.match(/^>\s*\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})\s*$/m);
  if (m) {
    return { dateStr: m[1], date: new Date(m[1] + 'T00:00:00') };
  }
  return null;
}

/**
 * Check whether 01-docs/remediation/REMEDIATION_PLAN.md contains a reference to
 * the given control ID (e.g. "T11"). We look for the control ID appearing
 * anywhere in the remediation file as a loose proxy for "there is a tracked
 * remediation item".
 */
function hasRemediationReference(controlId, remediationContent) {
  if (!remediationContent) return false;
  // Match the control ID as a whole word / token.
  const re = new RegExp(`\\b${controlId}\\b`);
  return re.test(remediationContent);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let matrixContent;
try {
  matrixContent = readFileSync(MATRIX_PATH, 'utf-8');
} catch (e) {
  fatal(`Cannot read ${MATRIX_PATH}: ${e.message}`);
}

let remediationContent = '';
try {
  remediationContent = readFileSync(REMEDIATION_PATH, 'utf-8');
} catch {
  // Remediation plan is optional for the validator, but we warn later.
}

console.log('Threat Matrix Validator');
console.log('=======================\n');

let failures = 0;

// ---------------------------------------------------------------------------
// 1. File freshness (within 90 days)
// ---------------------------------------------------------------------------

const matrixDateResult = parseMatrixDate(matrixContent);
if (matrixDateResult) {
  const { dateStr, date } = matrixDateResult;
  const ageDays = (Date.now() - date.getTime()) / MS_PER_DAY;
  if (ageDays > STALE_DAYS) {
    error(
      `Matrix is stale: dated ${dateStr} (${Math.floor(ageDays)} days old, max ${STALE_DAYS}).`
    );
    failures++;
  } else {
    ok(`Matrix date ${dateStr} is within ${STALE_DAYS} days (${Math.floor(ageDays)} days old).`);
  }
} else {
  error('Could not parse a date from the matrix front matter.');
  failures++;
}

// ---------------------------------------------------------------------------
// 2. Parse controls
// ---------------------------------------------------------------------------

const controls = parseControlRegister(matrixContent);
if (controls.length === 0) {
  fatal('No controls found in the Control Register table.');
}

console.log(`\nControls found: ${controls.length}\n`);

// ---------------------------------------------------------------------------
// 3. Count check
// ---------------------------------------------------------------------------

if (controls.length !== EXPECTED_CONTROLS) {
  error(`Expected ${EXPECTED_CONTROLS} controls, found ${controls.length}.`);
  failures++;
} else {
  ok(`All ${EXPECTED_CONTROLS} controls are present.`);
}

// ---------------------------------------------------------------------------
// 4. Validate each control
// ---------------------------------------------------------------------------

for (const c of controls) {
  console.log(`\n${c.id} — ${c.threat}`);
  console.log(`  Status: ${c.status}`);

  if (c.evidencePaths.length === 0) {
    error('No evidence files referenced.');
    failures++;
    continue;
  }

  // Check evidence file existence
  const missingEvidence = [];
  const foundEvidence = [];
  for (const p of c.evidencePaths) {
    const abs = resolve(p);
    if (existsSync(abs)) {
      foundEvidence.push(p);
    } else {
      missingEvidence.push(p);
    }
  }

  if (missingEvidence.length > 0) {
    warn(`Missing evidence files: ${missingEvidence.join(', ')}`);
  }

  // --- PASS controls -------------------------------------------------------
  if (c.status === STATUS_PASS) {
    if (missingEvidence.length > 0) {
      error(`PASS control missing evidence: ${missingEvidence.join(', ')}`);
      failures++;
    } else {
      ok(`All ${c.evidencePaths.length} evidence file(s) present.`);
    }
    continue;
  }

  // --- WARN / FAIL controls ------------------------------------------------
  // Accept if at least one evidence file exists OR a remediation reference
  // exists.
  const hasRemediation = hasRemediationReference(c.id, remediationContent);

  if (foundEvidence.length > 0) {
    ok(`${foundEvidence.length}/${c.evidencePaths.length} evidence file(s) present.`);
  }

  if (foundEvidence.length === 0 && !hasRemediation) {
    error(
      `No evidence files found and no remediation reference for ${c.id} in ${REMEDIATION_PATH}.`
    );
    failures++;
  } else if (foundEvidence.length === 0 && hasRemediation) {
    warn(`No evidence files, but remediation reference found for ${c.id}.`);
  }
}

// ---------------------------------------------------------------------------
// 5. Summary
// ---------------------------------------------------------------------------

console.log('\n-------------------------\n');

if (failures === 0) {
  console.log(`Threat matrix validation passed (${controls.length} controls checked).`);
  process.exit(0);
} else {
  console.log(`Threat matrix validation FAILED — ${failures} issue(s) found.`);
  process.exit(1);
}
