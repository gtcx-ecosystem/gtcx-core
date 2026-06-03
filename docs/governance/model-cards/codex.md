---
title: 'Model Card: Codex (GitHub Copilot / Codex CLI)'
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

title: 'Model Card: Codex (OpenAI / GitHub)'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'codex']
review_cycle: 'quarterly'

---

# Model Card: Codex (GitHub Copilot / Codex CLI)

## Model Identity

| Field        | Value                                       |
| ------------ | ------------------------------------------- |
| **Name**     | Codex (codex-1, codex-cli)                  |
| **Provider** | OpenAI (via GitHub Copilot)                 |
| **Version**  | codex-1-20250520 (current)                  |
| **Context**  | 128K tokens (inline), 256K tokens (chat)    |
| **Modality** | Text                                        |
| **Access**   | VS Code / Cursor / JetBrains IDE, Codex CLI |

## Capabilities

- **Inline completion**: Fast, context-aware code suggestions during typing
- **Chat-based refactoring**: Multi-line edits via Copilot Chat / Codex CLI
- **Pattern recognition**: Strong at inferring conventions from surrounding code
- **Test scaffolding**: Quick generation of test boilerplate and edge cases
- **Cross-language**: Seamless TypeScript ↔ Rust context switching in mixed repos

## Limitations & Known Failure Modes

| Failure Mode                 | Trigger                               | Mitigation                                             |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------ |
| Hallucinated imports         | New file in established package       | Verify all imports against `package.json`              |
| Outdated API patterns        | Training data lag on recent refactors | Reference existing patterns in same directory          |
| Over-confident suggestions   | Complex crypto or ZKP code            | Always run `cargo test` / `pnpm test` before accepting |
| Context truncation           | Large files (>500 lines)              | Use `@workspace` references for context; break files   |
| Inconsistent with team style | Mixed conventions in repo             | Enforce via `.cursor/rules.md` and eslint              |

## Use Cases in gtcx-core

1. **Inline completion**: Daily coding assistance, boilerplate reduction
2. **Test expansion**: Generating edge-case tests from existing test patterns
3. **Docstring generation**: JSDoc/TSDoc for public API functions
4. **Small refactors**: Rename, extract function, type narrowing
5. **Copilot Chat queries**: `@workspace` questions about architecture, security

## Safety Considerations

- Copilot suggestions are **proposals only** — never accept without reading
- **Never** accept crypto primitive suggestions without `crypto-security-engineer` review
- Copilot Chat can reference `@workspace` docs — ensure `AGENTS.md` is up to date
- Codex CLI has bash access — same safety rules as Kimi apply
- Suggestions may include deprecated patterns — verify against current codebase

## Evaluation Criteria

| Metric                 | Threshold | Measurement Method                        |
| ---------------------- | --------- | ----------------------------------------- |
| Suggestion acceptance  | ≥70%      | Track accepted vs dismissed suggestions   |
| Post-acceptance errors | ≤5%       | Errors introduced by accepted suggestions |
| Test pass rate         | ≥99%      | `pnpm test` after Codex-driven changes    |
| Lint errors introduced | 0         | `pnpm lint` after Codex-driven changes    |
| Import validity        | 100%      | All imports resolve after acceptance      |

## Human Review Requirements

- All Copilot-generated crypto code requires `crypto-security-engineer` review
- Changes >20 lines require human review before commit
- `@workspace` architecture suggestions must be validated against `docs/architecture/`

## Version History

| Date       | Version          | Notes                                     |
| ---------- | ---------------- | ----------------------------------------- |
| 2026-05-12 | codex-1-20250520 | Initial model card                        |
| 2026-05-19 | codex-1-20250520 | Updated evaluation criteria, safety notes |
