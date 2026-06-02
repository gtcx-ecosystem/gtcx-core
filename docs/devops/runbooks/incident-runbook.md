---
title: 'Incident Response Runbook — gtcx-core'
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

title: 'Incident Runbook'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# Incident Response Runbook — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Procedures for handling security incidents, broken releases, and critical bugs in published `@gtcx/*` npm packages.

---

## Severity Classification

| Severity      | Definition                                                             | Response Time | Fix SLA                |
| ------------- | ---------------------------------------------------------------------- | ------------- | ---------------------- |
| P0 — Critical | Crypto bug, key leak, signature bypass, supply chain compromise        | Immediate     | Patch within 24 hours  |
| P1 — High     | Data corruption, silent verification failure, published package broken | < 4 hours     | Patch within 72 hours  |
| P2 — Medium   | Non-critical bug, degraded performance, doc inaccuracy                 | < 24 hours    | Next scheduled release |
| P3 — Low      | Minor inconsistency, cosmetic issue                                    | Best effort   | Backlog                |

---

## P0: Security Incident in Published Package

### 1. Contain

```bash
# Deprecate ALL affected versions immediately — do not wait for a fix
npm deprecate @gtcx/<package>@">=<first-bad> <last-bad>" \
  "Security issue: <brief>. Use <safe-version>. See SECURITY.md."
```

### 2. Notify

- Post in downstream consumer channels (Slack, GitHub Discussions)
- If crypto/identity/verification: Cryptographic Security Engineer must be involved
- File GitHub Security Advisory via repo Settings → Security → Advisories

### 3. Fix

```bash
# Create hotfix branch
git checkout -b hotfix/<package>-<issue>

# Fix the issue
# Write regression test proving the fix
# Run full quality gates
pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Version bump (patch)
pnpm changeset  # select affected package, patch bump
pnpm version-packages

# Commit, tag, publish
git add -A && git commit -m "fix(<package>): <description> [SECURITY]"
git tag @gtcx/<package>@<new-version>
pnpm release
```

### 4. Verify

- Confirm new version appears on npm: `npm view @gtcx/<package> versions`
- Confirm deprecated versions show warning: `npm view @gtcx/<package>@<bad-version>`
- Test downstream repo installs clean version

### 5. Post-Incident

- Update `SECURITY.md` if disclosure process needs improvement
- Document what failed and why quality gates didn't catch it
- Update threat model if a new attack vector was discovered
- Update tests to prevent recurrence

---

## P1: Broken Published Package

A published version has a build error, missing exports, or runtime crash.

### 1. Assess

```bash
# Verify the issue locally
pnpm add @gtcx/<package>@<bad-version>
# Reproduce the reported error
```

### 2. Deprecate if Critical

```bash
npm deprecate @gtcx/<package>@<bad-version> \
  "Known issue: <brief>. Use <previous-version>."
```

### 3. Fix and Publish

Same flow as P0 Step 3 — hotfix branch, regression test, quality gates, patch release.

### 4. Do NOT Unpublish

`npm unpublish` breaks lockfiles for anyone who already installed the version. Only unpublish if:

- Published within last 72 hours AND
- Zero downstream installs confirmed AND
- The version contains leaked secrets

---

## P2/P3: Non-Critical Bug

1. File GitHub issue with reproduction steps
2. Fix in next sprint or scheduled release
3. No deprecation needed — document the workaround in the issue

---

## Supply Chain Compromise

If a dependency (not our code) is compromised:

### 1. Identify

```bash
# Check which packages are affected
pnpm audit
pnpm why <compromised-package>
```

### 2. Pin Safe Version

```bash
# Add override in root package.json
# pnpm.overrides: { "<package>": "<safe-version>" }
pnpm install
pnpm audit  # verify clean
```

### 3. Publish Patch

All affected `@gtcx/*` packages get a patch bump with the pinned override.

### 4. Monitor

- Check if the compromise affected published `@gtcx/*` builds
- If yes: deprecate affected versions and cut new builds with clean deps
- Subscribe to security advisories for the compromised package

---

## Rollback Checklist

If a fix can't be shipped fast enough:

1. Identify the last known good version for each affected package
2. Deprecate bad versions with message pointing to good version
3. Notify downstream consumers with exact `pnpm add @gtcx/<package>@<good-version>` command
4. Do not delete git tags — the tag history is the audit trail

---

## Contacts

- Security issues: security@gtcx.trade (see SECURITY.md for SLA)
- CODEOWNERS: @amanianai
- Cryptographic Security Engineer: required for P0 on crypto/identity/verification

---

## References

- [SECURITY.md](../../../SECURITY.md) — disclosure process and SLA
- [Release Checklist](../release-mgmt/release-checklist.md) — full release gate sequence
- [Threat Model](../../security/threat-model.md) — STRIDE analysis and attack scenarios
- [Threat Control Matrix](../../security/threat-control-matrix.md) — 12 controls with evidence
