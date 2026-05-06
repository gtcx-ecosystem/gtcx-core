#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean);

const allowlistedPrivateKeyFixtures = new Set([
  'packages/api-client/tests/fixtures/mtls/ca.key',
  'packages/api-client/tests/fixtures/mtls/client.key',
  'packages/api-client/tests/fixtures/mtls/server.key',
]);

const patterns = [
  { name: 'AWS access key id', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'GitHub token', regex: /gh[pousr]_[A-Za-z0-9_]{30,}/g },
  { name: 'npm token', regex: /npm_[A-Za-z0-9]{30,}/g },
  {
    name: 'private key block',
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
    allowFile: (file) => allowlistedPrivateKeyFixtures.has(file),
  },
];

const findings = [];

function isProbablyText(buffer) {
  return !buffer.includes(0);
}

for (const file of trackedFiles) {
  const buffer = fs.readFileSync(file);
  if (!isProbablyText(buffer)) {
    continue;
  }

  const content = buffer.toString('utf8');

  for (const pattern of patterns) {
    if (pattern.allowFile?.(file)) {
      continue;
    }

    for (const match of content.matchAll(pattern.regex)) {
      const line = content.slice(0, match.index ?? 0).split('\n').length;
      findings.push(`${file}:${line} ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error('Potential committed secrets detected:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Secret scan passed (${trackedFiles.length} repo files scanned).`);
