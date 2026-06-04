import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function resolveHubRoot(repoRoot, manifest, snapshot) {
  const candidates = [
    process.env.GTCX_DOCS_ROOT,
    snapshot?.hubLocalPath,
    manifest?.hubLocalPath,
    '../gtcx-docs',
  ].filter(Boolean);

  for (const rel of candidates) {
    const abs = resolve(repoRoot, rel);
    if (existsSync(join(abs, 'docs/governance/protocols'))) {
      return abs;
    }
  }
  return null;
}

export function hubProtocolRelPath(slug) {
  return join('docs/governance/protocols', slug, 'protocol.md');
}

export function hashFile(absPath) {
  const content = readFileSync(absPath);
  return createHash('sha256').update(content).digest('hex');
}

export function gitHubLastCommit(hubRoot, relPath) {
  try {
    const out = execSync(`git log -1 --format=%H|%cI -- "${relPath}"`, {
      cwd: hubRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return null;
    const [sha, date] = out.split('|');
    return { sha, date };
  } catch {
    return null;
  }
}

export function collectHubProtocolEntry(hubRoot, slug) {
  const rel = hubProtocolRelPath(slug);
  const abs = join(hubRoot, rel);
  if (!existsSync(abs)) {
    return { slug, rel, missing: true };
  }
  const sha256 = hashFile(abs);
  const git = gitHubLastCommit(hubRoot, rel);
  return {
    slug,
    rel,
    sha256,
    gitCommit: git?.sha ?? null,
    gitDate: git?.date ?? null,
  };
}

export function allManifestSlugs(manifest) {
  const slugs = new Set();
  for (const p of manifest.protocols ?? []) {
    if (p.slug) slugs.add(p.slug);
  }
  for (const p of manifest.foundationProtocols ?? []) {
    if (p.slug) slugs.add(p.slug);
  }
  for (const p of manifest.relatedProtocols ?? []) {
    if (p.slug) slugs.add(p.slug);
  }
  return [...slugs];
}
