#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const latestPath = path.join(rootDir, 'benchmarks/latest-results.json');
const historyPath = path.join(rootDir, 'benchmarks/history.json');

const maxEntriesArg = process.argv.find((arg) => arg.startsWith('--max='));
const maxEntries = maxEntriesArg ? Number(maxEntriesArg.slice('--max='.length)) : 50;
const safeMaxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? Math.floor(maxEntries) : 50;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toIsoTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

if (!fs.existsSync(latestPath)) {
  console.error(`Missing latest benchmark file: ${path.relative(rootDir, latestPath)}`);
  process.exit(1);
}

const latest = readJson(latestPath);
const latestEntry = {
  recordedAt: toIsoTimestamp(latest.recordedAt ?? new Date().toISOString()),
  source: latest.source ?? 'benchmarks/latest-results.json',
  metrics: latest.metrics ?? {},
};

const history = fs.existsSync(historyPath)
  ? readJson(historyPath)
  : {
      version: 1,
      entries: [],
    };

const entries = Array.isArray(history.entries) ? history.entries : [];

const dedupe = new Set();
const normalized = [];
for (const entry of [...entries, latestEntry]) {
  const key = `${toIsoTimestamp(entry.recordedAt ?? new Date().toISOString())}|${JSON.stringify(entry.metrics ?? {})}`;
  if (dedupe.has(key)) continue;
  dedupe.add(key);
  normalized.push({
    recordedAt: toIsoTimestamp(entry.recordedAt ?? new Date().toISOString()),
    source: entry.source ?? 'manual',
    metrics: entry.metrics ?? {},
  });
}

normalized.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
const trimmed = normalized.slice(-safeMaxEntries);

const existingComparable = JSON.stringify(entries ?? []);
const nextComparable = JSON.stringify(trimmed);
if (existingComparable === nextComparable) {
  console.log(
    `Benchmark history unchanged: ${path.relative(rootDir, historyPath)} (${trimmed.length} entries, latest ${latestEntry.recordedAt}).`
  );
  process.exit(0);
}

const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  maxEntries: safeMaxEntries,
  entries: trimmed,
};

fs.writeFileSync(historyPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `Benchmark history updated: ${path.relative(rootDir, historyPath)} (${trimmed.length} entries, latest ${latestEntry.recordedAt}).`
);
