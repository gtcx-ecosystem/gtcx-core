#!/usr/bin/env node

/**
 * Operational prerequisites verifier for gtcx-core.
 *
 * Catches the kind of drift that bus-factor=1 hides: secrets that were
 * never rotated, branch protection rules that someone disabled, a
 * CODEOWNER bot account that fell out of the org without anyone noticing.
 * The cost of running it is seconds; the cost of not running it is the
 * audit's biggest-risk callout.
 *
 * Run: `pnpm ops:check`
 *
 * Exit codes:
 *   0 — all checks pass (or skipped due to scope; see warnings)
 *   1 — at least one check failed (drift detected — fix before merging)
 *
 * Each check below has a uniform shape:
 *   - id          stable identifier for cross-referencing in commits/incidents
 *   - description one-line human-readable summary
 *   - verify()    runs the gh api / curl call, returns {status, detail}
 *   - remediate() returns a string with the exact fix command + UI fallback
 *
 * Adding a new check: extend the CHECKS array. The doc table at
 * docs/operations/repo-bootstrap.md is generated from the same array (run
 * `node tools/check-ops-prereqs.mjs --emit-doc` to regenerate it).
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = 'gtcx-ecosystem/gtcx-core';
const ORG = 'gtcx-ecosystem';
const GTCX_AGENT_ID = 283082388;

// ---------------------------------------------------------------------------
// gh api helper — returns { ok, body, status } and never throws
// ---------------------------------------------------------------------------

function ghApi(args) {
  try {
    const out = execFileSync('gh', ['api', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: true, body: out };
  } catch (err) {
    const stderr = err.stderr?.toString() ?? '';
    const stdout = err.stdout?.toString() ?? '';
    const statusMatch = stderr.match(/HTTP (\d+)/);
    return {
      ok: false,
      body: stdout,
      stderr,
      status: statusMatch ? Number(statusMatch[1]) : null,
    };
  }
}

function ghAvailable() {
  try {
    execFileSync('gh', ['auth', 'status'], { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

const CHECKS = [
  {
    id: 'gh-cli-available',
    description: 'gh CLI authenticated',
    verify: async () => {
      if (!ghAvailable()) {
        return { status: 'fail', detail: 'gh CLI not found or not authenticated' };
      }
      return { status: 'pass', detail: 'gh CLI authenticated' };
    },
    remediate: () =>
      'Install: https://cli.github.com/  Then: gh auth login',
  },
  {
    id: 'anthropic-api-key',
    description: 'ANTHROPIC_API_KEY repo secret is set (AI CODEOWNER primary provider)',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/actions/secrets`]);
      if (!res.ok) {
        if (res.status === 403 || res.status === 404) {
          return { status: 'skip', detail: `insufficient token scope (HTTP ${res.status}) — need admin on repo` };
        }
        return { status: 'fail', detail: `gh api error: ${res.stderr.trim()}` };
      }
      const body = JSON.parse(res.body);
      const has = body.secrets?.some((s) => s.name === 'ANTHROPIC_API_KEY');
      return has
        ? { status: 'pass', detail: 'ANTHROPIC_API_KEY present' }
        : { status: 'fail', detail: 'ANTHROPIC_API_KEY missing' };
    },
    remediate: () =>
      `gh secret set ANTHROPIC_API_KEY --repo ${REPO}\n` +
      `  UI: https://github.com/${REPO}/settings/secrets/actions`,
  },
  {
    id: 'openai-api-key',
    description: 'OPENAI_API_KEY repo secret is set (AI CODEOWNER fallback provider)',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/actions/secrets`]);
      if (!res.ok) {
        return { status: 'skip', detail: 'covered by anthropic-api-key skip' };
      }
      const body = JSON.parse(res.body);
      const has = body.secrets?.some((s) => s.name === 'OPENAI_API_KEY');
      return has
        ? { status: 'pass', detail: 'OPENAI_API_KEY present' }
        : {
            status: 'warn',
            detail: 'OPENAI_API_KEY missing — AI CODEOWNER has no fallback if Anthropic is down (bus-factor risk)',
          };
    },
    remediate: () =>
      `gh secret set OPENAI_API_KEY --repo ${REPO}  # closes bus-factor on ai codeowner review`,
  },
  {
    id: 'turbo-token',
    description: 'TURBO_TOKEN repo secret is set',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/actions/secrets`]);
      if (!res.ok) {
        return { status: 'skip', detail: 'covered by anthropic-api-key skip' };
      }
      const body = JSON.parse(res.body);
      const has = body.secrets?.some((s) => s.name === 'TURBO_TOKEN');
      return has
        ? { status: 'pass', detail: 'TURBO_TOKEN present' }
        : {
            status: 'warn',
            detail: 'TURBO_TOKEN missing — CI works but turbo cache is cold',
          };
    },
    remediate: () =>
      `gh secret set TURBO_TOKEN --repo ${REPO}  # generate at https://vercel.com/account/tokens`,
  },
  {
    id: 'turbo-team',
    description: 'TURBO_TEAM repo variable is set',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/actions/variables`]);
      if (!res.ok) {
        return { status: 'skip', detail: 'insufficient token scope' };
      }
      const body = JSON.parse(res.body);
      const has = body.variables?.some((v) => v.name === 'TURBO_TEAM');
      return has
        ? { status: 'pass', detail: 'TURBO_TEAM present' }
        : { status: 'warn', detail: 'TURBO_TEAM missing — paired with TURBO_TOKEN' };
    },
    remediate: () =>
      `gh variable set TURBO_TEAM --repo ${REPO} --body "<team-slug>"`,
  },
  {
    id: 'npm-token',
    description: 'NPM_TOKEN repo secret is set (required for publish workflow)',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/actions/secrets`]);
      if (!res.ok) {
        return { status: 'skip', detail: 'covered by anthropic-api-key skip' };
      }
      const body = JSON.parse(res.body);
      const has = body.secrets?.some((s) => s.name === 'NPM_TOKEN');
      return has
        ? { status: 'pass', detail: 'NPM_TOKEN present' }
        : { status: 'warn', detail: 'NPM_TOKEN missing — pnpm publish will fail until set' };
    },
    remediate: () =>
      `gh secret set NPM_TOKEN --repo ${REPO}  # automation token from https://www.npmjs.com/settings/<user>/tokens`,
  },
  {
    id: 'gtcx-agent-org-member',
    description: 'gtcx-agent is a member of gtcx-ecosystem org',
    verify: async () => {
      const res = ghApi([`orgs/${ORG}/members/gtcx-agent`]);
      if (res.ok) return { status: 'pass', detail: 'gtcx-agent is a member' };
      if (res.status === 404) {
        return { status: 'fail', detail: 'gtcx-agent is NOT in the org (CODEOWNERS unreachable)' };
      }
      return { status: 'skip', detail: `cannot verify (HTTP ${res.status})` };
    },
    remediate: () =>
      `gh api orgs/${ORG}/invitations -X POST -f invitee_id=${GTCX_AGENT_ID} -f role=direct_member\n` +
      `  (requires admin:org scope: gh auth refresh -s admin:org)\n` +
      `  UI: https://github.com/orgs/${ORG}/people`,
  },
  {
    id: 'branch-protection-main',
    description: 'main branch protection is enabled',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/branches/main/protection`]);
      if (res.ok) return { status: 'pass', detail: 'main is protected' };
      if (res.status === 404) {
        return { status: 'fail', detail: 'main is NOT protected — CODEOWNERS unenforced' };
      }
      return { status: 'skip', detail: `cannot verify (HTTP ${res.status})` };
    },
    remediate: () =>
      `UI: https://github.com/${REPO}/settings/branches\n` +
      `  Required: code owner review, status checks (CI workflows), no force push, no deletion\n` +
      `  CLI: gh api repos/${REPO}/branches/main/protection -X PUT --input - <<EOF\n` +
      `       (see docs/operations/repo-bootstrap.md for a templated payload)`,
  },
  {
    id: 'branch-protection-codeowner-review',
    description: 'main branch protection requires code owner review',
    verify: async () => {
      const res = ghApi([`repos/${REPO}/branches/main/protection`]);
      if (!res.ok) {
        return { status: 'skip', detail: 'main not protected — covered by branch-protection-main' };
      }
      const body = JSON.parse(res.body);
      const required = body.required_pull_request_reviews?.require_code_owner_reviews;
      return required
        ? { status: 'pass', detail: 'CODEOWNER review required' }
        : { status: 'fail', detail: 'CODEOWNER review NOT required (rule has no teeth)' };
    },
    remediate: () =>
      'In branch protection, enable: "Require review from Code Owners"',
  },
  {
    id: 'codeowners-accounts-exist',
    description: 'all accounts referenced in .github/CODEOWNERS exist',
    verify: async () => {
      const codeownersPath = path.join(process.cwd(), '.github/CODEOWNERS');
      if (!fs.existsSync(codeownersPath)) {
        return { status: 'fail', detail: 'CODEOWNERS file missing' };
      }
      const content = fs.readFileSync(codeownersPath, 'utf8');
      const mentions = new Set();
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        for (const m of trimmed.matchAll(/@([\w-]+(?:\/[\w-]+)?)/g)) {
          mentions.add(m[1]);
        }
      }

      const missing = [];
      for (const mention of mentions) {
        // teams have a slash; users don't
        if (mention.includes('/')) {
          // skip team verification — needs read:org and team-specific scope
          continue;
        }
        const res = ghApi([`users/${mention}`]);
        if (!res.ok && res.status === 404) missing.push(mention);
      }

      if (missing.length === 0) {
        return {
          status: 'pass',
          detail: `verified ${[...mentions].length} reference(s)`,
        };
      }
      return {
        status: 'fail',
        detail: `unknown account(s): ${missing.join(', ')}`,
      };
    },
    remediate: () =>
      'Either create the missing account, remove the entry from .github/CODEOWNERS, or fix the typo',
  },
];

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

const STATUS_GLYPH = {
  pass: '\x1b[32m✓\x1b[0m PASS',
  fail: '\x1b[31m✗\x1b[0m FAIL',
  warn: '\x1b[33m!\x1b[0m WARN',
  skip: '\x1b[90m·\x1b[0m SKIP',
};

async function emitDoc() {
  const lines = [];
  lines.push('# Repository Operational Prerequisites');
  lines.push('');
  lines.push('Auto-generated from `tools/check-ops-prereqs.mjs`. Do not edit by hand — modify the script and run `node tools/check-ops-prereqs.mjs --emit-doc`.');
  lines.push('');
  lines.push('Run `pnpm ops:check` to verify state. Run `pnpm ops:check --json` for machine-readable output.');
  lines.push('');
  lines.push('## Checks');
  lines.push('');
  lines.push('| ID | Description | Remediation |');
  lines.push('|---|---|---|');
  for (const c of CHECKS) {
    const remediation = c.remediate().replace(/\n\s*/g, '<br>').replace(/\|/g, '\\|');
    lines.push(`| \`${c.id}\` | ${c.description} | ${remediation} |`);
  }
  lines.push('');
  lines.push('## Required Token Scopes');
  lines.push('');
  lines.push('The runner relies on `gh auth login` having sufficient scopes. To check secret + branch-protection state, the token needs:');
  lines.push('');
  lines.push('- `repo` (covers branch protection, secrets read)');
  lines.push('- `admin:org` (covers org membership listing)');
  lines.push('');
  lines.push('Refresh: `gh auth refresh -s repo,admin:org`');

  const docPath = path.join(process.cwd(), 'docs/operations/repo-bootstrap.md');
  fs.mkdirSync(path.dirname(docPath), { recursive: true });
  fs.writeFileSync(docPath, lines.join('\n') + '\n');
  console.log(`Wrote ${docPath}`);
}

async function runChecks(jsonMode) {
  const results = [];
  for (const check of CHECKS) {
    const result = await check.verify();
    results.push({ id: check.id, description: check.description, ...result });
  }

  if (jsonMode) {
    console.log(JSON.stringify({ repo: REPO, results }, null, 2));
    const failed = results.some((r) => r.status === 'fail');
    return failed ? 1 : 0;
  }

  console.log(`\nGTCX Repo Operational Prerequisites — ${REPO}\n${'='.repeat(60)}\n`);
  for (const r of results) {
    console.log(`${STATUS_GLYPH[r.status]}  ${r.id.padEnd(35)} ${r.detail}`);
    if (r.status === 'fail' || r.status === 'warn') {
      const check = CHECKS.find((c) => c.id === r.id);
      const fix = check.remediate().replace(/\n/g, '\n           ');
      console.log(`        Fix: ${fix}`);
    }
  }

  const counts = { pass: 0, fail: 0, warn: 0, skip: 0 };
  for (const r of results) counts[r.status]++;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(
    `Summary: ${counts.pass} pass, ${counts.fail} fail, ${counts.warn} warn, ${counts.skip} skip`
  );

  return counts.fail > 0 ? 1 : 0;
}

const args = process.argv.slice(2);
if (args.includes('--emit-doc')) {
  await emitDoc();
  process.exit(0);
}

const exitCode = await runChecks(args.includes('--json'));
process.exit(exitCode);
