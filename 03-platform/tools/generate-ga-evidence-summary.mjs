#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const logPath = path.join(rootDir, '01-docs/release/ga-release/ga-release-evidence-log.md');
const summaryPath = path.join(rootDir, '01-docs/release/ga-release/ga-release-evidence-summary.md');
const checkOnly = process.argv.includes('--check');

const gateCatalog = [
  { gate: 'Security (Dependency Audit — npm)', owner: 'Core Platform' },
  { gate: 'Security (Dependency Audit — Rust)', owner: 'Core Platform' },
  { gate: 'Security (SAST)', owner: 'Security' },
  { gate: 'Security (Pen Test + Remediation)', owner: 'Security' },
  { gate: 'Security (SBOM)', owner: 'Security' },
  { gate: 'Security (Secret Scan)', owner: 'Security' },
  { gate: 'Performance (Crypto Benchmarks)', owner: 'Core Platform' },
  { gate: 'API Surface Stability', owner: 'Core Platform' },
  { gate: 'Coverage (Critical Packages)', owner: 'Core Platform' },
  { gate: 'Documentation (Integration Guides)', owner: 'Core Platform' },
  { gate: 'Documentation (AI Stub Caveats)', owner: 'Core Platform' },
  { gate: 'Change Management', owner: 'Core Platform' },
  { gate: 'Compliance Evidence (SOC2)', owner: 'Compliance' },
  { gate: 'Compliance Evidence (ISO 27001)', owner: 'Compliance' },
  { gate: 'Provenance Manifest', owner: 'Core Platform' },
  { gate: 'AI Evaluation Scorecard', owner: 'Core Platform' },
];

function escapePipes(value) {
  return value.replaceAll('|', '\\|');
}

function parseLogRows(markdown) {
  const lines = markdown.split('\n');
  const rows = [];

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (line.includes('| Date ')) continue;
    if (/^\|\s*-/.test(line)) continue;

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== 5) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cells[0])) continue;

    rows.push({
      date: cells[0],
      gate: cells[1],
      evidence: cells[2],
      summary: cells[3],
      owner: cells[4],
    });
  }

  return rows;
}

function compareDateDesc(a, b) {
  return b.localeCompare(a);
}

function getLatestEvidenceDate(rows) {
  return rows.map((row) => row.date).sort(compareDateDesc)[0] ?? '—';
}

function buildSummaryRows(rows) {
  return gateCatalog.map((gateDef) => {
    const matching = rows
      .filter((row) => row.gate === gateDef.gate)
      .sort((a, b) => compareDateDesc(a.date, b.date));

    return {
      gate: gateDef.gate,
      lastEvidenceDate: matching[0]?.date ?? '—',
      evidence: matching[0]?.evidence ?? '—',
      owner: gateDef.owner,
      entries: matching.length,
      latestSummary: matching[0]?.summary ?? '',
    };
  });
}

function countBlockingFindings(summaryRows) {
  return summaryRows.filter((row) => /^fail:/i.test(row.latestSummary)).length;
}

function renderTable(summaryRows) {
  const tableRows = [
    ['Gate', 'Last Evidence Date', 'Evidence', 'Owner', 'Entries'],
    ...summaryRows.map((row) => [
      escapePipes(row.gate),
      row.lastEvidenceDate,
      escapePipes(row.evidence),
      row.owner,
      String(row.entries),
    ]),
  ];

  const widths = tableRows[0].map((_, columnIndex) =>
    Math.max(...tableRows.map((row) => row[columnIndex].length))
  );

  const renderRow = (row) =>
    `| ${row.map((cell, index) => cell.padEnd(widths[index])).join(' | ')} |`;

  const separator = `| ${widths.map((width) => '-'.repeat(width)).join(' | ')} |`;

  return [renderRow(tableRows[0]), separator, ...tableRows.slice(1).map(renderRow)].join('\n');
}

function renderSummary(summaryRows) {
  const total = summaryRows.length;
  const withEvidence = summaryRows.filter((row) => row.entries > 0).length;
  const blockingFindings = countBlockingFindings(summaryRows);
  const missingEvidenceGates = summaryRows
    .filter((row) => row.entries === 0)
    .map((row) => row.gate);
  const coveragePct = Math.round((withEvidence / total) * 100);

  return [
    `- **${withEvidence} of ${total} gates have evidence** (${coveragePct}%)`,
    `- **${blockingFindings} of ${total} gates have blocking findings**`,
    `- **${missingEvidenceGates.length} gates require action**: ${missingEvidenceGates.join(', ')}`,
  ].join('\n');
}

function main() {
  const logMarkdown = fs.readFileSync(logPath, 'utf8');
  const rows = parseLogRows(logMarkdown);
  const summaryRows = buildSummaryRows(rows);
  const latestEvidenceDate = getLatestEvidenceDate(rows);

  const output = `---
title: 'GA Release Evidence Summary'
status: 'current'
date: '${latestEvidenceDate}'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['release', 'ga', 'evidence', 'auto-generated']
review_cycle: 'on-change'
---

# GA Evidence Summary

Generated: ${latestEvidenceDate}
Source: \`01-docs/release/ga-release/ga-release-evidence-log.md\`

${renderTable(summaryRows)}

## Summary

${renderSummary(summaryRows)}

## Usage Notes

- This file is generated from the evidence log. Do not edit manually.
- Re-run \`pnpm release:ga:evidence:summary\` after new evidence entries are added to the log.
- Use \`pnpm release:ga:evidence:check\` to verify this summary is current.
- All gates with 0 entries require evidence before sign-off can proceed.
`;

  if (checkOnly) {
    const currentOutput = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, 'utf8') : '';
    if (currentOutput !== output) {
      console.error(
        `GA evidence summary is stale. Run pnpm release:ga:evidence:summary to regenerate ${path.relative(rootDir, summaryPath)}.`
      );
      process.exit(1);
    }

    console.log(`GA evidence summary is current: ${path.relative(rootDir, summaryPath)}`);
    return;
  }

  fs.writeFileSync(summaryPath, output);
  console.log(`GA evidence summary generated: ${path.relative(rootDir, summaryPath)}`);
}

main();
