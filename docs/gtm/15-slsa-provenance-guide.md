---
title: '15 SLSA Provenance Consumer Guide'
status: 'current'
date: '2026-05-25'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'standard'
tags: ['gtm', 'slsa', 'provenance', 'supply-chain']
review_cycle: 'on-change'
---

# SLSA Provenance Consumer Guide

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Quality & Evidence Lead

**Purpose:** Enable enterprise customers, regulators, and downstream integrators to verify the supply-chain integrity of `@gtcx` npm packages using SLSA Build Level 3 provenance attestations.

---

## What Is SLSA Build Level 3

SLSA (Supply-chain Levels for Software Artifacts) Build Level 3 means:

- **Provenance exists:** Every package has a signed attestation describing how it was built
- **Build is isolated:** The build ran on GitHub Actions with no direct human intervention
- **Dependencies are pinned:** Exact versions of all dependencies are recorded in the attestation
- **Source is authenticated:** The build came from a specific, verifiable Git commit

**Current status:** Source L2 enforced. Build L3 pipeline ready. Provenance generation passes locally. Publish to npm pending the Wed-Fri operational window.

---

## How to Verify Provenance

### Method 1: npm CLI (Recommended)

```bash
# After installing a package, verify its provenance
npm audit signatures @gtcx/crypto

# Or verify directly against the registry
npm view @gtcx/crypto@latest --json | jq '.dist.attestations'
```

Expected output includes:

- `predicateType: https://slsa.dev/provenance/v1`
- `buildType: https://github.com/slsa-framework/slsa-github-generator/generic@v1`
- `builder.id: https://github.com/gtcx-ecosystem/gtcx-core/.github/workflows/release.yml@refs/heads/main`

### Method 2: Manual Verification with cosign

```bash
# Download the package and its attestation
npm pack @gtcx/crypto@latest

# Verify the attestation signature using Sigstore/cosign
cosign verify-blob \
  --bundle @gtcx/crypto-<version>.sigstore.json \
  --certificate-identity-regexp "^https://github.com/gtcx-ecosystem/gtcx-core/.github/workflows/release.yml@refs/.*" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  <package.tgz>
```

### Method 3: Programmatic Verification

```typescript
import { verifyProvenance } from '@gtcx/verification';

const result = await verifyProvenance({
  package: '@gtcx/crypto',
  version: '1.2.3',
  expectedBuilder: 'https://github.com/gtcx-ecosystem/gtcx-core/.github/workflows/release.yml',
});

if (result.valid) {
  console.log('Provenance verified:', result.commit);
} else {
  console.error('Provenance verification failed:', result.errors);
}
```

---

## What the Provenance Attestation Contains

| Field               | Value                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| `builder.id`        | GitHub Actions workflow URL                                                            |
| `buildInvocationId` | Unique run ID (e.g., `https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/12345`) |
| `source`            | Git repository URL + exact commit SHA                                                  |
| `dependencies`      | Complete list of resolved dependency URLs and hashes                                   |
| `buildConfig`       | Build parameters (Node version, pnpm version, feature flags)                           |
| `metadata`          | Build start time, runner OS, architecture                                              |

---

## For Vendor Risk Assessment Teams

When evaluating `@gtcx` packages for your organization's vendor risk process:

1. **Request the provenance manifest:** `artifacts/provenance-manifest.json` from the release tag
2. **Verify the builder identity:** Must match `gtcx-ecosystem/gtcx-core/.github/workflows/release.yml`
3. **Check the commit signature:** `git verify-commit <sha>` should show a CODEOWNER GPG signature
4. **Confirm no audit exceptions:** `cargo audit` and `pnpm audit --audit-level=high` should pass (exceptions documented in `rust/.cargo/audit.toml` if any)
5. **Review the SBOM:** `pnpm sbom:generate` produces a CycloneDX SBOM for license and dependency review

---

## Known Limitations

| Limitation                          | Status     | Mitigation                                                   |
| ----------------------------------- | ---------- | ------------------------------------------------------------ |
| Provenance not yet published to npm | Pending    | Publish scheduled for 2026-05-28 to 2026-05-30               |
| No rekor/transparency log query     | Not needed | npm registry + GitHub Actions OIDC provides equivalent trust |
| TypeScript source maps not attested | Accepted   | Source maps are build artifacts, not security boundaries     |

---

## Cross-References

- [SLSA Attestation Details](../security/slsa-attestation.md) — technical specification
- [Provenance Manifest](../../artifacts/provenance-manifest.json) — latest generated manifest
- [Trust Center](../governance/trust-portal.md) — organizational trust posture
- [Release Workflow](../../.github/workflows/release.yml) — build definition
