---
title: 'Docs Standard Compliance 2026 05 10'
status: 'superseded'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# Docs Standard Compliance Audit — 2026-05-10

> **Status:** Superseded — see [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md)
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Scope:** Application of `gtcx-ecosystem/audit/forensic-doc-standard-prompt.md` to `gtcx-core`
**Reference standard version:** 2026-05-10 canonical ecosystem prompt set

## Compliance Scores

| Axis                |      Score | Findings                                                                                                                                                                                              |
| ------------------- | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structural          |     8.4/10 | Canonical audit/governance/operations/guides/reference entrypoints added; some legacy top-level dirs (`agile/`, `devops/`, `gtm/`, `stack/`, `deployment/`, `quality/`) retained for repo continuity. |
| Naming              |    10.0/10 | No prohibited markdown names remain under `01-docs/`.                                                                                                                                                 |
| Frontmatter         |    10.0/10 | Standard `Status / Date / Owner` header added across substantive docs missing it.                                                                                                                     |
| Linking             |     8.8/10 | Canonical path updates applied for `01-docs/05-audit/`, `01-docs/governance/trust-portal.md`, and `01-docs/04-ops/repo-bootstrap.md`; legacy link style still warrants periodic review.               |
| Length              |     9.2/10 | Reference and audit docs exceed operational limits by design; no new long-form sprawl introduced in the standardization pass.                                                                         |
| Agentic Conventions |     8.7/10 | New entrypoints are conclusion-first and scoped; some legacy docs remain prose-heavy and should be tightened over time.                                                                               |
| RAG                 |    10.0/10 | Added `baseline.config.ts` with canonical knowledge path and exclusion contract.                                                                                                                      |
| Master INDEX        |     9.4/10 | Rewritten `01-docs/README.md` now follows the required section pattern and lookup-table model.                                                                                                        |
| **Overall**         | **9.1/10** |                                                                                                                                                                                                       |

## Violations Fixed

| Violation                                           | Files Affected                                                                                                                                                                                 | Resolution                                                                                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Non-canonical audit root                            | `01-docs/audits/*`                                                                                                                                                                             | Moved to `01-docs/05-audit/` with `git mv` and updated references.                                                         |
| Trust portal in non-canonical location              | `01-docs/trust/README.md`                                                                                                                                                                      | Moved to `01-docs/governance/trust-portal.md`.                                                                             |
| Ops bootstrap outside canonical operations path     | `01-docs/ops/repo-bootstrap.md`, `03-platform/tools/check-ops-prereqs.mjs`                                                                                                                     | Moved output doc to `01-docs/04-ops/repo-bootstrap.md` and updated generator references.                                   |
| Missing required entrypoints                        | `01-docs/start-here.md`, `01-docs/guides/getting-started.md`, `01-docs/04-ops/runbook.md`, `01-docs/reference/api-reference.md`, `01-docs/01-agents/overview.md`, `01-docs/devops/overview.md` | Added canonical entrypoint docs to satisfy navigation and acceptance requirements.                                         |
| Missing frontmatter on substantive docs             | Broad `01-docs/**` coverage                                                                                                                                                                    | Added standard `Status / Date / Owner` headers in bulk.                                                                    |
| Generated API docs living inside tracked `01-docs/` | `01-docs/api/`, `typedoc.json`                                                                                                                                                                 | Removed generated artifact tree from the docs source-of-truth path and redirected Typedoc output to `artifacts/api-docs/`. |
| Missing RAG contract                                | `baseline.config.ts`                                                                                                                                                                           | Added canonical knowledge-path and exclude configuration.                                                                  |

## Violations Remaining (Justified)

| Violation                                                                                                                            | Reason                                                                                                                                                                                     | Owner                   | Re-review by |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ------------ |
| Legacy top-level taxonomy (`agile/`, `devops/`, `gtm/`, `stack/`, `deployment/`, `quality/`) remains alongside canonical entrypoints | These paths are deeply referenced by repo automation, onboarding, and downstream docs. Renaming them in this pass would create unnecessary churn relative to the compliance uplift gained. | Protocol Architect      | 2026-08-10   |
| Some legacy docs still use dense prose instead of stronger table-first formatting                                                    | Content is correct and now status-scoped, but not all historical docs were rewritten for agentic style in this pass.                                                                       | Quality & Evidence Lead | 2026-08-10   |

## Files Moved/Renamed

- `01-docs/audits/` → `01-docs/05-audit/`
- `01-docs/trust/README.md` → `01-docs/governance/trust-portal.md`
- `01-docs/ops/repo-bootstrap.md` → `01-docs/04-ops/repo-bootstrap.md`

## Cross-references Updated

- `01-docs/audits/` → `01-docs/05-audit/`
- `01-docs/trust/README.md` → `01-docs/governance/trust-portal.md`
- `01-docs/ops/repo-bootstrap.md` → `01-docs/04-ops/repo-bootstrap.md`

## Sign-off

| Role      | Status  | Date       |
| --------- | ------- | ---------- |
| Author    | Drafted | 2026-05-10 |
| Repo lead | Pending | —          |
