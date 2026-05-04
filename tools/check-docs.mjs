import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * GTCX Doc-Linter
 * 
 * Ensures that documentation stays in sync with the codebase.
 * - Validates that all packages mentioned in README.md exist.
 * - Validates that all specs in docs/specs/core-spec.md match packages.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const packagesDir = path.join(rootDir, 'packages');
const rustDir = path.join(rootDir, 'rust');

function getDirectories(source) {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

const tsPackages = getDirectories(packagesDir).filter(n => n !== 'config');
const rustCrates = getDirectories(rustDir).filter(n => n.startsWith('gtcx-') && n !== 'target');

const errors = [];

function checkMarkdownFile(filePath, expectedPackages, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing documentation file: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const pkg of expectedPackages) {
    if (!content.includes(pkg)) {
      errors.push(`Documentation drift: ${label} is missing mention of package/crate '${pkg}'`);
    }
  }
}

console.log('🔍 Running Doc-Linter...');

// 1. Check Root README
checkMarkdownFile(path.join(rootDir, 'README.md'), tsPackages, 'README.md');
checkMarkdownFile(path.join(rootDir, 'README.md'), rustCrates, 'README.md');

// 2. Check Core System Spec
checkMarkdownFile(path.join(rootDir, 'docs/specs/core-spec.md'), tsPackages, 'core-spec.md');
checkMarkdownFile(path.join(rootDir, 'docs/specs/core-spec.md'), rustCrates, 'core-spec.md');

// 3. Check Architecture Overview
checkMarkdownFile(path.join(rootDir, 'docs/architecture/overview.md'), tsPackages, 'overview.md');

if (errors.length > 0) {
  console.error('❌ Doc-Linter FAILED:');
  errors.forEach(err => console.error(`   - ${err}`));
  process.exit(1);
} else {
  console.log('✅ Documentation is in sync with the codebase.');
  process.exit(0);
}
