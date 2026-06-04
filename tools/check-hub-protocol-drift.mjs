#!/usr/bin/env node
/**
 * Hub drift probe — compare gtcx-docs protocol.md hashes vs local snapshot.
 * Provider-agnostic; uses sibling ../gtcx-docs checkout when present.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readRepoFile } from './lib/agent-check-utils.mjs';
import {
  allManifestSlugs,
  collectHubProtocolEntry,
  resolveHubRoot,
} from './lib/hub-protocols.mjs';

const ROOT = process.cwd();
const update = process.argv.includes('--update');
const strict = process.argv.includes('--strict');
const failures = [];
const warnings = [];

const manifest = JSON.parse(
  readRepoFile('docs/agents/agent-protocols-manifest.json') ?? '{}',
);
let snapshot = {};
try {
  snapshot = JSON.parse(readRepoFile('docs/agents/agent-protocols-hub-snapshot.json') ?? '{}');
} catch {
  failures.push('Invalid docs/agents/agent-protocols-hub-snapshot.json');
}

const hubRoot = resolveHubRoot(ROOT, manifest, snapshot);
if (!hubRoot) {
  const msg =
    'Hub checkout not found (set GTCX_DOCS_ROOT or clone ../gtcx-docs). Hub drift check skipped.';
  if (strict) failures.push(msg);
  else warnings.push(msg);
} else {
  const slugs = allManifestSlugs(manifest);
  const nextProtocols = {};
  const snapshotEmpty = !snapshot.protocols || Object.keys(snapshot.protocols).length === 0;

  for (const slug of slugs) {
    const entry = collectHubProtocolEntry(hubRoot, slug);
    if (entry.missing) {
      failures.push(`Hub missing protocol: ${entry.rel}`);
      continue;
    }
    nextProtocols[slug] = {
      sha256: entry.sha256,
      gitCommit: entry.gitCommit,
      gitDate: entry.gitDate,
    };

    const prev = snapshot.protocols?.[slug];
    if (!prev) {
      if (!snapshotEmpty) {
        warnings.push(`No snapshot for ${slug} — run pnpm agent:hub-snapshot:update`);
      }
      continue;
    }
    if (prev.sha256 !== entry.sha256 && !update) {
      failures.push(
        `Hub drift: ${slug} changed since snapshot (${prev.gitDate ?? 'unknown'} → ${entry.gitDate}). Review hub text, update local wiring, then pnpm agent:hub-snapshot:update`,
      );
    }
  }

  // Hub README must index agent session protocols P26–P28
  const readme = readRepoFile(join(hubRoot, 'docs/governance/protocols/README.md'), true);
  if (readme) {
    for (const id of ['26-agent-proceed-confirmation', '27-agent-execution-obligation', '28-agent-authority-classification']) {
      if (!readme.includes(id)) {
        failures.push(`gtcx-docs protocols/README.md missing index entry: ${id}`);
      }
    }
    if (!readme.includes('19-agent-credential-access')) {
      warnings.push('gtcx-docs protocols/README.md missing P19 index entry');
    }
  }

  if (update) {
    const out = {
      schemaVersion: 1,
      hubRepo: manifest.hubRepo ?? 'gtcx-docs',
      hubLocalPath: snapshot.hubLocalPath ?? '../gtcx-docs',
      capturedAt: new Date().toISOString(),
      captureNote: 'Run after reviewing hub protocol changes',
      protocols: nextProtocols,
    };
    writeFileSync(
      join(ROOT, 'docs/agents/agent-protocols-hub-snapshot.json'),
      `${JSON.stringify(out, null, 2)}\n`,
    );
    console.log(`Hub snapshot updated (${Object.keys(nextProtocols).length} protocols).`);
    process.exit(0);
  }
  if (snapshotEmpty && !update) {
    warnings.push('Hub snapshot empty — run pnpm agent:hub-snapshot:update (once per hub change review cycle)');
  }
}

if (warnings.length) {
  console.warn('Hub drift warnings:\n');
  for (const w of warnings) console.warn(`  - ${w}`);
}

if (failures.length) {
  console.error('Hub drift check failed:\n');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('Hub drift check passed.');
