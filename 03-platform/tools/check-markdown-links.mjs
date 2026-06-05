#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();

// Top-level directories that hold archived or staged-for-deletion content.
// Markdown inside these directories is intentionally vestigial — internal
// links may have been written for the file's original location and are not
// expected to resolve. Excluding them from the link check matches the
// intent (these files are not part of the active documentation surface).
const EXCLUDED_PREFIXES = ['_delete/', '_archive/'];

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

    let targetPath = href.startsWith('/')
      ? path.resolve(workspaceRoot, `.${href}`)
      : path.resolve(path.dirname(absoluteFilePath), href);

    if (!existsSync(targetPath) && !href.startsWith('/') && href.startsWith('01-docs/')) {
      targetPath = path.resolve(workspaceRoot, href);
    }

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
