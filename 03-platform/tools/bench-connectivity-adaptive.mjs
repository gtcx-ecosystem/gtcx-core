#!/usr/bin/env node
/**
 * Connectivity Adaptive Mode Benchmark
 *
 * Measures performance of profile classification, option adaptation,
 * and batching under simulated network conditions.
 *
 * Run: node 03-platform/tools/bench-connectivity-adaptive.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ---------------------------------------------------------------------------
// Import connectivity modules directly (bypassing index to avoid side effects)
// ---------------------------------------------------------------------------

const { classifyProfile } = await import(
  join(rootDir, '03-platform/packages/connectivity/03-platform/src/profiles.ts')
);

const { DEFAULT_PROFILE_CONFIG, adaptClientOptionsForProfile } = await import(
  join(rootDir, '03-platform/packages/connectivity/03-platform/src/adapters/api-client.ts')
);

const { RequestBatcher } = await import(
  join(rootDir, '03-platform/packages/connectivity/03-platform/src/batching.ts')
);

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function bench(name, fn, iterations = 100_000) {
  // Warmup
  for (let i = 0; i < 1000; i++) fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  const elapsed = performance.now() - start;

  return {
    name,
    iterations,
    totalMs: elapsed,
    perOpNs: (elapsed * 1_000_000) / iterations,
  };
}

function benchAsync(name, fn, iterations = 10_000) {
  return new Promise((resolve) => {
    // Warmup
    const warmup = async () => {
      for (let i = 0; i < 100; i++) await fn();

      const start = performance.now();
      for (let i = 0; i < iterations; i++) await fn();
      const elapsed = performance.now() - start;

      resolve({
        name,
        iterations,
        totalMs: elapsed,
        perOpNs: (elapsed * 1_000_000) / iterations,
      });
    };
    warmup();
  });
}

// ---------------------------------------------------------------------------
// Benchmarks
// ---------------------------------------------------------------------------

const profiles = ['offline', 'ussd-only', 'edge', 'degraded', 'standard', 'satellite'];

// 1. Profile classification
const classifyResults = profiles.map((profile) => {
  const bandwidths = {
    offline: 0,
    'ussd-only': 0.5,
    edge: 100,
    degraded: 2500,
    standard: 10_000,
    satellite: 256,
  };
  const latencies = {
    offline: 0,
    'ussd-only': 2000,
    edge: 300,
    degraded: 150,
    standard: 50,
    satellite: 800,
  };
  return bench(
    `connectivity.classify_${profile}`,
    () => classifyProfile(bandwidths[profile], latencies[profile]),
    500_000
  );
});

// 2. Option adaptation
const adaptResults = profiles.map((profile) =>
  bench(
    `connectivity.adapt_${profile}`,
    () =>
      adaptClientOptionsForProfile(profile, {
        baseUrl: 'https://api.test',
      }),
    200_000
  )
);

// 3. Batching throughput (edge profile = most restrictive)
const batcher = new RequestBatcher({
  flushFn: async (requests) => requests.map((r) => ({ id: r.id, result: 'ok' })),
  getProfile: () => 'edge',
  maxBatchSize: 10,
  flushIntervalMs: 1000,
});

const batchResult = await benchAsync(
  'connectivity.batch_add_edge',
  async () => {
    batcher.add({ id: Math.random().toString(), payload: 'x' });
  },
  10_000
);

batcher.destroy();

// ---------------------------------------------------------------------------
// Aggregate results
// ---------------------------------------------------------------------------

const allResults = [...classifyResults, ...adaptResults, batchResult];

const metrics = {};
for (const r of allResults) {
  metrics[`${r.name}_ns`] = Math.round(r.perOpNs);
}

const report = {
  recordedAt: new Date().toISOString(),
  source: 'bench:connectivity-adaptive',
  metrics,
  details: allResults.map((r) => ({
    name: r.name,
    iterations: r.iterations,
    totalMs: Math.round(r.totalMs * 100) / 100,
    perOpNs: Math.round(r.perOpNs),
  })),
};

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

const latestPath = join(rootDir, 'benchmarks/latest-results.json');
writeFileSync(latestPath, JSON.stringify(report, null, 2));

console.log('Connectivity adaptive mode benchmark complete');
console.log('');
console.log('Metrics (ns/op):');
for (const [k, v] of Object.entries(metrics).sort()) {
  console.log(`  ${k}: ${v}`);
}
console.log('');
console.log(`Written to ${latestPath}`);
