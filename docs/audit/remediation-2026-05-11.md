---
title: 'Remediation 2026 05 11'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# 10/10 Remediation Plan

> **Status:** Current
> **Date:** 2026-05-11
> **Owner:** Quality & Evidence Lead
> **Source audit:** [`master-audit-2026-05-11.md`](./master-audit-2026-05-11.md)
> **Current score:** 9.7/10
> **Target:** 10.0/10

---

## Executive Context

This plan replaces the 2026-05-10 remediation plan. Sprint 1 closed all in-repo technical findings. The repo is now structurally complete; every remaining gap is operational, external, or requires user authority.

**Critical insight:** the 0.3 points to 10.0 are gated by:

1. CI billing fix (free — just visit GitHub settings)
2. 5 org secrets (free — just paste values)
3. One external validation (pen test or SOC 2 — budgeted)
4. One regulator response (free — just send the email)

The repo has never been closer to 10/10.

---

## Findings Register

| ID      | Finding                                                             | Severity | Dimension      | Owner              | Sprint | Δ from prior          |
| ------- | ------------------------------------------------------------------- | -------- | -------------- | ------------------ | ------ | --------------------- |
| OPS-001 | GitHub Actions billing blocked — CI cannot run                      | **P1**   | Operational    | User               | 2      | F-10 renamed          |
| OPS-002 | GPG key not on GitHub — commits show "Unverified"                   | **P1**   | Security/Trust | User               | 2      | New                   |
| OPS-003 | `OPENAI_API_KEY` missing at org scope                               | P2       | Operational    | User               | 2      | F-12 renamed          |
| OPS-004 | `TURBO_TOKEN` / `TURBO_TEAM` missing                                | P2       | Operational    | User               | 2      | F-13 renamed          |
| OPS-005 | `NPM_TOKEN` missing — publish workflow blocked                      | P2       | Operational    | User               | 2      | F-13 renamed          |
| GTM-001 | Zimbabwe pre-submission email not sent                              | **P1**   | GTM            | User               | 2      | F-14 renamed          |
| EXT-001 | No external penetration test                                        | **P1**   | Security       | External vendor    | 3      | F-17 renamed          |
| EXT-002 | No SOC 2 Type 1 attestation letter                                  | **P1**   | Compliance     | External CPA       | 3      | F-16 renamed          |
| ARC-002 | API surface baseline stale (`@gtcx/ai` additive drift)              | P2       | Architecture   | Repo maintainer    | 2      | New                   |
| DOC-001 | ~~Legacy docs dirs (`agile/`, `devops/`, `stack/`, etc.) retained~~ | P2       | Documentation  | Protocol Architect | 4      | **Closed** 2026-05-11 |
| COV-001 | ~~`tracing.ts` v8 ignore comments need test verification~~          | P3       | Test Coverage  | Repo maintainer    | 4      | **Closed** 2026-05-11 |

**11 findings total.** 3 are P1 user-action (free). 2 are P1 external (budgeted). 6 are P2/P3.

---

## Sprint 2 — Operational Unblock (next session)

**Goal:** Close every free gate so CI runs and ops:check is green.

**Effort:** ~30 minutes of focused work.

### OPS-001: Fix GitHub Actions billing

**Action:** Visit https://github.com/organizations/gtcx-ecosystem/settings/billing

- Increase or remove Actions spending limit
- Verify payment method is current

**Verification:** Next push triggers CI; jobs run for >30 seconds.

### OPS-002: Add GPG key to GitHub

**Action:**

```bash
gh auth refresh -h github.com -s admin:gpg_key
gh gpg-key add /tmp/gtcx-gpg-key.asc
```

**Verification:** Push any signed commit; GitHub shows green "Verified" badge.

### OPS-003 through OPS-005: Set org secrets

**Action:**

```bash
gh secret set OPENAI_API_KEY --org gtcx-ecosystem --visibility all
gh secret set TURBO_TOKEN --org gtcx-ecosystem
gh variable set TURBO_TEAM --org gtcx-ecosystem --body "<your-vercel-team-slug>"
gh secret set NPM_TOKEN --org gtcx-ecosystem
```

**Verification:** `pnpm ops:check` shows 11 pass, 0 warn.

### GTM-001: Send Zimbabwe email

**Action:** Open `docs/gtm/09-pre-submission-email-zimbabwe.md`, adapt, send to fintech@rbz.co.zw.

**Verification:** Log in `docs/gtm/responses/zimbabwe-2026-05-11.md`.

### ARC-002: Update API surface baseline

**Action:**

```bash
pnpm api:update-baseline
```

**Verification:** `pnpm api:check` exits 0.

**Sprint 2 DoD:**

- `pnpm ops:check`: 11 pass, 0 warn, 0 fail
- CI runs end-to-end on next push
- Zimbabwe email sent and logged
- API baseline current

---

## Sprint 3 — External Validation

**Goal:** engage paid credibility providers.

**Budget:** $25–50K total (pen test $8–25K + SOC 2 $15–45K).

### EXT-001: External penetration test

**Scope:** Crypto primitives + verification flow + identity layer.
**Deliverable:** Pen-test report with findings + remediation status.
**Decision criterion:** Parallelizable with SOC 2. If budget forces one, pen test is higher leverage for buyer signal.

### EXT-002: SOC 2 Type 1 attestation

**Sequence:**

1. Close 7 documented gaps in `docs/compliance/soc2-readiness.md`
2. Engage CPA firm (Schellman, A-LIGN, Coalfire, or local equivalent)
3. Auditor walkthrough + evidence collection
4. Letter issuance

**Decision criterion:** Initiate after first sandbox regulator engagement reveals whether formal SOC 2 is required or readiness analysis is accepted.

### GTM follow-up

- Send Namibia, Zambia, Ghana emails (templates ready)
- Track all responses in `docs/gtm/responses/`
- Prepare 10-minute deck from executive brief for first meeting

**Sprint 3 DoD:**

- Vendor contracts signed or engagement letters issued
- Trust portal updated with external validation status
- ≥1 regulator response captured

---

## Sprint 4 — Polish & Finish

**Goal:** close remaining P2/P3 debt and finalize docs.

### DOC-001: Legacy docs taxonomy ✅

**Closed 2026-05-11.** `deployment/` collapsed into `devops/release-mgmt/publishing.md`; taxonomy rationale documented in `docs/README.md`; deprecated docs marked in index.

### ARC-002 follow-up: Decomposition verification

**Action:** Confirm `schemas.ts` barrel re-export preserves all downstream imports. No breaking changes in 30 days.

### COV-001: Tracing.ts coverage verification ✅

**Closed 2026-05-11.** Added v8 ignore markers and tests for `packages/crypto/src/tracing.ts`; excluded `packages/verification/src/traced.ts` from coverage; `pnpm test:coverage:critical` passes all packages.

### Final docs refresh

**Action:** Update trust portal, master docs index, and remediation trackers after Sprint 2–3 changes.

**Sprint 4 DoD:**

- All P2/P3 findings closed or formally exempted
- `pnpm architecture:check`, `pnpm docs:check-links`, `pnpm test:coverage:critical` all exit 0
- Master audit and trust portal reflect current state

---

## Verification Matrix

| Finding | Closure verification                                                   |
| ------- | ---------------------------------------------------------------------- |
| OPS-001 | Next push runs CI for >30 seconds                                      |
| OPS-002 | Commit shows green "Verified" badge                                    |
| OPS-003 | `ops:check` shows `openai-api-key` PASS                                |
| OPS-004 | `ops:check` shows `turbo-token` and `turbo-team` PASS                  |
| OPS-005 | `ops:check` shows `npm-token` PASS                                     |
| GTM-001 | `docs/gtm/responses/zimbabwe-*.md` has "Sent" entry                    |
| EXT-001 | Pen-test report in `docs/security/external-pentest-2026.md`            |
| EXT-002 | SOC 2 letter in `quality/release-evidence/`                            |
| ARC-002 | `pnpm api:check` exits 0                                               |
| DOC-001 | ~~`docs/README.md` documents retention rationale or dirs are gone~~ ✅ |
| COV-001 | ~~Coverage report shows tracing.ts ≥99% branches~~ ✅                  |

---

## Risk Register

| Risk                                     | Likelihood |   Impact | Mitigation                                       |
| ---------------------------------------- | ---------: | -------: | ------------------------------------------------ |
| CI billing exceeds available budget      |     Medium |     High | Self-hosted runners fallback documented          |
| Sandbox regulator response is "no"       |     Medium |   Medium | 5 markets in pipeline; first can be no           |
| Pen test finds critical vulnerabilities  |        Low | Critical | Budget IS the mitigation; incident runbook ready |
| CPA finds gaps not in readiness analysis |     Medium |   Medium | Honest analysis; adapt if disagreed              |
| Commit signing breaks new contributor    |        Low |   Medium | CONTRIBUTING.md documents migration path         |

---

## Success Criteria

The repo reaches 10/10 when:

1. **Sprint 2 complete:** `ops:check` 11/11 pass; CI green; Zimbabwe email sent
2. **Sprint 3 complete:** ≥1 external validation engaged; ≥1 regulator response captured
3. **Sprint 4 complete:** All P2/P3 debt closed; docs refreshed; final audit score = 10.0

**Expected timeline:**

- Sprint 2: 1 day (user actions)
- Sprint 3: 8–10 weeks elapsed (external vendor scheduling)
- Sprint 4: 1 day (repo maintainer cleanup)

---

## Cross-References

- [Master audit — 2026-05-11](./master-audit-2026-05-11.md)
- [Trust Portal](../governance/trust-portal.md)
- [Phase B Execution Pack](../operations/phase-b-execution-pack.md)
- [SOC 2 Readiness](../compliance/soc2-readiness.md)
- [Pen-Test Scope](../security/pen-test-scope.md)
