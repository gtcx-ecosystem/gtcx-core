#!/usr/bin/env node
/**
 * Keep root toolchain files as real copies (no symlinks — Windows/Docker safe).
 * SoR: config/toolchain/*
 *
 * Usage:
 *   node 03-platform/scripts/config/sync-root-stubs.mjs
 *   node 03-platform/scripts/config/sync-root-stubs.mjs --check
 */
import { copyFileSync, existsSync, lstatSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const CHECK = process.argv.includes('--check');

const COPY_PAIRS = [['config/toolchain/turbo.json', 'turbo.json']];

const REEXPORT_STUBS = [
  {
    rel: 'tsconfig.json',
    content: `${JSON.stringify({ extends: './config/toolchain/tsconfig.base.json' }, null, 2)}\n`,
  },
];

function read(rel) {
  return readFileSync(join(REPO, rel), 'utf8');
}

let drift = 0;

function replaceWithCopy(from, to) {
  const dest = join(REPO, to);
  if (existsSync(dest) && lstatSync(dest).isSymbolicLink()) unlinkSync(dest);
  copyFileSync(join(REPO, from), dest);
}

for (const [from, to] of COPY_PAIRS) {
  const src = read(from);
  if (CHECK) {
    if (read(to) !== src) {
      console.log('DRIFT', to, `(sync from ${from})`);
      drift++;
    }
    continue;
  }
  replaceWithCopy(from, to);
}

function replaceStub(rel, content) {
  const dest = join(REPO, rel);
  if (existsSync(dest) && lstatSync(dest).isSymbolicLink()) unlinkSync(dest);
  writeFileSync(dest, content, 'utf8');
}

for (const { rel, content } of REEXPORT_STUBS) {
  if (CHECK) {
    if (read(rel) !== content) {
      console.log('DRIFT', rel);
      drift++;
    }
    continue;
  }
  replaceStub(rel, content);
}

if (CHECK) {
  console.log(drift ? `\n${drift} root stub(s) need sync` : '\nOK — root stubs match config SoR');
  process.exit(drift ? 1 : 0);
}
console.log('sync-root-stubs OK');
