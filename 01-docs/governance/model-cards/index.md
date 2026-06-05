---
title: 'AI Model Cards — gtcx-core'
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

title: 'Model Cards Index'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'index']
review_cycle: 'quarterly'

---

# AI Model Cards — gtcx-core

This directory contains model cards for all AI systems authorized to assist with development in the `gtcx-core` repository.

## Purpose

Model cards document the capabilities, limitations, safety considerations, and evaluation criteria for each AI model used in the GTCX agentic development workflow. They serve as:

- **Risk assessment** inputs for the threat control matrix
- **Onboarding** material for new team members
- **Audit evidence** for compliance reviews
- **Decision records** for model selection per task type

## Models

| Model Card            | Provider        | Primary Use Case                                      | Context          |
| --------------------- | --------------- | ----------------------------------------------------- | ---------------- |
| [Claude](claude.md)   | Anthropic       | Architecture, security review, long-context reasoning | 200K tokens      |
| [Gemini](gemini.md)   | Google          | Repo-wide audits, multimodal analysis, bulk docs      | 1M–2M tokens     |
| [Kimi](kimi.md)       | Moonshot AI     | Coverage pushes, repo hygiene, CI debugging           | 256K tokens      |
| [Codex](codex.md)     | OpenAI / GitHub | Inline completion, test scaffolding, small refactors  | 128K–256K tokens |
| [Cursor](cursor.md)   | Cursor Inc.     | Composer refactors, terminal assistance, code review  | 200K tokens      |
| [Copilot](copilot.md) | GitHub / OpenAI | Daily coding, PR hygiene, code explanation            | 8K–128K tokens   |

## Evaluation Pipeline

All model cards are evaluated quarterly against:

1. **Accuracy**: Test pass rate after agent-driven changes
2. **Safety**: Zero unauthorized security-sensitive changes
3. **Efficiency**: Context utilization and task completion time
4. **Compliance**: Adherence to `AGENTS.md` and role-specific rules

Evaluation results are recorded in the quarterly audit under `01-docs/05-audit/`.

## Human Review Matrix

| Change Type        | Claude   | Gemini   | Kimi     | Codex       | Cursor   | Copilot     |
| ------------------ | -------- | -------- | -------- | ----------- | -------- | ----------- |
| Crypto package     | Required | Required | Required | Required    | Required | Required    |
| Security package   | Required | Required | Required | Required    | Required | Required    |
| Public API change  | Required | Required | Required | Recommended | Required | Recommended |
| Doc change only    | Optional | Optional | Optional | Optional    | Optional | Optional    |
| Test addition      | Optional | Optional | Optional | Optional    | Optional | Optional    |
| Performance budget | Required | Required | Required | Recommended | Required | Recommended |

## Update History

| Date       | Change                               |
| ---------- | ------------------------------------ |
| 2026-05-19 | Initial model cards for 6 AI systems |
