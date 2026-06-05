---
title: 'npm Publish Runbook — Executing release.yml'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

---

title: 'NPM Publish Runbook'
status: 'current'
date: '2026-05-22'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'critical'
tags: ['operations', 'release', 'npm', 'publish', 'runbook']
review_cycle: 'on-change'

---

# npm Publish Runbook — Executing release.yml

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Frontier Infrastructure Engineer

Operational runbook for triggering [`.github/workflows/release.yml`](../../../.github/workflows/release.yml) — the workflow that builds, signs, and publishes the `@gtcx/*` package set to npm with SLSA provenance. Required for Sprint 2 task 2.3 of the [engagement readiness roadmap](../../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md).

This is distinct from [release-checklist.md](./release-checklist.md):

- **release-checklist.md** — per-release gate list, run for every published version.
- **this runbook** — operational sequence for executing the release pipeline end-to-end, including pre-flight checks the gates assume have already been done, post-publish verification, and rollback procedure.

## Blast radius

Publishing to npm is **irreversible**. `npm unpublish` exists but is heavily restricted (72-hour window, no replays of the same version) and frowned upon by the registry. Treat every publish as a one-way action. If a published version is broken, the recovery is a follow-up patch release, not an unpublish.

## Pre-flight verification (10 minutes)

Run from a clean local clone of `main` immediately before the publish. Each command must exit zero.

### 1. Working tree clean and on `main`

```bash
git status --short          # expect: empty
git rev-parse --abbrev-ref HEAD  # expect: main
git fetch origin && git status -uno  # expect: "Your branch is up to date with 'origin/main'."
```

### 2. Local gates green

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### 3. Release-mode policy checks

```bash
pnpm architecture:check
pnpm quality:governance:check
pnpm security:threat-matrix
pnpm api:check:release         # expect: passed, 0 violations, 0 drift
pnpm provenance:generate       # expect: artifacts/provenance-manifest.json written
pnpm release:ga:evidence:check
```

### 4. Changeset state

```bash
pnpm changeset status          # expect: enumerated bumps matching the intended release shape
```

Confirm the printed bumps match what you intend to publish. As of 2026-05-22 the queued state is:

| Bump  | Count | Packages                                                                                                                        |
| ----- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| patch | 7     | `@gtcx/security`, `@gtcx/runtime`, `@gtcx/crypto`, `@gtcx/api-client`, `@gtcx/identity`, `@gtcx/services`, `@gtcx/verification` |
| minor | 3     | `@gtcx/connectivity`, `@gtcx/crypto-native`, `@gtcx/sync`                                                                       |
| major | 1     | `@gtcx/workproof`                                                                                                               |

### 5. Org-level secrets and scope membership

```bash
gh secret list --org gtcx-ecosystem | grep -E "NPM_TOKEN|ANTHROPIC_API_KEY"
# expect: both present, visibility ALL

npm whoami --registry=https://registry.npmjs.org/
# expect: gtcx-protocol (owner of @gtcx scope)

npm access list packages 2>/dev/null | grep "@gtcx/" | head
# expect: read-write on all @gtcx/* packages

pnpm ops:check
# expect: all PASS or only WARNs unrelated to publishing
```

### 6. No conflicting workflow already running

```bash
gh run list --workflow=release.yml --limit 3 --json status,conclusion
# expect: all "completed"; no "in_progress" or "queued"
```

## Fire the publish

```bash
gh workflow run release.yml --repo gtcx-ecosystem/gtcx-core --ref main
gh run watch --repo gtcx-ecosystem/gtcx-core
```

The workflow performs all the per-release gates server-side, then invokes the changesets action which publishes via `pnpm release` (`pnpm build && changeset publish --provenance`).

### Expected run shape

| Stage                                                    | Approx duration                    |
| -------------------------------------------------------- | ---------------------------------- |
| Setup + install                                          | 1–2 min                            |
| Pre-build gates (architecture, governance, lint, format) | 1–2 min                            |
| Build + DTS                                              | 2–3 min                            |
| API surface check                                        | < 1 min                            |
| Test suite + critical coverage                           | 2–3 min                            |
| Rust toolchain + fmt/clippy/test                         | 4–6 min                            |
| Changesets publish                                       | 1–3 min depending on package count |
| **Total**                                                | **12–20 min**                      |

## Post-publish verification (5 minutes)

Verify every published package answers on npmjs.org with the expected version and provenance.

### 1. Every package resolved

```bash
for pkg in types crypto crypto-native schemas utils domain security verification identity \
           api-client connectivity logging network sync resilience telemetry runtime \
           events workproof services ai; do
  v=$(npm view "@gtcx/$pkg" version 2>/dev/null)
  echo "@gtcx/$pkg: ${v:-MISSING}"
done
```

All 21 must return a version. Any MISSING is a publish failure for that package.

### 2. Provenance attestation present

```bash
for pkg in types crypto schemas utils; do
  npm view "@gtcx/$pkg" --json | jq -r '.dist.attestations.url // "no-attestation"'
done
```

Expect a `https://registry.npmjs.org/-/npm/v1/attestations/...` URL per package, not `no-attestation`.

### 3. Downstream install smoke test

```bash
mkdir -p /tmp/gtcx-consumer-test && cd /tmp/gtcx-consumer-test
npm init -y >/dev/null
npm install @gtcx/types @gtcx/crypto @gtcx/utils
node -e "const c = require('@gtcx/crypto'); console.log(typeof c.sign);"
# expect: "function"
```

### 4. Workflow artifacts uploaded

```bash
gh run list --workflow=release.yml --limit 1 --json databaseId -q '.[0].databaseId' \
  | xargs -I{} gh run view {} --log | grep -E "release-(performance|api-surface|provenance|quality-kpis)" \
  | head
```

Expect all four artifacts: performance report, API surface report, provenance manifest, KPI metrics.

### 5. Update the trust portal with published versions

Once all packages are verified, update [`01-docs/governance/trust-portal.md`](../../governance/trust-portal.md) with a "Published versions" section listing each `@gtcx/*` package with its current npm version (Sprint 2 task 2.5).

## Rollback

There is no clean unpublish path. The supported recoveries:

### Bad code shipped

```bash
git revert <bad-commit>
git push origin main
# Create a new changeset describing the revert
# Run this runbook again to publish the corrected versions
```

### Wrong version published (e.g., major shipped as patch)

The version on npm is permanent. The recovery is to bump again to the correct semver-aligned version and publish that.

```bash
# Add changeset with the correct bump type
pnpm changeset
# Run this runbook again
```

### Compromised credential during publish

If `NPM_TOKEN` is suspected compromised:

```bash
# 1. Revoke at npmjs.org → Account Settings → Access Tokens
# 2. Mint a new token
# 3. Replace in GitHub org:
read -s TOKEN && echo "$TOKEN" | gh secret set NPM_TOKEN --org gtcx-ecosystem --visibility all
# 4. Run npm audit and rotate any other credentials touched
```

### Workflow run failed mid-publish

Some packages published, others didn't:

```bash
gh run view <run-id> --log | grep -E "ERR_PNPM|npm ERR" -A 5 | head -50
# Diagnose. Typical: NPM_TOKEN scope insufficient, network blip, changeset state mismatch.
# Re-run after fix:
gh workflow run release.yml --repo gtcx-ecosystem/gtcx-core --ref main
# Changesets is idempotent — already-published versions are skipped.
```

## Decision log

### 2026-05-22 — Runbook created

- Pre-Sprint-2.3 prep: documents the first-ever publish operational sequence.
- All pre-flight items match the current dry-run state validated in `805cda7` + `028e3d9`.
- The Sprint 2.2 dry-run cleared all blockers; this runbook is ready for execution when the user fires `gh workflow run release.yml`.

## Approvals required before first execution

| Role                            | Required for first execution                 | Status     |
| ------------------------------- | -------------------------------------------- | ---------- |
| Protocol Architect              | Yes                                          | ⏸️ Pending |
| Cryptographic Security Engineer | Yes — security-sensitive packages publishing | ⏸️ Pending |
| Quality & Evidence Lead         | Yes — release evidence completeness          | ⏸️ Pending |
