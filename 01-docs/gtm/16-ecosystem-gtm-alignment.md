---
title: 'Ecosystem GTM Alignment — gtcx-core ↔ gtcx-infrastructure'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'critical'
tags: ['gtm', 'alignment', 'infrastructure']
review_cycle: 'on-change'
---

# Ecosystem GTM Alignment — gtcx-core ↔ gtcx-infrastructure

**Purpose:** Single map of who owns what for bank-grade and African sandbox GTM. **gtcx-core** ships cryptographic evidence; **gtcx-infrastructure** owns live deployment, regulator packages, and **XC** (external clearance) blockers.

**Canonical infrastructure GTM hub:** [gtcx-infrastructure/01-docs/08-gtm/README.md](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/README.md)

**Strategy to use for African central-bank sandboxes:** [Global South 10/10 Plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/plans/global-south-10x-plan.md) — not the $750K FFIEC bank-subsidiary plan unless pursuing US/EU Tier-1 bank.

**External blockers register (XC):** [external-dependencies-register-2026-05-31.md](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/05-audit/external-dependencies-register-2026-05-31.md)

**gtcx-core readiness (not S-stages alone):** [gtm-readiness-2026-06-05.md](../audit/gtm-readiness-2026-06-05.md) — **GR-T1** library · sovereign **below GR-T2**. **GCR:** **GCR-T0 BLOCKED** — [global-compliance-rating-2026-06-05.md](../audit/global-compliance-rating-2026-06-05.md).

---

## Product boundary (what buyers actually adopt)

| Layer                        | Repo                  | What the buyer sees                             | GTM (S / GR-T)               |
| ---------------------------- | --------------------- | ----------------------------------------------- | ---------------------------- |
| **Foundation library**       | `gtcx-core`           | `@gtcx/*` on npm, trust portal, crypto evidence | S1 / **GR-T1**               |
| **Verification rail + APIs** | `gtcx-protocols`      | `@gtcx/sdk`, container `0.4.4`, sandboxes       | S2 / GR-T2 (with infra live) |
| **Deploy + regulator pack**  | `gtcx-infrastructure` | af-south-1, IRP, pen-test report, sandbox ZIP   | S2→S3 / below GR-T2 today    |

Regulators and DFIs do **not** license `gtcx-core` in isolation. They evaluate the **deployed stack** plus evidence package assembled from infrastructure GTM.

---

## Blocker ownership (S2+ procurement)

| Blocker                                   | Owner repo                                          | Canonical artifact                                                                                                                                                                                                                                                                                            | EXT-INF / sprint                                                   |
| ----------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Pen-test vendor + report**              | gtcx-infrastructure (scope) + GTM (signature)       | [`pentest-scope-rfp.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/regulatory/pentest-scope-rfp.md), [`pen-test-intake-evidence-2026-05-31.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/05-audit/pen-test-intake-evidence-2026-05-31.md) | **EXT-INF-002** (SOW pending; ordered **after** Sprint 1 per Q5)   |
| **SOC 2 Type I**                          | quality-evidence + infrastructure evidence pipeline | [`soc2-readiness-checklist.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/08-gtm/regulatory/soc2-readiness-checklist.md)                                                                                                                                                        | Post-revenue / bank partnership; not on Global South critical path |
| **Zimbabwe pre-submission / ZWCMP pilot** | GTM + legal (infra evidence)                        | Core: [`sandbox-intro-email-template.md`](./sandbox-intro-email-template.md); Infra: [`sandbox-application/`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/tree/main/01-docs/08-gtm/sandbox-application)                                                                                             | **EXT-INF-013** (pilot owner), **014** (DPA), **015** (SLA)        |
| **Live testnet + DR proof**               | gtcx-infrastructure                                 | Global South Gap 1 (terraform apply, WORM, DR test)                                                                                                                                                                                                                                                           | Engineering before pen-test window                                 |
| **npm Sigstore provenance**               | gtcx-core                                           | `pnpm provenance:check-npm:strict`, [trust portal](../governance/trust-portal.md)                                                                                                                                                                                                                             | **Done** 2026-06-01; consumers pinned                              |

---

## What gtcx-core contributes to infrastructure sandbox ZIP

When infrastructure runs `assemble-sandbox-evidence.sh`, cite these **from gtcx-core** (do not duplicate in infrastructure):

| Evidence                          | Location                                                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FIPS boundary + CMVP refs         | [`03-fips-readiness.md`](./03-fips-readiness.md)                                                                                 |
| STRIDE + threat matrix            | [`01-security-posture.md`](./01-security-posture.md), `01-docs/09-security/threat-control-matrix.md`                             |
| Compliance matrix (library scope) | [`02-compliance-matrix.md`](./02-compliance-matrix.md)                                                                           |
| npm provenance verification       | [`15-slsa-provenance-guide.md`](./15-slsa-provenance-guide.md), [`07-downstream-integration.md`](./07-downstream-integration.md) |
| Fuzz campaign                     | [`01-docs/05-audit/fuzz-campaign-evidence-2026-05-21.md`](../audit/fuzz-campaign-evidence-2026-05-21.md)                         |
| Executive one-pager               | [`00-executive-brief.md`](./00-executive-brief.md)                                                                               |

Infrastructure owns: architecture overview, data residency, encryption statement, KYC retention, IRP board sign-off, pen-test report attachment.

---

## Sequencing (aligned with Global South plan)

```text
Week 1–2   Infra: deploy testnet (Gap 1) + board IRP/RTO sign (Gap 3)
           GTM: EXT-INF-013 owner named; render sandbox email from template (do not send 09-zimbabwe draft)
Week 3–6   Infra/GTM: pen-test SOW (EXT-INF-002) → regional firm, $8–15K scope
           Legal: EXT-INF-014 DPA + pilot agreement (ZWCMP)
Parallel   Core: maintain npm provenance baseline; no duplicate regulator outreach from core-only docs
Week 7–12  Submit sandbox application (infra package) + respond to regulator questions
```

**Do not** claim SOC 2 Type I or Fortune-500 S4 readiness on the African sandbox path until infrastructure bank-grade plan applies.

---

## Doc hygiene rules

1. **Outbound email:** Use [`sandbox-intro-email-template.md`](./sandbox-intro-email-template.md) only. Per-country files `09`–`13` are **superseded** (historical).
2. **Scores:** Library internal 9.5/10 ≠ ecosystem certified 10/10. Use infrastructure **IR + XC** scoring for deployable product ([SCORING.md](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/05-audit/SCORING.md)).
3. **Pen-test narrative:** African sandboxes expect a **regional** report on the **live stack** (replay-guard, APIs, mobile), not npm library isolation alone — scope per infrastructure RFP.

---

## Related

| Doc                                                                                    | Role                                                        |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [gtm-reality-check-2026-06-02.md](./gtm-reality-check-2026-06-02.md)                   | Stage assessment (S0–S6) for gtcx-core as a product         |
| [gtm-roadmap-10-10-internal-2026-06-01.md](./gtm-roadmap-10-10-internal-2026-06-01.md) | Internal engineering 10/10 (complete)                       |
| [06-budget-readiness-plan.md](./06-budget-readiness-plan.md)                           | Core library $0 path; XC costs live in infrastructure plans |
