#!/usr/bin/env node

/**
 * Select applicable playbooks for an AI CODEOWNER review based on changed file paths.
 *
 * Usage: node select-playbooks.mjs <file1> <file2> ...
 *
 * Reads from stdin if no args. Outputs JSON: { playbooks: ["crypto", ...], filesReviewed: [...] }.
 *
 * Path-prefix rules match `docs/agents/governance/review-prompt.md` § Playbook Selection Rules.
 */

import fs from 'node:fs';
import path from 'node:path';

const PLAYBOOK_RULES = [
  {
    name: 'crypto',
    prefixes: ['packages/crypto/', 'packages/crypto-native/', 'rust/gtcx-crypto/', 'rust/gtcx-zkp/'],
  },
  {
    name: 'security',
    prefixes: ['packages/security/', 'packages/identity/'],
  },
  {
    name: 'verification',
    prefixes: ['packages/verification/', 'packages/workproof/'],
  },
  {
    name: 'ci',
    prefixes: ['.github/workflows/', 'tools/check-'],
  },
  {
    name: 'evidence',
    prefixes: ['quality/', 'docs/audits/', 'benchmarks/'],
  },
];

function readChangedFiles(args) {
  if (args.length > 0) return args;
  const stdin = fs.readFileSync(0, 'utf8');
  return stdin
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function selectPlaybooks(changedFiles) {
  const matched = new Set();
  const filesReviewed = [];

  for (const file of changedFiles) {
    let hit = false;
    for (const rule of PLAYBOOK_RULES) {
      if (rule.prefixes.some((p) => file.startsWith(p))) {
        matched.add(rule.name);
        hit = true;
      }
    }
    if (hit) filesReviewed.push(file);
  }

  return {
    playbooks: [...matched].sort(),
    filesReviewed,
  };
}

function loadPlaybook(name) {
  const playbookPath = path.join(
    process.cwd(),
    'docs/agents/governance/review-playbooks',
    `${name}.md`
  );
  // ci and evidence playbooks ship in Sprint 3+ per README; tolerate absence
  if (!fs.existsSync(playbookPath)) {
    return null;
  }
  return fs.readFileSync(playbookPath, 'utf8');
}

const args = process.argv.slice(2);
const changedFiles = readChangedFiles(args);
const { playbooks, filesReviewed } = selectPlaybooks(changedFiles);

const playbookContents = {};
for (const name of playbooks) {
  const content = loadPlaybook(name);
  if (content !== null) {
    playbookContents[name] = content;
  }
}

console.log(
  JSON.stringify(
    {
      playbooks: Object.keys(playbookContents),
      playbookContents,
      filesReviewed,
      filesSkipped: changedFiles
        .filter((f) => !filesReviewed.includes(f))
        .map((f) => ({ path: f, reason: 'no-applicable-playbook' })),
    },
    null,
    2
  )
);
