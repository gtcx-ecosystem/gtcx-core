import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import type { AccuracyResult } from './types';

const SECURITY_PACKAGES = new Set([
  '@gtcx/crypto',
  '@gtcx/crypto-native',
  '@gtcx/security',
  '@gtcx/identity',
  '@gtcx/verification',
]);

interface PackageTestResult {
  name: string;
  pass_rate: number;
  threshold: number;
  status: 'PASS' | 'FAIL';
}

function runTests(pkgPath: string): {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
} {
  try {
    const stdout = execSync('pnpm test -- --reporter=json', {
      cwd: pkgPath,
      encoding: 'utf-8',
      timeout: 300000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const lines = stdout.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (!line) continue;
      try {
        const report = JSON.parse(line);
        if (report && typeof report.numTotalTests === 'number') {
          return {
            total: report.numTotalTests,
            passed: report.numPassedTests,
            failed: report.numFailedTests,
            skipped: report.numPendingTests || 0,
          };
        }
      } catch {
        /* empty */
      }
    }
  } catch (err: unknown) {
    const e = err as { stdout?: string };
    if (e.stdout) {
      const lines = e.stdout.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (!line) continue;
        try {
          const report = JSON.parse(line);
          if (report && typeof report.numTotalTests === 'number') {
            return {
              total: report.numTotalTests,
              passed: report.numPassedTests,
              failed: report.numFailedTests,
              skipped: report.numPendingTests || 0,
            };
          }
        } catch {
          /* empty */
        }
      }
    }
  }

  return { total: 0, passed: 0, failed: 0, skipped: 0 };
}

function getWorkspacePackages(repo: string): Array<{ name: string; path: string }> {
  try {
    const stdout = execSync('pnpm list -r --json --depth=-1 2>/dev/null', {
      cwd: repo,
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const data = JSON.parse(stdout) as Array<{ name: string; path: string; private?: boolean }>;
    const filtered = data
      .filter((p) => p.name && p.name.startsWith('@gtcx/'))
      .map((p) => ({ name: p.name, path: p.path }));
    if (filtered.length > 0) return filtered;
  } catch {
    /* empty */
  }

  const packages: Array<{ name: string; path: string }> = [];
  try {
    const packagesDir = join(repo, 'packages');
    if (existsSync(packagesDir)) {
      const entries = execSync(`find ${packagesDir} -maxdepth 2 -name "package.json" -type f`, {
        encoding: 'utf-8',
        timeout: 10000,
      })
        .trim()
        .split('\n')
        .filter(Boolean);
      for (const pkgJson of entries) {
        try {
          const pkg = JSON.parse(readFileSync(pkgJson, 'utf-8'));
          if (pkg.name && pkg.name.startsWith('@gtcx/')) {
            packages.push({ name: pkg.name, path: pkgJson.replace('/package.json', '') });
          }
        } catch {
          /* empty */
        }
      }
    }
    if (packages.length > 0) return packages;
  } catch {
    /* empty */
  }

  const pnpmWorkspace = join(repo, 'pnpm-workspace.yaml');
  if (existsSync(pnpmWorkspace)) {
    const content = readFileSync(pnpmWorkspace, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/-\s+'(.+?)'/);
      if (match && match[1]) {
        const glob = match[1];
        if (glob.includes('*')) {
          const dir = join(repo, glob.replace('/*', ''));
          if (existsSync(dir)) {
            const entries = execSync(`ls -1 ${dir}`, { encoding: 'utf-8' }).trim().split('\n');
            for (const entry of entries) {
              const pkgJson = join(dir, entry, 'package.json');
              if (existsSync(pkgJson)) {
                const pkg = JSON.parse(readFileSync(pkgJson, 'utf-8'));
                packages.push({ name: pkg.name, path: join(dir, entry) });
              }
            }
          }
        } else {
          const pkgJson = join(repo, glob, 'package.json');
          if (existsSync(pkgJson)) {
            const pkg = JSON.parse(readFileSync(pkgJson, 'utf-8'));
            packages.push({ name: pkg.name, path: join(repo, glob) });
          }
        }
      }
    }
  }

  return packages;
}

export async function evaluateAccuracy(repo: string, _baseline?: string): Promise<AccuracyResult> {
  const packages = getWorkspacePackages(repo);
  const packageResults: PackageTestResult[] = [];

  let totalTests = 0;
  let totalPassed = 0;
  let totalSkipped = 0;

  for (const pkg of packages) {
    if (!existsSync(join(pkg.path, 'package.json'))) continue;

    const result = runTests(pkg.path);
    if (result.total === 0) continue;

    const passRate = result.passed / (result.total - result.skipped);
    const isSecurity = SECURITY_PACKAGES.has(pkg.name);
    const threshold = isSecurity ? 0.98 : 0.95;

    totalTests += result.total;
    totalPassed += result.passed;
    totalSkipped += result.skipped;

    packageResults.push({
      name: pkg.name,
      pass_rate: passRate,
      threshold,
      status: passRate >= threshold ? 'PASS' : 'FAIL',
    });
  }

  const overallPassRate = totalTests > totalSkipped ? totalPassed / (totalTests - totalSkipped) : 0;

  let baselinePassRate = overallPassRate;
  if (_baseline && existsSync(_baseline)) {
    try {
      const baseline = JSON.parse(readFileSync(_baseline, 'utf-8'));
      baselinePassRate = baseline.accuracy?.pass_rate ?? overallPassRate;
    } catch {
      /* empty */
    }
  }

  const status = overallPassRate >= 0.95 ? 'PASS' : 'FAIL';

  return {
    pass_rate: overallPassRate,
    baseline_pass_rate: baselinePassRate,
    delta: overallPassRate - baselinePassRate,
    threshold: 0.95,
    status,
    packages: packageResults,
  };
}
