---
title: 'Bank-grade audit — gtcx-core'
status: current
date: 2026-06-07
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-BANK-GRADE-FORENSIC-2026-06-07
audit_lane: bank-grade
audit_command: bank-grade-audit
certified_composite: 8.9
investor_lens: 8.9
enterprise_lens: 8.8
sovereign_dfi_lens: 9.0
audit_quality_1to10: 8.6
caps_fired: 0
p0_count: 0
p1_count: 4
p2_count: 5
baseline_commit: 47216fa
tier: critical
tags: ['audit', 'bank-grade', 'lane-4', 'forensic']
review_cycle: quarterly
related:
  - bank-grade-2026-06-05.md
  - engineering-completeness-quality-2026-06-05.md
  - internal-compliance-2026-06-05.md
  - signal-assessment-2026-06-07.md
---

# Bank-grade audit — gtcx-core (lane 4)

> **Lane 4 only.** Certified composite **8.9** is **not** engineering (lane 1 **10.0** signoff) or GCR (IC-T0 BLOCKED).  
> **Methodology:** [bank-grade-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/lane-scoring/bank-grade-scoring.md) + [SCORING_FRAMEWORK.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/audit-framework/SCORING_FRAMEWORK.md)  
> **Repo:** `gtcx-core` @ `47216fa` · **Auditor:** Cursor agent (master-audit / bank-grade-audit alias)

**Delta since [master-audit-2026-06-03.md](./master-audit-2026-06-03.md):** OI-X02 closed; EXT-INF-002 pack acknowledged; CORE-004 engineering closeout; FA-S6-02 + certified-pack pipelines green; SIGNAL assessment filed; DTF-5.5.4 commercial tracker. External attestation gaps unchanged (pen-test SOW, LOI, ceremony).

---

## Cited lane audits (do not re-score gates)

| Lane                  | Index                                                                                              | Readiness cited                                |
| --------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1 Engineering         | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) | **10.0** internal signoff · **9.5** completion |
| 2 Internal compliance | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           | **9.0** composite (5 domains)                  |
| 3 Industry            | [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)                           | **IC-T0** OPEN 0/12 — caps GCR narrative       |
| Deployment            | (ecosystem) gtcx-infrastructure staging substrate                                                  | Cited for sovereign pilot — not re-probed      |

---

## Protocol 27 — verification ladder (this session)

| Step | Command                                | Exit | Notes                               |
| ---- | -------------------------------------- | ---: | ----------------------------------- |
| V1   | `git rev-parse HEAD`                   |    0 | `47216fa`                           |
| V2   | `pnpm format:check`                    |    0 | After baseline/session prettier fix |
| V2   | `pnpm lint`                            |    0 | 45/45 tasks                         |
| V2   | `pnpm typecheck`                       |    0 | 45/45 tasks                         |
| V2   | `pnpm architecture:check`              |    0 | 24 packages, 287 files              |
| V2   | `pnpm build`                           |    0 | 25/25 tasks                         |
| V3   | `pnpm test`                            |    0 | 51/51 tasks                         |
| V4   | `pnpm docs:check-frontmatter`          |    0 | All valid                           |
| V4   | `pnpm docs:check-links`                |    0 | 576 files                           |
| V4   | `pnpm certified-pack:verify-manifest`  |    0 | 5 packs                             |
| V4   | `pnpm vendor-evidence:verify-manifest` |    0 | 22 artifacts                        |
| V5   | `pnpm quality:governance:check`        |    0 | After `pnpm agent:sync`             |
| V5   | `pnpm ops:check`                       |    0 | 8 pass, 3 warn                      |
| V5   | `pnpm readiness:lanes:check`           |    0 | SSOT + anti-drift                   |
| V5   | `pnpm agent:protocols:check`           |    0 | P1–P28                              |

---

## Dimension scorecard

| Dimension                         |   Score | Conf | Weight | Weighted | Evidence                                                                                           |
| --------------------------------- | ------: | :--: | -----: | -------: | -------------------------------------------------------------------------------------------------- |
| Code Quality                      | **9.3** |  A   |    15% |     1.40 | 51 turbo test tasks; integration suite; Rust `gtcx-zkp` trusted-setup verify                       |
| Repo / Folder Hygiene             | **9.5** |  A   |    10% |     0.95 | `check:workspace-root-cleanliness:strict`; agent sync; coordination docs SSOT                      |
| Security                          | **9.0** |  A   |    20% |     1.80 | FIPS path; `safety-rules.json` SR-002; crypto CODEOWNERS — **no third-party pen-test report**      |
| Global South Resilience           | **8.6** |  B   |    15% |     1.29 | Jurisdiction packs (5); network maturity honesty; offline/sync primitives                          |
| Ecosystem Integration             | **9.0** |  A   |    15% |     1.35 | OI-X02 + EXT-INF-002 acks; bridge current; downstream `@gtcx/*` consumers                          |
| Agentic Maturity                  | **8.7** |  A   |    10% |     0.87 | P22–P28 CI; Class S/A/R; [signal-assessment](./signal-assessment-2026-06-07.md) L1 high (team cap) |
| Enterprise / Production Readiness | **8.4** |  B   |    15% |     1.26 | Library + evidence packs; **not** deployable sovereign app; SOC/pen-test external                  |
| **Raw weighted**                  |         |      |   100% | **8.92** |                                                                                                    |

### Caps applied

| Cap rule                             | Fired? | Effect                               |
| ------------------------------------ | :----: | ------------------------------------ |
| Unresolved critical finding          |   No   | —                                    |
| 2+ high on consequential paths       |   No   | P1 items are external/human gates    |
| Mutable audit on consequential paths |   No   | —                                    |
| Raw AI approves consequential action |   No   | SR-002 enforced                      |
| Placeholder ecosystem authority      |   No   | Protocols hub linked, not duplicated |

**Certified composite (post-cap):** **8.9/10** (rounded; unchanged band vs 2026-06-03 — external attestation still binds)

---

## Lens table

| Lens                |   Score | Δ vs 06-03 | Rationale                                                                        |
| ------------------- | ------: | :--------: | -------------------------------------------------------------------------------- |
| **Investor**        | **8.9** |     —      | Reference crypto foundation; DTF technical ~88%; coordination velocity improved  |
| **Enterprise**      | **8.8** |    +0.1    | Infra acks closed; vendor pack + certified-pack witness; procurement gaps remain |
| **Sovereign / DFI** | **9.0** |     —      | FIPS + ZKP + jurisdiction packs; ceremony + pen-test still human-gated           |

---

## Findings

### P0 — none

No unresolved critical findings on consequential paths in-repo.

### P1

| ID       | Finding                                         | Owner                          | Evidence                                                                                                    |
| -------- | ----------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| BG-P1-01 | No third-party pen-test report in tree          | gtcx-infrastructure / Security | EXT-INF-002 SOW Class S; pack ack done                                                                      |
| BG-P1-02 | Tier 5 **commercial** blocked (5-C2)            | Human / GTM                    | [dtf-554-commercial-gate-tracker](../operations/coordination/dtf-554-commercial-gate-tracker-2026-06-07.md) |
| BG-P1-03 | CORE-004 ceremony `transcript.seed` unpublished | Custodian                      | Engineering green — [closeout](../operations/coordination/core-004-engineering-closeout-2026-06-06.md)      |
| BG-P1-04 | Industry Compliance IC-T0 (0/12)                | Ecosystem / Legal              | [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)                                    |

### P2

| ID       | Finding                                    | Owner                         |
| -------- | ------------------------------------------ | ----------------------------- |
| BG-P2-01 | Human Lead TBD (`AGENTS.md`)               | Leadership                    |
| BG-P2-02 | SIGNAL overall L1 high (team caps agentic) | gtcx-core + protocols owner   |
| BG-P2-03 | `ops:check` 3 warns (org env scope)        | Platform                      |
| BG-P2-04 | SOC 2 Type I letter absent                 | Compliance                    |
| BG-P2-05 | USSD protocol scaffolding only             | protocol-architect (optional) |

---

## Closed since 2026-06-03

| ID                       | Item                             | Evidence                                                 |
| ------------------------ | -------------------------------- | -------------------------------------------------------- |
| MA-P1-02 (partial)       | CORE-004 engineering             | Class R closeout 2026-06-06; ceremony remains Class S    |
| OI-X02                   | ER-1-08 infra hub ack            | `from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md` |
| EXT-INF-002 (core slice) | Vendor pack delivery + infra ack | 22 artifacts; outbound-acknowledged                      |
| FA-S6-02                 | Pen-test vendor intake pack      | `pnpm vendor-evidence:verify-manifest` exit 0            |
| DTF-5.5.2                | Certified pack pipeline          | `pnpm certified-pack:verify-manifest` exit 0             |

---

## Remediation (bank-grade path to 9.2+)

| Priority | Action                                                | Unlocks                   |
| -------- | ----------------------------------------------------- | ------------------------- |
| P1       | Human files DTF-5.5.4 LOI/regulator letter (redacted) | Tier 5 commercial witness |
| P1       | Custodian publishes CORE-004 ceremony artifacts       | D3 M3.2 done              |
| P1       | Infra signs pen-test SOW + vendor test                | EXT-INF-002 live-stack    |
| P2       | Name Human Lead + SIGNAL-CORE-001                     | Agentic ownership ceiling |
| P2       | Close IC-T0 register items (ecosystem)                | GCR tier lift             |

**Not in-repo:** Pen-test report, SOC 2 opinion, sovereign pilot DPA — track in lane 3/5 indexes only.

---

## Index + `latest.json` update checklist

- [x] Forensic: `docs/audit/bank-grade-audit-2026-06-07.md` (this file)
- [x] Lane index: update [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md) canonical row
- [x] `docs/audit/latest.json` → `lanes.bankGrade` + `legacy.sourceAudit`
- [x] `pnpm readiness:lanes:check` exit 0
- [ ] Optional: overview README maturity line (composite band unchanged)

---

## Anti-drift

| Wrong claim              | Correct lane               |
| ------------------------ | -------------------------- |
| "Engineering 8.9"        | Lane 1 **10.0** signoff    |
| "GCR ready"              | **GCR-T0 BLOCKED** (IC-T0) |
| "Tier 5 commercial done" | DTF-5.5.4 Class S open     |
| "Pen-test done"          | Pack ack only; SOW Class S |
