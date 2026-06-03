---
title: 'Release Checklist — gtcx-core'
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

title: 'Release Checklist'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# Release Checklist — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Complete this checklist for every release. All items must be checked before publishing. Gate execution is documented in the quality runbook.

---

## Pre-Release Gates

Run all gates in order. Check each only after the command passes:

**TypeScript gates:**

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:coverage:critical`
- [ ] `pnpm build`
- [ ] `pnpm architecture:check`
- [ ] `pnpm quality:governance:check`
- [ ] `pnpm security:threat-matrix`
- [ ] `pnpm perf:update-history` + `pnpm perf:check-budgets`
- [ ] `pnpm api:check` (review diff before proceeding)
- [ ] `pnpm provenance:generate`
- [ ] `pnpm docs` + `pnpm docs:check-links`

**Rust gates:**

- [ ] `cargo fmt --all -- --check`
- [ ] `cargo clippy --workspace --all-targets -- -D warnings`
- [ ] `cargo test --workspace --lib`
- [ ] Heavy ZKP proof validation completed within last 7 days (`cargo test -p gtcx-zkp --release -- --ignored`)

---

## API Surface Review

Review `quality/api-surface-report.json` vs `quality/api-surface-baseline.json`:

| Diff type       | Required action                                          |
| --------------- | -------------------------------------------------------- |
| Breaking change | Major version bump — escalate to human before proceeding |
| Additive change | Minor version bump minimum                               |
| No change       | Patch version acceptable                                 |

Do not run `pnpm api:update-baseline` until human approval is confirmed.

---

## Release Artifacts

These must exist and be committed before release:

- [ ] `quality/api-surface-report.json`
- [ ] `benchmarks/performance-report.json`
- [ ] `artifacts/provenance-manifest.json`
- [ ] `quality/release-<version>-evidence.md` — gate results summary

---

## Human Approval Signoff

- [ ] CODEOWNERS approval received
- [ ] Version bump type confirmed by human reviewer (patch / minor / major)
- [ ] API diff reviewed and version decision made
- [ ] UAT evidence log updated for any new features (`docs/agile/testing/uat-evidence-log.md`)
- [ ] Release notes updated

---

## Post-Approval Steps

Execute only after human approval:

- [ ] `pnpm api:update-baseline` (if API changed)
- [ ] Version bump applied
- [ ] Tag created
- [ ] Published per procedure in `docs/devops/ci-cd/ci-cd.md`

---

## Bad Release Rollback

If a broken version is published to npm:

1. **Deprecate immediately** — do not wait for a fix:
   ```bash
   npm deprecate @gtcx/<package>@<bad-version> "Known issue: <brief description>. Use <previous-version>."
   ```
2. **Notify downstream consumers** — post in the relevant channels that the version should not be used
3. **Cut a patch release** — fix the issue, run all gates, publish a new patch version
4. **Do NOT use `npm unpublish`** unless the version was published within the last 72 hours AND no downstream consumer has installed it. Unpublishing breaks lockfiles.
5. **Post-incident**: document what failed and why the gates did not catch it. Update gates if needed.

For security-critical releases (crypto bug, key leak, signature bypass):

- Treat as P0 — Cryptographic Security Engineer must be involved
- Deprecate all affected versions immediately
- Patch release within 24 hours
- Security advisory via `SECURITY.md` disclosure process

---

## Hard Rules

- Never mark a checklist item complete without running the actual gate
- Never publish without all gates passing
- Never run `pnpm api:update-baseline` without human approval
- Never force-push a release tag

---

## Reference

- [`docs/devops/runbooks/quality-runbook.md`](../runbooks/quality-runbook.md) — full gate sequence and triage order
- [`docs/testing/quality-standards.md`](../../testing/quality-standards.md) — coverage thresholds
- [`docs/agents/workflows/tasks/cut-release.md`](../../agents/workflows/tasks/cut-release.md) — release task playbook
