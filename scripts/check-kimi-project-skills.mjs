#!/usr/bin/env node
/**
 * Verify .kimi/skills matches skills-expected.json (GTCX Cursor/Claude parity).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const expectedPath = join(ROOT, '.kimi', 'skills-expected.json');
const skillsRoot = join(ROOT, '.kimi', 'skills');
const failures = [];

if (!existsSync(expectedPath)) {
  console.error('check-kimi-project-skills: missing .kimi/skills-expected.json');
  process.exit(1);
}

const { skills: expected } = JSON.parse(readFileSync(expectedPath, 'utf8'));
const onDisk = existsSync(skillsRoot)
  ? readdirSync(skillsRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort()
  : [];

for (const name of expected) {
  const skillFile = join(skillsRoot, name, 'SKILL.md');
  if (!existsSync(skillFile)) {
    failures.push(`missing .kimi/skills/${name}/SKILL.md — run pnpm kimi:skills:sync`);
    continue;
  }
  const text = readFileSync(skillFile, 'utf8');
  if (!/^---\s*\nname:\s*/m.test(text) || !text.includes(`name: ${name}`)) {
    failures.push(`.kimi/skills/${name}/SKILL.md: frontmatter name must be "${name}"`);
  }
  if (!text.includes('/skill:')) {
    failures.push(`.kimi/skills/${name}/SKILL.md: missing Kimi invoke hint /skill:`);
  }
}

const expectedSet = new Set(expected);
for (const name of onDisk) {
  if (!expectedSet.has(name)) {
    failures.push(`unexpected skill directory .kimi/skills/${name} — update skills-expected.json or remove`);
  }
}

if (failures.length) {
  console.error('check-kimi-project-skills failed:\n');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`check-kimi-project-skills: OK (${expected.length} skills)`);
