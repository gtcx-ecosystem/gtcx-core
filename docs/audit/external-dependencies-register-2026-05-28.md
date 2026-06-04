---
title: 'gtcx-core — External Dependencies Register'
status: 'current'
date: '2026-05-28'
owner: 'gtcx-core'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'external', 'dependencies', '10-10']
review_cycle: 'weekly'
internal_readiness: 10.0
certified_composite: 8.9
---

# gtcx-core — External Dependencies Register

> **Lane 3 — External-dependent compliance** ([index](./external-dependent-compliance-2026-06-05.md)). Five-lane model: [readiness-model.md](./readiness-model.md).  
> **Lane 1 engineering:** **10.0/10** — [internal-10-10-signoff-2026-05-28.md](./internal-10-10-signoff-2026-05-28.md).  
> **Lane 4 bank-grade:** **8.9/10** — [master-audit-2026-06-03.md](./master-audit-2026-06-03.md).  
> **EXT-CORE-007–010** are **lane 5 GTM**, not lane 3 compliance.

---

## Scoring model

| Metric                  |    Score | Meaning                                                                                                  |
| ----------------------- | -------: | -------------------------------------------------------------------------------------------------------- |
| **Internal readiness**  | **10.0** | All repo-controlled gates, scripts, coverage thresholds, and internal remediation items complete at HEAD |
| **Certified composite** |  **8.9** | SCORING_FRAMEWORK weighted score including external attestation caps on Security / Enterprise            |

Certified composite reaches **10.0** only when **all rows below** reach status `complete` with linked evidence artifacts.

---

## Summary

| Category                       |  Count |   Open | Complete |
| ------------------------------ | -----: | -----: | -------: |
| Third-party assurance          |      3 |      3 |        0 |
| Organization / platform policy |      2 |      2 |        0 |
| Upstream supply chain          |      1 |      1 |        0 |
| Market / regulator engagement  |      5 |      5 |        0 |
| Time-based certification       |      1 |      1 |        0 |
| **Total**                      | **12** | **12** |    **0** |

---

## Itemized register

| ID               | Dependency                                                                 | Type                     | Owner                               | Blocker for                                    | Status                                                         | Target ETA                                      | Evidence when complete                                                                                                     | Score impact                   |
| ---------------- | -------------------------------------------------------------------------- | ------------------------ | ----------------------------------- | ---------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **EXT-CORE-001** | Penetration test — vendor selection, SoW, execution, retest                | Third-party assurance    | crypto-security-engineer            | Security ≥9.5; Enterprise ≥9.7                 | **open** — RFP approved, vendor not selected                   | 6–10 weeks after SoW                            | `docs/security/pen-test-report-2026.pdf` + closure in [pen-test-engagement-log.md](../security/pen-test-engagement-log.md) | Security −1.5; Enterprise −0.8 |
| **EXT-CORE-002** | SOC 2 Type I — CPA engagement, observation, report                         | Third-party assurance    | quality-evidence-lead               | Enterprise ≥9.5                                | **open** — readiness 78–85%, not contracted                    | 8–14 weeks                                      | Report in `docs/compliance/` + [soc2-engagement-log.md](../compliance/soc2-engagement-log.md)                              | Enterprise −0.7                |
| **EXT-CORE-003** | FIPS 140-3 boundary review — independent reviewer                          | Third-party assurance    | crypto-security-engineer            | Security narrative for sovereign buyers        | **open**                                                       | 4–6 weeks after engagement                      | Signed reviewer memo in `docs/security/`                                                                                   | Sovereign −0.3                 |
| **EXT-CORE-004** | GitHub org policy — grant `id-token: write` for npm provenance (Sigstore)  | Org / platform           | frontier-infra-engineer (requestor) | SLSA Build L3; Supply chain dimension          | **open** — org returns HTTP 409 on workflow permission change  | Org admin SLA                                   | `npm view @gtcx/crypto --json` shows `dist.attestations`; [slsa-attestation.md](../security/slsa-attestation.md)           | Supply chain −2.5              |
| **EXT-CORE-005** | npm registry publish with provenance — requires EXT-CORE-004 + `NPM_TOKEN` | Org / platform           | frontier-infra-engineer             | Same as EXT-CORE-004                           | **blocked** on EXT-CORE-004                                    | Same day after policy fix                       | Published versions with attestations on npm                                                                                | Supply chain −2.5              |
| **EXT-CORE-006** | `rustls-webpki` RUSTSEC-2026-0098/0099/0104 — AWS SDK upstream fix         | Upstream                 | crypto-security-engineer            | Security hygiene (documented exceptions today) | **open** — tracked in `rust/.cargo/audit.toml`                 | Vendor release                                  | `cargo audit` clean without exceptions                                                                                     | Security −0.2                  |
| **EXT-CORE-007** | Zimbabwe RBZ pre-submission email sent + response                          | Market / regulator       | GTM lead                            | Investor lens 10.0 narrative                   | **open** — drafted, not sent                                   | Business calendar                               | `docs/gtm/responses/zimbabwe-*.md` status `Sent` / `Response`                                                              | Investor −0.5                  |
| **EXT-CORE-008** | Namibia, Zambia, Ghana pre-submission emails                               | Market / regulator       | GTM lead                            | Investor lens                                  | **open**                                                       | Business calendar                               | Per-market response trackers                                                                                               | Investor −0.3                  |
| **EXT-CORE-009** | Regulator response in any pilot market                                     | Market / regulator       | GTM lead                            | Sovereign lens 10.0                            | **open**                                                       | 30–90 days post-send                            | First `Response received` in `docs/gtm/responses/`                                                                         | Sovereign −0.5                 |
| **EXT-CORE-010** | Live pilot case study                                                      | Market / product         | GTM lead                            | GTM evidence pack                              | **deferred** — no pilot yet                                    | Post-pilot                                      | `docs/gtm/case-studies/`                                                                                                   | GTM −0.2                       |
| **EXT-CORE-011** | DR runbook **live** drill with witness (not tabletop only)                 | Operational / cross-team | frontier-infra-engineer             | Enterprise readiness                           | **open**                                                       | Coordinate with gtcx-infrastructure EXT-INF-006 | Joint drill report linked from both repos                                                                                  | Enterprise −0.3                |
| **EXT-CORE-012** | 90-day P1-free stability window                                            | Time-based               | quality-evidence-lead               | Reference-grade certification (Protocol 16)    | **in progress** — started 2026-05-19, completes **2026-08-17** | 2026-08-17                                      | `docs/audit/` stability attestation                                                                                        | Composite cap −0.2 if broken   |

---

## Cross-repo dependencies (infra / protocols)

| ID               | Upstream repo       | What gtcx-core needs                                                           | Register link                                                    |
| ---------------- | ------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **EXT-CORE-X01** | gtcx-infrastructure | WORM release evidence chain for institutional buyers citing infra attestations | gtcx-infrastructure external register (EXT-INF-003, EXT-INF-005) |
| **EXT-CORE-X02** | gtcx-protocols      | Staging DID HTTP resolution (INF-49) for ecosystem integration proof           | EXT-INF-004                                                      |

---

## Repo-side materials ready (not external completion)

| Track                | Status                 | Artifact                                                                                                                   |
| -------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Pen-test RFP + scope | Ready                  | [pen-test-rfp-2026.md](../security/pen-test-rfp-2026.md), [pen-test-scope.md](../security/pen-test-scope.md)               |
| Pen-test shortlist   | Ready                  | [pen-test-vendor-shortlist.md](../security/pen-test-vendor-shortlist.md)                                                   |
| SOC 2 readiness      | Ready                  | [soc2-readiness.md](../compliance/soc2-readiness.md), [soc2-evidence-pipeline.md](../compliance/soc2-evidence-pipeline.md) |
| SLSA workflow        | Ready (blocked at org) | `.github/workflows/release.yml`, [10-10-remediation-plan-2026-05-27.md](./10-10-remediation-plan-2026-05-27.md) §1         |
| Internal gates       | **Complete**           | [internal-10-10-signoff-2026-05-28.md](./internal-10-10-signoff-2026-05-28.md)                                             |

---

## Certified 10.0 exit checklist (external only)

- [ ] EXT-CORE-001 closed (pen-test retest clean)
- [ ] EXT-CORE-002 closed (SOC 2 Type I report)
- [ ] EXT-CORE-004 + EXT-CORE-005 closed (npm attestations live)
- [ ] EXT-CORE-012 complete (90-day P1-free)
- [ ] At least one of EXT-CORE-007..009 shows regulator engagement evidence
- [ ] Independent master re-audit with composite ≥9.8 and no caps

---

## Review log

| Date       | Action                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| 2026-05-28 | Initial register — internal 10.0 signoff + certified 8.9 reconciliation |
