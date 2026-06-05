/**
 * Resolve gtcx-core repo root from any script under 03-platform/scripts/.
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function findRepoRoot(start = dirname(fileURLToPath(import.meta.url))) {
  let dir = start;
  while (true) {
    if (
      existsSync(join(dir, 'package.json')) &&
      existsSync(join(dir, '03-platform')) &&
      existsSync(join(dir, '02-ops'))
    ) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('gtcx-core repo root not found');
}

export const REPO_ROOT = findRepoRoot();
