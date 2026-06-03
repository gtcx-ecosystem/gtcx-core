---
title: 'Agent Schemas'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

# Agent Schemas

JSON Schema definitions that agent-tooling and CI validators use to verify the shape of structured documents in `docs/agents/`.

| File                                             | Validates                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [`adr.schema.json`](./adr.schema.json)           | Architecture Decision Records in `docs/decisions/`                                          |
| [`doc.schema.json`](./doc.schema.json)           | YAML frontmatter on every `.md` file in `docs/` (mirrors `tools/check-doc-frontmatter.mjs`) |
| [`playbook.schema.json`](./playbook.schema.json) | Agent task playbooks under `docs/agents/workflows/tasks/`                                   |
| [`role.schema.json`](./role.schema.json)         | Per-role definitions in `docs/agents/roles/`                                                |

**Audience:** agent-tooling maintainers, CI gate authors. Consumers reference these via `$schema` URIs in the documents they validate.
