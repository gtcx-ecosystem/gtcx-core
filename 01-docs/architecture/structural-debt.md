---
title: 'Documentation Structural Debt'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'architecture']
review_cycle: 'on-change'
---

---

title: 'Documentation Structural Debt'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'strategic'
tags: ['architecture', 'documentation', 'debt', 'hygiene']
review_cycle: 'on-change'

---

# Documentation Structural Debt

> **Status:** Acknowledged, deferred
> **Current score:** 7.5 / 10 (passes Protocol 1 v2.0 minimums; not exemplary)
> **Target score:** 9.5 / 10
> **Decision date:** 2026-05-24
> **Execute window:** Post-Sprint 2.3 publish + post-W8 mobile rollout (target: mid-July 2026)

## Why this doc exists

`01-docs/` passes Protocol 1 v2.0 and protects every audit-trail requirement, but its top-level structure is wider than industry best practice and has overlapping concerns. The substance is there; the shape is not exemplary.

Restructuring during the active sovereign-state engagement window (Zimbabwe → Ghana → Namibia → Botswana → DRC) is the wrong tradeoff: blast radius is high (link cascades across this repo, downstream repos, regulator emails already in flight) and the regulator-facing value is zero (no regulator audits folder count).

This doc captures the debt so future-us executes it intentionally in a quiet window instead of re-discovering it from cold.

## Current state — 7.5 / 10

### What's good

- Protocol 1 v2.0 frontmatter: 100% compliant
- Tier 1 / Tier 2 Mermaid coverage: complete
- Every doc has an owner, status, date, review cycle, tags
- All cross-references resolve (link check passes in CI)
- Audit-trail discipline: every audit, response, log is dated and append-only

### What's not exemplary

| Issue                              | Evidence                                                                                                                       | Severity |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| **Too many top-level subdirs**     | 21 doc subdirs (industry best practice for a library: 8–12)                                                                    | Medium   |
| **Audience grouping missing**      | Alphabetized wall — `audit/`, `compliance/`, `governance/`, `security/` sit side-by-side with no "for-auditors" parent         | Medium   |
| **Overlapping concerns**           | `audit/` (27) + `compliance/` (10) + `governance/` (2) + `security/` (27) — 4 dirs with fuzzy boundaries                       | High     |
| **Imbalanced split**               | `devops/` (2) vs `operations/` (6) — same audience, one looks like a legacy artifact                                           | Medium   |
| **Subsumable subdir**              | `stack/` (4) — stack-level docs belong inside `architecture/` per Protocol 1 v2.0 canonical layout                             | Medium   |
| **Legacy carry-over**              | `remediation/` (2) — a top-level dir for two files; should fold into `audit/` or `security/`                                   | Low      |
| **Misplaced canonical concept**    | `decisions/` (18 ADRs) sits at top level; Protocol 1 v2.0 canonical placement is `architecture/decisions/`                     | Low      |
| **Same-name two-meaning conflict** | `01-docs/quality/` (human-facing quality docs) vs root `quality/` (CI-generated artifacts) — same word, two scopes, confusing  | Medium   |
| **No `engineering/` parent**       | Protocol 1 v2.0 lists `engineering/` as canonical; we have `specs/` + `architecture/` + `stack/` scattered as siblings instead | Low      |

## Target state — 9.5 / 10

Proposed consolidation: **21 top-level subdirs → 9**, grouped by audience.

```
01-docs/
├── start-here.md                     (unchanged — orientation entry point)
├── overview/                         (unchanged — repo overview, vision, principles)
├── engineering/                      ← NEW parent
│   ├── architecture/                 (was: architecture/ + stack/)
│   │   └── decisions/                (was: decisions/ — Protocol 1 canonical placement)
│   ├── specs/                        (unchanged)
│   ├── devops/                       (was: devops/ + operations/)
│   └── testing/                      (unchanged)
├── agents/                           (unchanged — agentic governance, roles, schemas)
├── security-and-compliance/          ← NEW parent
│   ├── security/                     (unchanged contents)
│   ├── compliance/                   (unchanged contents)
│   ├── governance/                   (unchanged contents)
│   └── audit/                        (was: audit/ + remediation/)
├── release/                          (unchanged)
├── gtm/                              (unchanged — engagement/sales/marketing)
├── agile/                            (unchanged — roadmap, sprints, engagement-log)
├── reference/                        (was: reference/ + guides/)
└── gitbook/                          (unchanged — library exemption stub)
```

**Result:**

- 21 subdirs → 9 (within best-practice 8–12 range)
- Clear audience grouping: engineers / security-and-compliance reviewers / GTM / agile
- Canonical Protocol 1 v2.0 layout (`architecture/decisions/`, `engineering/` parent)
- Zero loss of content — pure reshape

## Why we are deferring

| Reason                     | Detail                                                                                                                                                                                                                                       |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Engagement-window cost** | W1 of 30-day mobile rollout; W1 of sovereign-state outreach (Zimbabwe sandbox response queued). Restructure during this window risks broken links in regulator-facing artifacts.                                                             |
| **Downstream blast**       | Absolute GitHub URLs from this repo are referenced in: `gtcx-mobile` README, `gtcx-protocols` integration guides, trust portal hosting (`01-docs/04-ops/trust-portal-hosting.md`). Each link cascade requires coordination + downstream PRs. |
| **Release-pipeline noise** | release.yml is iterating to clean green; a structural restructure on top of an iterating pipeline makes gate failures harder to attribute and creates compounding rebases.                                                                   |
| **Zero regulator impact**  | No regulator engagement, no SOC 2 auditor, no pen test vendor will score against folder count. The substance — content, frontmatter, audit trail, cross-references — is what matters and is at 9.5/10 already.                               |
| **Execution cost**         | Estimated 4–6 hours of careful work plus ~2 hours of downstream-repo coordination. Fragmented across many small windows it stretches to 1–2 weeks of context-switching. Done in one quiet window post-rollout, it's one focused day.         |

## Execution plan (for the future window)

When the engagement window relaxes (post-Sprint 2.3 publish + post-W8 mobile rollout, target mid-July 2026):

1. **Phase 1 — Create new parent dirs and `git mv`** (~1 hour)
   - `git mv decisions architecture/decisions`
   - `git mv stack/* architecture/` (4 files; decide individually)
   - `git mv operations/* devops/` (6 files)
   - `git mv remediation/* audit/` (2 files)
   - `git mv guides/* reference/` (2 files)
   - Create `engineering/` and `security-and-compliance/` parents; move children

2. **Phase 2 — Fix internal links** (~1.5 hours)
   - `rg -l "01-docs/decisions"` → rewrite to `01-docs/architecture/decisions`
   - `rg -l "01-docs/stack"` → rewrite to `01-docs/architecture`
   - `rg -l "01-docs/operations"` → rewrite to `01-docs/devops`
   - `rg -l "01-docs/remediation"` → rewrite to `01-docs/05-audit`
   - `rg -l "01-docs/guides"` → rewrite to `01-docs/reference`
   - Run `pnpm docs:links:check` to confirm zero broken links

3. **Phase 3 — Update README indices** (~30 min)
   - `01-docs/README.md` top-level table
   - `01-docs/overview/README.md` if it enumerates dirs
   - Each new parent dir gets a README per Protocol 1 v2.0

4. **Phase 4 — Downstream coordination** (~2 hours, async)
   - Open a coordinating issue in `gtcx-mobile`, `gtcx-protocols` listing the moved paths
   - Issue includes a sed/rg script for downstream repos to apply automatically
   - Trust portal absolute URLs: regenerate the index in `01-docs/04-ops/trust-portal-hosting.md`

5. **Phase 5 — Audit-trail anchor** (~30 min)
   - Single commit: `refactor(docs): consolidate 21 subdirs to 9 with audience grouping`
   - Cite this debt doc in the commit body
   - Update `01-docs/05-audit/internal-completion-audit-YYYY-MM-DD.md` to reflect new 9.5/10 score

**Total focused effort:** ~6 hours of work, ~2 hours of async downstream coordination. Net 1 working day.

## Decision

**Defer to a quiet window. Track here. Do not act incrementally** — partial restructure is worse than no restructure (creates inconsistent shape during transition).

## Out of scope for this debt

- Content rewrite: not needed; content is at the bar
- Frontmatter changes: 100% compliant already
- Adding new docs: separate initiative (`01-docs/05-audit/internal-completion-audit-2026-05-21.md` covers content completeness)
- `quality/` (root) vs `01-docs/quality/` naming clash: tracked separately; the root `quality/` directory is generated CI output and renaming it has its own blast radius

## Related

- [Internal completion audit (2026-05-21)](../audit/internal-completion-audit-2026-05-21.md) — content-completeness score (9.5/10)
- [Docs standard compliance (2026-05-22)](../audit/docs-standard-compliance-2026-05-22.md) — Protocol 1 v2.0 compliance audit
- [Engagement readiness sprint roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — drives why we are deferring
