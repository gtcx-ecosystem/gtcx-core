---
title: Agent Permission Unblock Report
status: current
date: 2026-06-05
protocol: P27
---

# Agent Permission Unblock Report

Emit when `agentAutonomy.ok` is false at session start (`baseline start`, `pnpm agent:start`, or `pnpm agent:environment:check`).

## Template

```markdown
## Permission Unblock Report

**Blocked command:** `<exact command that failed or would fail>`
**Exit / error:** `<stderr or sandbox message — no secrets>`
**Why blocked:** `<sandbox | cursor-allowlist | path-missing | other>`
**Impact:** `<which V-ladder steps cannot run in-session until unblocked>`

### Enable (operator — one-time)

1. `<concrete step — e.g. add Shell(baseline **) to .cursor/cli.json>`
2. `<optional: Cursor Settings → Agents → Run Mode → Allowlist; Sandbox Networking → Allow All>`
3. `<optional: node scripts/sync/cursor-permissions-rollout.mjs --repo gtcx-core from gtcx-agentic>`

### After enable

Agent will re-run `pnpm agent:environment:check` (or `baseline start`) in this session. Do not ask operator to paste terminal output unless debugging together.
```

## Autonomy levels

| Level      | Meaning                                                                         |
| ---------- | ------------------------------------------------------------------------------- |
| `full`     | `.cursor/cli.json` + `permissions.json` allow required tools; PATH has binaries |
| `partial`  | Some allowlist entries missing — gates may defer to human (P27 violation risk)  |
| `blocked`  | Required binary or permission missing — do not claim done without unblock       |
| `terminal` | No Cursor config — full shell assumed (CLI / non-IDE agents)                    |

## Required tools (P27)

- `pnpm`, `node`, `git`, `gh`, `baseline` — always required
- `python3` — repo-hygiene checker (optional but recommended)
- `cargo` — Rust V6 when `rust/` or `Cargo.toml` exists

## Canonical checker

`baseline-os/scripts/ecosystem/lib/agent-environment-autonomy.mjs` — invoked at Phase 0b of `baseline start`.
