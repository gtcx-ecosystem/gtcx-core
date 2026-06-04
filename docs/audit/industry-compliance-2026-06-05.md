---
title: 'Industry Compliance — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: crypto-security-engineer
document_id: AUDIT-INDUSTRY-COMPLIANCE-2026-06-05
audit_lane: industry-compliance
tier: critical
tags: ['audit', 'compliance', 'industry', 'index', 'tier']
review_cycle: weekly
supersedes: external-dependent-compliance-2026-06-05.md
---

# Industry Compliance — index

**Lane 3 of 5** — [readiness-model.md](./readiness-model.md)

Third-party, org, and time-based **industry** attestations (pen-test, SOC 2, provenance, ceremony). **Not** engineering in-repo work (lane 1–2) or commercial GTM motion (lane 5).

**Audit quality (register):** **8.0/10**

**Readiness:** **tier + status only** — never 1–10 for delivery.

---

## Industry Compliance tiers (IC-T0–IC-T4)

| Tier      | Name             | What it covers                                                         | Current placement                                                  |
| --------- | ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **IC-T0** | **Blocker**      | Third-party assurance required before enterprise/sovereign procurement | **Active** — pen-test, SOC 2 letter, XR-402 ceremony not delivered |
| **IC-T1** | **Assurance**    | Independent review, DR live drill, FIPS boundary memo                  | **Open** — items scheduled or RFP-ready                            |
| **IC-T2** | **Platform**     | Org policy: npm provenance, Sigstore `id-token`, publish               | **Blocked** — EXT-CORE-004/005                                     |
| **IC-T3** | **Supply chain** | Upstream advisories (RUSTSEC, crate ecosystem)                         | **Open** — mitigated in `rust/.cargo/audit.toml`                   |
| **IC-T4** | **Temporal**     | Time-based certification gates                                         | **In-flight** — 90-day P1-free window (ends 2026-08-17)            |

**Aggregate industry tier today:** **IC-T0** (T0 items incomplete).

---

## Register status (readiness)

| Status         | Meaning                                                      |
| -------------- | ------------------------------------------------------------ |
| **OPEN**       | 0 of 12 EXT-CORE items `complete`                            |
| **PREP-READY** | In-repo RFP, SOC 2 gap analysis, SLSA workflow (lane 2 prep) |
| **IN-FLIGHT**  | IC-T4 temporal gate running                                  |
| **BLOCKED**    | IC-T2 platform (org npm provenance)                          |

---

## EXT-CORE → tier mapping

| EXT-CORE | Item                     | IC tier | Delivery           |
| -------- | ------------------------ | ------- | ------------------ |
| 001      | Pen-test report          | IC-T0   | `not-started`      |
| 002      | SOC 2 Type I letter      | IC-T0   | `not-started`      |
| XR-402   | Trusted-setup ceremony   | IC-T0   | `blocked`          |
| 003      | FIPS boundary review     | IC-T1   | `open`             |
| 011      | DR live drill            | IC-T1   | `open`             |
| 004/005  | npm provenance + publish | IC-T2   | `blocked`          |
| 006      | RUSTSEC upstream         | IC-T3   | `open` (mitigated) |
| 012      | 90-day P1-free           | IC-T4   | `in-progress`      |

Market/regulator outreach rows (007–010) → [GTM-Readiness](./gtm-readiness-2026-06-05.md), not Industry Compliance.

---

## Canonical audit

[external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md) — **SoR**
