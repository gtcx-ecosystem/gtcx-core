---
title: 'Cross-repo sprint workplan — gtcx-core obligations (June 2026)'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-SPRINT-CORE-001
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: weekly
tier: standard
tags: ['coordination', 'sprint', 'cross-repo', 'workplan']
---

# Cross-repo sprint workplan — gtcx-core obligations (June 2026)

**Planning lens:** Upstream obligations, external vendor coordination, and release-gated work for the GTCX ecosystem cryptographic foundation.  
**Sprint horizon:** 2026-06-03 → 2026-06-28  
**Bridge (live):** [`cross-repo-agent-bridge.md`](cross-repo-agent-bridge.md)

**Assessment key:**

| Status          | Meaning                                      |
| --------------- | -------------------------------------------- |
| **done**        | Acceptance met; no further cross-repo action |
| **ready**       | Unblocked; owner can start                   |
| **in-progress** | Active work in owning repo                   |
| **blocked**     | Waiting on named dependency                  |
| **deferred**    | Explicitly post-pilot / post-sprint          |

| Risk       | Meaning                                   |
| ---------- | ----------------------------------------- |
| **R-high** | Blocks multiple repos or production trust |
| **R-med**  | Blocks one consumer or staging path       |
| **R-low**  | Polish, docs, or parallel track           |

---

## Sprint map

| Sprint       | Dates (target)                | Theme                           | Exit criteria                                                       |
| ------------ | ----------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| **S-CORE-1** | 2026-06-03 → 06-07            | **Staging sync + provenance**   | EAP bundle synced; provenance investigation started                 |
| **S-CORE-2** | 2026-06-08 → 06-14            | **Vendor engagement + D3 prep** | Audit SOW signed; Z3/Coq consultant engaged; D3 test scaffold ready |
| **S-CORE-3** | 2026-06-15 → 06-21            | **INF-86 ceremony support**     | Transcript verification test ready; VK hash published               |
| **S-CORE-4** | 2026-06-08 → 06-28 (parallel) | **Documentation + registry**    | Machine-readable docs for all new packages; Protocol 22 CI          |

---

## Master dependency register (gtcx-core obligations)

| Work ID  | Title                                          | Owner                    | Sprint   | Status            | Risk   | Depends on        | Blocks             |
| -------- | ---------------------------------------------- | ------------------------ | -------- | ----------------- | ------ | ----------------- | ------------------ |
| CORE-001 | EAP auth-keys bundle sync (staging)            | gtcx-core                | S-CORE-1 | **done**          | R-med  | —                 | XR-201 / INT-S3-08 |
| CORE-002 | SLSA provenance CI investigation               | gtcx-infrastructure      | S-CORE-1 | **open**          | R-med  | Priority decision | Build L3 claim     |
| CORE-003 | `@gtcx/zkp-kat-vectors` downstream consumption | gtcx-protocols           | S-CORE-2 | **open**          | R-low  | —                 | M6.5 validation    |
| CORE-004 | D3 trusted-setup transcript verification       | gtcx-core                | S-CORE-3 | **release-gated** | R-med  | Ceremony complete | D3 9.5 → 10        |
| CORE-005 | Pen-test vendor selection + SOW                | baseline-os / Security   | S-CORE-2 | **blocked**       | R-high | Vendor responses  | D9 completion      |
| CORE-006 | Z3/Coq formal verification consultant          | baseline-os / Security   | S-CORE-2 | **blocked**       | R-high | Sourcing          | D8 completion      |
| CORE-007 | Side-channel analysis lab (D7 M7.5)            | baseline-os / Security   | S-CORE-2 | **blocked**       | R-med  | Vendor selection  | D7 9 → 10          |
| CORE-008 | Regulator attestation / NIST CMVP liaison      | GTM / Protocol Architect | S-CORE-2 | **blocked**       | R-med  | Introduction      | D10 9 → 10         |
| CORE-009 | Zimbabwe email human gate routing              | baseline-os / GTM        | S-CORE-1 | **blocked**       | R-low  | 6 human approvals | —                  |
| CORE-010 | gtcx-core `agent:next-work` CI (P22 W2)        | gtcx-core                | S-CORE-4 | **ready**         | R-low  | —                 | Agent ergonomics   |
| CORE-013 | M10.2 runtime FIPS enforcement for BLAKE3      | gtcx-core                | S-CORE-1 | **done**          | R-med  | —                 | D10 9 → 9.5        |
| CORE-011 | EAP admin rotate + redacted export             | gtcx-core                | —        | **done**          | —      | —                 | —                  |
| CORE-012 | EAP bundle sync CLI implementation             | gtcx-core                | —        | **done**          | —      | —                 | —                  |

---

## Sprint S-CORE-1 — Staging sync + provenance (2026-06-03 → 06-07)

### Goal

Execute EAP bundle sync for staging; initiate SLSA provenance investigation.

### Work items

#### CORE-001 — EAP auth-keys bundle sync

| Field          | Value                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Owner**      | gtcx-core                                                                                  |
| **Assessment** | **ready** — CLI implemented, AWS SM permissions verified                                   |
| **Command**    | `cd packages/eap && EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 pnpm eap:sync-bundle`     |
| **Acceptance** | `gtcx/intelligence/staging/auth-keys` secret updated; key count > 0; infra ESO refresh ack |
| **Ping**       | Notify gtcx-infrastructure same day for ESO force-refresh                                  |

#### CORE-002 — SLSA provenance investigation (infra-owned)

| Field          | Value                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Owner**      | gtcx-infrastructure                                                                                    |
| **Assessment** | **open** — awaiting priority decision from Quality & Evidence lead                                     |
| **Plan**       | Investigate CI pipeline: `id-token: write`, OIDC exchange, `changeset publish --provenance` forwarding |
| **Acceptance** | At least one `@gtcx/*` package published with `dist.attestations`                                      |
| **Blocker**    | Is Build L3 a hard requirement for regulator submission?                                               |

#### CORE-009 — Zimbabwe email gate routing

| Field          | Value                                                 |
| -------------- | ----------------------------------------------------- |
| **Owner**      | baseline-os / GTM Lead                                |
| **Assessment** | **blocked** — 6 of 8 human gates remain               |
| **Plan**       | Route each gate to owner; no technical work           |
| **Acceptance** | Email sent; sandbox@rbz.co.zw bounce/confirm received |

---

## Sprint S-CORE-2 — Vendor engagement + D3 prep (2026-06-08 → 06-14)

### Goal

Engage external vendors for remaining 10/10 gaps; prepare D3 transcript verification scaffold.

### Work items

| ID       | Owner                    | Task                                                      | Status  |
| -------- | ------------------------ | --------------------------------------------------------- | ------- |
| CORE-005 | Security / baseline-os   | Select pen-test vendor from RFP; sign SOW                 | blocked |
| CORE-006 | Security / baseline-os   | Source Z3/Coq formal-methods consultant                   | blocked |
| CORE-007 | Security / baseline-os   | Source side-channel analysis lab                          | blocked |
| CORE-008 | GTM / Protocol Architect | African regulator introduction; NIST CMVP liaison         | blocked |
| CORE-003 | gtcx-protocols           | Add `@gtcx/zkp-kat-vectors` devDep + one integration test | open    |
| CORE-010 | gtcx-core                | Add `agent:next-work` to GitHub Actions workflow          | ready   |

---

## Sprint S-CORE-3 — INF-86 ceremony support (2026-06-15 → 06-21)

### Goal

Support production key ceremony with cryptographic verification.

### Sequence

```
XR-401 (human algorithm decision)
  → XR-402 (infra ceremony + SPKI export)
  → CORE-004 (gtcx-core transcript verification test)
  → XR-403 (protocols bog.json + evidence)
```

#### CORE-004 — D3 trusted-setup transcript verification

| Field          | Value                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**      | gtcx-core                                                                                                                        |
| **Assessment** | **release-gated** — runs only after ceremony produces transcript                                                                 |
| **Plan**       | Implement `cargo test --features trusted-setup-verify` that re-derives VK from transcript and confirms hash matches KAT artifact |
| **Acceptance** | Test passes; VK hash documented in protocol docs                                                                                 |
| **Blocker**    | Ceremony completion (XR-402)                                                                                                     |

---

## Sprint S-CORE-4 — Documentation + registry (parallel)

### Goal

Machine-readable docs for all new packages; Protocol 22 CI integration.

| ID       | Owner     | Task                                              | Status |
| -------- | --------- | ------------------------------------------------- | ------ |
| CORE-010 | gtcx-core | `agent:next-work` in CI                           | ready  |
| —        | gtcx-core | Machine-readable docs for `@gtcx/zkp-kat-vectors` | done   |
| —        | gtcx-core | Machine-readable docs for EAP sync CLI            | done   |

---

## Risk register (gtcx-core obligations)

| Risk                                     | Likelihood | Impact | Mitigation                                                               |
| ---------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------ |
| EAP sync fails due to AWS SM permissions | Low        | Med    | Test with `--dry-run` first; verify IAM                                  |
| Vendor selection slips past June         | Med        | High   | Parallel track: engage multiple vendors; fallback to internal assessment |
| INF-86 ceremony delayed                  | Med        | Med    | CORE-004 stays gated; D3 remains at 9.5                                  |
| Provenance not required by regulator     | Med        | Low    | Defer to post-pilot; document as aspirational                            |

---

## Reporting

| Action             | Command / location                                                               |
| ------------------ | -------------------------------------------------------------------------------- |
| Bridge update      | Edit [`cross-repo-agent-bridge.md`](cross-repo-agent-bridge.md) § Latest updates |
| Work ID completion | Update Status column in this file + bridge entry                                 |
| Blocker            | `baseline-os` `pnpm ecosystem:repo:report-work`                                  |

---

## Changelog

| Date       | Change                                                     |
| ---------- | ---------------------------------------------------------- |
| 2026-06-03 | Initial workplan from ecosystem coordination folder review |
