#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = process.cwd();
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sorMapPath = path.join(workspaceRoot, 'config/sor-map.json');

// Top-level directories that hold archived or staged-for-deletion content.
// Markdown inside these directories is intentionally vestigial — internal
// links may have been written for the file's original location and are not
// expected to resolve. Excluding them from the link check matches the
// intent (these files are not part of the active documentation surface).
const EXCLUDED_PREFIXES = ['_delete/', '_archive/', '00-archive/'];

/** Apply legacy rewrites to a repo-root relative path. */
function applyLegacyRewrites(normalized) {
  const candidates = [normalized];
  for (const [from, to] of Object.entries(DEPRECATED_PREFIX_MAP)) {
    if (normalized.startsWith(from)) {
      candidates.push(to + normalized.slice(from.length));
    }
  }
  for (const [pattern, replacement] of LEGACY_PATH_REWRITES) {
    if (pattern.test(normalized)) {
      candidates.push(normalized.replace(pattern, replacement));
    }
  }
  return [...new Set(candidates)];
}

/** @type {Array<[RegExp, string]>} layout v3 legacy path rewrites (repo-root relative) */
const LEGACY_PATH_REWRITES = [
  [/^01-docs\/audit(\/|$)/, '01-docs/05-audit/'],
  [/^01-docs\/agents(\/|$)/, '01-docs/01-agents/'],
  [/^01-docs\/operations(\/|$)/, '01-docs/04-ops/'],
  [/^docs\/audit(\/|$)/, '01-docs/05-audit/'],
  [/^docs\/agents(\/|$)/, '01-docs/01-agents/'],
  [/^01-docs\/10-compliance(\/|$)/, '01-docs/compliance/'],
  [/^01-docs\/06-coordination(\/|$)/, '01-docs/coordination/'],
  [/^01-docs\/07-assurance(\/|$)/, '01-docs/assurance/'],
  [/^01-docs\/09-security(\/|$)/, '01-docs/security/'],
  [/^01-docs\/05-audit\/agile(\/|$)/, '01-docs/agile/'],
  [/^01-docs\/specs\/03-platform\/packages(\/|$)/, '01-docs/specs/packages/'],
  [/^specs\/03-platform\/packages(\/|$)/, '01-docs/specs/packages/'],
  [/^01-docs\/04-ops\/03-platform\/examples(\/|$)/, '01-docs/04-ops/examples/'],
  [/^03-platform\/examples\/bout-progress-exploration-os\.config\.json$/, '01-docs/04-ops/examples/bout-progress-exploration-os.config.json'],
  [/^01-docs\/04-ops\/repo\/01-docs\/09-security(\/|$)/, '01-docs/security/'],
  [/^rust\/gtcx-crypto\/03-platform\/src(\/|$)/, 'rust/gtcx-crypto/src/'],
  [/^rust\/gtcx-zkp\/03-platform\/src(\/|$)/, 'rust/gtcx-zkp/src/'],
  [/^SECURITY\.md$/, '01-docs/04-ops/repo/SECURITY.md'],
  [/^CONTRIBUTING\.md$/, '01-docs/04-ops/repo/CONTRIBUTING.md'],
  [/^CLAUDE\.md$/, '.claude/CLAUDE.md'],
  [/^GEMINI\.md$/, '.gemini/GEMINI.md'],
  [/^KIMI\.md$/, '.kimi/KIMI.md'],
  [/^CODEX\.md$/, '.codex/CODEX.md'],
  [/^01-docs\/AGENTS\.md$/, 'AGENTS.md'],
  [/^01-docs\/CLAUDE\.md$/, '.claude/CLAUDE.md'],
  [/^01-docs\/GEMINI\.md$/, '.gemini/GEMINI.md'],
  [/^01-docs\/KIMI\.md$/, '.kimi/KIMI.md'],
  [/^01-docs\/CODEX\.md$/, '.codex/CODEX.md'],
  [/^01-docs\/\.cursor(\/|$)/, '.cursor/'],
  [/^01-docs\/\.claude(\/|$)/, '.claude/'],
  [/^01-docs\/\.kimi(\/|$)/, '.kimi/'],
  [/^01-docs\/\.agent(\/|$)/, '.agent/'],
  [/^01-docs\/\.github(\/|$)/, '.github/'],
  [/^01-docs\/workspace(\/|$)/, '02-ops/'],
  [/^workspace(\/|$)/, '02-ops/'],
  [/^01-docs\/01-docs(\/|$)/, '01-docs/'],
  [/^quality(\/|$)/, '05-audit/quality/'],
  [/^01-docs\/quality\/quality(\/|$)/, '05-audit/quality/'],
  [/^artifacts(\/|$)/, '00-archive/artifacts/'],
  [/^01-docs\/artifacts(\/|$)/, '00-archive/artifacts/'],
  [/^benchmarks(\/|$)/, '03-platform/benchmarks/'],
  [/^01-docs\/benchmarks(\/|$)/, '03-platform/benchmarks/'],
  [/^01-docs\/08-gtm(\/|$)/, '01-docs/gtm/'],
  [/^01-docs\/specs\/03-platform\/packages(\/|$)/, '01-docs/specs/packages/'],
  [/^\.github\/03-platform\/scripts(\/|$)/, '.github/scripts/'],
  [/^tests\/integration(\/|$)/, '03-platform/tests/integration/'],
];

/** @type {Record<string, string>} sor-map deprecated prefix → canonical prefix */
function loadDeprecatedPrefixMap() {
  try {
    const sor = JSON.parse(readFileSync(sorMapPath, 'utf8'));
    const map = {};
    for (const [from, note] of Object.entries(sor.deprecated ?? {})) {
      if (!from.endsWith('/')) continue;
      const normalized = from.replace(/^\.\//, '');
      if (note.includes('01-docs/05-audit')) map[normalized] = '01-docs/05-audit/';
      else if (note.includes('01-docs/01-agents')) map[normalized] = '01-docs/01-agents/';
      else if (note.includes('01-docs/04-ops')) map[normalized] = '01-docs/04-ops/';
    }
    return map;
  } catch {
    return {};
  }
}

const DEPRECATED_PREFIX_MAP = loadDeprecatedPrefixMap();

const markdownFiles = execSync("git ls-files -z '*.md'", { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .filter((file) => !EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix)));

const markdownLinkRegex = /\[[^\]]+\]\(([^)]+)\)/g;
const brokenLinks = [];

function stripCodeBlocks(text) {
  // Remove fenced code blocks (``` ... ```) to avoid matching example links
  return text.replace(/^```[\s\S]*?^```/gm, (block) => '\n'.repeat(block.split('\n').length - 1));
}

/** @param {string} relPath repo-root relative (may use ..) */
function normalizeRepoRelative(relPath) {
  return path.normalize(relPath).split(path.sep).join('/');
}

/** @param {string} repoRel */
function legacyCandidates(repoRel) {
  return applyLegacyRewrites(normalizeRepoRelative(repoRel));
}

/** @param {string} href @param {string} sourceFile git path */
function resolveLinkTarget(href, sourceFile) {
  let targetPath = href.startsWith('/')
    ? path.resolve(workspaceRoot, `.${href}`)
    : path.resolve(workspaceRoot, path.dirname(sourceFile), href);

  if (existsSync(targetPath)) return targetPath;

  if (!href.startsWith('/') && href.startsWith('01-docs/')) {
    targetPath = path.resolve(workspaceRoot, href);
    if (existsSync(targetPath)) return targetPath;
  }

  const primaryRel = normalizeRepoRelative(path.relative(workspaceRoot, targetPath));
  for (const candidateRel of legacyCandidates(primaryRel)) {
    const candidateAbs = path.resolve(workspaceRoot, candidateRel);
    if (existsSync(candidateAbs)) return candidateAbs;
  }

  return targetPath;
}

for (const file of markdownFiles) {
  const absoluteFilePath = path.resolve(workspaceRoot, file);
  const rawContent = readFileSync(absoluteFilePath, 'utf8');
  const content = stripCodeBlocks(rawContent);

  for (const match of content.matchAll(markdownLinkRegex)) {
    const rawHref = (match[1] ?? '').trim().replace(/^<(.+)>$/, '$1');
    if (
      !rawHref ||
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('#')
    ) {
      continue;
    }

    const href = rawHref.split('#')[0]?.split('?')[0] ?? '';
    if (!href) {
      continue;
    }

    const targetPath = resolveLinkTarget(href, file);
    if (!existsSync(targetPath)) {
      const line = content.slice(0, match.index ?? 0).split('\n').length;
      brokenLinks.push(`${file}:${line} -> ${rawHref}`);
    }
  }
}

if (brokenLinks.length > 0) {
  console.error('Broken Markdown links detected:');
  for (const link of brokenLinks) {
    console.error(`- ${link}`);
  }
  process.exit(1);
}

console.log(`Markdown link check passed (${markdownFiles.length} files).`);
