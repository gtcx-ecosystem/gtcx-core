---
title: 'Model Card: Gemini (Google)'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'gemini']
review_cycle: 'quarterly'
---

# Model Card: Gemini (Google)

## Model Identity

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| **Name**       | Gemini (gemini-1.5-pro, gemini-1.5-flash)  |
| **Provider**   | Google DeepMind                            |
| **Version**    | gemini-1.5-pro-002 (current)               |
| **Context**    | 1M–2M tokens                               |
| **Modality**   | Text, image, audio, video                  |
| **Access**     | Google AI Studio, Vertex AI, API           |

## Capabilities

- **Extreme context window**: Can ingest entire repo documentation (all `docs/` files) in a single prompt
- **Multimodal analysis**: Can process architecture diagrams, screenshots, and video recordings
- **Cross-file analysis**: Excels at finding patterns across large codebases due to context capacity
- **Web grounding**: Can retrieve current dependency versions, CVE data, and market information
- **Code generation**: Competent TypeScript and Rust; slightly less consistent than Claude on edge cases

## Limitations & Known Failure Modes

| Failure Mode                  | Trigger                                      | Mitigation                                      |
| ----------------------------- | -------------------------------------------- | ----------------------------------------------- |
| Safety over-refusal           | Security-related prompts (e.g., threat modeling) | Rephrase as "audit review" or "academic analysis" |
| Inconsistent formatting       | Long multi-file generation sessions          | Enforce templates and post-process with linter  |
| Hallucinated web results      | Grounding queries for niche packages         | Verify all web-retrieved facts against primary sources |
| Delayed context degradation   | Sessions approaching 2M tokens               | Restart session and provide summary context     |
| Aggressive pattern matching   | Generates boilerplate instead of precise code| Require explicit reference to existing patterns |

## Use Cases in gtcx-core

1. **Repo-wide audits**: Full documentation review, cross-package dependency analysis
2. **Diagram generation**: Architecture diagrams from `docs/architecture/overview.md`
3. **Market research**: Commodity pricing, regulatory updates for docs
4. **Bulk documentation**: Frontmatter injection across 100+ files, link verification
5. **Comparative analysis**: Evaluating multiple implementation approaches simultaneously

## Safety Considerations

- Gemini lacks built-in safety constraints equivalent to Claude's `.claude/settings.local.json`
- **Self-enforce**: Never execute destructive commands, never push to git, never publish to npm
- **Self-enforce**: Always run verification gates before declaring success
- Web grounding may retrieve outdated or incorrect information — always verify

## Evaluation Criteria

| Metric                  | Threshold | Measurement Method                          |
| ----------------------- | --------- | ------------------------------------------- |
| Context utilization     | ≤80%      | Monitor token usage per session             |
| Doc frontmatter validity| 100%      | `pnpm docs:check-frontmatter` after batch   |
| Link integrity          | 0 broken  | `pnpm docs:check-links` after batch         |
| Fact accuracy (web)     | ≥95%      | Spot-check 10% of web-grounded claims       |
| Format consistency      | 100%      | `pnpm format:check` after generation        |

## Human Review Requirements

- All multimodal outputs (diagrams, charts) require human verification for accuracy
- Web-grounded compliance claims require `quality-evidence-lead` verification
- Generated architecture diagrams must be reviewed by `protocol-architect`

## Version History

| Date       | Version               | Notes                                      |
| ---------- | --------------------- | ------------------------------------------ |
| 2026-05-12 | gemini-1.5-pro-002    | Initial model card                         |
| 2026-05-19 | gemini-1.5-pro-002    | Updated use cases, evaluation criteria     |
