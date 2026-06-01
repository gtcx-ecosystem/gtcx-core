---
title: 'SLSA Build Level 3 Attestation'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'security']
review_cycle: 'on-change'
---

---

title: 'Slsa Attestation'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'

---

# SLSA Build Level 3 Attestation

> **Status:** Current
> **Date:** 2026-05-11
> **Owner:** Cryptographic Security Engineer

**Standard:** [SLSA v1.0 Build Track](https://slsa.dev/spec/v1.0/levels#build-track)
**Level claimed:** Build Level 3
**Level achieved:** Build Level 3 _mechanism configured; not yet proven in production_
**Assessment date:** 2026-05-11
**Owner:** Cryptographic Security Engineer (`docs/agents/roles/crypto-security-engineer.md`)
**Cross-references:** [Trust Portal](../governance/trust-portal.md), [SOC 2 Readiness](../compliance/soc2-readiness.md)

> **Honesty note (2026-06-01):** The Build Level 3 _mechanism_ is configured in CI
> (`pnpm pack` + `npm publish --provenance`, GitHub OIDC, sigstore). **npm rejects
> provenance when the source GitHub repository is private** (E422). `gtcx-core` must be
> **public** (or use a public release mirror) before registry attestations can exist.
> See [`../audit/ci-confirmation-2026-06-01.md`](../audit/ci-confirmation-2026-06-01.md).
> Source Level 2 is enforced and current.

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

All seven Build Level 3 requirements are satisfied **by mechanism configuration**. The pipeline is documented above; no requirement relies on private infrastructure or non-public claims. **Actual attestations will only exist after the first published release.**

---

## What we do NOT claim

To be honest about scope:

- **SLSA Source Track Level 1 — claimed** (version-controlled, change-managed, retained). See § SLSA Source Track below for full mapping.
- **SLSA Source Track Level 2** — not yet claimed. Path is documented; deferred pending explicit team decision on commit-signing enforcement.
- **SLSA L4** — deprecated in v1.0. Not applicable.
- **Reproducible builds across all packages** — `@gtcx/utils` reproduces bit-for-bit; packages with `workspace:*` deps fail due to upstream pnpm pack ordering bug. Documented in [`tools/check-reproducible-build.mjs`](../../tools/check-reproducible-build.mjs). Build Level 3 does NOT require reproducibility. It is tracked separately under build hermeticity.

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

| Phase            | Action                                                                                                                                                                                                   | Owner                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Generation**   | Every `pnpm release` invocation produces signed provenance via npm sigstore                                                                                                                              | GitHub Actions runner |
| **Storage**      | Provenance is stored at npm registry alongside the package tarball                                                                                                                                       | npm                   |
| **Verification** | Consumers run `slsa-verifier` against the published package                                                                                                                                              | Consumer / auditor    |
| **Revocation**   | Compromised attestations are addressed via [`SECURITY-INCIDENT.md`](./security-incident-runbook.md), Phase 5: Coordinated Disclosure. Typical response is yanking the affected version and republishing. | Incident commander    |

---

## Relationship to existing artifacts

The SLSA assertion sits on top of the existing supply-chain controls:

- **Provenance manifest** — see [`tools/generate-provenance-manifest.mjs`](../../tools/generate-provenance-manifest.mjs). The internal manifest is written to `artifacts/provenance-manifest.json` and captures source SHA, build config, and dependency snapshot.
- **SBOM (CycloneDX)** — generated by Trivy on every CI build at `quality/release-evidence/`.
- **Crypto deps content-hash allowlist** — see [`tools/check-crypto-deps.mjs`](../../tools/check-crypto-deps.mjs). This independent supply-chain check complements SLSA's provenance coverage.
- **Reproducible build verifier** — see [`tools/check-reproducible-build.mjs`](../../tools/check-reproducible-build.mjs). This independent check complements SLSA's hermeticity ambitions and is separate from Build Level 3 requirements.
- **AI CODEOWNER review log** — `quality/ai-review-log/` is populated by [`gtcx-codeowner-action`](../../.github/scripts/codeowner-review/). It provides independent change-management evidence even though no formal Source Level claim depends on it.

Each layer is independently verifiable. SLSA L3 is the build-process assertion; the others extend it.

---

## SLSA Source Track — current level and path forward

### Current: Source Level 2

SLSA Source Level 2 requires **verified history** — every commit's authenticity is cryptographically verifiable, not just version-controlled. The SLSA spec language: "every change to the source is verified to come from a particular contributor (e.g. via authenticated commit signing)."

`gtcx-core` satisfies Source Level 2:

| Requirement                           | Mechanism                                                  | Evidence                                                           |
| ------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Source is version-controlled          | Git, hosted on GitHub                                      | `git log --all`                                                    |
| Every change has a recorded history   | All commits retained; no force-push policy                 | Branch protection `allow_force_pushes: false` enforced on `main`   |
| Sources can be retrieved indefinitely | GitHub repository availability                             | The repository itself                                              |
| Every change is authenticated         | Required signed commits on `main`                          | Branch protection `required_signatures: true` enforced on `main`   |
| Contributor identity is verifiable    | GPG / SSH commit signing with keys tied to GitHub identity | Verified signatures visible on every commit after enforcement date |

#### Enforcement details

- **Branch protection:** `required_signatures.enabled: true` on `main`
- **CODEOWNER signing keys:** `@amanianai` (GPG `339E985C9F4A476C47C71E7B40C84A7356404E82`) and `@gtcx-agent` (bot account — commits via GitHub API, not direct pushes)
- **Contributor onboarding:** signing-key setup documented in [`CONTRIBUTING.md`](../../CONTRIBUTING.md#signed-commits)
- **Existing unsigned commits:** grandfathered; the rule applies only to _new_ commits pushed after enforcement

#### Verification

```bash
# Confirm required_signatures is enabled
gh api repos/gtcx-ecosystem/gtcx-core/branches/main/protection | jq '.required_signatures.enabled'
# Expected: true

# Confirm recent commits are signed
git log --show-signature -5 --oneline
# Expected: "Good signature from ..." on each commit
```

**Enforced since:** 2026-05-10

### Higher levels — Source Level 3, 4

Out of scope. Source Level 3 requires "verified history with a tamper-evident log" — typically a centralized append-only log like Sigstore Rekor recording every signed commit. Source Level 4 adds two-party review enforcement at the source layer (which we have via CODEOWNERS but not in a SLSA-conformant tamper-evident form). Both are post-Source-Level-2 hardening passes.

---

## Cross-references

- [Trust Portal](../governance/trust-portal.md) — section "Supply chain integrity"
- [SOC 2 Readiness](../compliance/soc2-readiness.md) — CC8.1 Change Management mapping
- [SECURITY-INCIDENT.md](./security-incident-runbook.md) — Phase 5 coordinated disclosure
- [SLSA v1.0 Build Track spec](https://slsa.dev/spec/v1.0/levels#build-track)
- [npm provenance documentation](https://docs.npmjs.com/generating-provenance-statements)

## Changelog

- **1.0.0** (2026-05-10) — Initial SLSA Build Level 3 assertion. Seven build-track requirements mapped to existing pipeline mechanisms. Honest scoping: source track not claimed, L4 deprecated, reproducibility tracked separately.
