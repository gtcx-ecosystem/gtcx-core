---
title: "Model Card: Claude (Anthropic)"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "governance"]
review_cycle: "on-change"
---

---
title: 'Model Card: Claude (Anthropic)'
status: 'current'
date: '2026-05-19'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['governance', 'model-card', 'agentic', 'claude']
review_cycle: 'quarterly'
---

# Model Card: Claude (Anthropic)

## Model Identity

| Field          | Value                                      |
| -------------- | ------------------------------------------ |
| **Name**       | Claude (Claude Code / Claude Desktop)      |
| **Provider**   | Anthropic                                  |
| **Version**    | claude-sonnet-4-20250514 (current)         |
| **Context**    | 200K tokens                                |
| **Modality**   | Text, image (analysis only)                |
| **Access**     | API + Claude Code CLI                      |

## Capabilities

- **Long-context reasoning**: Handles full `AGENTS.md` (525+ lines) + multiple package specs in a single session
- **Code generation**: Strong TypeScript and Rust output; follows explicit patterns well
- **Architecture design**: Produces coherent multi-file refactors with dependency awareness
- **Security analysis**: Identifies cryptographic misuses when prompted with threat models
- **Documentation**: Generates structured prose with consistent formatting

## Limitations & Known Failure Modes

| Failure Mode                  | Trigger                                      | Mitigation                                      |
| ----------------------------- | -------------------------------------------- | ----------------------------------------------- |
| Hallucinated file paths       | Large refactor across unfamiliar packages    | Require `Glob`/`Grep` verification before edits |
| Over-eager refactoring        | Vague "improve this" prompts                 | Scope prompts to specific metrics or ADRs       |
| Context window exhaustion     | Sessions >150K tokens with full repo context | Use `Agent` tool for exploration; summarize     |
| False confidence in crypto    | Requests for custom primitives               | Hard rule in `AGENTS.md` + CODEOWNER review     |
| Outdated dependency knowledge | Training cutoff ~6 months prior              | Always verify versions against `package.json`   |

## Use Cases in gtcx-core

1. **Protocol Architect sessions**: Architecture decisions, cross-package refactors, ADR drafting
2. **Security review assistant**: Threat modeling, audit response drafting (human-reviewed)
3. **Documentation generation**: Machine-readable docs, spec files, runbooks
4. **Test generation**: Coverage gap analysis, chaos test design, property test scaffolding

## Safety Considerations

- **Never** allows Claude output to approve security-sensitive changes without `crypto-security-engineer` review
- **Never** allows Claude to modify `docs/security/threat-control-matrix.md` without human sign-off
- **Always** run full quality gate (`pnpm architecture:check && pnpm lint && pnpm test`) after Claude-driven refactors
- Claude Code CLI has file-system access — restrict to working directory only

## Evaluation Criteria

| Metric                  | Threshold | Measurement Method                          |
| ----------------------- | --------- | ------------------------------------------- |
| Test pass rate post-edit | ≥98%      | `pnpm test` after Claude session            |
| Lint cleanliness        | 0 errors  | `pnpm lint` after Claude session            |
| Architecture violations | 0         | `pnpm architecture:check` after session     |
| Doc frontmatter validity| 100%      | `pnpm docs:check-frontmatter` after session |
| Coverage regression     | None      | Compare `pnpm test --coverage` before/after |

## Human Review Requirements

- All changes to `packages/crypto/`, `packages/security/`, `packages/verification/`, `packages/identity/`, `rust/gtcx-crypto/`, `rust/gtcx-zkp/` require `crypto-security-engineer` review
- ADR status changes (Draft → Accepted) require human decision
- Any change to `benchmarks/performance-budgets.json` requires `quality-evidence-lead` review

## Version History

| Date       | Version               | Notes                                      |
| ---------- | --------------------- | ------------------------------------------ |
| 2026-05-12 | claude-sonnet-4-20250514 | Initial model card                         |
| 2026-05-19 | claude-sonnet-4-20250514 | Updated evaluation criteria, use cases     |
