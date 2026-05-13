#!/usr/bin/env node
/**
 * @file Validates YAML frontmatter on all markdown docs.
 * @usage node tools/check-doc-frontmatter.mjs [file]
 */

import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Valid values per docs/agents/docs-standard-machine-readable.md
const VALID_STATUS = ['current', 'draft', 'deprecated', 'superseded'];
const VALID_OWNERS = ['protocol-architect', 'crypto-security-engineer', 'frontier-infra-engineer', 'quality-evidence-lead', 'product-lead'];
const VALID_TIERS = ['critical', 'standard', 'informational'];
const VALID_CYCLES = ['quarterly', 'monthly', 'on-change'];
const REQUIRED_FIELDS = ['title', 'status', 'date', 'owner', 'role', 'tier', 'tags', 'review_cycle'];

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
        // Inline array: ["a", "b"]
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
    errors.push({ file: filePath, message: `Invalid status: "${fm.status}". Must be one of: ${VALID_STATUS.join(', ')}` });
  }

  if (fm.owner && !VALID_OWNERS.includes(fm.owner)) {
    errors.push({ file: filePath, message: `Invalid owner: "${fm.owner}". Must be one of: ${VALID_OWNERS.join(', ')}` });
  }

  if (fm.role && !VALID_OWNERS.includes(fm.role)) {
    errors.push({ file: filePath, message: `Invalid role: "${fm.role}". Must be one of: ${VALID_OWNERS.join(', ')}` });
  }

  if (fm.tier && !VALID_TIERS.includes(fm.tier)) {
    errors.push({ file: filePath, message: `Invalid tier: "${fm.tier}". Must be one of: ${VALID_TIERS.join(', ')}` });
  }

  if (fm.review_cycle && !VALID_CYCLES.includes(fm.review_cycle)) {
    errors.push({ file: filePath, message: `Invalid review_cycle: "${fm.review_cycle}". Must be one of: ${VALID_CYCLES.join(', ')}` });
  }

  if (fm.tags) {
    if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
      errors.push({ file: filePath, message: 'tags must be a non-empty array' });
    } else {
      for (const tag of fm.tags) {
        if (!/^[a-z0-9-]+$/.test(tag)) {
          errors.push({ file: filePath, message: `Invalid tag: "${tag}". Must match /^[a-z0-9-]+$/` });
        }
      }
    }
  }

  if (fm.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) {
      errors.push({ file: filePath, message: `Invalid date: "${fm.date}". Must be YYYY-MM-DD` });
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const files = args.length > 0
    ? args.map(f => resolve(ROOT, f))
    : globSync('docs/**/*.md', { cwd: ROOT, absolute: true });

  for (const file of files) {
    if (!existsSync(file)) {
      errors.push({ file, message: 'File does not exist' });
      continue;
    }
    validateFile(file);
  }

  const total = files.length;
  const valid = total - errors.length;

  console.log(`\nDoc frontmatter check: ${valid}/${total} files valid`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const err of errors) {
      const rel = err.file.replace(ROOT + '/', '');
      console.log(`  ❌ ${rel}: ${err.message}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const warn of warnings) {
      const rel = warn.file.replace(ROOT + '/', '');
      console.log(`  ⚠️  ${rel}: ${warn.message}`);
    }
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} doc(s) with frontmatter errors`);
    process.exit(1);
  }

  console.log('\n✅ All docs have valid frontmatter');
  process.exit(0);
}

main();
