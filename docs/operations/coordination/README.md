---
title: 'Cross-repo coordination — gtcx-core'
status: current
date: 2026-06-03
owner: gtcx-core
document_id: COORD-README-CORE-001
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
---

# Cross-repo coordination — gtcx-core

**Purpose:** Index for all cross-repo coordination artifacts originating from or affecting `gtcx-core`. gtcx-core is the upstream cryptographic and protocol foundation for the GTCX ecosystem. It has **no downstream blockers** but maintains obligations to 4+ consumer repos.

**Created:** 2026-06-03 (gap closure — gtcx-core previously lacked `docs/operations/coordination/`).

---

## Artifact index

| File                                                                                                           | Role                                                                    |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`cross-repo-agent-bridge.md`](cross-repo-agent-bridge.md)                                                     | **Live snapshot** — what changed, what is blocked, who owns next action |
| [`cross-repo-sprint-workplan-2026-06.md`](cross-repo-sprint-workplan-2026-06.md)                               | Sprint backlog, XR-ID alignment, gtcx-core obligations                  |
| [`remaining-cross-repo-work-2026-06-02.md`](remaining-cross-repo-work-2026-06-02.md)                           | Itemized open items with owner, priority, effort, blocker               |
| [`to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md`](to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md) | **Outbound ticket** — EAP bundle sync done; ESO refresh requested       |
| [`../../agents/sessions/index.md`](../../agents/sessions/index.md)                                             | Agent handoff index (10/10 roadmap, downstream handoffs)                |

**Ecosystem canonicals:**

- SoR bridge: `gtcx-protocols/docs/operations/coordination/cross-repo-agent-bridge.md`
- Blockers: `baseline-os/workstream/index/blockers.md`
- Coordination reports: `baseline-os/workstream/coordination/coordination-report-latest.md`

---

## gtcx-core in the ecosystem

```
baseline-os (governance hub)
    │
    ▼
gtcx-core (cryptographic foundation — this repo)
    │
    ├──► gtcx-protocols     (protocol layer, ZKP consumption)
    ├──► gtcx-infrastructure (CI, provenance, EAP sync)
    ├──► gtcx-intelligence  (EAP Phase B consumer)
    ├──► gtcx-platforms     (sovereign runtime)
    └──► baseline-os        (vendor tracking, Zimbabwe gate)
```

**Rule:** gtcx-core does not block any downstream repo on code. All open items are either:

- **Downstream consumption** (protocols installs KAT package, infra runs sync)
- **External/vendor** (audit, formal verification, regulator)
- **Release-gated** (D3 transcript verification runs only at ceremony)

---

## Quick status (gtcx-core obligations)

| #   | Item                                | To                   | Priority | Status        | Next action                            |
| --- | ----------------------------------- | -------------------- | -------- | ------------- | -------------------------------------- |
| 1   | EAP auth-keys bundle sync           | gtcx-infrastructure  | P1       | ready         | Run `pnpm eap:sync-bundle` staging     |
| 2   | SLSA provenance CI fix              | gtcx-infrastructure  | P1/P2    | open          | Infra investigates OIDC/npm provenance |
| 3   | `@gtcx/zkp-kat-vectors` consumption | gtcx-protocols       | P2       | open          | Protocols adds devDep + test           |
| 4   | D3 transcript verification          | gtcx-core (internal) | P2       | release-gated | Implement after ceremony               |
| 5   | External vendor tracking            | baseline-os          | P1       | open          | Human/vendor selection                 |
| 6   | Zimbabwe email gate routing         | baseline-os          | P1       | open          | Human approvals                        |

_Last update: 2026-06-03_
