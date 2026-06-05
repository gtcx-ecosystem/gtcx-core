/** @file Shared npm registry provenance helpers for publish + verify tooling. */

import { execSync } from 'node:child_process';

/**
 * @param {string} packageName
 * @param {string} version
 * @returns {{ state: 'not_published' } | { state: 'ok', attestations: unknown } | { state: 'missing', attestations: null } | { state: 'error', message: string }}
 */
export function registryAttestationStatus(packageName, version) {
  try {
    const out = execSync(`npm view ${packageName}@${version} dist --json`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const dist = JSON.parse(out);
    if (hasRegistryAttestation(dist?.attestations)) {
      return { state: 'ok', attestations: dist.attestations };
    }
    return { state: 'missing', attestations: dist?.attestations ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/E404|404 Not Found|No match found/i.test(message)) {
      return { state: 'not_published' };
    }
    return { state: 'error', message };
  }
}

/**
 * @param {unknown} attestations
 */
export function hasRegistryAttestation(attestations) {
  if (!attestations || typeof attestations !== 'object') {
    return false;
  }
  const row = /** @type {{ url?: string; provenance?: unknown }} */ (attestations);
  return Boolean(row.url || row.provenance);
}
