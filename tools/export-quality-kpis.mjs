#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const trackerPath = path.join(rootDir, 'docs/quality/10-10-remediation-tracker.md');
const metricsPath = path.join(rootDir, 'quality/kpi-metrics.json');
const ciHistoryPath = path.join(rootDir, 'artifacts/ci-history.json');
const provenancePath = path.join(rootDir, 'artifacts/provenance-manifest.json');
const budgetsPath = path.join(rootDir, 'benchmarks/performance-budgets.json');
const latestBenchmarksPath = path.join(rootDir, 'benchmarks/latest-results.json');

const criticalPackages = ['crypto', 'domain', 'security', 'services', 'verification'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.relative(rootDir, filePath)}`);
  }
}

function asPercent(covered, total) {
  if (total === 0) return 100;
  return (covered / total) * 100;
}

function formatPercent(value) {
  if (Math.abs(value - Math.round(value)) < 0.0001) {
    return `${Math.round(value)}%`;
  }
  return `${value.toFixed(1)}%`;
}

function parseEnvNumber(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid numeric value for ${name}: ${raw}`);
  }
  return value;
}

function loadKpiHistory() {
  if (!fs.existsSync(ciHistoryPath)) {
    return null;
  }
  return readJson(ciHistoryPath);
}

function deriveKpisFromHistory(history) {
  if (!history) {
    return {
      source: 'computed-fallback',
      windowDays: null,
      highSeverityEscapeDefectsMonth: 0,
      flakyTestRatePercent: 0,
      docsApiDriftIncidentsMonth: 0,
      securityPolicyViolationsMerged: 0,
      ciQualityGatePassRatePercent: null,
    };
  }

  const summary = history.summary ?? {};
  const issueCounts = history.issueCounts ?? {};
  const hasNumericPassRate = Number.isFinite(Number(summary.passRatePercent));
  const hasNumericRerunRate = Number.isFinite(Number(summary.rerunRatePercent));
  const numericWindowDays = Number(history.windowDays);

  return {
    source: history.source ?? 'history-file',
    windowDays: Number.isFinite(numericWindowDays) && numericWindowDays > 0 ? numericWindowDays : null,
    highSeverityEscapeDefectsMonth: Number(issueCounts.highSeverityEscapeDefectsMonth ?? 0),
    flakyTestRatePercent: Number(hasNumericRerunRate ? summary.rerunRatePercent : 0),
    docsApiDriftIncidentsMonth: Number(summary.docsApiDriftIncidents ?? 0),
    securityPolicyViolationsMerged: Number(issueCounts.securityPolicyViolationsMerged ?? 0),
    ciQualityGatePassRatePercent: hasNumericPassRate ? Number(summary.passRatePercent) : null,
  };
}

function coverageFromFile(filePath) {
  ensureFile(filePath);
  const coverage = readJson(filePath);

  let statementTotal = 0;
  let statementCovered = 0;
  let branchTotal = 0;
  let branchCovered = 0;
  let functionTotal = 0;
  let functionCovered = 0;

  for (const fileCoverage of Object.values(coverage)) {
    const statements = Object.values(fileCoverage.s ?? {});
    statementTotal += statements.length;
    statementCovered += statements.filter((count) => Number(count) > 0).length;

    const branches = Object.values(fileCoverage.b ?? {});
    for (const branchCounts of branches) {
      for (const count of branchCounts) {
        branchTotal += 1;
        if (Number(count) > 0) {
          branchCovered += 1;
        }
      }
    }

    const functions = Object.values(fileCoverage.f ?? {});
    functionTotal += functions.length;
    functionCovered += functions.filter((count) => Number(count) > 0).length;
  }

  return {
    statements: { covered: statementCovered, total: statementTotal, pct: asPercent(statementCovered, statementTotal) },
    branches: { covered: branchCovered, total: branchTotal, pct: asPercent(branchCovered, branchTotal) },
    functions: { covered: functionCovered, total: functionTotal, pct: asPercent(functionCovered, functionTotal) },
    lines: { covered: statementCovered, total: statementTotal, pct: asPercent(statementCovered, statementTotal) },
  };
}

function aggregateCoverage(perPackage) {
  let statementCovered = 0;
  let statementTotal = 0;
  let branchCovered = 0;
  let branchTotal = 0;
  let functionCovered = 0;
  let functionTotal = 0;

  for (const summary of Object.values(perPackage)) {
    statementCovered += summary.statements.covered;
    statementTotal += summary.statements.total;
    branchCovered += summary.branches.covered;
    branchTotal += summary.branches.total;
    functionCovered += summary.functions.covered;
    functionTotal += summary.functions.total;
  }

  return {
    statements: { covered: statementCovered, total: statementTotal, pct: asPercent(statementCovered, statementTotal) },
    branches: { covered: branchCovered, total: branchTotal, pct: asPercent(branchCovered, branchTotal) },
    functions: { covered: functionCovered, total: functionTotal, pct: asPercent(functionCovered, functionTotal) },
    lines: { covered: statementCovered, total: statementTotal, pct: asPercent(statementCovered, statementTotal) },
  };
}

function computePerformanceBudgetStatus() {
  ensureFile(budgetsPath);
  ensureFile(latestBenchmarksPath);
  const budgets = readJson(budgetsPath).metrics ?? {};
  const observed = readJson(latestBenchmarksPath).metrics ?? {};

  const failures = [];
  for (const [metric, budgetValue] of Object.entries(budgets)) {
    const budget = Number(budgetValue);
    const latest = Number(observed[metric]);
    if (!Number.isFinite(budget) || !Number.isFinite(latest)) {
      failures.push({ metric, budget: budgetValue, observed: observed[metric], reason: 'invalid' });
      continue;
    }
    if (latest > budget) {
      failures.push({ metric, budget, observed: latest, reason: 'budget_exceeded' });
    }
  }

  return {
    metricsCount: Object.keys(budgets).length,
    failedMetrics: failures,
    pass: failures.length === 0,
  };
}

function computeEvidenceStatus() {
  if (!fs.existsSync(provenancePath)) {
    return { hasProvenance: false, missingEvidenceCount: 0, missingEvidencePaths: [] };
  }

  const provenance = readJson(provenancePath);
  const evidence = provenance.evidenceArtifacts ?? [];
  const missing = evidence.filter((entry) => entry.exists === false).map((entry) => entry.path);

  return {
    hasProvenance: true,
    missingEvidenceCount: missing.length,
    missingEvidencePaths: missing,
  };
}

function updateTracker(kpis) {
  ensureFile(trackerPath);
  let tracker = fs.readFileSync(trackerPath, 'utf8').replace(/\r\n/g, '\n');
  const columnWidths = {
    label: 34,
    baseline: 8,
    target: 6,
    current: 7,
  };

  const rows = [
    {
      label: 'High-severity escape defects/month',
      baseline: `${kpis.highSeverityEscapeDefectsMonth}`,
      target: '<1',
      current: `${kpis.highSeverityEscapeDefectsMonth}`,
    },
    {
      label: 'Flaky test rate',
      baseline: formatPercent(kpis.flakyTestRatePercent),
      target: '<1%',
      current: formatPercent(kpis.flakyTestRatePercent),
    },
    {
      label: 'Docs/API drift incidents/month',
      baseline: `${kpis.docsApiDriftIncidentsMonth}`,
      target: '0',
      current: `${kpis.docsApiDriftIncidentsMonth}`,
    },
    {
      label: 'Security policy violations merged',
      baseline: `${kpis.securityPolicyViolationsMerged}`,
      target: '0',
      current: `${kpis.securityPolicyViolationsMerged}`,
    },
    {
      label: 'CI quality gate pass rate',
      baseline: formatPercent(kpis.ciQualityGatePassRatePercent),
      target: '>98%',
      current: formatPercent(kpis.ciQualityGatePassRatePercent),
    },
  ];

  for (const row of rows) {
    const escapedLabel = row.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rowRegex = new RegExp(`^\\|\\s*${escapedLabel}\\s*\\|[^\\n]*$`, 'm');
    const replacement = `| ${row.label.padEnd(columnWidths.label, ' ')} | ${row.baseline.padEnd(
      columnWidths.baseline,
      ' '
    )} | ${row.target.padEnd(columnWidths.target, ' ')} | ${row.current.padEnd(columnWidths.current, ' ')} |`;
    if (!rowRegex.test(tracker)) {
      throw new Error(`Unable to update tracker row: ${row.label}`);
    }
    tracker = tracker.replace(rowRegex, replacement);
  }

  fs.writeFileSync(trackerPath, tracker);
}

const coverageByPackage = {};
for (const pkg of criticalPackages) {
  const filePath = path.join(rootDir, `packages/${pkg}/coverage/coverage-final.json`);
  coverageByPackage[pkg] = coverageFromFile(filePath);
}

const aggregateCoverageSummary = aggregateCoverage(coverageByPackage);
const performanceBudget = computePerformanceBudgetStatus();
const evidence = computeEvidenceStatus();

const coverageThresholdPass =
  aggregateCoverageSummary.lines.pct >= 85 &&
  aggregateCoverageSummary.statements.pct >= 85 &&
  aggregateCoverageSummary.branches.pct >= 80 &&
  aggregateCoverageSummary.functions.pct >= 75;

const computedCiPassRate = performanceBudget.pass && coverageThresholdPass && evidence.missingEvidenceCount === 0 ? 100 : 0;
const kpiHistory = loadKpiHistory();
const historyDerivedKpis = deriveKpisFromHistory(kpiHistory);

const kpis = {
  highSeverityEscapeDefectsMonth: parseEnvNumber(
    'KPI_HIGH_SEVERITY_ESCAPE_DEFECTS',
    historyDerivedKpis.highSeverityEscapeDefectsMonth
  ),
  flakyTestRatePercent: parseEnvNumber('KPI_FLAKY_TEST_RATE_PERCENT', historyDerivedKpis.flakyTestRatePercent),
  docsApiDriftIncidentsMonth: parseEnvNumber(
    'KPI_DOCS_API_DRIFT_INCIDENTS',
    historyDerivedKpis.docsApiDriftIncidentsMonth
  ),
  securityPolicyViolationsMerged: parseEnvNumber(
    'KPI_SECURITY_POLICY_VIOLATIONS_MERGED',
    historyDerivedKpis.securityPolicyViolationsMerged
  ),
  ciQualityGatePassRatePercent: parseEnvNumber(
    'KPI_CI_QUALITY_GATE_PASS_RATE_PERCENT',
    historyDerivedKpis.ciQualityGatePassRatePercent ?? computedCiPassRate
  ),
};

const metrics = {
  generatedAt: new Date().toISOString(),
  source: {
    runId: process.env.GITHUB_RUN_ID ?? null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    sha: process.env.GITHUB_SHA ?? null,
    ref: process.env.GITHUB_REF ?? null,
  },
  history: {
    path: path.relative(rootDir, ciHistoryPath),
    exists: Boolean(kpiHistory),
    source: historyDerivedKpis.source,
    windowDays: historyDerivedKpis.windowDays,
  },
  criticalCoverage: {
    packages: coverageByPackage,
    aggregate: aggregateCoverageSummary,
    thresholdPass: coverageThresholdPass,
  },
  performanceBudget,
  evidence,
  kpis,
};

fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
fs.writeFileSync(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);
updateTracker(kpis);

console.log(
  `Quality KPI metrics exported: ${path.relative(rootDir, metricsPath)} (CI pass rate ${formatPercent(kpis.ciQualityGatePassRatePercent)}).`
);
