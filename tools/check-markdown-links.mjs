#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const workspaceRoot = process.cwd();

const markdownFiles = execSync(
  "git ls-files -z README.md 'docs/**/*.md' 'packages/*/README.md' 'tests/**/*.md'",
  { encoding: 'utf8' }
)
  .split('\0')
  .filter(Boolean);

const markdownLinkRegex = /\[[^\]]+\]\(([^)]+)\)/g;
const brokenLinks = [];

for (const file of markdownFiles) {
  const absoluteFilePath = path.resolve(workspaceRoot, file);
  const content = readFileSync(absoluteFilePath, 'utf8');

  for (const match of content.matchAll(markdownLinkRegex)) {
    const rawHref = (match[1] ?? '').trim();
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

    const targetPath = href.startsWith('/')
      ? path.resolve(workspaceRoot, `.${href}`)
      : path.resolve(path.dirname(absoluteFilePath), href);

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
