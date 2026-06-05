---
title: 'Agent PR witness checklist'
status: current
date: 2026-06-05
owner: gtcx-core
protocol: P27
document_id: OPS-AGENT-PR-CHECKLIST
tier: standard
tags: ['agents', 'pull-request', 'signal']
review_cycle: on-change
---

# Agent PR witness checklist

Use when a PR touches **agent paths** (see globs below). Required for SIGNAL L1→L2 criterion #2: agent instructions in Git with PR review.

**Attestation verify:** `pnpm agent:attestation:check --pr`  
**Template:** [`agent-attestation-template.md`](./agent-attestation-template.md)

## Agent-touch globs

- `docs/agents/**`
- `scripts/agent-*`, `scripts/lib/agent-*`, `scripts/lib/resolve-suggest-persona.mjs`
- `.agent/**`
- `.cursor/rules/**`, `.cursor/cli.json`, `.cursor/permissions.json`
- `AGENTS.md`, `CLAUDE.md`, `KIMI.md`, `GEMINI.md`, `CODEX.md`
- `docs/operations/agent-*`
- `tools/check-agent-protocols.mjs`

## PR checklist

- [ ] **Proceed Brief** in PR description: story ID, authority class (S/A/R), persona + frame
- [ ] **Agent Context Attestation** block pasted (all Phase 5.x boxes checked)
- [ ] **V-ladder executed in-session** — report `command` + `exit code` (not "verify locally")

| Step | Command                                                        | Required when       | Exit |
| ---- | -------------------------------------------------------------- | ------------------- | ---- |
| V1   | `git status`, scoped `git diff`                                | Always              |      |
| V2   | `pnpm format:check`, `lint`, `typecheck`, `architecture:check` | Code/docs gates     |      |
| V3   | `pnpm test`                                                    | Behavior changed    |      |
| V4   | docs/bundle checks                                             | Docs/deploy touched |      |
| V5   | `pnpm quality:governance:check`                                | Governance touched  |      |
| V6   | `cargo test`                                                   | Rust changed        |      |

- [ ] **Evidence paths** linked for audit/coordination changes (`docs/audit/`, `docs/coordination/`)
- [ ] **Cross-repo:** inbound/outbound ticket filed if sibling repo blocked (Protocol 24)
- [ ] **No secrets** in diff; no `--no-verify`
- [ ] **Class S/A:** human approval documented before merge (P28)

## Reviewer checklist

- [ ] Attestation present and plausible for scope
- [ ] V-ladder exits reported; failures explained or fixed
- [ ] Agent-path change matches Proceed Brief story
- [ ] Crypto/security packages: crypto-security-engineer role consulted if applicable
