#!/usr/bin/env node
/**
 * Merge session-backfill + canonical duplicate YAML blocks in 01-docs/05-audit/*.md
 * @usage node 03-platform/tools/merge-duplicate-audit-frontmatter.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const AUDIT_DIR = join(process.cwd(), '01-docs/05-audit');
const write = process.argv.includes('--write');

const DUPLICATE_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n\r?\n---\r?\n\r?\n([\s\S]*?)\r?\n---\r?\n/;

function mergeContent(content, file) {
  const m = content.match(DUPLICATE_RE);
  if (!m) return null;
  const firstBlock = content.slice(4, content.indexOf('\n---', 4));
  if (!firstBlock.includes('session-backfill')) return null;
  const canonical = m[1].trimEnd();
  return `---\n${canonical}\n---\n${content.slice(m[0].length)}`;
}

const files = readdirSync(AUDIT_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => join(AUDIT_DIR, f));

let changed = 0;
for (const path of files) {
  const content = readFileSync(path, 'utf8');
  const merged = mergeContent(content, path);
  if (!merged || merged === content) continue;
  changed += 1;
  const rel = path.replace(process.cwd() + '/', '');
  if (write) {
    writeFileSync(path, merged, 'utf8');
    console.log(`merged: ${rel}`);
  } else {
    console.log(`would merge: ${rel}`);
  }
}

if (!write) {
  console.log(`\n${changed} file(s) — run with --write to apply`);
} else {
  console.log(`\n${changed} file(s) updated`);
}
