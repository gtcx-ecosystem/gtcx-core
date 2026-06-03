---
title: 'Engagement Readiness — Trust Automation (Phase 6)'
status: 'current'
date: '2026-05-22'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['agile', 'roadmap', 'trust', 'ai-eval']
review_cycle: 'on-change'
---

# Engagement Readiness — Trust Automation (Phase 6)

> Parent: [Engagement Readiness Sprint Roadmap](./engagement-readiness-sprint-roadmap-2026-05-22.md)

## Phase 6 — Trust automation moat (post-engagement, Q2–Q3 2026)

**Strategic opportunity** ([full-audit-2026-06-01](../../audit/full-audit-2026-06-01.md)): **`@gtcx/ai-eval` scorecards + machine-readable trust artifacts every release.** Hard to copy quickly because it encodes `safety-rules.json`, CI gate semantics, and release evidence — not just crypto primitives.

Runs in parallel with Sprint 4 external compliance; does not block sovereign sandbox send.

| #   | Task                    | Files / commands                                                      | Effort | Acceptance criteria                                                               |
| --- | ----------------------- | --------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------- |
| 6.1 | CI scorecard artifact   | `.github/workflows/ci.yml`, `packages/ai-eval/`                       | M      | `pnpm ai:evaluate --output artifacts/ai-scorecard.json` uploaded per `main` build |
| 6.2 | GA evidence integration | `tools/generate-ga-evidence-summary.mjs`, `release:ga:evidence:check` | S      | Release evidence fails if scorecard missing or stale                              |
| 6.3 | Trust portal link       | `docs/governance/trust-portal.md`                                     | S      | Regulators can download scorecard for each published npm version                  |
| 6.4 | Spec-drift rules        | `packages/ai-eval/src/`                                               | M      | Scorecard flags README blockers + package-count drift vs `architecture:check`     |

**Canonical roadmap:** [docs/roadmap.md §4.10](../../roadmap.md#410-gtcxai-eval--machine-readable-trust-scorecards-strategic-moat)

---
