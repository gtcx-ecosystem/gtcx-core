---
title: 'Audit — Agent Start'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
tier: standard
tags: ['audit', 'agents']
review_cycle: on-change
---

# Audit — Agent Start

> **Canonical home** for gtcx-core audit prompts and lane forensics.  
> **Engine:** [gtcx-docs audit framework](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/03-platform/tools/audit/audit-framework)  
> **Reports:** `01-docs/05-audit/` (per-repo SoR)

---

## Quick start

1. Read [audit framework README](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/audit-framework/README.md) and [UNIVERSAL_RUBRIC.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/audit-framework/UNIVERSAL_RUBRIC.md).
2. Run lane command from `01-docs/01-agents/readiness-and-audit-lanes.md` (e.g. `engineering-audit`).
3. Write forensic to `01-docs/05-audit/<audit-type>-YYYY-MM-DD.md`.
4. Update `01-docs/05-audit/latest.json` and run `pnpm readiness:lanes:check`.

Command registry: [gtcx-docs commands.json](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/audit-framework/commands.json).

---

## exploration-os — public SIR verifier (moat)

Cross-repo moat reference (deploy + smoke only — code lives in exploration-os):

| Resource                 | Path                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Verifier source + deploy | [exploration-os/public/sir-verifier/README.md](https://github.com/gtcx-ecosystem/exploration-os/blob/main/public/sir-verifier/README.md) |
| Full audit (2026-05-30)  | [exploration-os audit](https://github.com/gtcx-ecosystem/exploration-os/blob/main/01-docs/05-audit/full-audit-2026-05-30.md)             |

_No new exploration-os build from gtcx-core — deploy checklist and audit scoring only._

---

## Related

| Doc                                                                                          | Purpose              |
| -------------------------------------------------------------------------------------------- | -------------------- |
| [`README.md`](./README.md)                                                                   | Index + hygiene      |
| [`../01-docs/05-audit/readiness-model.md`](../01-docs/05-audit/readiness-model.md)           | Five audit lanes     |
| [`../01-docs/agile/cross-repo-coordination.md`](../01-docs/agile/cross-repo-coordination.md) | Protocol 24 handoffs |
