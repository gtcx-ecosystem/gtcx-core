#!/usr/bin/env node
/**
 * Repo CLI — run agent commands without `pnpm`.
 *
 *   agent start
 *   agent next-work --json
 *   agent bout-progress
 *   agent protocols:check
 *
 * One-time: add repo bin to PATH (from gtcx-core root):
 *   export PATH="$(pwd)/bin:$PATH"
 * Or: pnpm agent:cli:path  → paste into ~/.zshrc
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const ALIASES = {
  start: 'start',
  'session-start': 'start',
  session: 'start',
};

function usage() {
  const cmds = Object.keys(pkg.scripts)
    .filter((k) => k.startsWith('agent:'))
    .map((k) => k.replace(/^agent:/, ''))
    .sort();
  console.log(`Usage: agent <command> [args...]

Examples:
  agent start
  agent start --json
  agent next-work
  agent bout-progress
  agent protocols:check

Commands (agent:* scripts):
  ${cmds.join(', ')}

Setup (no pnpm prefix):
  export PATH="${join(ROOT, 'bin')}:$PATH"
`);
}

function normalizeCommand(argv) {
  if (argv.length === 0) return null;
  let head = argv[0].replace(/^agent:/, '');
  let rest = argv.slice(1);
  if (ALIASES[head]) head = ALIASES[head];
  // agent protocols check → protocols:check
  if (rest[0] && !rest[0].startsWith('-') && !head.includes(':')) {
    head = `${head}:${rest[0]}`;
    rest = rest.slice(1);
  }
  return { head, rest };
}

function resolveScript(scriptKey) {
  const cmd = pkg.scripts[scriptKey];
  if (!cmd) return null;
  const nodeMatch = cmd.match(/^node\s+(\S+)/);
  if (nodeMatch) {
    const rel = nodeMatch[1];
    const abs = rel.startsWith('/') ? rel : join(ROOT, rel);
    if (!existsSync(abs)) return { error: `missing ${rel}` };
    return { node: abs, extra: cmd.slice(nodeMatch[0].length).trim() };
  }
  return { pnpm: scriptKey };
}

function main() {
  const parsed = normalizeCommand(process.argv.slice(2));
  if (!parsed) {
    usage();
    process.exit(1);
  }
  const scriptKey = `agent:${parsed.head}`;
  const resolved = resolveScript(scriptKey);
  if (!resolved) {
    console.error(`agent: unknown command "${parsed.head}" (no ${scriptKey} in package.json)`);
    usage();
    process.exit(1);
  }
  if (resolved.error) {
    console.error(`agent: ${resolved.error}`);
    process.exit(1);
  }
  if (resolved.pnpm) {
    const r = spawnSync('pnpm', ['run', resolved.pnpm, ...parsed.rest], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    process.exit(r.status ?? 1);
  }
  const extraArgs = resolved.extra ? resolved.extra.split(/\s+/).filter(Boolean) : [];
  const r = spawnSync(process.execPath, [resolved.node, ...extraArgs, ...parsed.rest], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  process.exit(r.status ?? 1);
}

main();
