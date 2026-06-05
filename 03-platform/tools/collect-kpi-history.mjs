#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const outDir = path.join(rootDir, 'artifacts');
const outPath = path.join(outDir, 'ci-history.json');

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
const repository = process.env.GITHUB_REPOSITORY ?? '';
const windowDaysRaw = Number(process.env.KPI_WINDOW_DAYS ?? '30');
const maxRunsRaw = Number(process.env.KPI_MAX_RUNS ?? '50');
const workflowsRaw = process.env.KPI_WORKFLOWS ?? 'ci.yml';
const highSeverityLabels = process.env.KPI_HIGH_DEFECT_LABELS ?? 'severity:high,escaped-defect';
const securityViolationLabels =
  process.env.KPI_SECURITY_VIOLATION_LABELS ?? 'security-policy-violation';

const windowDays = Number.isFinite(windowDaysRaw) && windowDaysRaw > 0 ? windowDaysRaw : 30;
const maxRuns = Number.isFinite(maxRunsRaw) && maxRunsRaw > 0 ? maxRunsRaw : 50;
const workflows = workflowsRaw
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const docsApiDriftGates = new Set([
  'API surface baseline check',
  'Validate markdown links',
  'Generate API docs',
]);
const securityPolicyGates = new Set([
  'Threat matrix validation',
  'Run Trivy vulnerability scanner',
  'Generate SBOM (CycloneDX)',
  'Upload Trivy scan results',
  'Upload SBOM artifact',
]);

const now = new Date();
const sinceDate = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);

function ensureOutputDir() {
  fs.mkdirSync(outDir, { recursive: true });
}

async function formatJsonForWrite(payload) {
  const fallback = `${JSON.stringify(payload, null, 2)}\n`;
  try {
    const prettier = await import('prettier');
    const config = (await prettier.resolveConfig(outPath)) ?? {};
    return await prettier.format(JSON.stringify(payload), { ...config, parser: 'json' });
  } catch {
    return fallback;
  }
}

async function writeHistory(payload) {
  ensureOutputDir();
  fs.writeFileSync(outPath, await formatJsonForWrite(payload));
}

function parseLinkHeader(linkHeader) {
  if (!linkHeader) return null;
  for (const segment of linkHeader.split(',')) {
    const trimmed = segment.trim();
    if (trimmed.endsWith('rel="next"')) {
      const match = trimmed.match(/<([^>]+)>/);
      if (match) return match[1];
    }
  }
  return null;
}

async function githubGet(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'gtcx-quality-kpi-collector',
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} for ${url}: ${body.slice(0, 300)}`);
  }
  return {
    data: await response.json(),
    next: parseLinkHeader(response.headers.get('link')),
  };
}

async function listWorkflowRuns(workflowFile) {
  const runs = [];
  let nextUrl = `https://api.github.com/repos/${repository}/actions/workflows/${encodeURIComponent(
    workflowFile
  )}/runs?per_page=100&branch=main`;

  while (nextUrl && runs.length < maxRuns) {
    const { data, next } = await githubGet(nextUrl);
    const workflowRuns = Array.isArray(data.workflow_runs) ? data.workflow_runs : [];
    for (const run of workflowRuns) {
      const createdAt = new Date(run.created_at);
      if (createdAt < sinceDate) {
        nextUrl = null;
        break;
      }
      runs.push(run);
      if (runs.length >= maxRuns) {
        break;
      }
    }
    if (runs.length >= maxRuns) break;
    nextUrl = next;
  }

  return runs;
}

async function listRunJobs(runId) {
  const jobs = [];
  let nextUrl = `https://api.github.com/repos/${repository}/actions/runs/${runId}/jobs?per_page=100`;
  while (nextUrl) {
    const { data, next } = await githubGet(nextUrl);
    const pageJobs = Array.isArray(data.jobs) ? data.jobs : [];
    jobs.push(...pageJobs);
    nextUrl = next;
  }
  return jobs;
}

function summarizeRuns(runs) {
  const completed = runs.filter((run) => run.status === 'completed');
  const successful = completed.filter((run) => run.conclusion === 'success');
  const rerunCount = completed.filter((run) => Number(run.run_attempt ?? 1) > 1).length;
  const passRatePercent = completed.length > 0 ? (successful.length / completed.length) * 100 : 0;
  const rerunRatePercent = completed.length > 0 ? (rerunCount / completed.length) * 100 : 0;

  return {
    totalRuns: runs.length,
    completedRuns: completed.length,
    successfulRuns: successful.length,
    rerunCount,
    passRatePercent,
    rerunRatePercent,
  };
}

async function collectIssueCount(labels) {
  let count = 0;
  let nextUrl = `https://api.github.com/repos/${repository}/issues?state=all&labels=${encodeURIComponent(
    labels
  )}&since=${encodeURIComponent(sinceDate.toISOString())}&per_page=100`;

  while (nextUrl) {
    const { data, next } = await githubGet(nextUrl);
    const issues = Array.isArray(data) ? data : [];
    for (const issue of issues) {
      if (issue.pull_request) continue;
      const createdAt = new Date(issue.created_at);
      if (createdAt >= sinceDate) {
        count += 1;
      }
    }
    nextUrl = next;
  }

  return count;
}

async function main() {
  if (!token || !repository) {
    await writeHistory({
      generatedAt: now.toISOString(),
      windowDays,
      since: sinceDate.toISOString(),
      repository: repository || null,
      source: 'local-or-missing-github-auth',
      warnings: ['Missing GITHUB_TOKEN or GITHUB_REPOSITORY; wrote empty KPI history snapshot.'],
      workflows: [],
      summary: {
        totalRuns: 0,
        completedRuns: 0,
        successfulRuns: 0,
        rerunCount: 0,
        passRatePercent: 0,
        rerunRatePercent: 0,
        docsApiDriftIncidents: 0,
      },
      issueCounts: {
        highSeverityEscapeDefectsMonth: 0,
        securityPolicyViolationsMerged: 0,
      },
    });
    console.log(
      `KPI history collection skipped (missing GitHub auth): ${path.relative(rootDir, outPath)}`
    );
    return;
  }

  const workflowSummaries = [];
  const allRuns = [];
  let docsApiDriftIncidents = 0;

  for (const workflowFile of workflows) {
    const runs = await listWorkflowRuns(workflowFile);
    const summarizedRuns = [];

    for (const run of runs) {
      const runSummary = {
        id: run.id,
        workflow: workflowFile,
        name: run.name,
        event: run.event,
        status: run.status,
        conclusion: run.conclusion,
        createdAt: run.created_at,
        updatedAt: run.updated_at,
        runAttempt: Number(run.run_attempt ?? 1),
        htmlUrl: run.html_url,
        failedJobs: [],
        failedSteps: [],
        hasDocsApiDriftFailure: false,
        hasSecurityPolicyFailure: false,
      };

      if (run.status === 'completed' && run.conclusion !== 'success') {
        const jobs = await listRunJobs(run.id);
        const failedJobs = jobs
          .filter((job) => job.conclusion === 'failure')
          .map((job) => job.name)
          .filter(Boolean);
        const failedSteps = jobs
          .flatMap((job) => job.steps ?? [])
          .filter((step) => step?.conclusion === 'failure')
          .map((step) => step.name)
          .filter(Boolean);

        runSummary.failedJobs = [...new Set(failedJobs)];
        runSummary.failedSteps = [...new Set(failedSteps)];
      }

      const failureSignals = [...runSummary.failedJobs, ...runSummary.failedSteps];
      runSummary.hasDocsApiDriftFailure = failureSignals.some((signal) =>
        docsApiDriftGates.has(signal)
      );
      runSummary.hasSecurityPolicyFailure = failureSignals.some((signal) =>
        securityPolicyGates.has(signal)
      );

      if (runSummary.hasDocsApiDriftFailure) {
        docsApiDriftIncidents += 1;
      }

      summarizedRuns.push(runSummary);
      allRuns.push(runSummary);
    }

    workflowSummaries.push({
      workflow: workflowFile,
      summary: summarizeRuns(summarizedRuns),
      runs: summarizedRuns,
    });
  }

  const overallSummary = summarizeRuns(allRuns);
  overallSummary.docsApiDriftIncidents = docsApiDriftIncidents;

  const issueCounts = {
    highSeverityEscapeDefectsMonth: await collectIssueCount(highSeverityLabels),
    securityPolicyViolationsMerged: await collectIssueCount(securityViolationLabels),
  };

  await writeHistory({
    generatedAt: new Date().toISOString(),
    windowDays,
    since: sinceDate.toISOString(),
    repository,
    source: 'github-api',
    workflows: workflowSummaries,
    summary: overallSummary,
    issueCounts,
  });

  console.log(
    `KPI history collected: ${path.relative(rootDir, outPath)} (${overallSummary.completedRuns} completed runs in ${windowDays}d).`
  );
}

main().catch((error) => {
  console.error(`Failed to collect KPI history: ${error.message}`);
  process.exit(1);
});
