/**
 * Resolve gtcx-agentic script paths across layout migrations (03-platform/scripts/ → 13-03-platform/scripts/).
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

export function resolveAgenticScript(name) {
  const candidates = [
    join(REPO_ROOT, '../gtcx-agentic/scripts', name),
    join(REPO_ROOT, '../gtcx-agentic/13-scripts', name),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return null;
}

export function resolveAgenticScriptRel(name) {
  const abs = resolveAgenticScript(name);
  if (!abs) return null;
  return abs.replace(`${REPO_ROOT}/`, '');
}
