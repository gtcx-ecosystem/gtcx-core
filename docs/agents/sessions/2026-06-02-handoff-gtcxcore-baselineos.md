---
title: 'Cross-Repo Handoff — 10/10 Moat Progress + Coordination Update'
date: '2026-06-02'
from: 'gtcx-core'
to: 'baseline-os'
scope: 'Moat score update, Zimbabwe email status, provenance priority'
tags: ['handoff', 'gtcx-core', 'baseline-os', '10-10-moat', 'coordination']
status: 'open'
---

# Cross-Repo Handoff — gtcx-core → baseline-os

## Summary

gtcx-core algorithmic moat score: **8.2 → 8.5** (D2: 9→10, D6: 8→9, D10: 8→9).
No new blockers. Two coordination items need routing.

---

## Item 1 — Zimbabwe Email Gates (still pending human action)

**Source:** `baseline-os/workstream/coordination/inbound/from-gtcx-core-2026-05-26.md`
**Status:** Unchanged since 2026-05-26. 6 of 8 gates still need human owners.

| Gate                             | Owner              | Status   |
| -------------------------------- | ------------------ | -------- |
| Trust portal URL live            | —                  | **PASS** |
| npm packages published           | —                  | **PASS** |
| Recipient address verified       | GTM Lead           | **OPEN** |
| Engagement-lead name designated  | GTM Lead           | **OPEN** |
| Sender name + title designated   | Protocol Architect | **OPEN** |
| Pen-test SoW state confirmed     | Security Lead      | **OPEN** |
| SOC 2 CPA letter state confirmed | Compliance Lead    | **OPEN** |
| Protocol Architect approval      | Protocol Architect | **OPEN** |

**Action for baseline-os:** Route to owners if not already done. No technical work.

---

## Item 2 — SLSA Provenance Priority Decision Needed

**Status:** Confirmed missing on all `@gtcx/*` packages.
**Question:** Is Build L3 (provenance attestations) a hard requirement for regulator submission?

**If YES:**

- gtcx-infrastructure must fix CI pipeline before next publish
- Estimate: 1–2 days (OIDC token + changeset publish behavior)

**If NO:**

- Document exception in compliance package
- Move on; current Source L2 + manual artifact signing is sufficient

**Action for baseline-os:** Quality & Evidence lead to confirm regulator requirement and report back.

---

## Item 3 — 10/10 Roadmap External Dependency Tracking

Two dimensions remain at 0/10 and require external resources:

| Dimension              | Milestones              | Resource Needed                       | ETA       |
| ---------------------- | ----------------------- | ------------------------------------- | --------- |
| D8 Formal Verification | M8.1–M8.6               | Z3/Coq consultant                     | 2–3 weeks |
| D9 Third-Party Audit   | M9.1–M9.5               | Crypto audit vendor                   | 4–6 weeks |
| D7 M7.5                | Side-channel assessment | External lab                          | 2–3 weeks |
| D10 M10.3              | Regulator attestation   | African regulator / NIST CMVP liaison | 2 weeks   |

**Action for baseline-os:** Track vendor SOW status. gtcx-core has pen-test RFP drafted (`docs/security/pen-test-rfp-2026.md`) but vendor not selected.

---

## No Action Needed

- No downstream repos are blocked by gtcx-core changes
- gtcx-platforms staging confirmed: no additional protocols evidence gates required
- All API changes are additive (no breaking changes)

## References

- `gtcx-core/docs/audit/moat-dimension-roadmap-10-10.md` — full roadmap
- `baseline-os/workstream/coordination/inbound/from-gtcx-core-2026-05-26.md` — original coordination ticket
- `gtcx-core/docs/security/pen-test-rfp-2026.md` — RFP draft
