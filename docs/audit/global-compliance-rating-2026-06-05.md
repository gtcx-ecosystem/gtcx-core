---
title: 'Global Compliance Rating — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-GCR-2026-06-05
tier: critical
tags: ['audit', 'compliance', 'gcr', 'tier', 'status']
review_cycle: weekly
---

# Global Compliance Rating (GCR)

**Primary command:** `global-compliance-audit` → `docs/audit/global-compliance-audit-<date>.md`  
**Scoring:** [global-compliance-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/lane-scoring/global-compliance-scoring.md)  
**Prerequisites:** `compliance-audit` + `external-audit`

**Cross-lane rollup** — procurement-facing **tier + status only** (never 1–10).

**Not** the same as:

| Term               | What it is                                                                            |
| ------------------ | ------------------------------------------------------------------------------------- |
| **GCR** (this doc) | Global Compliance **Rating** — tier/status rollup (lanes 2 + 3)                       |
| **GCI**            | Global Compliance **Index** — protocol scoring product (`gtcx-protocols` / `@gtcx/*`) |
| **8.9**            | Bank-grade **lane 4** composite — buyer lenses, not GCR                               |
| **IC-T0**          | Industry Compliance **lane 3** sub-tier — feeds GCR                                   |

**SSOT machine-readable:** [`latest.json`](./latest.json) → `globalComplianceRating`

---

## Current placement (2026-06-05)

| Field          | Value                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **GCR tier**   | **GCR-T0**                                                                                       |
| **GCR status** | **BLOCKED**                                                                                      |
| **Driver**     | Industry **IC-T0** active (pen-test, SOC 2 letter, ceremony undelivered); register **OPEN 0/12** |

In-repo corporate design (lane 2 **8.2** corporate readiness) is strong; **GCR stays T0** until lane 3 IC-T0 blockers clear.

---

## GCR tiers (GCR-T0–GCR-T4)

| Tier       | Name             | Meaning                                                                  |
| ---------- | ---------------- | ------------------------------------------------------------------------ |
| **GCR-T0** | **Blocked**      | Cannot pass enterprise/sovereign vendor-risk on external attestation     |
| **GCR-T1** | **Design-ready** | In-repo controls + SOC 2 **design** complete; external items in prep/RFP |
| **GCR-T2** | **Partial**      | Some third-party evidence delivered (e.g. pen-test draft, partial TSC)   |
| **GCR-T3** | **Attested**     | Industry items required for pilot procurement delivered (IC-T1+ clear)   |
| **GCR-T4** | **Sustained**    | Temporal gates closed (IC-T4 complete); register largely **CLOSED**      |

**Rule:** GCR tier = **worst-of** lane 3 **IC** aggregate tier and lane 2 **corporate readiness** band (see derivation below).

---

## GCR status (register-style)

| Status         | Meaning                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| **BLOCKED**    | IC-T0 blockers active — current                                         |
| **OPEN**       | Register has zero `complete` industry items                             |
| **PREP-READY** | In-repo RFP/SOC gap work done; awaiting vendor/CPA                      |
| **IN-FLIGHT**  | At least one industry item in progress                                  |
| **CLEAR**      | No P0 industry blockers; procurement may proceed on compliance evidence |

---

## Derivation (no duplicate scoring)

```text
GCR tier   := f( IC aggregate tier , corporate readiness band )
GCR status := f( EXT-CORE register , IC-T0/T2 blocker flags )
```

| Input          | Source                                                                                               | Today                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| IC aggregate   | [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)                             | **IC-T0**                                             |
| Corporate band | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md) domain `corporateReadiness` | **8.2** → supports **GCR-T1** design, capped by IC-T0 |
| Register       | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md)       | **OPEN 0/12**                                         |

**Mapping (normative):**

- IC-T0 active → **GCR-T0** + **BLOCKED**
- IC-T1 only, register OPEN → **GCR-T1** + **PREP-READY** or **IN-FLIGHT**
- IC-T2 blocked on platform → **GCR-T0** or **BLOCKED** if org npm blocks procurement narrative
- IC-T3+ with register progress → **GCR-T2**+
- IC-T4 closed + register ≥ majority complete → **GCR-T4** + **CLEAR**

Agents update GCR whenever **IC tier** or **register status** changes.

---

## Lane map

| GCR draws from                                   | Lane                                      |
| ------------------------------------------------ | ----------------------------------------- |
| Corporate readiness, SOC 2 design, SOX           | 2 Internal compliance                     |
| Pen-test, SOC 2 letter, ceremony, npm provenance | 3 Industry Compliance                     |
| Engineering 9.5, bank-grade 8.9, GTM GR-T\*      | **Not** GCR — cite those lanes separately |

---

## Related

- [readiness-model.md](./readiness-model.md)
- [readiness-and-audit-lanes.md](../agents/readiness-and-audit-lanes.md)
