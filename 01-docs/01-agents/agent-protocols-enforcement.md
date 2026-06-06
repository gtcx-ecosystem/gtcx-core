---
title: 'Agent protocols enforcement (P1–P28)'
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

**Purpose:** Machine-verifiable adoption for **P1–P28** — not advisory text alone. **Provider-agnostic:** terminal, Kimi CLI, Claude Code, Codex, Cursor, Copilot.

| Artifact                      | Path                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Machine manifest              | [agent-protocols-manifest.json](./agent-protocols-manifest.json)             |
| Hub drift snapshot            | [agent-protocols-hub-snapshot.json](./agent-protocols-hub-snapshot.json)     |
| Enforcement gate              | `pnpm agent:protocols:check`                                                 |
| Session start (first command) | `pnpm agent:session-start`                                                   |
| Attestation template          | [agent-attestation-template.md](../operations/agent-attestation-template.md) |
| CI                            | `ci.yml` + `agent-attestation.yml`                                           |

---

## Enforcement layers

| Layer                   | Mechanism                                             | What it catches                                                                                |
| ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Structural**          | `pnpm agent:protocols:check`                          | Missing scripts, partials, phases, P27 forbidden phrases, P1–P21 gate wiring                   |
| **Universal (any LLM)** | `pnpm agent:universal:check`                          | `agent-universal-instructions.md`, P26/P27 rules, no operator-delegation in `.agent/` (SR-013) |
| **Ecosystem SoR**       | `gtcx-agentic` `pnpm agent:universal:check`           | All sibling repos: universal doc + cursor rules + partials drift                               |
| **Hub drift**           | `pnpm agent:hub-drift:check`                          | gtcx-docs protocol.md changed since snapshot (sibling `../gtcx-docs` or `GTCX_DOCS_ROOT`)      |
| **P24 runtime**         | `pnpm agent:coordination:check --strict`              | P0 blocked without durable coordination record                                                 |
| **Session refresh**     | `pnpm agent:session-start`                            | Stale session; skips Proceed Brief / next-work bootstrap                                       |
| **Attestation**         | `pnpm agent:attestation:check --pr` / commit-msg hook | Agent-path PRs/commits without attestation block                                               |
| **LLM entry points**    | `pnpm agent:sync` → 8 targets + `.kimi/AGENTS.md`     | Instruction drift across models                                                                |
| **Cursor (optional)**   | `.cursor/rules/*.mdc`                                 | Extra reminder when using Cursor — not required for terminal LLMs                              |

---

## Session workflow (any LLM / terminal)

```bash
pnpm agent:session-start    # Phase 5.4–5.6 bootstrap — always first
# … implement …
pnpm test                   # P27 V-ladder as applicable
pnpm agent:protocols:check  # before PR when touching agent/governance docs
```

Phases: **5.4** P22 · **5.5** P24 · **5.6** P26+P28 · **5.7** P27

---

## Hub drift workflow

When gtcx-docs protocols change:

1. Review hub `protocol.md` text
2. Update local wiring (AGENTS, scripts, partials) if needed
3. `pnpm agent:hub-snapshot:update`
4. `pnpm agent:protocols:check`

---

## Commands

| Command                                  | Role                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `pnpm agent:session-start`               | Next-work + session.md + Proceed Brief skeleton      |
| `pnpm agent:session-start --json`        | Machine-readable for automation                      |
| `pnpm agent:protocols:check`             | Full bundle (foundation + agent cluster + hub drift) |
| `pnpm agent:foundation-protocols:check`  | P1–P21 local gates only                              |
| `pnpm agent:hub-drift:check`             | Compare hub hashes vs snapshot                       |
| `pnpm agent:hub-snapshot:update`         | Refresh snapshot after hub review                    |
| `pnpm agent:coordination:check --strict` | P24 hygiene (embedded in protocols check)            |
| `pnpm agent:attestation:check --pr`      | PR body attestation (CI workflow)                    |
| `pnpm agent:universal:check`             | Any-LLM universal doc + anti-delegation partials     |

---

## Adding a protocol

1. Add to `agent-protocols-manifest.json`
2. Extend `03-platform/tools/check-agent-protocols.mjs` or foundation checker
3. Update human `AGENTS.md` §1.6 if startup phase applies
4. Update `.agent/*` partials → `pnpm agent:sync`
5. `pnpm agent:hub-snapshot:update` if hub text new/changed
