#!/usr/bin/env node
/**
 * Class R — refresh launch/GTM machine state without full forensic audit.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLaunchFocus, writeLaunchFocusState } from './lib/agent-launch-focus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUTO_DEV = join(ROOT, 'docs/audit/auto-dev-state-tier5-commercial.md');

const lf = buildLaunchFocus(ROOT);
writeLaunchFocusState(ROOT, lf);

const lines = [
  '---',
  `updated: ${new Date().toISOString().slice(0, 10)}`,
  'owner: gtcx-core',
  `status: launch-focus-${lf.sessionMode}`,
  '---',
  '',
  '# Auto-dev state — launch / GTM (machine-generated)',
  '',
  '**Do not hand-edit** — run `pnpm agent:reconcile-launch`.',
  '',
  '## North star',
  '',
  `- **Outcome:** ${lf.northStar.outcome}`,
  `- **GTM library:** ${lf.northStar.gtmTier.library} · **Sovereign:** ${lf.northStar.gtmTier.ecosystemSovereign}`,
  '',
  `## Session mode: **${lf.sessionMode.toUpperCase()}**`,
  '',
  '| Bucket | Count |',
  '| ------ | ----- |',
  `| implement | ${lf.workSetCounts.implement} |`,
  `| plan | ${lf.workSetCounts.plan} |`,
  `| human | ${lf.workSetCounts.human} |`,
  '',
  '## Implement queue',
  '',
];

for (const item of lf.workSet.implement) {
  lines.push(`- **${item.storyId}** — ${item.title}`);
}
if (lf.workSet.implement.length === 0) {
  lines.push('- _(empty — agent in PLAN mode)_');
}

lines.push('', '## Plan queue (when implement empty)', '');
for (const item of lf.workSet.plan) {
  lines.push(`- **${item.storyId}** — ${item.title}${item.command ? ` (\`${item.command}\`)` : ''}`);
}

lines.push('', '## Human gates', '');
for (const item of lf.workSet.human) {
  lines.push(`- **${item.storyId}** — ${item.title} (${item.owner ?? 'human'})`);
}

writeFileSync(AUTO_DEV, `${lines.join('\n')}\n`);

let roadmap = '';
const roadmapPath = join(ROOT, 'docs/audit/execution-roadmap.md');
if (existsSync(roadmapPath)) {
  roadmap = readFileSync(roadmapPath, 'utf8');
  const stamp = new Date().toISOString().slice(0, 10);
  if (roadmap.includes('last_reconciled:')) {
    roadmap = roadmap.replace(/last_reconciled:\s*\S+/, `last_reconciled: ${stamp}`);
  }
  const note = `Launch-focus reconcile ${stamp} — mode ${lf.sessionMode}; implement ${lf.workSetCounts.implement} / plan ${lf.workSetCounts.plan}. Run pnpm agent:reconcile-auto-dev for hub JSON.`;
  if (roadmap.includes('reconciliation_note:')) {
    const existing = roadmap.match(/reconciliation_note:\s*>-\s*\n([\s\S]*?)(?=\nsources:)/)?.[1] ?? '';
    if (!/auto-dev-data|ER-AUTO-DEV/.test(existing)) {
      roadmap = roadmap.replace(
        /reconciliation_note:\s*>-\s*\n(?:\s+[^\n]+\n?)*/,
        `reconciliation_note: >-\n  ${note}\n`,
      );
    }
  }
  writeFileSync(roadmapPath, roadmap);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      sessionMode: lf.sessionMode,
      workSetCounts: lf.workSetCounts,
      wrote: [AUTO_DEV, lf.statePath],
    },
    null,
    2,
  ),
);
