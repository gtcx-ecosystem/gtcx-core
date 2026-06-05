#!/usr/bin/env node
/**
 * Agent Context Attestation verifier — PR bodies, commit messages, or files.
 * Provider-agnostic; use in CI for agent-touching PRs.
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  AGENT_PATH_GLOBS,
  parseAttestation,
  readRepoFile,
  textRequiresAttestation,
} from './lib/agent-check-utils.mjs';

const ROOT = process.cwd();
const args = process.argv.slice(2);

function readArgFile(flag) {
  const i = args.indexOf(flag);
  if (i === -1 || !args[i + 1]) return null;
  const p = args[i + 1];
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

function stagedTouchesAgentPaths() {
  try {
    const out = execSync('git diff --cached --name-only', {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return out
      .split('\n')
      .some((f) => AGENT_PATH_GLOBS.some((g) => f.startsWith(g) || f === g.replace(/\/$/, '')));
  } catch {
    return false;
  }
}

function prDiffTouchesAgentPaths() {
  const base = process.env.GITHUB_BASE_SHA ?? process.env.PR_BASE_SHA;
  if (base) {
    try {
      const out = execSync(`git diff --name-only ${base}...HEAD`, {
        cwd: ROOT,
        encoding: 'utf8',
      });
      return out
        .split('\n')
        .filter(Boolean)
        .some((f) => AGENT_PATH_GLOBS.some((g) => f.startsWith(g) || f === g.replace(/\/$/, '')));
    } catch {
      // fall through
    }
  }
  return false;
}

function prTouchesAgentPaths(event) {
  if (prDiffTouchesAgentPaths()) return true;

  try {
    const out = execSync(
      `gh pr diff ${event.pull_request.number} --name-only 2>/dev/null || true`,
      { cwd: ROOT, encoding: 'utf8' }
    );
    if (out.trim()) {
      return out
        .split('\n')
        .some((f) => AGENT_PATH_GLOBS.some((g) => f.startsWith(g) || f === g.replace(/\/$/, '')));
    }
  } catch {
    // gh not available
  }

  const title = event.pull_request?.title ?? '';
  const body = event.pull_request?.body ?? '';
  return /agent|protocol|AGENTS\.md/i.test(`${title}\n${body}`);
}

function loadPrEvent() {
  const path = process.env.GITHUB_EVENT_PATH;
  if (!path || !existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function fail(msg) {
  console.error(msg);
  console.error('\nTemplate: 01-docs/04-ops/agent-attestation-template.md');
  process.exit(1);
}

let text = readArgFile('--file');
const prMode = args.includes('--pr');
const stagedMode = args.includes('--staged');
const commitMsgMode = args.includes('--commit-msg');

if (commitMsgMode) {
  if (!stagedTouchesAgentPaths()) {
    console.log('agent:attestation:check — commit does not touch agent paths, skip.');
    process.exit(0);
  }
  text = readArgFile('--commit-msg') ?? readRepoFile('.git/COMMIT_EDITMSG');
  if (text) {
    const result = parseAttestation(text);
    if (!result.ok) {
      fail(`Commit message attestation incomplete:\n  - ${result.missing.join('\n  - ')}`);
    }
    console.log('Agent Context Attestation check passed (commit message).');
    process.exit(0);
  }
  fail('Commit touches agent paths but message has no attestation block.');
}

if (prMode) {
  const event = loadPrEvent();
  if (!event?.pull_request) {
    console.log('agent:attestation:check — not a PR event, skip.');
    process.exit(0);
  }
  if (!prTouchesAgentPaths(event)) {
    console.log('agent:attestation:check — PR does not touch agent paths, skip.');
    process.exit(0);
  }
  text = event.pull_request.body ?? '';
  if (!text?.trim()) {
    fail('PR touches agent paths but body is empty. Add ## Agent Context Attestation block.');
  }
}

if (stagedMode) {
  if (!stagedTouchesAgentPaths()) {
    console.log('agent:attestation:check — staged files do not touch agent paths, skip.');
    process.exit(0);
  }
  text = readArgFile('--file') ?? process.env.AGENT_ATTESTATION_TEXT ?? '';
  if (!text.trim()) {
    fail(
      'Staged agent-path changes require attestation in commit message or AGENT_ATTESTATION_TEXT.'
    );
  }
}

if (!text && args.includes('--require')) {
  text = readArgFile('--file') ?? '';
}

if (!text) {
  console.log(
    'Usage: pnpm agent:attestation:check --pr | --staged [--file path] | --commit-msg path'
  );
  process.exit(0);
}

const result = parseAttestation(text);
if (!result.ok) {
  fail(`Attestation incomplete. Missing checked items:\n  - ${result.missing.join('\n  - ')}`);
}

console.log('Agent Context Attestation check passed.');
