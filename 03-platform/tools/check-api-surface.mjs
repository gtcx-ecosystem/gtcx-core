#!/usr/bin/env node

import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';
import { PLATFORM_PACKAGES, REPO_ROOT } from '../../config/paths.mjs';

const rootDir = REPO_ROOT;
const packagesDir = PLATFORM_PACKAGES;
const baselinePath = path.join(rootDir, '05-audit/quality/api-surface-baseline.json');
const reportPath = path.join(rootDir, '05-audit/quality/api-surface-report.json');

const args = process.argv.slice(2);
const shouldUpdate = args.includes('--update');
const enforceSemver = args.includes('--enforce-semver') || isTruthy(process.env.API_ENFORCE_SEMVER);
const referenceRef = getArgValue('--reference-ref') ?? process.env.API_BASELINE_REF ?? null;

function isTruthy(value) {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function getArgValue(prefix) {
  const match = args.find((arg) => arg.startsWith(`${prefix}=`));
  return match ? match.slice(prefix.length + 1) : null;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}

function execGitShow(ref, relPath) {
  const spec = `${ref}:${relPath.replace(/\\/g, '/')}`;
  try {
    return execSync(`git show ${spec}`, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

function listPackageRecords() {
  const records = [];
  for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgDir = path.join(packagesDir, entry.name);
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) continue;
    const pkgJson = readJson(pkgJsonPath);
    if (!pkgJson.name || !pkgJson.types) continue;
    records.push({
      packageName: pkgJson.name,
      version: pkgJson.version,
      dirRel: path.relative(rootDir, pkgDir),
      typesRel: path.relative(rootDir, path.join(pkgDir, pkgJson.types)),
      typesAbs: path.join(pkgDir, pkgJson.types),
    });
  }
  return records.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

function normalizeExportName(name) {
  return name?.trim() ?? '';
}

function collectExportNamesFromDts(sourceText) {
  const sourceFile = ts.createSourceFile(
    'index.d.ts',
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const exportsSet = new Set();

  const hasModifier = (node, kind) =>
    Boolean(node?.modifiers?.some((modifier) => modifier.kind === kind));
  const isExported = (node) => hasModifier(node, ts.SyntaxKind.ExportKeyword);

  const add = (name) => {
    const normalized = normalizeExportName(name);
    if (normalized) exportsSet.add(normalized);
  };

  for (const node of sourceFile.statements) {
    if (ts.isExportAssignment(node)) {
      add('default');
      continue;
    }

    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          add(element.name.getText(sourceFile));
        }
      } else if (node.exportClause && ts.isNamespaceExport(node.exportClause)) {
        add(node.exportClause.name.getText(sourceFile));
      } else if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        add(`*:${node.moduleSpecifier.text}`);
      }
      continue;
    }

    if (!isExported(node)) continue;

    if (
      (ts.isClassDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isModuleDeclaration(node)) &&
      node.name
    ) {
      add(node.name.getText(sourceFile));
      if (hasModifier(node, ts.SyntaxKind.DefaultKeyword)) add('default');
      continue;
    }

    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) add(decl.name.text);
      }
      continue;
    }
  }

  return [...exportsSet].sort((a, b) => a.localeCompare(b));
}

function buildCurrentSnapshot(records) {
  const packages = {};
  for (const record of records) {
    if (!fs.existsSync(record.typesAbs)) {
      throw new Error(
        `Missing type declaration for ${record.packageName}: ${record.typesRel}. Run "pnpm build" before api:check.`
      );
    }
    const raw = fs.readFileSync(record.typesAbs, 'utf8').replace(/\r\n/g, '\n');
    packages[record.packageName] = {
      version: record.version,
      dir: record.dirRel,
      typesPath: record.typesRel,
      hash: sha256(raw),
      exports: collectExportNamesFromDts(raw),
    };
  }
  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    packages,
  };
}

function normalizeSnapshot(rawSnapshot) {
  const rawPackages = rawSnapshot?.packages ?? {};
  const normalizedPackages = {};
  for (const [packageName, info] of Object.entries(rawPackages)) {
    normalizedPackages[packageName] = {
      version: info.version ?? null,
      dir: info.dir ?? null,
      typesPath: info.typesPath ?? null,
      hash: info.hash ?? info.fileHash ?? null,
      exports: Array.isArray(info.exports)
        ? [...new Set(info.exports)].sort((a, b) => a.localeCompare(b))
        : null,
    };
  }
  return {
    schemaVersion: rawSnapshot?.schemaVersion ?? 1,
    generatedAt: rawSnapshot?.generatedAt ?? null,
    packages: normalizedPackages,
  };
}

function classifyPackageChange(baseInfo, currentInfo) {
  if (!baseInfo && currentInfo) {
    return {
      kind: 'additive',
      reason: 'new_package',
      addedExports: currentInfo.exports ?? [],
      removedExports: [],
    };
  }
  if (baseInfo && !currentInfo) {
    return {
      kind: 'breaking',
      reason: 'removed_package',
      addedExports: [],
      removedExports: baseInfo.exports ?? [],
    };
  }
  if (!baseInfo || !currentInfo) {
    return { kind: 'none', reason: 'none', addedExports: [], removedExports: [] };
  }
  if (baseInfo.hash === currentInfo.hash) {
    return { kind: 'none', reason: 'hash_unchanged', addedExports: [], removedExports: [] };
  }

  const baseExports = baseInfo.exports;
  const currentExports = currentInfo.exports;
  if (!baseExports || !currentExports) {
    return {
      kind: 'breaking',
      reason: 'hash_changed_legacy_baseline',
      addedExports: [],
      removedExports: [],
    };
  }

  const baseSet = new Set(baseExports);
  const currentSet = new Set(currentExports);
  const added = [...currentSet]
    .filter((name) => !baseSet.has(name))
    .sort((a, b) => a.localeCompare(b));
  const removed = [...baseSet]
    .filter((name) => !currentSet.has(name))
    .sort((a, b) => a.localeCompare(b));

  if (removed.length > 0) {
    return {
      kind: 'breaking',
      reason: 'exports_removed',
      addedExports: added,
      removedExports: removed,
    };
  }
  if (added.length > 0) {
    return {
      kind: 'additive',
      reason: 'exports_added_only',
      addedExports: added,
      removedExports: [],
    };
  }
  return {
    kind: 'breaking',
    reason: 'export_signatures_changed',
    addedExports: [],
    removedExports: [],
  };
}

function diffSnapshots(baseSnapshot, currentSnapshot) {
  const diffs = [];
  const packageNames = new Set([
    ...Object.keys(baseSnapshot.packages),
    ...Object.keys(currentSnapshot.packages),
  ]);
  for (const packageName of [...packageNames].sort((a, b) => a.localeCompare(b))) {
    const baseInfo = baseSnapshot.packages[packageName] ?? null;
    const currentInfo = currentSnapshot.packages[packageName] ?? null;
    const classification = classifyPackageChange(baseInfo, currentInfo);
    diffs.push({
      packageName,
      classification: classification.kind,
      reason: classification.reason,
      baseHash: baseInfo?.hash ?? null,
      currentHash: currentInfo?.hash ?? null,
      baseVersion: baseInfo?.version ?? null,
      currentVersion: currentInfo?.version ?? null,
      addedExports: classification.addedExports,
      removedExports: classification.removedExports,
    });
  }
  return diffs;
}

function parseVersion(version) {
  if (!version) return null;
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function compareVersionBump(baseVersion, currentVersion) {
  const base = parseVersion(baseVersion);
  const current = parseVersion(currentVersion);
  if (!base || !current) return 'unknown';
  if (current.major < base.major) return 'downgrade';
  if (current.major > base.major) return 'major';
  if (current.minor < base.minor) return 'downgrade';
  if (current.minor > base.minor) return 'minor';
  if (current.patch < base.patch) return 'downgrade';
  if (current.patch > base.patch) return 'patch';
  return 'none';
}

function bumpMeetsRequirement(required, observed) {
  if (observed === 'major') return true;
  if (required === 'minor' && observed === 'minor') return true;
  if (required === 'patch' && observed === 'patch') return true;
  return false;
}

function collectChangesetBumps() {
  const changesetDir = path.join(rootDir, '.changeset');
  const bumps = {};
  if (!fs.existsSync(changesetDir)) return bumps;

  const rank = { patch: 1, minor: 2, major: 3 };
  const files = fs
    .readdirSync(changesetDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md'
    )
    .map((entry) => path.join(changesetDir, entry.name));

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
    const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    for (const line of frontmatterMatch[1].split('\n')) {
      const match = line.match(/^\s*["']?(@[^"']+)["']?\s*:\s*(major|minor|patch)\s*$/);
      if (!match) continue;
      const packageName = match[1];
      const bumpType = match[2];
      const existing = bumps[packageName];
      if (!existing || rank[bumpType] > rank[existing]) {
        bumps[packageName] = bumpType;
      }
    }
  }

  return bumps;
}

function loadReferenceSnapshotFromGit(ref) {
  if (!ref) return null;
  const baselineRaw = execGitShow(ref, 'quality/api-surface-baseline.json');
  if (!baselineRaw) return null;
  try {
    const snapshot = normalizeSnapshot(JSON.parse(baselineRaw));
    // Augment with actual package.json versions at the ref, since the baseline
    // may not have been updated in the same commit as a version bump.
    for (const packageName of Object.keys(snapshot.packages)) {
      const info = snapshot.packages[packageName];
      if (!info.dir) continue;
      const pkgJsonRaw = execGitShow(ref, `${info.dir}/package.json`);
      if (pkgJsonRaw) {
        try {
          const pkgJson = JSON.parse(pkgJsonRaw);
          if (pkgJson.version) {
            info.version = pkgJson.version;
          }
        } catch {
          // ignore parse errors
        }
      }
    }
    return snapshot;
  } catch {
    return null;
  }
}

function buildPolicyEvaluation(referenceSnapshot, currentSnapshot) {
  const changesetBumps = collectChangesetBumps();
  const diffs = diffSnapshots(referenceSnapshot, currentSnapshot).filter(
    (entry) => entry.classification !== 'none'
  );
  const violations = [];

  for (const change of diffs) {
    if (change.classification !== 'additive' && change.classification !== 'breaking') continue;

    if (!change.baseVersion || !change.currentVersion) {
      if (change.reason === 'new_package') continue;
      violations.push({
        packageName: change.packageName,
        classification: change.classification,
        reason: change.reason,
        requiredBump: change.classification === 'breaking' ? 'major' : 'minor',
        observedVersionBump: 'unknown',
        declaredChangesetBump: changesetBumps[change.packageName] ?? null,
        message: 'Unable to determine package version delta for API policy.',
      });
      continue;
    }

    // If version did not change and no exports were added/removed, the hash
    // difference is likely due to non-semantic changes (comments, build
    // artifacts, or stale baseline). Skip semver enforcement in this case.
    if (
      change.classification === 'breaking' &&
      change.reason === 'export_signatures_changed' &&
      change.addedExports.length === 0 &&
      change.removedExports.length === 0 &&
      change.baseVersion === change.currentVersion
    ) {
      continue;
    }

    const requiredBump = change.classification === 'breaking' ? 'major' : 'minor';
    const observedBump = compareVersionBump(change.baseVersion, change.currentVersion);
    const declaredBump = changesetBumps[change.packageName] ?? null;
    const satisfiesVersion = bumpMeetsRequirement(requiredBump, observedBump);
    const satisfiesChangeset = bumpMeetsRequirement(requiredBump, declaredBump ?? 'none');

    if (!satisfiesVersion && !satisfiesChangeset) {
      violations.push({
        packageName: change.packageName,
        classification: change.classification,
        reason: change.reason,
        requiredBump,
        observedVersionBump: observedBump,
        declaredChangesetBump: declaredBump,
        message: `API ${change.classification} change requires ${requiredBump} bump (version or changeset).`,
      });
    }
  }

  return { diffs, violations, changesetBumps };
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function printFailure(title, lines) {
  console.error(`${title}\n`);
  for (const line of lines) {
    console.error(`- ${line}`);
  }
}

const packageRecords = listPackageRecords();
const currentSnapshot = buildCurrentSnapshot(packageRecords);

if (shouldUpdate) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
  fs.writeFileSync(baselinePath, `${JSON.stringify(currentSnapshot, null, 2)}\n`);
  writeReport({
    generatedAt: new Date().toISOString(),
    mode: 'update',
    baselinePath: path.relative(rootDir, baselinePath),
    reportPath: path.relative(rootDir, reportPath),
    updatedPackages: Object.keys(currentSnapshot.packages).length,
    schemaVersion: currentSnapshot.schemaVersion,
  });
  console.log(`API surface baseline updated: ${path.relative(rootDir, baselinePath)}`);
  process.exit(0);
}

if (!fs.existsSync(baselinePath)) {
  console.error(
    `Missing API baseline file ${path.relative(rootDir, baselinePath)}. Run "pnpm api:update-baseline".`
  );
  process.exit(1);
}

const workingBaseline = normalizeSnapshot(readJson(baselinePath));
const driftDiffs = diffSnapshots(workingBaseline, currentSnapshot);
const driftChanges = driftDiffs.filter((entry) => entry.classification !== 'none');

let referenceSnapshot = null;
let policy = { diffs: [], violations: [], changesetBumps: {} };
if (referenceRef) {
  referenceSnapshot = loadReferenceSnapshotFromGit(referenceRef);
  if (referenceSnapshot) {
    policy = buildPolicyEvaluation(referenceSnapshot, currentSnapshot);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  schemaVersion: 1,
  baseline: {
    path: path.relative(rootDir, baselinePath),
    schemaVersion: workingBaseline.schemaVersion,
  },
  current: {
    packageCount: Object.keys(currentSnapshot.packages).length,
  },
  drift: {
    changeCount: driftChanges.length,
    changes: driftChanges,
  },
  policy: {
    referenceRef,
    referenceLoaded: Boolean(referenceSnapshot),
    enforceSemver,
    changeCount: policy.diffs.length,
    changes: policy.diffs,
    violationCount: policy.violations.length,
    violations: policy.violations,
    changesetBumps: policy.changesetBumps,
  },
};
writeReport(report);

if (driftChanges.length > 0) {
  const lines = driftChanges.map(
    (change) => `${change.packageName}: ${change.classification} (${change.reason})`
  );
  printFailure('API surface check failed:', lines);
  console.error('\nIf changes are expected, run: pnpm api:update-baseline');
  console.error(`Diff report written: ${path.relative(rootDir, reportPath)}`);
  process.exit(1);
}

if (enforceSemver) {
  if (!referenceRef) {
    console.error(
      `API semver policy enabled but no reference ref set. Use --reference-ref=<ref> or API_BASELINE_REF.\nReport: ${path.relative(
        rootDir,
        reportPath
      )}`
    );
    process.exit(1);
  }
  if (!referenceSnapshot) {
    console.error(
      `API semver policy enabled but reference baseline could not be loaded from "${referenceRef}".\nReport: ${path.relative(
        rootDir,
        reportPath
      )}`
    );
    process.exit(1);
  }
  if (policy.violations.length > 0) {
    const lines = policy.violations.map(
      (violation) =>
        `${violation.packageName}: ${violation.message} (observed=${violation.observedVersionBump}, changeset=${
          violation.declaredChangesetBump ?? 'none'
        })`
    );
    printFailure('API semver policy check failed:', lines);
    console.error(`\nDiff report written: ${path.relative(rootDir, reportPath)}`);
    process.exit(1);
  }
}

console.log(
  `API surface check passed (${Object.keys(currentSnapshot.packages).length} packages, report: ${path.relative(
    rootDir,
    reportPath
  )}).`
);
