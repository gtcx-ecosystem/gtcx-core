#!/usr/bin/env node

/**
 * Crypto dependency content-pin verifier (closes AT-005).
 *
 * Scans `pnpm-lock.yaml` and verifies that every resolved version of the
 * cryptographic dependencies we care about — currently the @noble/* family —
 * appears in the allowlist below with the expected sha512 integrity hash.
 *
 * If a package version appears in the lockfile that is NOT in the allowlist,
 * the script fails. This catches:
 *   - A new transitive @noble/* version slipping in via a dep upgrade
 *   - A modified package.json override that updates a version without
 *     a corresponding update to this allowlist
 *   - A compromised registry serving a different tarball under the same
 *     version (the integrity hash would not match)
 *
 * Adding a new approved version requires editing this file in a PR, which
 * goes through CODEOWNERS review.
 *
 * Run: `node 03-platform/tools/check-crypto-deps.mjs`
 */

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const lockfilePath = path.join(repoRoot, 'pnpm-lock.yaml');

/**
 * Allowlist of crypto packages by exact version, with their expected integrity
 * hashes. These hashes were captured from a known-good install on 2026-05-09
 * and verified against the upstream npm registry.
 *
 * To add a new approved version:
 *   1. Run `pnpm install` to populate the lockfile with the new version.
 *   2. Find the new entry in pnpm-lock.yaml (look for `'<package>@<version>':`).
 *   3. Copy the `integrity:` value into the table below.
 *   4. Open a PR; CODEOWNERS review enforced via .github/CODEOWNERS.
 */
const ALLOWLIST = {
  '@noble/curves': {
    '1.9.0':
      'sha512-7YDlXiNMdO1YZeH6t/kvopHHbIZzlxrCV9WLqCY6QhcXOoXiNCMDqJIglZ9Yjx5+w7Dz30TITFrlTjnRg7sKEg==',
    '2.0.1':
      'sha512-vs1Az2OOTBiP4q0pwjW5aF0xp9n4MxVrmkFBxc6EKZc6ddYx5gaZiAsZoq0uRRXWbi3AT/sBqn05eRPtn1JCPw==',
  },
  '@noble/hashes': {
    '1.8.0':
      'sha512-jCs9ldd7NwzpgXDIf6P3+NrHh9/sD6CQdxHyjQI+h/6rDNo88ypBxxz45UDuZHz9r3tNz7N/VInSVoVdtXEI4A==',
    '2.0.1':
      'sha512-XlOlEbQcE9fmuXxrVTXCTlG2nlRXa9Rj3rr5Ue/+tX+nmkgbX720YHh0VR3hBF9xDvwnb8D2shVGOwNx+ulArw==',
  },
  '@noble/ciphers': {
    '1.3.0':
      'sha512-2I0gnIVPtfnMw9ee9h1dJG7tp81+8Ob3OJb3Mv37rx5L40/b0i7djjCVvGOVqc9AEIQyvyu1i6ypKdFw8R8gQw==',
  },
};

const TRACKED_PACKAGES = Object.keys(ALLOWLIST);

const lockfile = fs.readFileSync(lockfilePath, 'utf8');

const errors = [];
const seen = new Set();

for (const pkgName of TRACKED_PACKAGES) {
  // Match every block `'<pkgName>@<version>':\n    resolution: {integrity: <hash>...`
  // Lockfile blocks look like:
  //   '@noble/curves@1.9.0':
  //     resolution: {integrity: sha512-...==}
  const blockRegex = new RegExp(
    `^  '${pkgName.replace(/\//g, '\\/').replace(/\./g, '\\.')}@([^']+)':\\s*\\n\\s+resolution:\\s+\\{integrity:\\s+(sha512-[A-Za-z0-9+/=]+)\\}`,
    'gm'
  );

  let match;
  while ((match = blockRegex.exec(lockfile)) !== null) {
    const [, version, integrity] = match;
    if (!version || !integrity) continue;

    const allowedVersions = ALLOWLIST[pkgName];
    seen.add(`${pkgName}@${version}`);

    if (!Object.prototype.hasOwnProperty.call(allowedVersions, version)) {
      errors.push(
        `Disallowed version: ${pkgName}@${version} appears in pnpm-lock.yaml but is not in the allowlist.\n` +
          `  Approved versions: ${Object.keys(allowedVersions).join(', ')}\n` +
          `  To approve, add the version+integrity hash to 03-platform/tools/check-crypto-deps.mjs and submit a PR.`
      );
      continue;
    }

    const expectedIntegrity = allowedVersions[version];
    if (integrity !== expectedIntegrity) {
      errors.push(
        `Integrity mismatch: ${pkgName}@${version}\n` +
          `  Lockfile: ${integrity}\n` +
          `  Allowlist: ${expectedIntegrity}\n` +
          `  This indicates either a registry tampering event or a stale allowlist. Investigate before proceeding.`
      );
    }
  }
}

// Sanity check: each tracked package must have at least one resolved version
for (const pkgName of TRACKED_PACKAGES) {
  const found = [...seen].some((entry) => entry.startsWith(`${pkgName}@`));
  if (!found) {
    errors.push(
      `Tracked package ${pkgName} not found in pnpm-lock.yaml.\n` +
        `  Either the dependency was removed (update 03-platform/tools/check-crypto-deps.mjs) ` +
        `or the lockfile is corrupted.`
    );
  }
}

if (errors.length > 0) {
  console.error(`Crypto dependency check failed (${errors.length} issue(s)):\n`);
  for (const err of errors) {
    console.error(`- ${err}\n`);
  }
  process.exit(1);
}

console.log(`Crypto dependency check passed. Verified ${seen.size} resolved version(s):`);
for (const entry of [...seen].sort()) {
  console.log(`  ${entry}`);
}
