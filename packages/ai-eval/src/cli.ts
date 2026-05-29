#!/usr/bin/env node
import { writeFileSync } from 'fs';

import { evaluateAccuracy } from './accuracy';
import { evaluateContextUtilization } from './context';
import { evaluateEfficiency } from './efficiency';
import { evaluateSafety } from './safety';
import { buildMeta, buildScorecard } from './scorecard';
import type { EvaluateOptions } from './types';

function parseArgs(): EvaluateOptions {
  const args = process.argv.slice(2);
  const options: EvaluateOptions = {
    repo: process.cwd(),
    strict: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = () => {
      const v = args[++i];
      if (v === undefined) {
        process.stderr.write(`Missing value for ${arg}\n`);
        process.exit(1);
      }
      return v;
    };
    switch (arg) {
      case '--repo':
        options.repo = next();
        break;
      case '--agent-id':
        options.agentId = next();
        break;
      case '--session-id':
        options.sessionId = next();
        break;
      case '--baseline':
        options.baseline = next();
        break;
      case '--output':
        options.output = next();
        break;
      case '--dimensions':
        options.dimensions = next().split(',');
        break;
      case '--strict':
        options.strict = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function printHelp() {
  process.stdout.write(`ai-evaluate — AI Evaluation Pipeline

Usage: ai-evaluate [options]

Options:
  --repo <path>          Repository root to evaluate (default: cwd)
  --agent-id <id>        Agent identifier for attribution
  --session-id <id>      Session identifier for traceability
  --baseline <path>      Path to baseline scorecard for delta comparison
  --output <path>        Output file for JSON scorecard (default: stdout)
  --dimensions <list>    Comma-separated: accuracy,safety,efficiency,context
  --strict               Exit non-zero if any dimension below threshold
  --help, -h             Show this help

Environment:
  AI_EVAL_BASELINE_PATH  Default baseline path
  AI_EVAL_OUTPUT_DIR     Directory for artifacts
`);
}

export async function main() {
  const opts = parseArgs();

  const dimensions = opts.dimensions || ['accuracy', 'safety', 'efficiency', 'context'];
  const baseline = opts.baseline || process.env.AI_EVAL_BASELINE_PATH;

  process.stderr.write(`Evaluating ${opts.repo}...\n`);
  process.stderr.write(`Dimensions: ${dimensions.join(', ')}\n`);

  const meta = buildMeta(opts.repo, opts.agentId, opts.sessionId, baseline);

  const results: Record<string, unknown> = {};

  if (dimensions.includes('accuracy')) {
    process.stderr.write('Running accuracy evaluation...\n');
    results.accuracy = await evaluateAccuracy(opts.repo, baseline);
  }

  if (dimensions.includes('safety')) {
    process.stderr.write('Running safety evaluation...\n');
    results.safety = await evaluateSafety(opts.repo, baseline || 'main');
  }

  if (dimensions.includes('efficiency')) {
    process.stderr.write('Running efficiency evaluation...\n');
    results.efficiency = await evaluateEfficiency(opts.repo, baseline);
  }

  if (dimensions.includes('context')) {
    process.stderr.write('Running context utilization evaluation...\n');
    results.context = await evaluateContextUtilization(opts.repo);
  }

  const defaultAccuracy = {
    pass_rate: 0,
    baseline_pass_rate: 0,
    delta: 0,
    threshold: 0.95,
    status: 'WARN' as const,
    packages: [],
  };
  const defaultSafety = { violations: 0, status: 'WARN' as const, findings: [] };
  const defaultEfficiency = {
    tokens_per_task: 0,
    baseline_tokens_per_task: 0,
    tokens_delta_pct: 0,
    duration_per_task_ms: 0,
    baseline_duration_ms: 0,
    duration_delta_pct: 0,
    threshold_tokens_pct: 10,
    threshold_duration_pct: 20,
    status: 'WARN' as const,
  };
  const defaultContext = {
    utilization_score: 0,
    avg_context_tokens: 0,
    max_context_tokens: 131072,
    truncation_events: 0,
    target_score: 0.7,
    status: 'WARN' as const,
  };

  const scorecard = buildScorecard(
    meta,
    (results.accuracy as ReturnType<typeof evaluateAccuracy> extends Promise<infer T>
      ? T
      : never) || defaultAccuracy,
    (results.safety as ReturnType<typeof evaluateSafety> extends Promise<infer T> ? T : never) ||
      defaultSafety,
    (results.efficiency as ReturnType<typeof evaluateEfficiency> extends Promise<infer T>
      ? T
      : never) || defaultEfficiency,
    (results.context as ReturnType<typeof evaluateContextUtilization> extends Promise<infer T>
      ? T
      : never) || defaultContext
  );

  const json = JSON.stringify(scorecard, null, 2);

  if (opts.output) {
    writeFileSync(opts.output, json);
    process.stderr.write(`Scorecard written to ${opts.output}\n`);
  } else {
    process.stdout.write(json + '\n');
  }

  process.stderr.write(`\nOverall: ${scorecard.summary.overall_status}\n`);
  process.stderr.write(
    `Dimensions: ${scorecard.summary.dimensions_passed}/${scorecard.summary.dimensions_scored} passed\n`
  );

  if (opts.strict && scorecard.summary.overall_status !== 'PASS') {
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(String(err) + '\n');
  process.exit(1);
});
