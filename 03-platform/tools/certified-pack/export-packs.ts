/**
 * DTF-5.5.2 — Export canonical engagement jurisdiction packs to artifacts/certified-pack/packs/.
 */
import fs from 'node:fs';
import path from 'node:path';

import { REPO_ROOT } from '../../../config/paths.mjs';
import { ENGAGEMENT_JURISDICTIONS } from '../../tests/integration/fixtures/jurisdiction-fixtures';

const outDir = path.join(REPO_ROOT, '00-archive/artifacts/certified-pack/packs');

function canonicalJson(value: unknown): string {
  return `${JSON.stringify(value)}\n`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const { code, name, fixture } of ENGAGEMENT_JURISDICTIONS) {
  const config = fixture();
  const fileName = `${code.toLowerCase()}-engagement-pack.json`;
  const outPath = path.join(outDir, fileName);
  fs.writeFileSync(outPath, canonicalJson(config));
  process.stderr.write(`[certified-pack] wrote ${fileName} (${name})\n`);
}
