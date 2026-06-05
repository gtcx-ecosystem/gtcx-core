---
title: 'GTCX Core — 10/10 Remediation Roadmap Appendix'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['agile', 'roadmap', 'risk']
review_cycle: 'on-change'
---

# GTCX Core — 10/10 Remediation Roadmap Appendix

> Parent: [10/10 Remediation Sprint Roadmap](./10-10-remediation-sprint-roadmap-2026-05-27.md)

## 10. Risk Register with Triggers

| Risk                                      | Likelihood | Impact   | Trigger                                   | Mitigation                                                    | Escalation                         |
| ----------------------------------------- | ---------- | -------- | ----------------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| Org denies `id-token: write`              | Medium     | High     | No response by S47 mid-sprint             | Document manual Sigstore fallback; accept 9.8 cap on Security | Product Lead → Org admin           |
| Pen-test vendor scheduling slips >2 weeks | High       | Critical | No SOW signed by S47 end                  | Expand shortlist to 5 vendors; consider remote-first firms    | Security Lead → CTO                |
| Pen-test finds Critical vuln              | Low        | Critical | Report received with Critical finding     | Incident runbook; 48-hour response SLA; rapid patch release   | Security Lead → Protocol Architect |
| CPA finds gaps not in readiness analysis  | Medium     | Medium   | SOC 2 readiness assessment flags new gaps | 6-week buffer; honest gap documentation                       | Compliance Lead → CFO              |
| Regulator response is "no"                | Medium     | Medium   | First market responds negatively          | 5 markets in pipeline; iterate pitch; seek intro via partner  | GTM Lead → Product Lead            |
| rustls-webpki upstream fix delayed        | High       | Low      | No fix by S49                             | Documented exceptions accepted by `cargo audit`; tracked      | Rust Lead → Protocol Architect     |
| CI billing exceeds budget                 | Medium     | High     | Monthly CI cost >2x baseline              | Self-hosted runners fallback documented; optimize test matrix | DevOps → CTO                       |
| Key contributor unavailable               | Medium     | Medium   | Sprint owner PTO >3 days                  | Cross-train on critical path items; pair programming          | Team Lead → Protocol Architect     |

---

## 11. Contingency Planning

### If SLSA Provenance Remains Blocked

| Scenario                                 | Action                                                                            | Impact on Score                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Org denies `id-token: write` permanently | Document manual Sigstore signing procedure; add `cosign` step to release workflow | Security drops to 9.0 (from 10.0); composite caps at 9.8 |
| Org approves but with restrictions       | Test restricted permissions; document exact configuration                         | None — full 10.0 achievable                              |
| Org requests security review             | Provide SLSA provenance whitepaper; schedule 30-min review                        | Delay S47-S48 by 1 sprint                                |

### If Pen-Test Vendor Selection Fails

| Scenario                              | Action                                                                        | Impact on Score                              |
| ------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| No vendor available in budget         | De-scope to automated pen-test (OWASP ZAP, Burp Suite) + external code review | Security drops to 9.0; composite caps at 9.7 |
| Vendor available but 6-week lead time | Accept delay; start S48 work in parallel; shift S50-S51 right                 | Timeline extends to 16 weeks                 |
| Vendor finds Critical vuln            | Execute incident response; fix in hotfix sprint; re-test                      | Timeline extends by 2-4 weeks                |

---

## 12. Parking Lot (Out of Scope for 10.0)

| ID       | Item                                                          | Why Deferred                                             | Target Sprint |
| -------- | ------------------------------------------------------------- | -------------------------------------------------------- | ------------- |
| PARK-001 | Barrel export refactoring (14 files)                          | Engineering effort >3 days; not scored in audit          | Post-10.0     |
| PARK-002 | Full integration test matrix across all downstream repos      | Requires 5d+ platform work; smoke tests suffice for 10.0 | Post-10.0     |
| PARK-003 | Case study from live pilot                                    | No pilot running yet                                     | Post-10.0     |
| PARK-004 | Replace `actions/checkout@v4` with Node 24-compatible version | Warning only; no functional impact                       | S47           |
| PARK-005 | Add `pnpm api:update-baseline` to changeset version hook      | Process improvement; not scored                          | S48           |
| PARK-006 | Self-hosted runner migration for CI cost control              | Budget optimization; not readiness-critical              | Post-10.0     |

---

## 13. Tracking Mechanism

### Weekly Standup (15 min, async)

**Format:** Update `01-docs/05-audit/agile/sprints/current.md` with:

- What did you complete since last standup?
- What are you working on next?
- Any blockers?

### Sprint Review (1 hour, end of sprint)

**Attendees:** All sprint owners + Protocol Architect
**Agenda:**

1. Demo completed work (5 min per owner)
2. Review sprint metrics (score trajectory, CI pass rate, ops:check)
3. Update risk register
4. Plan next sprint

### Sprint Retrospective (30 min, end of sprint)

**Format:** Start / Stop / Continue
**Output:** Action items for next sprint

### Score Tracking

Update the score trajectory table after each sprint review:

```bash
# Run before each sprint review
pnpm ops:check
pnpm docs:check-frontmatter
pnpm docs:check-links
pnpm api:check
```

---

## 14. Cross-References

- [Master audit 2026-05-27](../../audit/master-audit-2026-05-27.md)
- [10/10 Remediation Plan](../../audit/10-10-remediation-plan-2026-05-27.md)
- [Current Sprint](../sprints/current.md)
- [Team Definition](../team.md)
- [Backlog](../backlog.md)
- [Engagement Readiness Roadmap](./engagement-readiness-sprint-roadmap-2026-05-22.md)
- [Trust Portal](../../governance/trust-portal.md)

---

_Roadmap generated: 2026-05-27_
_Next review: 2026-05-31 (S46 Sprint Review)_
