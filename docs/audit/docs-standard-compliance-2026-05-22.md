---
title: 'Docs Standard Compliance — 2026-05-22'
status: 'current'
date: '2026-05-22'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit', 'compliance', 'hygiene']
review_cycle: 'quarterly'
---

# Docs Standard Compliance Audit — 2026-05-22

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Quality & Evidence Lead
> **Supersedes:** [docs-standard-compliance-2026-05-10.md](./docs-standard-compliance-2026-05-10.md)

**Scope:** Re-application of [`forensic-doc-standard-prompt.md`](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/audit/prompts/docs/forensic-doc-standard-prompt.md) and [`forensic-repo-hygiene-prompt.md`](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/audit/prompts/hygiene/forensic-repo-hygiene-prompt.md) to `gtcx-core`.

**Reference standard versions:**

- `forensic-doc-standard-prompt.md` — canonical `/docs/` taxonomy + INDEX rules
- `forensic-repo-hygiene-prompt.md` — 8-axis repo hygiene scoring (root cleanliness, README discipline, naming, orphans)
- `forensic-docs-machine-readable-prompt.md` — YAML frontmatter + structured data requirements

**Driver:** Imminent sovereign-state engagements (Zimbabwe, Ghana, Namibia, Botswana, DRC) require auditable evidence that the documentation surface a regulator clones matches enterprise/bank-grade standards.

---

## Compliance Scores

| Axis                |       Score | Δ vs 2026-05-10 | Findings                                                                                                                                                                                                |
| ------------------- | ----------: | --------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structural          |  **9.4/10** |            +1.0 | Single canonical `/docs/` root. Root-level orphan `audit/` directory closed; empty `docs/audit/_historical/` removed (`91fc9f6`). Legacy taxonomy preserved per prior justification.                    |
| Naming              | **10.0/10** |               — | All `docs/**/*.md` files kebab-case. ALL_CAPS audit filename renamed to `anti-inflation-audit-results-2026-05-11.md`. Root `.md` files all in standard allowlist (AGENTS, CLAUDE, etc).                 |
| Frontmatter         | **10.0/10** |               — | `pnpm docs:check-frontmatter` — **222/222 files valid**, 42 excluded by pattern (`**/README.md`, templates, agent sessions). Schema enforced by `tools/check-doc-frontmatter.mjs`.                      |
| Linking             | **10.0/10** |            +1.2 | `pnpm docs:check-links` — **348/348 files clean**, including all intra-repo and cross-doc references. Stale link to `audit/anti-inflation-audit-RESULTS-…` corrected in 10/10 roadmap docs (`91fc9f6`). |
| Length              |  **9.2/10** |               — | Reference and audit docs exceed operational limits by design; no new long-form sprawl. Audit docs land at canonical size for evidence purposes.                                                         |
| Agentic Conventions |  **9.0/10** |            +0.3 | New audit + engagement-roadmap docs conclusion-first with explicit tables; legacy operational docs partially tightened but not exhaustively rewritten.                                                  |
| RAG                 | **10.0/10** |               — | `baseline.config.ts` canonical knowledge-path and exclude contract present and current.                                                                                                                 |
| Master INDEX        |  **9.4/10** |               — | `docs/README.md` rewritten as canonical INDEX with audience-driven sections per `forensic-doc-cleanup-prompt.md`. Lookup-table model preserved.                                                         |
| **Overall**         |  **9.6/10** |            +0.5 |                                                                                                                                                                                                         |

## Violations Closed in This Cycle

| Violation                                                                                        | Source Rule                                                                            | Resolution                                                                                                                                                   | Commit    |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| Root-level `audit/` directory holding 1 file outside `/docs/`                                    | `forensic-repo-hygiene-prompt.md` Axis 1 (root cleanliness) + single-doc-root rule     | `git mv audit/anti-inflation-audit-RESULTS-2026-05-11.md docs/audit/anti-inflation-audit-results-2026-05-11.md`; directory removed; inbound links updated.   | `91fc9f6` |
| Audit filename containing `RESULTS` (ALL_CAPS)                                                   | `forensic-repo-hygiene-prompt.md` Axis 5 (kebab-case markdown rule)                    | Renamed to kebab-case in same `git mv`. Added YAML frontmatter so the relocated file passes `docs:check-frontmatter`.                                        | `91fc9f6` |
| Empty `docs/audit/_historical/` directory                                                        | `forensic-repo-hygiene-prompt.md` Axis 8 (empty/orphan dirs)                           | `rmdir docs/audit/_historical/` — directory had no files (not even `.gitkeep`).                                                                              | `91fc9f6` |
| Stale 8.63/10 composite + 13 packages marked "Functional / pending validation" in README         | `forensic-doc-standard-prompt.md` (current-state accuracy) + machine-readability rules | README "Current State" and Package Readiness Matrix aligned to 9.5/10 audit; all 19 testable packages graduated to Production-hardened with branch coverage. | `ae15402` |
| Trust portal missing references to 2026-05-21 audit + fuzz evidence                              | `forensic-doc-standard-prompt.md` (linking + evidence currency)                        | Added "Current readiness (2026-05-21)" table with dimension/value/evidence cross-references to current artifacts.                                            | `ae15402` |
| 2026-05-22 engagement roadmap frontmatter violations (`tags` multi-line, invalid `review_cycle`) | `forensic-docs-machine-readable-prompt.md` (frontmatter schema)                        | `tags` reverted to single-line inline array; `review_cycle: 'weekly'` → `'on-change'` (in allowed enum).                                                     | `7da539c` |

## Violations Remaining (Justified)

| Violation                                                                                                                            | Reason                                                                                                                                                                               | Owner                   | Re-review by |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ------------ |
| Legacy top-level doc taxonomy (`agile/`, `devops/`, `gtm/`, `stack/`, `deployment/`, `quality/`) remains alongside canonical entries | These paths are deeply referenced by repo automation, onboarding docs, and downstream products. Renaming creates churn beyond the compliance uplift gained.                          | Protocol Architect      | 2026-08-22   |
| Some legacy operational docs still use dense prose instead of stronger table-first formatting                                        | Content is correct and status-scoped; not exhaustively rewritten for agentic style. Will be addressed incrementally during engagement-readiness sprints.                             | Quality & Evidence Lead | 2026-08-22   |
| `docs/agents/sessions/index.md` does not follow `README.md` convention for directory indices                                         | Intentional design — file is referenced as `docs/agents/sessions/index.md` in agent session-handoff protocol; renaming would cascade-update agent instructions across the ecosystem. | Protocol Architect      | On-change    |

## Standards Coverage — gtcx-agentic Forensic Prompts

Each prompt from `gtcx-agentic/audit/prompts/` is mapped to applicable enforcement in `gtcx-core`:

| Prompt                                     | Applies to gtcx-core? | Local Enforcement                                                                                                                                    |
| ------------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `forensic-doc-standard-prompt.md`          | Yes                   | `tools/check-doc-frontmatter.mjs` + `tools/check-markdown-links.mjs`; canonical `/docs/` tree manually audited each cycle.                           |
| `forensic-doc-cleanup-prompt.md`           | Yes                   | Master INDEX in `docs/README.md`; no `_sop/`, `_cannon/`, `wiki/` competing roots; `docs/overview/README.md` retained as canonical bridge doc.       |
| `forensic-docs-machine-readable-prompt.md` | Yes                   | YAML frontmatter schema in `tools/check-doc-frontmatter.mjs` mirrors `docs/agents/docs-standard-machine-readable.md`. Enforced 222/222.              |
| `forensic-repo-hygiene-prompt.md`          | Yes                   | Manual 8-axis audit each cycle. Closed in `91fc9f6`: orphan-at-root, kebab-case naming, empty directories.                                           |
| `forensic-full-audit-prompt.md`            | Yes                   | Latest applicable: [`docs/audit/internal-completion-audit-2026-05-21.md`](./internal-completion-audit-2026-05-21.md) (9.5/10 composite, 24/24 done). |
| `forensic-verification-audit-prompt.md`    | Yes                   | [`docs/audit/anti-inflation-audit-results-2026-05-11.md`](./anti-inflation-audit-results-2026-05-11.md) — anti-inflation forensic verification.      |
| `forensic-master-prompt.md`                | Yes                   | Master audit series: `docs/audit/master-audit-2026-05-{10,11,12}.md`; superseded by internal-completion-audit-2026-05-21 for current composite.      |
| `repo-overview-prompt.md`                  | Yes                   | [`docs/overview/README.md`](../overview/README.md) — 46 KB canonical bridge doc; status `current`, last updated 2026-05-17.                          |
| `10-10-roadmap-prompt.md`                  | Yes                   | Series: `docs/audit/10-10-roadmap-2026-05-{11,13,17,19}.md`; latest is 2026-05-19, reflecting M2+ at 9.5/10.                                         |

## Out-of-Scope (Justified)

| Standard                                                  | Reason                                                                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overlays/gtcx-core.md` (repo-specific overlay)           | Lives in `gtcx-agentic` repo, not `gtcx-core`. Out of scope for "this repo" application. Standard framework rules apply by default per design.          |
| GTM/marketing audit                                       | gtcx-core is a library; no end-user surface. GTM docs (`docs/gtm/`) target institutional partners and are reviewed under the standard frontmatter pass. |
| External pen test, SOC 2 Type 1 attestation               | Long-lead external work; kicked off in Sprint 4 of [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md).  |
| Lens-specific scoring (Investor / Enterprise / Sovereign) | Performed in master audit series, not in doc-standard compliance scope. See `internal-completion-audit-2026-05-21.md`.                                  |

## Verification Commands

These commands produce the evidence underlying this audit:

```bash
# Frontmatter compliance
pnpm docs:check-frontmatter     # expects: 222/222 valid

# Link integrity
pnpm docs:check-links            # expects: 348 files passing

# Orphan-at-root check (Axis 1)
find . -maxdepth 1 -type f -name "*.md" | grep -vE \
  "^./(README|LICENSE|CHANGELOG|CODEOWNERS|SECURITY|CONTRIBUTING|CODE_OF_CONDUCT|AGENTS|CLAUDE|CODEX|GEMINI|KIMI|CONVENTIONS)\.md$"
# expects: no output

# ALL_CAPS markdown check (Axis 5)
find docs -type f -name "*.md" -exec basename {} \; | grep -E "^[A-Z][A-Z_0-9-]+\.md$" | grep -v "^README.md$"
# expects: no output

# Empty/README-only docs subdir check (Axis 8)
for d in $(find docs -type d); do
  total=$(find "$d" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')
  [ "$total" = "0" ] && echo "EMPTY: $d"
done
# expects: no EMPTY output

# Single-canonical-doc-root check
find . -maxdepth 2 -type d -name "_sop" -o -name "_cannon" -o -name "wiki" -o -name "documentation"
# expects: no output
```

## Sign-off

| Role      | Status  | Date       |
| --------- | ------- | ---------- |
| Author    | Drafted | 2026-05-22 |
| Repo lead | Pending | —          |
