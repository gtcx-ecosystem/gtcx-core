#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const rootDir = process.cwd();
const budgetsPath = path.join(rootDir, 'benchmarks/bundle-size-budgets.json');
const packageFilter = readOption('--package');

function readOption(name) {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(name);
  if (index !== -1) return process.argv[index + 1];
  return undefined;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function packageDir(packageName) {
  return path.join(rootDir, 'packages', packageName.replace('@gtcx/', ''));
}

function formatBytes(bytes) {
  return `${bytes.toLocaleString('en-US')} B`;
}

function main() {
  if (!fs.existsSync(budgetsPath)) {
    throw new Error(`Missing bundle budgets file: ${path.relative(rootDir, budgetsPath)}`);
  }

  const budgets = readJson(budgetsPath);
  const packages = Object.entries(budgets.packages ?? {});
  const selected = packageFilter
    ? packages.filter(([packageName]) => packageName === packageFilter)
    : packages;

  if (selected.length === 0) {
    throw new Error(`No bundle budget found for package: ${packageFilter}`);
  }

  const failures = [];
  const rows = [];

  for (const [packageName, budget] of selected) {
    const entryPath = path.join(packageDir(packageName), 'dist/index.mjs');
    if (!fs.existsSync(entryPath)) {
      failures.push(`${packageName}: missing dist/index.mjs (run pnpm build first)`);
      continue;
    }

    const source = fs.readFileSync(entryPath);
    const rawBytes = source.length;
    const gzipBytes = zlib.gzipSync(source, { level: 9 }).length;
    const maxBytes = Number(budget.max);

    if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
      failures.push(`${packageName}: invalid budget value ${budget.max}`);
      continue;
    }

    const pass = gzipBytes <= maxBytes;
    if (!pass) {
      failures.push(
        `${packageName}: gzip ${formatBytes(gzipBytes)} exceeds budget ${formatBytes(maxBytes)}`
      );
    }

    rows.push({
      packageName,
      rawBytes,
      gzipBytes,
      maxBytes,
      pass,
    });
  }

  for (const row of rows) {
    const status = row.pass ? 'PASS' : 'FAIL';
    console.log(
      `${status} ${row.packageName}: gzip ${formatBytes(row.gzipBytes)} / ${formatBytes(
        row.maxBytes
      )} (raw ${formatBytes(row.rawBytes)})`
    );
  }

  if (failures.length > 0) {
    console.error('\nBundle budget check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`\nBundle budget check passed (${rows.length} package(s)).`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
