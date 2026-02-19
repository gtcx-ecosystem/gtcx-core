#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const budgetsPath = path.join(rootDir, 'benchmarks/performance-budgets.json');
const latestPath = path.join(rootDir, 'benchmarks/latest-results.json');
const historyPath = path.join(rootDir, 'benchmarks/history.json');
const reportPath = path.join(rootDir, 'benchmarks/performance-report.json');

const strictTrend = process.argv.includes('--strict-trend') || isTruthy(process.env.PERF_ENFORCE_TREND);

function isTruthy(value) {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.relative(rootDir, filePath)}`);
  }
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function getTrendConfig(budgets) {
  const trend = budgets.trend ?? {};
  const windowSize = Number(trend.windowSize ?? 5);
  const minSamples = Number(trend.minSamples ?? 3);
  const maxRegressionPercent = Number(trend.maxRegressionPercent ?? 10);
  return {
    windowSize: Number.isFinite(windowSize) && windowSize > 0 ? windowSize : 5,
    minSamples: Number.isFinite(minSamples) && minSamples > 0 ? minSamples : 3,
    maxRegressionPercent: Number.isFinite(maxRegressionPercent) && maxRegressionPercent >= 0 ? maxRegressionPercent : 10,
    metricOverrides: trend.metricOverrides ?? {},
  };
}

function execGit(command) {
  return execSync(command, { cwd: rootDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function collectGitHistoryEntries(limit = 30) {
  let commitsRaw = '';
  try {
    commitsRaw = execGit(`git log --format=%H -- benchmarks/latest-results.json -n ${limit}`);
  } catch {
    return [];
  }

  const commits = commitsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const entries = [];
  for (const commit of commits) {
    try {
      const raw = execGit(`git show ${commit}:benchmarks/latest-results.json`);
      const parsed = JSON.parse(raw);
      entries.push({
        source: `git:${commit}`,
        recordedAt: toIsoDate(parsed.recordedAt) ?? null,
        metrics: parsed.metrics ?? {},
      });
    } catch {
      continue;
    }
  }
  return entries;
}

function collectHistoryEntries() {
  const entries = [];
  if (fs.existsSync(historyPath)) {
    const history = readJson(historyPath);
    const historyEntries = Array.isArray(history.entries) ? history.entries : [];
    for (const entry of historyEntries) {
      entries.push({
        source: entry.source ?? 'history',
        recordedAt: toIsoDate(entry.recordedAt) ?? null,
        metrics: entry.metrics ?? {},
      });
    }
  }

  for (const entry of collectGitHistoryEntries(30)) {
    entries.push(entry);
  }

  const dedupe = new Map();
  for (const entry of entries) {
    const key = `${entry.recordedAt ?? 'unknown'}|${JSON.stringify(entry.metrics)}`;
    if (!dedupe.has(key)) {
      dedupe.set(key, entry);
    }
  }

  return [...dedupe.values()].sort((a, b) => {
    const aTime = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
    const bTime = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
    return aTime - bTime;
  });
}

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value, digits = 4) {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}

function writeReport(report) {
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function main() {
  ensureFile(budgetsPath);
  ensureFile(latestPath);

  const budgets = readJson(budgetsPath);
  const latest = readJson(latestPath);
  const trendConfig = getTrendConfig(budgets);

  const budgetMetrics = budgets.metrics ?? {};
  const latestMetrics = latest.metrics ?? {};
  const metricKeys = Object.keys(budgetMetrics);

  if (metricKeys.length === 0) {
    throw new Error('Performance budgets file has no metrics.');
  }

  const historyEntries = collectHistoryEntries();
  const failures = [];
  const warnings = [];
  const metricReports = [];

  for (const key of metricKeys) {
    const budget = Number(budgetMetrics[key]);
    const observed = Number(latestMetrics[key]);

    if (!Number.isFinite(budget) || budget <= 0) {
      failures.push(`${key}: invalid budget value "${budgetMetrics[key]}"`);
      continue;
    }
    if (!Number.isFinite(observed) || observed < 0) {
      failures.push(`${key}: missing or invalid observed value "${latestMetrics[key]}"`);
      continue;
    }
    if (observed > budget) {
      failures.push(`${key}: observed ${observed} exceeds budget ${budget}`);
    }

    const override = trendConfig.metricOverrides?.[key] ?? {};
    const maxRegressionPercent = Number.isFinite(Number(override.maxRegressionPercent))
      ? Number(override.maxRegressionPercent)
      : trendConfig.maxRegressionPercent;

    const allSamples = historyEntries
      .map((entry) => Number(entry.metrics?.[key]))
      .filter((value) => Number.isFinite(value) && value >= 0);

    // Exclude the most recent sample if it equals current observed value to avoid self-biasing.
    const historicalSamples = [...allSamples];
    if (historicalSamples.length > 0 && historicalSamples[historicalSamples.length - 1] === observed) {
      historicalSamples.pop();
    }

    const trendSamples = historicalSamples.slice(-trendConfig.windowSize);
    const sampleCount = trendSamples.length;

    if (sampleCount < trendConfig.minSamples) {
      const message = `${key}: insufficient trend samples (${sampleCount}/${trendConfig.minSamples})`;
      if (strictTrend) {
        failures.push(message);
      } else {
        warnings.push(message);
      }
      metricReports.push({
        metric: key,
        observed: round(observed),
        budget: round(budget),
        budgetPass: observed <= budget,
        trendChecked: false,
        sampleCount,
        requiredSamples: trendConfig.minSamples,
        windowSize: trendConfig.windowSize,
      });
      continue;
    }

    const baselineMean = mean(trendSamples);
    const allowed = baselineMean * (1 + maxRegressionPercent / 100);
    const regressionPercent = baselineMean === 0 ? 0 : ((observed - baselineMean) / baselineMean) * 100;
    const trendPass = observed <= allowed;
    if (!trendPass) {
      failures.push(
        `${key}: observed ${round(observed)} regressed ${round(regressionPercent, 2)}% over trend baseline ${round(
          baselineMean
        )} (allowed <= ${round(allowed)}; max ${maxRegressionPercent}%)`
      );
    }

    metricReports.push({
      metric: key,
      observed: round(observed),
      budget: round(budget),
      budgetPass: observed <= budget,
      trendChecked: true,
      sampleCount,
      requiredSamples: trendConfig.minSamples,
      windowSize: trendConfig.windowSize,
      trendBaselineMean: round(baselineMean),
      maxRegressionPercent,
      allowedValue: round(allowed),
      regressionPercent: round(regressionPercent, 2),
      trendPass,
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    strictTrend,
    latestRecordedAt: latest.recordedAt ?? null,
    trendConfig,
    history: {
      sourceFile: fs.existsSync(historyPath) ? path.relative(rootDir, historyPath) : null,
      gitHistoryEnabled: true,
      entryCount: historyEntries.length,
    },
    failures,
    warnings,
    metrics: metricReports,
  };

  writeReport(report);

  if (failures.length > 0) {
    console.error('Performance budget check failed:\n');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    if (warnings.length > 0) {
      console.error('\nWarnings:');
      for (const warning of warnings) {
        console.error(`- ${warning}`);
      }
    }
    console.error(`\nReport written: ${path.relative(rootDir, reportPath)}`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log('Performance budget check passed with warnings:');
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }

  console.log(
    `Performance budget check passed (${metricKeys.length} metrics, trend checked ${
      metricReports.filter((entry) => entry.trendChecked).length
    } metrics, report: ${path.relative(rootDir, reportPath)}).`
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
