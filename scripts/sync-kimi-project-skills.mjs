#!/usr/bin/env node
/**
 * Generate .kimi/skills/<command>/SKILL.md for all GTCX-native Cursor/Claude commands.
 * Paths are repo-relative (../gtcx-docs) so skills work from gtcx-core without global install.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS = '../gtcx-docs';
const FRAMEWORK = `${DOCS}/tools/audit/audit-framework`;
const LANE_SCORING = `${DOCS}/tools/audit/lane-scoring`;
const AUDIT_MANIFEST = `${DOCS}/tools/audit/agent-commands/manifest.json`;
const ROADMAP = `${DOCS}/tools/roadmap/roadmap-framework`;
const SKILLS_DIR = join(ROOT, '.kimi', 'skills');
const EXPECTED = join(ROOT, '.kimi', 'skills-expected.json');

function readJson(relFromRoot) {
  const p = join(ROOT, relFromRoot);
  if (!existsSync(p)) {
    console.error(`sync-kimi-project-skills: missing ${relFromRoot} (clone gtcx-docs sibling)`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const manifest = readJson(AUDIT_MANIFEST);
const { commands } = readJson(`${FRAMEWORK}/commands.json`);

function tierLabel(cmd) {
  const c = commands[cmd];
  if (!c) return 'audit';
  if (c.auditType === 'domain') return 'domain';
  if (c.lane === 'gcr') return 'gcr';
  if (typeof c.lane === 'number') return `lane-${c.lane}`;
  return 'supporting';
}

function buildDescription(cmd) {
  const c = commands[cmd];
  if (!c) return `GTCX audit: ${cmd}`;
  const parts = [];
  if (c.auditType === 'domain' && c.feedsLaneAudit) {
    const feed = Array.isArray(c.feedsLaneAudit) ? c.feedsLaneAudit.join(', ') : c.feedsLaneAudit;
    parts.push(`feeds ${feed}`);
  }
  if (c.lane && c.lane !== 'gcr') parts.push(`lane ${c.lane}`);
  if (c.lane === 'gcr') parts.push('GCR rollup');
  if (c.requires?.length) parts.push(`requires ${c.requires.join(' + ')}`);
  if (c.time) parts.push(c.time);
  return `GTCX ${tierLabel(cmd)} audit${parts.length ? ` (${parts.join('; ')})` : ''}`;
}

function resolveFrameworkPath(rel) {
  if (!rel) return null;
  if (rel.startsWith('../lane-scoring/')) {
    return `${LANE_SCORING}/${rel.replace('../lane-scoring/', '')}`;
  }
  return `${FRAMEWORK}/${rel.replace(/^\//, '')}`;
}

function buildAuditBody(cmd) {
  const c = commands[cmd];
  const commandPath = c?.file ? `${FRAMEWORK}/${c.file}` : `${FRAMEWORK}/commands/${cmd}.md`;
  const promptPath = c?.prompt ? `${FRAMEWORK}/${c.prompt}` : null;
  const scoringPath = c?.scoringProtocol ? resolveFrameworkPath(c.scoringProtocol) : null;
  const output = (c?.reportOutput || c?.output || `docs/audit/${cmd}-<DATE>.md`).replace(
    '<DATE>',
    'YYYY-MM-DD',
  );
  const requires = c?.requires?.length
    ? `\n**Prerequisites:** Run \`${c.requires.join('`, `')}\` first (or cite forensics ≤7 days old).\n`
    : '';

  return `# ${cmd}

Run the GTCX **${cmd}** audit in **this repo** (\`gtcx-core\`).

## Steps

1. Read command spec: \`${commandPath}\`
2. Read prompt (BEGIN PROMPT → END PROMPT): \`${promptPath || 'see command file'}\`
${scoringPath ? `3. Read scoring protocol: \`${scoringPath}\`` : '3. Follow scoring in command + prompt'}
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: \`${output}\` (today's date)
6. Update lane index + \`docs/audit/latest.json\` if readiness changed
7. \`pnpm readiness:lanes:check\`
8. Commit audit artifacts; push in-session when done unless operator said **do not push**
${requires}
## Registry

- Framework: \`${FRAMEWORK}/AGENT-START.md\`
- Lane audits: \`${DOCS}/tools/audit/lane-audits/README.md\`
- Domain audits: \`${DOCS}/tools/audit/domain-audits/README.md\`

**Kimi invoke:** \`/skill:${cmd}\` (not \`/${cmd}\`).
`;
}

function buildAliasBody(alias, target) {
  return `# ${alias}

**Alias for \`${target}\`.** Same workflow as \`/skill:${target}\`.

${buildAuditBody(target).replace(new RegExp(`^# ${target}`, 'm'), `# ${alias} (via ${target})`)}
`;
}

function buildSkill(cmd, body, description) {
  const desc = (description || buildDescription(cmd)).replace(/\n/g, ' ').slice(0, 500);
  return `---
name: ${cmd}
description: ${desc}
---

${body}
`;
}

function writeSkill(cmd, content) {
  const dir = join(SKILLS_DIR, cmd);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'SKILL.md'), content, 'utf8');
}

function installAudit(cmd) {
  if (commands[cmd]) {
    writeSkill(cmd, buildSkill(cmd, buildAuditBody(cmd)));
    return;
  }
  const target = manifest.aliases[cmd];
  if (!target) {
    console.warn(`skip ${cmd}: not in commands.json or aliases`);
    return;
  }
  const desc = `GTCX audit alias: ${cmd} (same as ${target}) — ${buildDescription(target)}`;
  writeSkill(cmd, buildSkill(cmd, buildAliasBody(cmd, target), desc));
}

const ROADMAP_SKILLS = {
  'execute-roadmap': {
    description: 'GTCX execute-roadmap — reconcile audits and implement until phase complete',
    body: `# execute-roadmap

Reconcile audits/strategy into a living execution plan **and implement stories** until the active phase is complete.

**Not \`roadmap\`** — plan-only shortcut is \`gtcx-reconcile-roadmap\`.

## Execute (read in order)

1. \`${ROADMAP}/AGENT-START.md\`
2. \`${ROADMAP}/commands/execute-roadmap.md\`
3. \`${ROADMAP}/prompts/roadmap/roadmap-reconcile-execute-prompt.md\` — all phases (reconcile + plan + ship)
4. \`${ROADMAP}/ECOSYSTEM-CONTEXT.md\`

## Output

Update \`docs/strategy/execution-roadmap.md\` or \`docs/audit/execution-roadmap.md\` in **gtcx-core**, then implement stories.

## Rules

- Prefer **execution bout** (\`pnpm agent:session-start\`) for shipping; do not use this skill only to discover priorities
- **Protocol 27:** Run gates in-session; report command + exit code
- Do not stop after planning

**Kimi invoke:** \`/skill:execute-roadmap\`
`,
  },
  'gtcx-reconcile-roadmap': {
    description: 'GTCX gtcx-reconcile-roadmap — reconcile and plan only (no implementation)',
    body: `# gtcx-reconcile-roadmap

**Reconcile and plan only** — updates the execution roadmap from latest audits/strategy. Does **not** implement stories.

For reconcile + ship, use \`/skill:execute-roadmap\`.

## Execute (read in order)

1. \`${ROADMAP}/AGENT-START.md\`
2. \`${ROADMAP}/commands/gtcx-reconcile-roadmap.md\`
3. \`${ROADMAP}/prompts/roadmap/roadmap-reconcile-execute-prompt.md\` — Phases 0–2 only (stop before Execute)
4. \`${ROADMAP}/ECOSYSTEM-CONTEXT.md\`

## Output

Update \`docs/strategy/execution-roadmap.md\` or \`docs/audit/execution-roadmap.md\`; set \`Last reconciled: YYYY-MM-DD\`.

## Rules

- Read-only reconcile — no code changes unless fixing the plan doc
- Every open audit issue → story or explicit deferral

**Kimi invoke:** \`/skill:gtcx-reconcile-roadmap\`
`,
  },
};

const auditCommands = [
  ...manifest.lane,
  ...manifest.domain,
  ...manifest.supporting,
  ...Object.keys(manifest.aliases),
];

let written = 0;
for (const cmd of auditCommands) {
  installAudit(cmd);
  written += 1;
  console.log(`  ✓ ${cmd}`);
}

for (const [cmd, spec] of Object.entries(ROADMAP_SKILLS)) {
  writeSkill(cmd, buildSkill(cmd, spec.body, spec.description));
  written += 1;
  console.log(`  ✓ ${cmd}`);
}

const expected = {
  version: 1,
  description:
    'GTCX-native slash commands mirrored for Kimi CLI (/skill:<name>). Sync: pnpm kimi:skills:sync',
  skills: [...new Set([...auditCommands, ...Object.keys(ROADMAP_SKILLS)])].sort(),
};
writeFileSync(EXPECTED, `${JSON.stringify(expected, null, 2)}\n`, 'utf8');
console.log(`\nWrote ${written} skills under .kimi/skills/ (${expected.skills.length} expected names)`);
