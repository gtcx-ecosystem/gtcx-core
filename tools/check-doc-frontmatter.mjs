#!/usr/bin/env node
/**
 * @file Validates YAML frontmatter on markdown docs.
 * @usage node tools/check-doc-frontmatter.mjs [file...]
 * @usage node tools/check-doc-frontmatter.mjs --diff [base-ref]
 */

import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Valid values per Protocol 1 v2.0 §YAML Frontmatter Standard
// https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/1-docs-structure/protocol.md
// Local schema accepts 'deprecated' and 'superseded' as supersets of the protocol's
// 'archived' for backwards-compatibility with pre-v2.0 docs.
const VALID_STATUS = ['current', 'draft', 'archived', 'deprecated', 'superseded'];
const VALID_OWNERS = [
  'protocol-architect',
  'crypto-security-engineer',
  'frontier-infra-engineer',
  'quality-evidence-lead',
  'product-lead',
  'gtcx-core',
];
const VALID_TIERS = ['strategic', 'critical', 'standard', 'informational'];
const VALID_CYCLES = ['quarterly', 'monthly', 'bi-weekly', 'weekly', 'on-change'];
const REQUIRED_FIELDS = ['title', 'status', 'date', 'owner', 'role', 'tier', 'tags', 'review_cycle'];

const DEFAULT_EXCLUDES = [
  '**/README.md',
  '**/templates/**',
  'docs/agents/sessions/**',
  'docs/agents/workflows/agent-*.md',
  'docs/audit/**',
  'docs/gtm/inbound-tickets/**',
];

const errors = [];
const warnings = [];

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return null;
  const raw = match[1];
  const lines = raw.split('\n');
  const data = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    const arrayItem = line.match(/^\s+-\s+(.+)$/);
    if (arrayItem && currentKey) {
      if (!currentArray) {
        currentArray = [];
        data[currentKey] = currentArray;
      }
      currentArray.push(arrayItem[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    const keyValue = line.match(/^(\w+):\s*(.*)$/);
    if (keyValue) {
      currentKey = keyValue[1];
      currentArray = null;
      const value = keyValue[2].trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          data[currentKey] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          data[currentKey] = value;
        }
      } else if (value === '') {
        data[currentKey] = undefined;
      } else {
        data[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return data;
}

function validateFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fm = parseFrontmatter(content);

  if (!fm) {
    errors.push({ file: filePath, message: 'Missing YAML frontmatter' });
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
      errors.push({ file: filePath, message: `Missing required field: ${field}` });
    }
  }

  if (fm.status && !VALID_STATUS.includes(fm.status)) {
    errors.push({
      file: filePath,
      message: `Invalid status: "${fm.status}". Must be one of: ${VALID_STATUS.join(', ')}`,
    });
  }

  if (fm.owner && !VALID_OWNERS.includes(fm.owner)) {
    errors.push({
      file: filePath,
      message: `Invalid owner: "${fm.owner}". Must be one of: ${VALID_OWNERS.join(', ')}`,
    });
  }

  if (fm.role && !VALID_OWNERS.includes(fm.role)) {
    errors.push({
      file: filePath,
      message: `Invalid role: "${fm.role}". Must be one of: ${VALID_OWNERS.join(', ')}`,
    });
  }

  if (fm.tier && !VALID_TIERS.includes(fm.tier)) {
    errors.push({
      file: filePath,
      message: `Invalid tier: "${fm.tier}". Must be one of: ${VALID_TIERS.join(', ')}`,
    });
  }

  if (fm.review_cycle && !VALID_CYCLES.includes(fm.review_cycle)) {
    errors.push({
      file: filePath,
      message: `Invalid review_cycle: "${fm.review_cycle}". Must be one of: ${VALID_CYCLES.join(', ')}`,
    });
  }

  if (fm.tags) {
    if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
      errors.push({ file: filePath, message: 'tags must be a non-empty array' });
    } else {
      for (const tag of fm.tags) {
        if (!/^[a-z0-9-]+$/.test(tag)) {
          errors.push({
            file: filePath,
            message: `Invalid tag: "${tag}". Must match /^[a-z0-9-]+$/`,
          });
        }
      }
    }
  }

  if (fm.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) {
      errors.push({
        file: filePath,
        message: `Invalid date: "${fm.date}". Must be YYYY-MM-DD`,
      });
    }
  }
}

function getChangedFiles(baseRef) {
  try {
    const output = execSync(`git diff --name-only --diff-filter=ACMRT ${baseRef}...HEAD`, {
      cwd: ROOT,
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f.startsWith('docs/') && f.endsWith('.md'))
      .map((f) => resolve(ROOT, f));
  } catch {
    return [];
  }
}

function shouldExclude(filePath, patterns) {
  const rel = relative(ROOT, filePath).replace(/\\/g, '/');
  for (const pattern of patterns) {
    const regex = new RegExp(
      '^' +
        pattern
          .replace(/\*\*/g, '{{GLOBSTAR}}')
          .replace(/\*/g, '[^/]*')
          .replace(/\{\{GLOBSTAR\}\}/g, '.*')
          .replace(/\?/g, '[^/]') +
        '$'
    );
    if (regex.test(rel)) return true;
  }
  return false;
}

function main() {
  const args = process.argv.slice(2);
  let files = [];
  let useDiff = false;
  let baseRef = 'origin/main';
  let excludePatterns = [...DEFAULT_EXCLUDES];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--diff') {
      useDiff = true;
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        baseRef = args[++i];
      }
    } else if (arg === '--exclude') {
      const pattern = args[++i];
      if (pattern) excludePatterns.push(pattern);
    } else if (!arg.startsWith('--')) {
      files.push(resolve(ROOT, arg));
    }
  }

  if (useDiff) {
    files = getChangedFiles(baseRef);
    if (files.length === 0) {
      console.log('No docs changed in this PR. Skipping frontmatter check.');
      process.exit(0);
    }
  } else if (files.length === 0) {
    files = globSync('docs/**/*.md', { cwd: ROOT, absolute: true });
  }

  // Filter out excluded files
  const checkFiles = files.filter((f) => !shouldExclude(f, excludePatterns));
  const excludedCount = files.length - checkFiles.length;

  for (const file of checkFiles) {
    if (!existsSync(file)) {
      errors.push({ file, message: 'File does not exist' });
      continue;
    }
    validateFile(file);
  }

  const total = checkFiles.length;
  const filesWithErrors = new Set(errors.map((e) => e.file)).size;
  const valid = total - filesWithErrors;

  console.log(`\nDoc frontmatter check: ${valid}/${total} files valid`);
  if (excludedCount > 0) {
    console.log(`  (${excludedCount} file(s) excluded by pattern)`);
  }

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const err of errors) {
      const rel = relative(ROOT, err.file);
      console.log(`  - ${rel}: ${err.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const warn of warnings) {
      const rel = relative(ROOT, warn.file);
      console.log(`  - ${rel}: ${warn.message}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} doc(s) with frontmatter errors`);
    process.exit(1);
  }

  console.log('\nAll checked docs have valid frontmatter');
  process.exit(0);
}

main();
