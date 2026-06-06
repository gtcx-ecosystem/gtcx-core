/**
 * Resolve gtcx-agentic suggest-persona across layout migrations (03-platform/scripts/lib → 13-03-platform/scripts/lib).
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../..');

const CANDIDATES = [
  join(REPO_ROOT, '../gtcx-agentic/13-03-platform/scripts/lib/suggest-persona.mjs'),
  join(REPO_ROOT, '../gtcx-agentic/03-platform/scripts/lib/suggest-persona.mjs'),
  join(REPO_ROOT, '../baseline-os/03-platform/scripts/ecosystem/lib/suggest-persona.mjs'),
];

export function resolveSuggestPersonaPath() {
  for (const path of CANDIDATES) {
    if (existsSync(path)) return path;
  }
  return null;
}

export async function loadSuggestPersona() {
  const path = resolveSuggestPersonaPath();
  if (!path) {
    throw new Error(
      'suggest-persona.mjs not found — clone gtcx-agentic sibling or baseline-os persona map'
    );
  }
  return import(pathToFileURL(path).href);
}
