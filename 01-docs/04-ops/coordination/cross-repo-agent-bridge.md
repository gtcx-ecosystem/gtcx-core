---
title: 'Cross-repo agent bridge — gtcx-core upstream hub'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-BRIDGE-CORE-001
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'bridge', 'agents', 'cross-repo']
---

# Cross-repo agent bridge — gtcx-core

**Purpose:** Single place for agents working in **gtcx-core** to read ecosystem cross-repo state, post updates, and see downstream obligations without opening 15 repos.

**Maintained by:** gtcx-core agents. **Ecosystem canonical bridge:** `gtcx-protocols/01-docs/04-ops/coordination/cross-repo-agent-bridge.md` — mirror P0 changes there when closing ecosystem blockers.

| Artifact                                                                             | Role                                    |
| ------------------------------------------------------------------------------------ | --------------------------------------- |
| **This file**                                                                        | Live snapshot + communication rules     |
| [`cross-repo-sprint-workplan-2026-06.md`](cross-repo-sprint-workplan-2026-06.md)     | Sprint backlog, XR-ID alignment         |
| [`remaining-cross-repo-work-2026-06-02.md`](remaining-cross-repo-work-2026-06-02.md) | Open items with owner, priority, effort |
| [`../../01-agents/sessions/index.md`](../../01-agents/sessions/index.md)             | Agent handoff index                     |

---

## How agents use this bridge

1. **Session start:** Read **Latest updates** (below) + open your repo's `remaining-cross-repo-work` doc.
2. **Before cross-repo work:** Check workplan item `XR-*` status; do not duplicate work another agent owns.
3. **After material change:** Append one line to **Latest updates** below (not a separate log file — gtcx-core uses this bridge as single artifact).
4. **P0 ecosystem blocker:** Report `baseline-os` `pnpm ecosystem:repo:report-work --status=blocked` + file inbound ticket per Protocol 24.
5. **Do not** paste deployment-proof tables or normative protocol text here — link only.

---

## Failure taxonomy (SIGNAL-E)

Classify agent/coordination failures for bridge rows and remediation. **Do not** paste secrets.

| Class               | When                                         | Example                                 | Remediation                        |
| ------------------- | -------------------------------------------- | --------------------------------------- | ---------------------------------- |
| `witness-drift`     | Witness doc stale vs hub state               | Outbound ack missing after infra deploy | File outbound + update Latest row  |
| `gate-fail`         | V-ladder or `agent:protocols:check` exit ≠ 0 | protocols check failed                  | Fix in-session; log command + exit |
| `class-s-violation` | Agent attempted Class S work                 | LOI signature by agent                  | Stop; witness only; human gate     |
| `cross-repo-stale`  | Sibling repo layout drift                    | Missing shim import                     | Fix import + cross-repo-deps check |
| `import-drift`      | Broken sibling script path                   | `suggest-persona.mjs` path              | Resolver + gtcx-agentic shim       |

### Logged incidents

| When (UTC) | Class          | Persona / agent | Gate / story                        | Remediation                               |
| ---------- | -------------- | --------------- | ----------------------------------- | ----------------------------------------- |
| 2026-06-05 | `import-drift` | Cursor agent    | `pnpm agent:protocols:check` exit 1 | SIGNAL-CORE-011 — resolver + agentic shim |

---

## Latest updates (newest first)

| When (UTC) | Agent / repo      | Update                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-05 | gtcx-core         | **SIGNAL Phase 1** — suggest-persona import resolver (SIGNAL-CORE-011); agent PR checklist; failure taxonomy; session gate metrics in auto-dev-data. Protocols gate restore pending verify. Human Lead still **TBD** (SIGNAL-CORE-001).                                                                                                                                                                                                                                              |
| 2026-06-07 | gtcx-core         | **DTF-5.5.4 tracker** — [`dtf-554-commercial-gate-tracker-2026-06-07.md`](./dtf-554-commercial-gate-tracker-2026-06-07.md) (Class S witness). P22 backlog clear; commercial ceiling unchanged.                                                                                                                                                                                                                                                                                       |
| 2026-06-07 | gtcx-core         | **EXT-INF-002 pack ack** — inbound [`from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md`](./from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md). Core automatable work **done**; SOW Class S remains infra. Manifests refreshed (`vendor-evidence` + `certified-pack` verify exit 0).                                                                                                                                                                                        |
| 2026-06-07 | gtcx-core         | **OI-X02 closed** — inbound [`from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md`](./from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md) (infra hub log `2026-06-04T23:50Z`). Witness queue empty. **EXT-INF-002** still Class S on infra (SOW). P22 Class S wall: DTF-5.5.4, CORE-004-CEREMONY.                                                                                                                                                                             |
| 2026-06-07 | gtcx-core         | **Infra ack rollup** — [`to-gtcx-infrastructure-open-acks-rollup-2026-06-07.md`](./to-gtcx-infrastructure-open-acks-rollup-2026-06-07.md) (OI-X02 + EXT-INF-002). Command lookup template fixed ecosystem-wide. P22 witness — Class S only.                                                                                                                                                                                                                                          |
| 2026-06-05 | gtcx-core         | **EXT-INF-002 outbound** — [`to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md`](./to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md) (FA-S6-02, 22 artifacts). Ecosystem push + cursor permissions rollout executed. P22 witness — Class S wall (DTF-5.5.4, CORE-004-CEREMONY).                                                                                                                                                                               |
| 2026-06-04 | gtcx-core         | **execute-roadmap** — FA-S6-02 vendor pen-test pack manifest (`pnpm vendor-evidence:verify-manifest` exit 0); LAUNCH-PLAN bout done; P22 Class S wall. EXT-INF-002 core input ready for infra.                                                                                                                                                                                                                                                                                       |
| 2026-06-04 | gtcx-core         | **LAUNCH-PLAN bout** — `pnpm agent:reconcile-launch` exit 0; execution-roadmap + bridge refresh. **CORE-004 Class R closed** — ceremony Class S parallel. **P22** plan mode (5 items). **baseline start** SSOT rolled via gtcx-agentic.                                                                                                                                                                                                                                              |
| 2026-06-04 | gtcx-core         | **Kimi skills parity** — 22 project skills (`.kimi/skills/`, `pnpm kimi:skills:check`). **CORE-004** verify-publish gate `pnpm ops:trusted-setup:verify-publish`; bout check-in — ceremony `transcript.seed` pending custodian. **P22** DTF-5.5.4 Class S. Launch reconcile + execution-roadmap refresh.                                                                                                                                                                             |
| 2026-06-06 | gtcx-core         | **Launch focus** provisioned (`pnpm agent:launch:check`) — GTM north star + work set in `.baseline/launch-focus.json`. **OI-X02** core **done** (outbound filed); witness infra hub ack. **CORE-004** engineering green — ceremony checklist [`core-004-ceremony-publish-checklist.md`](./core-004-ceremony-publish-checklist.md). Tier 5 commercial: **DTF-5.5.4** Class S.                                                                                                         |
| 2026-06-03 | gtcx-core         | **OI-X02 outbound** — ER-1-08 infra hub ack requested [`to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md`](./to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md). Master audit P2 closed: network badges + overview matrix (`0b572f8`). CORE-004 still blocked XR-402.                                                                                                                                                                                                         |
| 2026-06-03 | gtcx-core         | **Master audit refresh 8.9/10** @ `a48b0c7` — all in-repo gates green; doc/repo hygiene 9.6; Tier 5 technical ~88%; CORE-004 blocked XR-402. [`master-audit-2026-06-03.md`](../../audit/master-audit-2026-06-03.md) · overview Phase 7 updated.                                                                                                                                                                                                                                      |
| 2026-06-03 | gtcx-core         | **Doc-standard + repo hygiene execute pass** — compliance **9.6/10** (`30d1075` agile splits, `f512c0d` hygiene P1–P4); `pnpm docs:check-frontmatter` 279/279 · `pnpm check:workspace-root-cleanliness:strict` PASS. Infra validate-all gate #2 (Docs Standard) **closed on core side** — mirror [`from-gtcx-infrastructure-validate-all-mirror-2026-06-03.md`](./from-gtcx-infrastructure-validate-all-mirror-2026-06-03.md).                                                       |
| 2026-06-05 | gtcx-intelligence | **DTF-5.4.4 witness-only** — mirror [`5142ff8`](https://github.com/gtcx-ecosystem/gtcx-intelligence/commit/5142ff8); [`from-gtcx-core-dtf-5-4-4-witness-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-intelligence/blob/main/01-docs/04-ops/coordination/from-gtcx-core-dtf-5-4-4-witness-2026-06-05.md); no intel code. **P22** `backlogClear` — **P22-EVID-03**, S11-03, H-03 still blocked ↔ **INT-S9-01** / OI-B08 (Wire #2 staging creds). Next intel: **INT-S9-06**.  |
| 2026-06-05 | gtcx-core         | **S-T5-4 / DTF-5.4.4 closed** — protocols witness [`73eaff2b`](https://github.com/gtcx-ecosystem/gtcx-protocols/commit/73eaff2b); inbound [`from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md); core ack [`to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md`](./to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md) · helper `fc041a6`. |
| 2026-06-03 | gtcx-core         | **D4 DONE** — Backward compat M4.1. Cross-API test: `proveDiamondOrigin()` → `verifyCommodityOrigin()` passes (mocked + native). D4 9→10.                                                                                                                                                                                                                                                                                                                                            |
| 2026-06-03 | gtcx-core         | **D5 DONE** — RNG entropy audit M5.1 + non-determinism M5.2. `RNG.md` documents hierarchy; 100 proofs all distinct in ~26s. D5 9→10.                                                                                                                                                                                                                                                                                                                                                 |
| 2026-06-03 | gtcx-core         | **M10.2 DONE** — Runtime FIPS enforcement for BLAKE3. Centralized `03-platform/src/fips.rs`, raw blake3 returns `Result`. 63 crypto tests pass. D10 9→9.5.                                                                                                                                                                                                                                                                                                                           |
| 2026-06-03 | gtcx-core         | Coordination folder created (`01-docs/04-ops/coordination/`). Bridge + workplan + remaining-work docs established. 6 open cross-repo obligations tracked.                                                                                                                                                                                                                                                                                                                            |
| 2026-06-03 | gtcx-core         | 10/10 cryptographic defensibility: D1=10, D2=10, D4=10, D5=10, D6=10, D7=9, D10=9.5. Overall ≈ 8.95/10. External/vendor gaps remain.                                                                                                                                                                                                                                                                                                                                                 |
| 2026-06-03 | gtcx-core         | `@gtcx/zkp-kat-vectors@1.0.0` published in workspace. Awaiting gtcx-protocols consumption.                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-06-02 | gtcx-core         | Handoffs created for gtcx-protocols, gtcx-infrastructure, baseline-os. Master tracker: `01-docs/01-agents/sessions/2026-06-02-remaining-cross-repo-work.md`.                                                                                                                                                                                                                                                                                                                         |

---

## Critical path (gtcx-core lens)

```mermaid
flowchart TB
  subgraph core [gtcx-core obligations]
    C1[EAP bundle sync staging]
    C2[SLSA provenance investigation]
    C3[D3 transcript verification — release-gated]
  end
  subgraph downstream [Downstream / external]
    D1[gtcx-infrastructure ESO refresh]
    D2[gtcx-protocols KAT consumption]
    D3[baseline-os vendor tracking]
    D4[Human: Zimbabwe email gate]
  end
  C1 --> D1
  C2 --> D3
```

| Priority | Work ID       | Owner               | Next action                                                                                      | Unblocks                     |
| -------- | ------------- | ------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- |
| **P1**   | EAP-SYNC      | gtcx-core           | **done** 2026-06-03 — bundle synced; infra ESO refresh acked; region mismatch fixed              | — (XR-202/INT-S3-08 closed)  |
| **P1**   | PROVENANCE    | gtcx-infrastructure | Investigate OIDC token exchange for `--provenance` publish                                       | Build L3 SLSA claim          |
| **P1**   | VENDORS       | baseline-os         | Select pen-test vendor; source Z3/Coq consultant; source side-channel lab                        | D8, D9, D7 M7.5 completion   |
| **P2**   | KAT-CONSUME   | gtcx-protocols      | **done** — DTF-5.4.4 E2E + KAT consumption (`73eaff2b`)                                          | M6.5 downstream validation   |
| **P2**   | D3-TRANSCRIPT | gtcx-core           | **partial** — `trusted-setup-verify` CI green; publish `artifacts/trusted-setup/transcript.seed` | D3 9.5 → 10 after transcript |

Full backlog: [`cross-repo-sprint-workplan-2026-06.md`](cross-repo-sprint-workplan-2026-06.md)

---

## Per-repo coordination docs (reviewed 2026-06-03)

| Repo                    | Coordination path              | Assessment                                                              |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| **gtcx-protocols**      | `01-docs/04-ops/coordination/` | Active hub — operator seed shipped; INF-86 schema ready                 |
| **gtcx-infrastructure** | `01-docs/04-ops/coordination/` | Track A/B done; INF-86 + platforms rollout open                         |
| **gtcx-intelligence**   | `01-docs/04-ops/coordination/` | DTF-5.4.4 witness `5142ff8`; Wave 2 — INT-S9-01 blocked, next INT-S9-06 |
| **gtcx-platforms**      | `01-docs/04-ops/coordination/` | P0 ECR image pushes; INF-86 consumer after pilot                        |
| **gtcx-core**           | `01-docs/04-ops/coordination/` | **New** — upstream obligations only; no internal blockers               |
| **baseline-os**         | `workstream/coordination/`     | Canonical blockers index + vendor tracking                              |

---

## Active workstreams (gtcx-core obligations)

### EAP bundle sync — **ready to execute**

- `pnpm eap:sync-bundle` rebuilds `gtcx/intelligence/{env}/auth-keys` from EAP client secrets
- After gtcx-core confirms write, infra force-refreshes ESO → K8s secret update
- **Impact:** Fed XR-201/202 chain — **INT-S3-08 closed** 2026-06-03 (intelligence evidence committed)

### SLSA provenance — **open, infra-owned**

- gtcx-core reported all `@gtcx/*` packages lack `dist.attestations` on npm
- Infra must investigate: `id-token: write`, OIDC exchange, `changeset publish --provenance`
- **Impact:** Build L3 aspirational claim

### KAT package consumption — **done (DTF-5.4.4)**

- `@gtcx/zkp-kat-vectors` linked in gtcx-protocols; circuit profile E2E per trust-portal ID
- Protocols witness: commit **`73eaff2b`** · inbound [`from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md) · hub log SoR [`gtcx-protocols/.../cross-repo-agent-log.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/04-ops/coordination/cross-repo-agent-log.md)
- Intelligence mirror (witness-only): **`5142ff8`** · [`from-gtcx-core-dtf-5-4-4-witness-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-intelligence/blob/main/01-docs/04-ops/coordination/from-gtcx-core-dtf-5-4-4-witness-2026-06-05.md) · bridge [`gtcx-intelligence/.../cross-repo-bridge.md`](https://github.com/gtcx-ecosystem/gtcx-intelligence/blob/main/01-docs/04-ops/coordination/cross-repo-bridge.md)
- **Impact:** M6.5 cross-implementation KAT path closed for S-T5-4; no intelligence deliverable

**P22 (protocols) — unchanged:** `backlogClear` with **P22-EVID-03**, S11-03, H-03 still blocked — same staging-auth class as intelligence **INT-S9-01** / OI-B08 (Wire #2 credentialed smoke). Intelligence Sprint 9: INT-S9-02–05 done; next automatable **INT-S9-06** (`cron eval:publish-production` on staging).

### External vendor gaps — **open, human-gated**

| Dimension              | Resource                              | ETA       | Owner                         |
| ---------------------- | ------------------------------------- | --------- | ----------------------------- |
| D8 Formal Verification | Z3/Coq consultant                     | 2–3 weeks | baseline-os / Security        |
| D9 Third-Party Audit   | Crypto audit vendor                   | 4–6 weeks | baseline-os / Security        |
| D7 M7.5 Side-Channel   | External lab                          | 2–3 weeks | baseline-os / Security        |
| D10 M10.3 Regulator    | African regulator / NIST CMVP liaison | 2 weeks   | GTM Lead / Protocol Architect |

---

## Communication rules

| Do                                                                  | Don't                                           |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| Update **Latest updates** above when status changes                 | Edit another repo's coordination doc without PR |
| Update **workplan** `XR-*` status when completing a slice           | Copy full bridge into Slack — link this file    |
| Link **evidence JSON** under `01-docs/05-audit/evidence/`           | Paste credentials in bridge or log              |
| Mirror P0 one-liner to **protocols bridge** when ecosystem-critical | Claim downstream work as gtcx-core-owned        |

---

## Quick links (sibling coordination)

| Repo                | Path                                                     |
| ------------------- | -------------------------------------------------------- |
| gtcx-protocols      | `01-docs/04-ops/coordination/cross-repo-agent-bridge.md` |
| gtcx-intelligence   | `01-docs/04-ops/coordination/cross-repo-bridge.md`       |
| gtcx-platforms      | `01-docs/04-ops/coordination/cross-repo-agent-bridge.md` |
| gtcx-infrastructure | `01-docs/04-ops/coordination/`                           |
| baseline-os         | `workstream/coordination/coordination-report-latest.md`  |

---

_Last review: 2026-06-03. Maintainer: gtcx-core agents. Sync with protocols bridge on P0 changes._
