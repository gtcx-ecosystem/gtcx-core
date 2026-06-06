---
title: 'Agent Context Attestation — template'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-ATTESTATION
tier: standard
tags: ['agents', 'attestation', 'protocol-26']
review_cycle: on-change
---

# Agent Context Attestation — template

Paste into **PR description** or **commit message** when changing agent wiring (`01-docs/01-agents/`, `.agent/`, `AGENTS.md`, agent scripts).

Verify: `pnpm agent:attestation:check --file path/to/body.md`

```markdown
## Agent Context Attestation

- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered
- [x] Phase 4: Persona & frame selected
- [x] Phase 5: Context attested
- [x] Phase 5.4: Next work selected (<ID>) via Protocol 22
- [x] Phase 5.5: Cross-repo coordination checked (Protocol 24)
- [x] Phase 5.6: Proceed Brief + authority class (Protocol 26 + 28)
- [x] Phase 5.7: Verification ladder executed (Protocol 27)
```

**CI:** PRs that touch agent paths must include this block (`pnpm agent:attestation:check --pr`).
