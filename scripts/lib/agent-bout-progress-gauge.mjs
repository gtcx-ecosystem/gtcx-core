/**
 * Bout progress gauge — separate engineering / workflow / GTM buyer scores.
 * Config: .baseline/bout-progress.config.json (schema gtcx.boutProgress.v1)
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const BOUT_PROGRESS_CONFIG = '.baseline/bout-progress.config.json';
export const BOUT_PROGRESS_DOC = 'docs/operations/agent-bout-progress-gauge.md';

function getByPath(obj, path) {
  if (!path || !obj) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function loadBoutProgressConfig(root) {
  const p = join(root, BOUT_PROGRESS_CONFIG);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}

export function overlayFromLatestJson(config, root) {
  const latestPath = join(root, 'docs/audit/latest.json');
  if (!existsSync(latestPath)) return config;
  let latest;
  try {
    latest = JSON.parse(readFileSync(latestPath, 'utf8'));
  } catch {
    return config;
  }
  const dims = { ...config.dimensions };
  for (const [key, dim] of Object.entries(dims)) {
    if (!dim.autoFromLatestJson) continue;
    const v = getByPath(latest, dim.autoFromLatestJson);
    if (typeof v === 'number') {
      dims[key] = { ...dim, current: v, syncedFrom: 'docs/audit/latest.json' };
    }
  }
  return { ...config, dimensions: dims };
}

function weightedSum(dimensions, weights, field = 'current') {
  let sum = 0;
  let wTotal = 0;
  for (const [key, w] of Object.entries(weights)) {
    const dim = dimensions[key];
    if (!dim || typeof w !== 'number') continue;
    sum += w * (dim[field] ?? dim.current ?? 0);
    wTotal += w;
  }
  return wTotal > 0 ? sum / wTotal : 0;
}

function sumBoutDelta(config) {
  const delta = {};
  for (const task of config.tasks ?? []) {
    if (task.status === 'done' || task.status === 'human') continue;
    for (const [k, v] of Object.entries(task.boutDelta ?? {})) {
      delta[k] = (delta[k] ?? 0) + v;
    }
  }
  return delta;
}

export function buildProgressGauge(root, { applyLatestJson = true } = {}) {
  let config = loadBoutProgressConfig(root);
  if (!config) return null;
  if (applyLatestJson) config = overlayFromLatestJson(config, root);

  const composite = weightedSum(config.dimensions, config.weights);
  const boutDelta = sumBoutDelta(config);
  const deltaDims = { ...config.dimensions };
  for (const [key, bump] of Object.entries(boutDelta)) {
    if (deltaDims[key]) {
      deltaDims[key] = {
        ...deltaDims[key],
        afterBout: Math.min(
          deltaDims[key].ceiling ?? 10,
          (deltaDims[key].current ?? 0) + bump,
        ),
      };
    }
  }
  const afterBoutComposite = weightedSum(
    Object.fromEntries(
      Object.entries(deltaDims).map(([k, d]) => [k, { current: d.afterBout ?? d.current }]),
    ),
    config.weights,
  );

  const activeTasks = (config.tasks ?? []).filter(
    (t) => !['done', 'cancelled'].includes(t.status),
  );

  const buyerDim =
    config.dimensions.gtmBuyer ??
    config.dimensions.workflow ??
    Object.values(config.dimensions).find((d) => d.buyerStage);

  return {
    schema: 'gtcx.boutProgressGauge.v1',
    repo: config.repo,
    normativeDoc: config.normativeDoc ?? BOUT_PROGRESS_DOC,
    antiDrift: config.antiDrift,
    dimensions: config.dimensions,
    weights: config.weights,
    composite: round1(composite),
    afterBoutComposite: round1(afterBoutComposite),
    boutDelta,
    buyerStage: buyerDim?.buyerStage ?? null,
    buyerStageNote: buyerDim?.buyerStageNote ?? buyerDim?.gtmTier ?? null,
    activeTasks,
    tasks: config.tasks ?? [],
    reportMarkdown: formatGaugeMarkdown(config, {
      composite,
      afterBoutComposite,
      buyerDim,
      boutDelta,
      activeTasks,
    }),
  };
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

export function formatGaugeMarkdown(config, computed) {
  const lines = [
    '### Progress gauge',
    '',
    '| Dimension | Today | After bout (realistic) | Ceiling |',
    '| --------- | ----- | ---------------------- | ------- |',
  ];
  for (const [key, dim] of Object.entries(config.dimensions)) {
    const after =
      computed.boutDelta[key] != null
        ? round1(Math.min(dim.ceiling ?? 10, (dim.current ?? 0) + computed.boutDelta[key]))
        : dim.current;
    const extra = dim.buyerStage ? ` (${dim.buyerStage})` : dim.gtmTier ? ` (${dim.gtmTier})` : '';
    lines.push(
      `| ${dim.id}. ${dim.label} | ${dim.current}${extra} | ${after} | ${dim.ceiling ?? 10} |`,
    );
  }
  lines.push(
    '',
    `**Bout composite:** ${round1(computed.composite)} / 10 → **${round1(computed.afterBoutComposite)}** if active tasks land.`,
  );
  if (computed.buyerDim?.buyerStage) {
    lines.push(
      `**Buyer stage:** ${computed.buyerDim.buyerStage}${computed.buyerDim.buyerStageNote ? ` — ${computed.buyerDim.buyerStageNote}` : ''}.`,
    );
  }
  if (computed.activeTasks?.length) {
    lines.push('', '**Active priorities:**');
    for (const t of computed.activeTasks.slice(0, 6)) {
      lines.push(`- \`${t.id}\` (${t.priority}) ${t.title}${t.blocker ? ` — *${t.blocker}*` : ''}`);
    }
  }
  return lines.join('\n');
}
