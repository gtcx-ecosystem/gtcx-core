---
title: 'Model Card: Kimi (Moonshot AI)'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'kimi']
review_cycle: 'quarterly'
---

# Model Card: Kimi (Moonshot AI)

## Model Identity

| Field        | Value                 |
| ------------ | --------------------- |
| **Name**     | Kimi (Kimi Code CLI)  |
| **Provider** | Moonshot AI           |
| **Version**  | kimi-k1.5 (current)   |
| **Context**  | 256K tokens           |
| **Modality** | Text                  |
| **Access**   | Kimi Code CLI (local) |

## Capabilities

- **Efficient tool use**: Strong `Agent` tool delegation for exploration tasks
- **Background task management**: Reliable `run_in_background=true` for long builds/tests
- **Plan mode**: Structured multi-file change planning via `EnterPlanMode`
- **Skill system**: Can load modular `SKILL.md` files for domain-specific capabilities
- **Code execution**: Direct bash access with safety constraints

## Limitations & Known Failure Modes

| Failure Mode                | Trigger                           | Mitigation                                     |
| --------------------------- | --------------------------------- | ---------------------------------------------- |
| Context compaction gaps     | Very long sessions (>200K tokens) | Use `/task` for background work; save handoffs |
| Over-reliance on shell      | Complex multi-step operations     | Prefer `Agent` tool for exploration; verify    |
| Plan mode drift             | Plans exceeding 5-7 files         | Break into smaller plans; commit incrementally |
| Timeout on long tests       | Coverage runs >300s               | Use `run_in_background=true` with `/task`      |
| Less consistent Rust output | Complex lifetime/generic patterns | Pair with `cargo clippy` and human review      |

## Use Cases in gtcx-core

1. **Coverage pushes**: Batch test additions, coverage config fixes, threshold tuning
2. **Repo hygiene**: Bulk renames, file moves, README additions
3. **CI debugging**: ` investigate-ci-failure` workflow execution
4. **Documentation cleanup**: Frontmatter injection, link fixing, kebab-case enforcement
5. **Agent handoffs**: Session continuity via `docs/agents/sessions/` handoff files

## Safety Considerations

- Kimi Code CLI has full filesystem and bash access — respect working-directory boundaries
- **Never** access files outside `/Users/amanianai/Sites/gtcx-ecosystem/gtcx-core/`
- **Never** run `git push --force`, `rm -rf /`, or destructive commands
- Background tasks run independently — use `TaskOutput` to monitor; do not assume success
- Skill files extend capabilities — review all `SKILL.md` content before loading

## Evaluation Criteria

| Metric                   | Threshold | Measurement Method                   |
| ------------------------ | --------- | ------------------------------------ |
| Test pass rate post-edit | ≥98%      | `pnpm test` after Kimi session       |
| Context efficiency       | ≤200K tok | Monitor session token usage          |
| Commit atomicity         | ≤5 files  | Average files per commit             |
| Handoff completeness     | 100%      | All sessions >1hr write handoff file |
| Background task success  | ≥95%      | Track `/task` completion rate        |

## Human Review Requirements

- All security-sensitive package changes require `crypto-security-engineer` review
- Agent handoffs must be reviewed by receiving agent before work continues
- Background task outputs must be inspected before dependent steps proceed

## Version History

| Date       | Version   | Notes                                     |
| ---------- | --------- | ----------------------------------------- |
| 2026-05-12 | kimi-k1.5 | Initial model card                        |
| 2026-05-19 | kimi-k1.5 | Updated evaluation criteria, safety notes |
