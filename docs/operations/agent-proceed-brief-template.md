---
title: 'Agent Proceed Brief — template (Protocol 26)'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-P26-TEMPLATE
tier: standard
tags: ['agents', 'protocol-26', 'proceed-brief']
review_cycle: on-change
---

# Agent Proceed Brief — template (Protocol 26)

Copy at session start **before** irreversible implementation. Hub: [Protocol 26](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/26-agent-proceed-confirmation/protocol.md).

```markdown
## Proceed Brief

**Next action:** <what you will do>
**Story / work ID:** <from pnpm agent:next-work or user override>
**Because:** <evidence — roadmap, blocker, audit>
**Authority class:** S | A | R (Protocol 28)
**Authorization artifact:** <path or URL if Class A>
**Inputs used:** agent-work-selection.md, session.md, coordination report
**Blocked:** no | yes — see Blocker Report
**Override:** Reply **stop**, **correct:** …, or explicit story ID.
```

**Blocker Report (when blocked):**

```markdown
## Blocker Report

**Blocked on:** <repo / credential / human gate>
**Owner:** <role or repo>
**Artifact needed:** <file, ticket, approval>
**Agent will not:** ask operator to choose between backlog items
```
