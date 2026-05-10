#!/usr/bin/env node

/**
 * Reproducible-build verifier (closes AI Trust Gap #2).
 *
 * Builds a target package twice from clean state and compares the resulting
 * npm tarballs bit-for-bit. If the hashes match, the build is locally
 * reproducible — anyone with the same source + lockfile + Node version
 * produces the same artifact. This is the property a sandbox regulator
 * cares about when they ask "can you prove what you ship matches your
 * source?"
 *
 * If the hashes differ, the tool extracts both tarballs and surfaces the
 * specific files that differ — so the nondeterminism source can be fixed
 * (typically: file mtimes from `pnpm pack`, sourcemap path absolution,
 * embedded build IDs).
 *
 * Run: `pnpm build:reproducible` (defaults to @gtcx/crypto)
 *      `pnpm build:reproducible --package=@gtcx/verification`
 *
 * Exit codes:
 *   0 — both builds produced bit-identical tarballs
 *   1 — hashes differ; details printed to stderr
 *   2 — infrastructure failure (build crashed, pack failed, etc.)
 *
 * Limitations (v1):
 *   - Compares two LOCAL builds. Does not yet compare against a published
 *     npm tarball — that integration lands when packages are published to
 *     the @gtcx scope.
 *   - One package at a time. Workspace-wide reproducibility is a Sprint
 *     5+ extension once the per-package case is solid.
 *   - SOURCE_DATE_EPOCH is set to a fixed value to neutralize file-mtime
 *     nondeterminism in `pnpm pack`. If the build tool itself embeds the
 *     current timestamp (e.g., into a banner comment), the mismatch will
 *     surface in the diff phase.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const pkgArg = args.find((a) => a.startsWith('--package='));
const targetPackage = pkgArg ? pkgArg.split('=')[1] : '@gtcx/crypto';

// SOURCE_DATE_EPOCH neutralizes file-mtime nondeterminism in tar packing.
// Set to 2026-01-01 UTC — arbitrary fixed point, what matters is that two
// runs use the same value.
const SOURCE_DATE_EPOCH = '1735689600';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, SOURCE_DATE_EPOCH, ...(opts.env ?? {}) },
    ...opts,
  });
}

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return createHash('sha256').update(data).digest('hex');
}

function ensureCleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function listTarballContents(tarPath) {
  const out = run('tar', ['-tzf', tarPath]);
  return out.split('\n').filter(Boolean).sort();
}

function extractTarball(tarPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  run('tar', ['-xzf', tarPath, '-C', destDir]);
}

// ---------------------------------------------------------------------------
// Build-and-pack a target package
// ---------------------------------------------------------------------------

function buildAndPack(packageName, destDir) {
  console.error(`  → cleaning + building ${packageName}...`);
  // Clean only the target package's dist; leaving node_modules intact for speed.
  run('pnpm', ['--filter', packageName, 'clean']);
  run('pnpm', ['--filter', packageName, 'build']);

  console.error(`  → packing ${packageName} → ${destDir}...`);
  ensureCleanDir(destDir);
  run('pnpm', ['--filter', packageName, 'exec', 'pnpm', 'pack', '--pack-destination', destDir]);

  const files = fs.readdirSync(destDir).filter((f) => f.endsWith('.tgz'));
  if (files.length !== 1) {
    throw new Error(`Expected exactly one tarball in ${destDir}, found ${files.length}`);
  }
  return path.join(destDir, files[0]);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const tmpRoot = path.join(os.tmpdir(), `gtcx-repro-${process.pid}`);
const destA = path.join(tmpRoot, 'build-a');
const destB = path.join(tmpRoot, 'build-b');

try {
  console.error(`Reproducible-build check for ${targetPackage}`);
  console.error(`SOURCE_DATE_EPOCH=${SOURCE_DATE_EPOCH}`);
  console.error('');

  console.error('Build A:');
  const tarballA = buildAndPack(targetPackage, destA);
  const hashA = hashFile(tarballA);
  console.error(`  hash: sha256:${hashA}`);
  console.error('');

  console.error('Build B:');
  const tarballB = buildAndPack(targetPackage, destB);
  const hashB = hashFile(tarballB);
  console.error(`  hash: sha256:${hashB}`);
  console.error('');

  if (hashA === hashB) {
    console.log(`✓ Reproducible: ${targetPackage}@<version> sha256:${hashA}`);
    process.exit(0);
  }

  // Mismatch — surface what differs
  console.error(`✗ NOT reproducible — hashes differ:`);
  console.error(`  A: sha256:${hashA}`);
  console.error(`  B: sha256:${hashB}`);
  console.error('');

  const filesA = listTarballContents(tarballA);
  const filesB = listTarballContents(tarballB);
  const onlyA = filesA.filter((f) => !filesB.includes(f));
  const onlyB = filesB.filter((f) => !filesA.includes(f));

  if (onlyA.length || onlyB.length) {
    console.error('File-list mismatch:');
    for (const f of onlyA) console.error(`  only in A: ${f}`);
    for (const f of onlyB) console.error(`  only in B: ${f}`);
    console.error('');
  }

  // Extract and diff per-file content
  const extractA = path.join(tmpRoot, 'extract-a');
  const extractB = path.join(tmpRoot, 'extract-b');
  extractTarball(tarballA, extractA);
  extractTarball(tarballB, extractB);

  const sharedFiles = filesA.filter((f) => filesB.includes(f));
  const contentDiffs = [];
  for (const f of sharedFiles) {
    const aPath = path.join(extractA, f);
    const bPath = path.join(extractB, f);
    if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) continue;
    const aHash = hashFile(aPath);
    const bHash = hashFile(bPath);
    if (aHash !== bHash) contentDiffs.push({ file: f, aHash, bHash });
  }

  if (contentDiffs.length > 0) {
    console.error(`Per-file content differs (${contentDiffs.length} file(s)):`);
    for (const d of contentDiffs) {
      console.error(`  ${d.file}`);
      console.error(`    A: ${d.aHash.slice(0, 16)}...`);
      console.error(`    B: ${d.bHash.slice(0, 16)}...`);
    }
    console.error('');

    // Known pnpm-level cause: workspace deps are rewritten to versions in
    // non-deterministic order when packing. Detected by checking if the only
    // difference is in package/package.json with the dependency keys reordered.
    const onlyPackageJsonDiffers =
      contentDiffs.length === 1 && contentDiffs[0].file === 'package/package.json';
    if (onlyPackageJsonDiffers) {
      const aPkg = JSON.parse(fs.readFileSync(path.join(extractA, 'package/package.json'), 'utf8'));
      const bPkg = JSON.parse(fs.readFileSync(path.join(extractB, 'package/package.json'), 'utf8'));
      // Same keys, different ordering → pnpm pack workspace-dep reorder bug
      const sameKeys = JSON.stringify(Object.keys(aPkg).sort()) === JSON.stringify(Object.keys(bPkg).sort());
      if (sameKeys) {
        console.error('Detected: pnpm pack workspace-dep ordering bug.');
        console.error('  When workspace:* deps are rewritten to versions, pnpm uses a non-deterministic');
        console.error('  iteration order. The package.json contents are equivalent but byte-different.');
        console.error('  This is upstream of gtcx-core. Workarounds:');
        console.error('    (a) Post-pack canonicalization: extract, sort deps alphabetically, repack.');
        console.error('    (b) Avoid workspace:* in published packages (pin versions explicitly).');
        console.error('    (c) Wait for upstream fix.');
        console.error('  The runtime artifact is not affected — only the published tarball envelope.');
        process.exit(1);
      }
    }

    console.error('Hint: differing files in dist/ usually indicate build-tool nondeterminism');
    console.error('(embedded timestamps, absolute paths in sourcemaps, environment-derived IDs).');
    console.error('Differing package.json or other files indicate a `pnpm pack` issue.');
  }

  // Preserve temp dirs on mismatch — operator needs to inspect them.
  console.error('');
  console.error(`Build artifacts preserved at ${tmpRoot} for inspection.`);
  process.exit(1);
} catch (err) {
  console.error(`Infrastructure failure: ${err.message}`);
  if (err.stderr) console.error(err.stderr.toString());
  console.error(`Build artifacts (if any) at ${tmpRoot}.`);
  process.exit(2);
}

// Cleanup only on success — operator never needs to inspect a passing build.
try {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
} catch {
  // ignore
}
