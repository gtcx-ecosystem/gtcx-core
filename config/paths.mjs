/**
 * Canonical path joins for gtcx-core — import from scripts/tools via sor-map.
 * SoR: config/sor-map.json
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONFIG_DIR = dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = join(CONFIG_DIR, '..');
export const SOR_MAP_PATH = join(REPO_ROOT, 'config/sor-map.json');
export const REPO_KIND_PATH = join(REPO_ROOT, 'config/repo-kind.json');
export const GOVERNANCE_SPINE_PATH = join(REPO_ROOT, 'config/governance-spine.json');
export const OPS_MANIFEST_PATH = join(REPO_ROOT, 'config/ops.manifest.json');
export const ALLOWLIST_PATH = join(REPO_ROOT, '01-docs/operations/repo/root-allowlist.json');
export const PLATFORM_PACKAGES = join(REPO_ROOT, '03-platform/packages');
export const PLATFORM_SCRIPTS = join(REPO_ROOT, '03-platform/scripts');
export const PLATFORM_TOOLS = join(REPO_ROOT, '03-platform/tools');
export const PLATFORM_BENCHMARKS = join(REPO_ROOT, '03-platform/benchmarks');
export const RUST_CRATES = join(REPO_ROOT, 'rust');
export const AUDIT_EVIDENCE = join(REPO_ROOT, '05-audit/evidence');
export const AUDIT_NARRATIVE = join(REPO_ROOT, '01-docs/05-audit');
export const TOOLCHAIN = join(REPO_ROOT, 'config/toolchain');

const THREAT_MATRIX_CANDIDATES = [
  join(REPO_ROOT, '01-docs/security/threat-control-matrix.md'),
  join(REPO_ROOT, '01-docs/09-security/threat-control-matrix.md'),
];

/** @returns {string} absolute path to threat-control-matrix.md */
export function threatMatrixPath() {
  for (const candidate of THREAT_MATRIX_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  return THREAT_MATRIX_CANDIDATES[0];
}

/** @returns {Record<string, unknown>} */
export function loadSorMap() {
  return JSON.parse(readFileSync(SOR_MAP_PATH, 'utf8'));
}

/** @param {string} key sor-map paths key */
export function relFromSor(key) {
  const rel = loadSorMap().paths?.[key];
  if (!rel) throw new Error(`sor-map paths.${key} missing`);
  return rel;
}

/** @param {string} key sor-map paths key */
export function absFromSor(key) {
  return join(REPO_ROOT, relFromSor(key));
}

/** @param {string[]} [failures] */
export function assertSorPathsExist(failures = [], keys = null) {
  const sor = loadSorMap();
  const entries = keys ?? Object.keys(sor.paths ?? {});
  for (const key of entries) {
    const rel = sor.paths[key];
    if (!rel) continue;
    const abs = join(REPO_ROOT, rel.replace(/\/$/, ''));
    if (!existsSync(abs)) failures.push(`sor-map path missing (${key}): ${rel}`);
  }
  return failures;
}
