---
title: 'Agent protocols enforcement (P19–P28)'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: AGENT-PROTOCOLS-ENFORCE
tier: standard
tags: ['agents', 'protocol-22', 'protocol-27', 'governance']
review_cycle: on-change
---

# Agent protocols enforcement (gtcx-core)

**Purpose:** Make Protocol 22–28 adoption **machine-verifiable** in this repo — not advisory text in `AGENTS.md` alone.

| Artifact           | Path                                                             |
| ------------------ | ---------------------------------------------------------------- |
| Machine manifest   | [agent-protocols-manifest.json](./agent-protocols-manifest.json) |
| Enforcement gate   | `pnpm agent:protocols:check`                                     |
| CI                 | `.github/workflows/ci.yml` — Protocol adoption step              |
| Governance bundle  | `pnpm quality:governance:check` (includes protocols check)       |
| Cursor (always on) | `.cursor/rules/agent-protocols-enforcement.mdc`                  |
| P27 only           | `.cursor/rules/protocol-27-agent-execution-obligation.mdc`       |

**Hub SoR:** [gtcx-docs protocols index](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/README.md) — normative text stays in the hub; this repo wires **scripts, CI, entry points, and local manifests**.

---

## Agent protocol catalog (hub)

| ID      | Title                          | Startup phase      | gtcx-core wiring                                                                                |
| ------- | ------------------------------ | ------------------ | ----------------------------------------------------------------------------------------------- |
| **P19** | Agent Credential Access        | —                  | `.agent/credentials-pointer.md`; vault via gtcx-agentic                                         |
| **P22** | Agent Work Selection           | **5.4**            | `docs/operations/agent-work-selection.md`, `pnpm agent:next-work`, `agent:work-selection:check` |
| **P24** | Cross-Repo Coordination        | **5.5**            | `docs/operations/coordination/cross-repo-agent-bridge.md`, `.agent/coordination-pointer.md`     |
| **P26** | Agent Proceed Confirmation     | **5.6**            | `docs/operations/agent-proceed-brief-template.md`                                               |
| **P28** | Agent Authority Classification | **5.6** (with P26) | Authority class **S / A / R** in Proceed Brief                                                  |
| **P27** | Agent Execution Obligation     | **5.7**            | V-ladder §7 `AGENTS.md`; Cursor P27 rule; forbidden “verify locally” in agent ops docs          |

**Related (not startup phases):** P16 audit standard → `docs/agents/readiness-and-audit-lanes.md`; P18 machine-readable docs → `pnpm docs:check-frontmatter`.

**Institutional:** [agent-startup-protocol.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/institutional/agent-startup-protocol.md) (INST-003) — phases 5.4–5.7 align with the table above.

---

## What the gate enforces

`tools/check-agent-protocols.mjs` fails CI/governance when:

1. **Manifest** exists and lists P22–P28 with hub URLs.
2. **Scripts** — `agent:next-work`, `agent:work-selection:check`, `agent:protocols:check` in `package.json`.
3. **AGENTS.md** — Phases 5.4–5.7, Protocol 22/24/26/27/28 strings, V-ladder commands, `agent:protocols:check` reference.
4. **P22** — runs embedded `pnpm agent:work-selection:check`.
5. **P24** — bridge doc + coordination partial in agent-sync targets.
6. **P26** — proceed brief template on disk.
7. **P27** — Cursor rule file; no forbidden defer-to-human phrases under `docs/agents/` and `docs/operations/` (except this enforcement guide).
8. **P28** — Authority class + Protocol 28 in `AGENTS.md`.
9. **CI** — `agent:next-work` and `agent:protocols:check` (or work-selection check) in workflow.
10. **Agent-sync** — `protocols-enforcement-pointer.md` partial on all primary LLM targets.

---

## Session workflow (agents)

```text
Phase 1–3  → baseline + git state
Phase 5.4  → pnpm agent:next-work (P22)
Phase 5.5  → coordination report + handoffs (P24)
Phase 5.6  → Proceed Brief + authority class S|A|R (P26 + P28)
Phase 5.7  → run V-ladder; report command + exit code (P27)
Before done → pnpm agent:protocols:check (if governance/docs touched)
```

**P27 — allowed close:** `Ran pnpm test — exit 0.`  
**P27 — blocked:** emit Permission Unblock Report (template in P27 hub + `.cursor/rules/protocol-27-agent-execution-obligation.mdc`).

---

## Adding a new protocol

1. Add entry to `agent-protocols-manifest.json` with `hubUrl` and local paths.
2. Extend `tools/check-agent-protocols.mjs` with concrete checks.
3. Add startup phase bullet to human `AGENTS.md` §1.6 (if applicable).
4. Extend `.agent/protocols-enforcement-pointer.md` and run `pnpm agent:sync`.
5. Run `pnpm agent:protocols:check` and `pnpm quality:governance:check`.

---

## Anti-patterns (P27)

Do **not** end sessions with:

- “Verify locally: `pnpm test`”
- “Please run the validators before merge”
- “Run this in your terminal and share the output”

Use in-session execution or Permission Unblock Report.
