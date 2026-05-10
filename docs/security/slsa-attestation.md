# SLSA Build Level 3 Attestation

**Standard:** [SLSA v1.0 Build Track](https://slsa.dev/spec/v1.0/levels#build-track)
**Level claimed:** Build Level 3
**Assessment date:** 2026-05-10
**Owner:** Cryptographic Security Engineer (`docs/agents/roles/crypto-security-engineer.md`)
**Cross-references:** [Trust Portal](../trust/README.md), [SOC 2 Readiness](../compliance/soc2-readiness.md)

---

## What this document asserts

`gtcx-core` produces SLSA Build Level 3 (v1.0 spec) provenance for every npm package it publishes. This document describes which SLSA requirements are met, by which mechanism, and how an auditor can independently verify the claim.

This is an **assertion**, not a third-party attestation. The provenance artifacts themselves are signed by GitHub's OIDC identity (via npm's provenance integration with sigstore) — those signatures are the verifiable evidence. This document maps the SLSA spec to where in our build pipeline each requirement is satisfied.

---

## SLSA Build Level 3 requirements

| Requirement                                                  | SLSA v1.0 spec                                    | gtcx-core mechanism                                                                                                        | Evidence                                                                     |
| ------------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Build is hosted**                                          | Build runs on a hosted build platform             | GitHub-hosted Actions runners (`runs-on: ubuntu-latest`)                                                                   | `.github/workflows/release.yml:14`                                           |
| **Provenance is generated and signed by the build platform** | Platform-signed provenance, not user-controllable | `npm publish --provenance` invokes sigstore via GitHub OIDC; signatures are issued by GitHub's identity, not the publisher | `pnpm release` → `changeset publish --provenance` → npm sigstore integration |
| **Provenance is non-falsifiable**                            | A malicious build user cannot forge provenance    | OIDC token issuance is bound to the workflow run; the publisher cannot forge the workflow identity                         | GitHub OIDC: `id-token: write` permission in `release.yml:18`                |
| **Build is isolated**                                        | Build environment is reset between runs           | GitHub-hosted runners are ephemeral VMs, destroyed after each run                                                          | GitHub Actions hosted-runner architecture                                    |
| **Source identified in provenance**                          | Provenance records the exact source commit        | npm provenance includes commit SHA from `${{ github.sha }}`                                                                | npm registry attestation field for any `@gtcx/*` package                     |
| **Build process identified in provenance**                   | Provenance records build configuration            | npm provenance includes workflow file path + ref                                                                           | npm registry attestation field                                               |
| **Provenance is published**                                  | Provenance is publicly accessible                 | npm registry exposes provenance via `npm view <pkg> --json` and the npmjs.com web UI                                       | After first publish, `npm view @gtcx/<pkg> --json \| jq .dist.attestations`  |

All seven Build Level 3 requirements are satisfied. The mechanism for each is documented above; no requirement relies on private infrastructure or non-public claims.

---

## What we do NOT claim

To be honest about scope:

- **SLSA Source Track (any level)** — not claimed. Source-track levels require additional source-side controls (commit signing, two-party review at the source). We have CODEOWNERS dual-review (human + AI), which is functionally equivalent to two-party review, but we do not currently sign every commit. SLSA Source Level 2+ assertion would require either commit-signing enforcement or a substituting source-verification framework.
- **SLSA L4** — deprecated in v1.0. Not applicable.
- **Reproducible builds across all packages** — `@gtcx/utils` reproduces bit-for-bit; packages with `workspace:*` deps fail due to upstream pnpm pack ordering bug. Documented in [`tools/check-reproducible-build.mjs`](../../tools/check-reproducible-build.mjs). Build Level 3 does NOT require reproducibility — that's a separate property tracked under "build hermeticity."

---

## How to verify the assertion

After a published release exists at `https://www.npmjs.com/package/@gtcx/<package>`:

```bash
# 1. Fetch the published attestation
npm view @gtcx/crypto --json | jq '.dist.attestations'

# 2. Verify the provenance signature using sigstore
npm install -g @sigstore/cli
npx sigstore verify @gtcx/crypto --offline

# 3. Inspect the in-toto statement
npm audit signatures @gtcx/crypto
```

Or via the SLSA verifier:

```bash
go install github.com/slsa-framework/slsa-verifier/v2/cli/slsa-verifier@latest
slsa-verifier verify-npm-package \
  --source-uri github.com/gtcx-ecosystem/gtcx-core \
  --source-tag <release-tag> \
  $(npm pack @gtcx/crypto --dry-run --json | jq -r '.[0].filename')
```

If verification succeeds, the consumer has cryptographic proof that:

- The published artifact came from the `gtcx-ecosystem/gtcx-core` repository
- It was built by the workflow at `.github/workflows/release.yml`
- It was built from a specific source commit
- The provenance was signed by GitHub (not by the publisher)

---

## Attestation lifecycle

| Phase            | Action                                                                                                                                                                                        | Owner                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Generation**   | Every `pnpm release` invocation produces signed provenance via npm sigstore                                                                                                                   | GitHub Actions runner |
| **Storage**      | Provenance is stored at npm registry alongside the package tarball                                                                                                                            | npm                   |
| **Verification** | Consumers run `slsa-verifier` against the published package                                                                                                                                   | Consumer / auditor    |
| **Revocation**   | Compromised attestations are addressed via [`SECURITY-INCIDENT.md`](../../SECURITY-INCIDENT.md) Phase 5 (Coordinated Disclosure) — typically by yanking the affected version and republishing | Incident commander    |

---

## Relationship to existing artifacts

The SLSA assertion sits on top of the existing supply-chain controls:

- **Provenance manifest** ([`tools/generate-provenance-manifest.mjs`](../../tools/generate-provenance-manifest.mjs)) — internal manifest written to `artifacts/provenance-manifest.json`. Captures source SHA, build config, dependency snapshot.
- **SBOM (CycloneDX)** — generated by Trivy on every CI build at `quality/release-evidence/`.
- **Crypto deps content-hash allowlist** ([`tools/check-crypto-deps.mjs`](../../tools/check-crypto-deps.mjs)) — independent supply-chain check that complements SLSA's "provenance includes dependencies" property.
- **Reproducible build verifier** ([`tools/check-reproducible-build.mjs`](../../tools/check-reproducible-build.mjs)) — independent check that complements SLSA's hermeticity ambitions (separate from Build Level 3 requirements).
- **AI CODEOWNER review log** (`quality/ai-review-log/` — populated by [`gtcx-codeowner-action`](../../.github/scripts/codeowner-review/)) — independent change-management evidence that maps to SLSA Source Track ambitions even though we don't formally claim a Source Level.

Each layer is independently verifiable. SLSA L3 is the build-process assertion; the others extend it.

---

## Path to SLSA Source Level 2+

Currently out of scope for this document. The path would require:

1. Enforced commit signing across all CODEOWNERS (Sigstore or GPG)
2. Branch protection requires signed commits (`require_signed_commits: true` in branch protection settings)
3. Documented two-party review process — partially in place via `.github/CODEOWNERS` dual-reviewer enforcement
4. Source provenance attestation tied to the build attestation

Estimated effort: 1-2 weeks (mostly process documentation; commit-signing enforcement is a one-line branch protection change).

---

## Cross-references

- [Trust Portal](../trust/README.md) — section "Supply chain integrity"
- [SOC 2 Readiness](../compliance/soc2-readiness.md) — CC8.1 Change Management mapping
- [SECURITY-INCIDENT.md](../../SECURITY-INCIDENT.md) — Phase 5 coordinated disclosure
- [SLSA v1.0 Build Track spec](https://slsa.dev/spec/v1.0/levels#build-track)
- [npm provenance documentation](https://docs.npmjs.com/generating-provenance-statements)

## Changelog

- **1.0.0** (2026-05-10) — Initial SLSA Build Level 3 assertion. Seven build-track requirements mapped to existing pipeline mechanisms. Honest scoping: source track not claimed, L4 deprecated, reproducibility tracked separately.
