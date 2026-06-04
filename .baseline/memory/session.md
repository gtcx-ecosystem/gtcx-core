---
session_id: '2026-06-05-readiness-lanes-gcr'
agent: 'gtcx-core-agent'
focus: 'Five-lane readiness model, GCR, agent sync; CORE-004 blocked XR-402'
---

# Session: Readiness lanes + GCR + agent centralization

## Recent commits (lane model)

| SHA       | Summary                                            |
| --------- | -------------------------------------------------- |
| `08583fc` | prettierignore KIMI/Codex/Copilot agent-sync drift |
| `691a75b` | GCR tier/status rollup                             |
| `0f3647a` | agent readiness guide + anti-drift checks          |
| `419b436` | lane 2 five internal compliance domains            |
| `b178f79` | Industry Compliance + GTM-Readiness tiers          |

## Readiness snapshot (2026-06-05)

| Lane / rollup   | Outcome                               |
| --------------- | ------------------------------------- |
| 1 Engineering   | 9.5 / 10.0 signoff                    |
| 2 Internal      | **9.0** (5 domains)                   |
| 3 Industry      | **IC-T0** · OPEN 0/12                 |
| **GCR**         | **GCR-T0** · **BLOCKED**              |
| 4 Bank-grade    | **8.9** (lane 4 only)                 |
| 5 GTM-Readiness | **GR-T1** · sovereign **below GR-T2** |

**SSOT:** `docs/audit/latest.json` · `docs/audit/readiness-model.md` · `docs/agents/readiness-and-audit-lanes.md`

## Protocol 22

`pnpm agent:next-work` → **CORE-004** — **blocked** (`XR-402` ceremony).

**External (IC/GCR):** pen-test, SOC 2 letter, npm provenance org policy, ceremony.

**GTM (GR):** sovereign stack — testnet, sandbox send, infra pen-test (not library S1).

## Verification

| Command                         | Result                       |
| ------------------------------- | ---------------------------- |
| `pnpm readiness:lanes:check`    | exit 0                       |
| `pnpm agent:check`              | exit 0                       |
| `pnpm quality:governance:check` | runs agent + readiness gates |
