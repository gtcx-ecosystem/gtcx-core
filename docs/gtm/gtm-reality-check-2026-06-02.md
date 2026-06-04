---
title: 'GTM Reality Check — gtcx-core'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'critical'
tags: ['gtm', 'assessment']
review_cycle: 'quarterly'
framework: '~/.claude/GTM.md v1.0'
aligned_with: 'gtcx-infrastructure/docs/gtm/plans/global-south-10x-plan.md'
---

# GTM Reality Check — gtcx-core

> **Superseded (2026-06-05):** Stage verdicts and buyer split live in [gtm-readiness-2026-06-05.md](../audit/gtm-readiness-2026-06-05.md). Engineering and compliance are separate lanes in [readiness-model.md](../audit/readiness-model.md). This file is retained for history.

**Assessed as:** npm cryptographic **foundation library** (not a deployable service).  
**Evidence base:** README, trust portal, `docs/gtm/*`, `docs/audit/ci-confirmation-2026-06-01.md`, infrastructure GTM + EXT-INF register (2026-05-31).  
**Alignment:** [16-ecosystem-gtm-alignment.md](./16-ecosystem-gtm-alignment.md)

---

## PHASE 1 — Stage assessment

### S0: Prototype — **Ready**

| Dimension   | Assessment                                                                                |
| ----------- | ----------------------------------------------------------------------------------------- |
| Technical   | `pnpm install && pnpm test` passes; 2,360+ tests; integration `runtime-substrate.test.ts` |
| Commercial  | Repo public; conventional commits                                                         |
| Trust       | Secret scan, threat matrix validator in CI                                                |
| Operational | 21 CI gates documented                                                                    |
| AI-specific | `@gtcx/ai` trust gating; ai-eval scorecard in CI (WARN non-blocking)                      |

**Evidence:** `README.md` (2026-06-01), `pnpm ci:confirmation` log in `docs/audit/ci-confirmation-2026-06-01.md`.

---

### S1: MVP — **Ready**

| Dimension   | Assessment                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Technical   | 21/21 `@gtcx/*` on npm; `07-downstream-integration.md`; provenance `pnpm provenance:check-npm:strict` |
| Commercial  | Published packages; changesets; trust portal                                                          |
| Trust       | FIPS via aws-lc-rs (CMVP #4816); no custom crypto                                                     |
| Operational | Release workflow + GA evidence log                                                                    |
| AI-specific | Documented stub boundaries in package READMEs                                                         |

**Evidence:** npm release [26778909174](https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/26778909174); downstream pins in `gtcx-protocols` / `gtcx-infrastructure` lockfiles.

**Deal killers:** None at S1 for a **developer** integrating the library.

---

### S2: Pilot Ready — **Partially Ready** (library only) / **Not Ready** (sovereign deal)

| Dimension   | Assessment                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Technical   | Library is pilot-grade; **live pilot** requires `gtcx-protocols` + `gtcx-infrastructure` testnet (infra Gap 1 not proven at regulator) |
| Commercial  | No standalone pilot contract for the library; ZWCMP pilot owned via infrastructure EXT-INF-013–015                                     |
| Trust       | **No external pen-test report** on the stack (EXT-INF-002 open). Internal fuzz/SAST strong but examiners want third-party              |
| Operational | Library has no SLA; support is via downstream product owner                                                                            |
| AI-specific | ai-eval WARN in CI — buyer may ask what WARN means in production                                                                       |

**Deal killers (S2 sovereign / paying pilot):**

- EXT-INF-002 pen-test SOW not signed
- EXT-INF-013 no named pilot owner (ZWCMP)
- Zimbabwe outreach: template ready, **send not executed** (human)
- Infrastructure testnet not demonstrated (Global South Gap 1)

**Gap:** Close XC register in infrastructure; core supplies crypto appendix only.  
**Timeline:** 8–12 weeks aligned with [Global South plan](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/gtm/plans/global-south-10x-plan.md) (deploy + pen-test + submission).

---

### S3: General Availability — **Not Ready**

**Deal killers:** No standard enterprise MSA for the library alone; no billing; no self-service hosted product; regulator path not closed; downstream products still carry custom sovereign work.

**Gap:** Repeatable commercial packaging via `gtcx-platforms` / protocols Cloud SKU, not gtcx-core repo.  
**Timeline:** Quarters (post first sandbox approval + pen-test).

---

### S4: Enterprise — **Not Ready**

**Deal killers:** No SOC 2 Type I letter in hand; no delivered pen-test report; no SSO/audit product surface (library-only).

_Assessment stops here per framework (two consecutive Not Ready)._

---

## PHASE 2 — Verdict

**Current GTM stage (gtcx-core as product):** **S1 MVP** — a developer can `pnpm add @gtcx/crypto` and integrate with documented primitives and npm Sigstore provenance in under one day.

**Current GTM stage (ecosystem deal using gtcx-core):** **S2 Partially Ready** — technical foundation is there; **trust and operational proof live in gtcx-infrastructure**, not in this repo.

**First realistic deal (90 days):** **ZWCMP 30-day design partner / pilot** (Zimbabwe commodity verification) sold as **GTCX Cloud/Sovereign + protocols rail**, not as npm library license.

- **Buyer:** Chamber / pilot consortium + RBZ sandbox path (sales-led per EXT-INF Q6)
- **Size:** Design-partner / LOI scale (not enterprise ELAs)
- **Must be true to close:** EXT-INF-013 owner + cadence; EXT-INF-014 DPA signed; infra testnet + DR evidence; EXT-INF-002 pen-test report filed; sandbox application submitted from infrastructure package

**Stage gate blockers (top 5):**

| #   | Blocker                             | Why it kills the deal                      | Fix                                                                                       |
| --- | ----------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| 1   | EXT-INF-013 — no pilot owner        | No one owns regulator relationship         | Name owner by 2026-06-07; update `pilot-success-criteria.md`                              |
| 2   | EXT-INF-002 — pen-test SOW unsigned | Trust team stops cold                      | Sign regional scope ($8–15K) per infra RFP                                                |
| 3   | Infra Gap 1 — no live testnet proof | RBZ grades systems, not Terraform          | `terraform apply` + DR/chaos records                                                      |
| 4   | EXT-INF-014 — DPA unsigned          | Cannot process Zimbabwe data in af-south-1 | Legal + pilot agreement PDF                                                               |
| 5   | Zimbabwe email not sent             | No regulator dialogue started              | Render [`sandbox-intro-email-template.md`](./sandbox-intro-email-template.md); human send |

**AI trust gaps (specific to gtcx-core):**

- `@gtcx/ai` and verification optional AI paths — buyers will ask what runs on-device vs cloud and whether AI can sign credentials (it cannot; trust gating documented)
- ai-eval scorecard **WARN** — need one-page explanation for procurement
- No customer-data processing in library (good) but downstream must not send PII into logging hooks without DPA

**Competitive reality (canonical: [DTF-001 Defensibility Tiers 1–5](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0)):**

Higher tier = **more defensible** = **longer replication time** for competitors.

| Defensibility tier | Replication   | GTCX status                                                                                                                                                                     |
| -----------------: | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|              **1** | ~90 days      | Achieved — commodity crypto                                                                                                                                                     |
|              **2** | 6–12 months   | Achieved — ZKP + KAT + CI                                                                                                                                                       |
|              **3** | 6–9 months    | Achieved — platform bundle                                                                                                                                                      |
|              **4** | 6+ months     | Achieved — 22/22 provenance                                                                                                                                                     |
|              **5** | 12–18+ months | **Not achieved** — named jurisdiction circuits; [path-to-tier-5](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/frameworks/defensibility-tiers/v1.0.0/path-to-tier-5.md) |

Sovereign deals also need pen-test, testnet, pilot owner (infra/GTM) — **deal readiness** on top of Tier 5, not a separate tier.

---

## PHASE 3 — 90-day plan

| #   | Action                                                        | Stage gate | Owner                 | Effort | Impact        |
| --- | ------------------------------------------------------------- | ---------- | --------------------- | ------ | ------------- |
| 1   | Name EXT-INF-013 ZWCMP pilot owner + first cadence            | S2         | Founder/GTM           | S      | Unblocks deal |
| 2   | Execute pen-test SOW (infra RFP, regional firm)               | S2→S3      | GTM + crypto-security | M      | Builds trust  |
| 3   | Deploy infra testnet + DR/chaos evidence (Global South Gap 1) | S2         | frontier-infra        | L      | Unblocks deal |
| 4   | Board-sign IRP + RTO/RPO (infra sandbox pack)                 | S2         | Founder               | S      | Builds trust  |
| 5   | Send Zimbabwe sandbox intro (canonical template only)         | S2         | GTM                   | XS     | Unblocks deal |
| 6   | Legal: EXT-INF-014 DPA + pilot agreement                      | S2         | Legal                 | L      | Closes gap    |
| 7   | Attach gtcx-core evidence appendix to infra sandbox ZIP       | S2         | protocol-architect    | S      | Builds trust  |
| 8   | Publish one-page "ai-eval WARN" buyer FAQ                     | S2         | Eng + GTM             | XS     | Reduces risk  |
| 9   | Keep downstream `@gtcx/*` on provenance baseline              | S1→S2      | Eng                   | XS     | Reduces risk  |
| 10  | SOC 2 Type I CPA engagement (if bank track parallel)          | S4         | quality-evidence      | XL     | Closes gap    |

**Priority order:** 1 → 3 → 2 → 5 → 4 → 6 → 7 (matches infrastructure execution-roadmap and Global South sequencing).

---

_Next review: 2026-09-01 or when EXT-INF-002/013 close._
