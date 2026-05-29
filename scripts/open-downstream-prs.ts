#!/usr/bin/env tsx
/**
 * Cross-Repo Publish Automation — Downstream PR Opener
 *
 * Triggered by .github/workflows/cross-repo-publish.yml after a successful
 * gtcx-core release. Reads downstream-registry.json, clones affected repos,
 * bumps package versions, runs compatibility checks, and opens PRs.
 *
 * Run locally for testing:
 *   tsx scripts/open-downstream-prs.ts --dry-run --downstream gtcx-protocols
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

interface Downstream {
  repo: string;
  owner: string;
  packages: string[];
  bump_strategy: 'minor_auto' | 'patch_auto' | 'minor_manual' | 'patch_manual';
  required_checks: string[];
  reviewers: string[];
}

interface Registry {
  version: string;
  downstreams: Downstream[];
}

interface PublishedPackage {
  name: string;
  oldVersion: string;
  newVersion: string;
}

const DRY_RUN = process.argv.includes('--dry-run');
const TARGET_DOWNSTREAM = process.argv.find((a) => a.startsWith('--downstream='))?.split('=')[1];

const REGISTRY_PATH = join(__dirname, 'downstream-registry.json');
const GH_TOKEN = process.env.GITHUB_TOKEN || '';

function log(...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(...args);
}

function run(
  cwd: string,
  cmd: string,
  opts: { timeout?: number; ignoreError?: boolean } = {}
): { stdout: string; stderr: string; code: number } {
  try {
    const stdout = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      timeout: opts.timeout || 120000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout: stdout.trim(), stderr: '', code: 0 };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; status?: number };
    if (opts.ignoreError) {
      return {
        stdout: e.stdout?.trim() || '',
        stderr: e.stderr?.trim() || '',
        code: e.status ?? 1,
      };
    }
    throw new Error(`Command failed in ${cwd}: ${cmd}\n${e.stderr || e.stdout || ''}`);
  }
}

function loadRegistry(): Registry {
  if (!existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry not found: ${REGISTRY_PATH}`);
  }
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8')) as Registry;
}

function extractPublishedPackages(): PublishedPackage[] {
  // In CI, this reads the release commit diff to find changed package.json files
  // For local testing, read from environment or fallback to empty
  const packagesEnv = process.env.PUBLISHED_PACKAGES;
  if (packagesEnv) {
    return JSON.parse(packagesEnv) as PublishedPackage[];
  }

  // Fallback: detect from git diff in gtcx-core
  const { stdout } = run(process.cwd(), 'git diff HEAD~1 --name-only');
  const changed = stdout.split('\n').filter((f) => f.includes('package.json'));
  const packages: PublishedPackage[] = [];

  for (const pkgJson of changed) {
    const pkgPath = join(process.cwd(), pkgJson);
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    if (pkg.name && pkg.version) {
      // Try to get previous version from git
      const prev = run(process.cwd(), `git show HEAD~1:${pkgJson}`, {
        ignoreError: true,
      });
      let oldVersion = '0.0.0';
      if (prev.code === 0) {
        try {
          const prevPkg = JSON.parse(prev.stdout);
          oldVersion = prevPkg.version;
        } catch {
          /* empty */
        }
      }
      if (oldVersion !== pkg.version) {
        packages.push({
          name: pkg.name,
          oldVersion,
          newVersion: pkg.version,
        });
      }
    }
  }
  return packages;
}

function shouldAutoOpen(
  strategy: Downstream['bump_strategy'],
  oldVersion: string,
  newVersion: string
): { open: boolean; draft: boolean } {
  const oldParts = oldVersion.split('.').map(Number);
  const newParts = newVersion.split('.').map(Number);
  const isMajor = newParts[0] > oldParts[0];
  const isMinor = newParts[1] > oldParts[1];
  const isPatch = newParts[2] > oldParts[2];

  if (isMajor) return { open: false, draft: false }; // Major bumps never auto-open

  switch (strategy) {
    case 'minor_auto':
      return { open: true, draft: false };
    case 'patch_auto':
      return { open: isPatch && !isMinor, draft: false };
    case 'minor_manual':
      return { open: true, draft: true };
    case 'patch_manual':
      return { open: true, draft: isMinor };
    default:
      return { open: false, draft: false };
  }
}

function runCompatibilityCheck(
  cloneDir: string,
  checks: string[]
): { status: 'PASS' | 'WARN' | 'FAIL'; logs: string } {
  const logs: string[] = [];

  for (const check of checks) {
    let cmd = '';
    switch (check) {
      case 'ci':
        cmd = 'pnpm ci || pnpm test';
        break;
      case 'typecheck':
        cmd = 'pnpm typecheck || npx tsc --noEmit';
        break;
      case 'test':
        cmd = 'pnpm test --run || pnpm test';
        break;
      case 'build':
        cmd = 'pnpm build';
        break;
      case 'security-scan':
        cmd = 'pnpm audit --audit-level=high';
        break;
      default:
        cmd = `pnpm ${check}`;
    }

    log(`  Running compatibility check: ${check}`);
    const result = run(cloneDir, cmd, { ignoreError: true });
    logs.push(`=== ${check} ===\n${result.stdout}\n${result.stderr}`);

    if (result.code !== 0) {
      return { status: 'FAIL', logs: logs.join('\n') };
    }
  }

  return { status: 'PASS', logs: logs.join('\n') };
}

async function openDownstreamPR(
  downstream: Downstream,
  packages: PublishedPackage[]
): Promise<void> {
  log(`\nProcessing downstream: ${downstream.owner}/${downstream.repo}`);

  const affected = packages.filter((p) => downstream.packages.includes(p.name));
  if (affected.length === 0) {
    log(`  No affected packages. Skipping.`);
    return;
  }

  // Determine if we should open a PR
  let shouldOpen = false;
  let isDraft = false;
  for (const pkg of affected) {
    const decision = shouldAutoOpen(downstream.bump_strategy, pkg.oldVersion, pkg.newVersion);
    if (decision.open) shouldOpen = true;
    if (decision.draft) isDraft = true;
  }

  if (!shouldOpen) {
    log(`  Bump strategy ${downstream.bump_strategy} prevents auto-open for these versions.`);
    return;
  }

  // Clone downstream repo
  const cloneDir = mkdtempSync(join(tmpdir(), `gtcx-core-bump-${downstream.repo}-`));
  const repoUrl = `https://x-access-token:${GH_TOKEN}@github.com/${downstream.owner}/${downstream.repo}.git`;

  if (DRY_RUN) {
    log(`  [DRY RUN] Would clone ${downstream.owner}/${downstream.repo} to ${cloneDir}`);
  } else {
    run(process.cwd(), `git clone --depth 1 ${repoUrl} ${cloneDir}`);
  }

  // Bump packages
  const bumpCommands: string[] = [];
  for (const pkg of affected) {
    bumpCommands.push(`${pkg.name}@${pkg.newVersion}`);
  }

  const branchName = `gtcx-core/bump-${affected
    .map((p) => p.name.replace('@gtcx/', ''))
    .join('-')}-${Date.now()}`;

  if (DRY_RUN) {
    log(`  [DRY RUN] Would run: pnpm update ${bumpCommands.join(' ')}`);
    log(`  [DRY RUN] Would create branch: ${branchName}`);
  } else {
    run(cloneDir, `git checkout -b ${branchName}`);
    run(cloneDir, `pnpm update ${bumpCommands.join(' ')}`);
    run(cloneDir, `pnpm install`);
  }

  // Compatibility check
  let compatStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
  let compatLogs = '';
  if (!DRY_RUN) {
    const check = runCompatibilityCheck(cloneDir, downstream.required_checks);
    compatStatus = check.status;
    compatLogs = check.logs;
    if (compatStatus === 'FAIL') {
      isDraft = true;
    }
  } else {
    log(`  [DRY RUN] Would run compatibility checks: ${downstream.required_checks.join(', ')}`);
  }

  // Commit and push
  const summaryLines = affected.map((p) => `- \`${p.name}\`: ${p.oldVersion} → ${p.newVersion}`);
  const commitBody = `chore(deps): bump gtcx-core packages

${summaryLines.join('\n')}

Compatibility: ${compatStatus}

Source: gtcx-core release`;

  if (DRY_RUN) {
    log(`  [DRY RUN] Would commit with message:\n${commitBody}`);
    log(`  [DRY RUN] Would push branch ${branchName}`);
  } else {
    run(cloneDir, 'git add -A');
    run(cloneDir, `git commit -m "${commitBody.replace(/"/g, '\\"')}"`);
    run(cloneDir, `git push origin ${branchName}`);
  }

  // Open PR
  const prTitle = `chore(deps): bump ${affected.map((p) => p.name).join(', ')} to latest`;
  const prBody = `## Automated Dependency Bump

**Source:** gtcx-core release
**Packages updated:**
${summaryLines.join('\n')}

**Compatibility check:** ${compatStatus}

${
  compatStatus === 'FAIL'
    ? '⚠️ **Compatibility check failed.** This PR was opened as a draft. See logs below.\n\n```\n' +
      compatLogs.slice(0, 4000) +
      '\n```'
    : ''
}

### Rollback
\`\`\`bash
git revert $(git log --grep="bump gtcx-core" --oneline -1 | awk '{print $1}')
\`\`\`

_This PR was auto-generated by the cross-repo publish pipeline._
Do not edit the branch name — it is used for pipeline tracking.
`;

  if (DRY_RUN) {
    log(`  [DRY RUN] Would open PR:\n    Title: ${prTitle}\n    Draft: ${isDraft}`);
    if (downstream.reviewers.length) {
      log(`  [DRY RUN] Would request review from: ${downstream.reviewers.join(', ')}`);
    }
  } else {
    const draftFlag = isDraft ? '--draft' : '';
    const reviewerFlag = downstream.reviewers.length
      ? `--reviewer ${downstream.reviewers.join(',')}`
      : '';
    const { stdout: prUrl } = run(
      cloneDir,
      `gh pr create ${draftFlag} --title "${prTitle.replace(/"/g, '\\"')}" --body "${prBody.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" ${reviewerFlag} --label "cross-repo-bump,auto-generated"`,
      { ignoreError: true }
    );
    log(`  Opened PR: ${prUrl}`);
  }

  // Cleanup
  if (!DRY_RUN) {
    run(process.cwd(), `rm -rf ${cloneDir}`);
  }
}

async function main() {
  if (!DRY_RUN && !GH_TOKEN) {
    throw new Error('GITHUB_TOKEN is required. Set it in the environment or run with --dry-run.');
  }

  const registry = loadRegistry();
  const published = extractPublishedPackages();

  if (published.length === 0) {
    log('No published packages detected. Exiting.');
    return;
  }

  log(`Detected ${published.length} published package(s):`);
  for (const pkg of published) {
    log(`  ${pkg.name}: ${pkg.oldVersion} → ${pkg.newVersion}`);
  }

  const downstreams = TARGET_DOWNSTREAM
    ? registry.downstreams.filter((d) => d.repo === TARGET_DOWNSTREAM)
    : registry.downstreams;

  if (downstreams.length === 0) {
    log('No downstreams match filter. Exiting.');
    return;
  }

  for (const downstream of downstreams) {
    await openDownstreamPR(downstream, published);
  }

  log('\nCross-repo publish automation complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
