---
title: 'Model Card: Cursor (Cursor IDE)'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'governance']
review_cycle: 'on-change'
---

---

title: 'Model Card: Cursor (Cursor IDE)'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'cursor']
review_cycle: 'quarterly'

---

# Model Card: Cursor (Cursor IDE)

## Model Identity

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| **Name**     | Cursor (Composer, Chat, Tab)               |
| **Provider** | Cursor Inc. (Anyscale backend)             |
| **Version**  | Cursor 0.48.x (current)                    |
| **Context**  | 200K tokens (Composer), 128K tokens (Chat) |
| **Modality** | Text, image (chat only)                    |
| **Access**   | Cursor IDE (macOS, Windows, Linux)         |

## Capabilities

- **Composer**: Multi-file editing with cross-file awareness
- **Chat with context**: `@file`, `@folder`, `@code` references for precise context
- **Tab completion**: Fast inline suggestions with project-wide pattern learning
- **Terminal integration**: Runs commands in integrated terminal
- **Git integration**: Diff review, commit message generation

## Limitations & Known Failure Modes

| Failure Mode                  | Trigger                                         | Mitigation                                      |
| ----------------------------- | ----------------------------------------------- | ----------------------------------------------- |
| Composer over-reach           | Vague prompts in large workspaces               | Scope Composer to specific files/directories    |
| Context pollution             | `.cursor/rules.md` conflicts with project       | Keep `.cursor/rules.md` minimal; AGENTS.md wins |
| Terminal command risks        | Auto-suggested terminal commands                | Review every command before execution           |
| Model switching inconsistency | Cursor switches backend model silently          | Pin model in settings; verify behavior          |
| Index staleness               | Large refactors not reflected in codebase index | Re-index workspace after major renames          |

## Use Cases in gtcx-core

1. **Composer refactors**: Multi-file type renames, API migrations
2. **Chat debugging**: `@file` references for targeted debugging help
3. **Terminal assistance**: Command suggestions for pnpm, cargo workflows
4. **Code review**: AI-generated diff summaries before human review
5. **Commit hygiene**: Conventional commit message generation

## Safety Considerations

- Cursor has file-system and terminal access — respect working-directory boundaries
- `.cursor/rules.md` is agent-specific but `AGENTS.md` is canonical — conflicts resolved in favor of AGENTS.md
- Composer can modify multiple files simultaneously — review all diffs before accepting
- Terminal integration can execute destructive commands — require explicit approval

## Evaluation Criteria

| Metric                  | Threshold | Measurement Method                          |
| ----------------------- | --------- | ------------------------------------------- |
| Composer accuracy       | ≥90%      | Files correctly modified without regression |
| Terminal command safety | 100%      | No destructive commands executed            |
| Commit message quality  | ≥95%      | Conventional commit format compliance       |
| Index freshness         | Real-time | Re-index after refactors >10 files          |

## Human Review Requirements

- All Composer changes >3 files require human diff review
- Terminal commands require explicit user confirmation
- `.cursor/rules.md` changes require `protocol-architect` review

## Version History

| Date       | Version       | Notes                                     |
| ---------- | ------------- | ----------------------------------------- |
| 2026-05-12 | Cursor 0.48.x | Initial model card                        |
| 2026-05-19 | Cursor 0.48.x | Updated safety notes, evaluation criteria |
