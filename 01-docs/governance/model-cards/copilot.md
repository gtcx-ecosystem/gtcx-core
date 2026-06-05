---
title: 'Model Card: GitHub Copilot'
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

title: 'Model Card: GitHub Copilot'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'copilot']
review_cycle: 'quarterly'

---

# Model Card: GitHub Copilot

## Model Identity

| Field        | Value                                      |
| ------------ | ------------------------------------------ |
| **Name**     | GitHub Copilot (Inline + Chat)             |
| **Provider** | GitHub / OpenAI                            |
| **Version**  | Copilot 1.300.x (current)                  |
| **Context**  | ~8K tokens (inline), 128K tokens (Chat)    |
| **Modality** | Text                                       |
| **Access**   | VS Code, JetBrains, Vim/Neovim, GitHub.com |

## Capabilities

- **Inline completion**: Real-time suggestions based on cursor position and surrounding context
- **Copilot Chat**: Natural language queries about code, architecture, and debugging
- **Pull request summaries**: AI-generated PR descriptions and review comments
- **Test generation**: Suggests tests based on existing test patterns
- **Explanation**: Explains complex code sections in natural language

## Limitations & Known Failure Modes

| Failure Mode            | Trigger                                | Mitigation                                     |
| ----------------------- | -------------------------------------- | ---------------------------------------------- |
| Short-context blindness | Dependencies defined far from usage    | Use Copilot Chat with `@workspace` for context |
| License ambiguity       | Suggestions may resemble training data | Enable duplication detection filter            |
| Inconsistent quality    | Niche domains (ZKP, custom protocols)  | Pair with domain expert review                 |
| Chat context loss       | Multi-turn conversations               | Restart chat with summarized context           |
| Suggestion latency      | Large files or slow network            | Accept partial suggestions; complete manually  |

## Use Cases in gtcx-core

1. **Daily coding**: Inline completion for TypeScript and Rust development
2. **Code explanation**: Understanding legacy or complex cryptographic code
3. **PR hygiene**: Generating PR descriptions from commit history
4. **Review assistance**: Initial pass on PRs for style and logic issues
5. **Onboarding**: Explaining codebase conventions to new contributors

## Safety Considerations

- Copilot Inline is **passive** — it suggests but does not execute
- Copilot Chat can suggest terminal commands — review before execution
- Enable "block suggestions matching public code" to reduce license risk
- PR summaries are **drafts** — require human review before submission
- Never rely on Copilot for security-critical code without expert review

## Evaluation Criteria

| Metric               | Threshold | Measurement Method                        |
| -------------------- | --------- | ----------------------------------------- |
| Suggestion relevance | ≥75%      | Accepted suggestions vs total shown       |
| License safety       | 100%      | Duplication filter enabled, zero flags    |
| PR summary accuracy  | ≥90%      | Human review score of generated summaries |
| Explanation clarity  | ≥85%      | New contributor comprehension tests       |

## Human Review Requirements

- All PR summaries require human editing before submission
- Security-sensitive code suggestions require `crypto-security-engineer` review
- Copilot Chat architecture advice must be validated against `01-docs/architecture/`

## Version History

| Date       | Version         | Notes                                     |
| ---------- | --------------- | ----------------------------------------- |
| 2026-05-12 | Copilot 1.300.x | Initial model card                        |
| 2026-05-19 | Copilot 1.300.x | Updated safety notes, evaluation criteria |
