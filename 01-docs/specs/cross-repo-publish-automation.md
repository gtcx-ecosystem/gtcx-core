---
title: 'Cross-Repo Publish Automation Specification'
status: 'current'
date: '2026-05-17'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-17/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs', 'cross-repo', 'automation']
review_cycle: 'on-change'
---

---

title: 'Cross-Repo Publish Automation Specification'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'strategic'
tags: ['specs', 'cross-repo', 'automation', 'npm', 'ci']
review_cycle: 'on-change'

---

# Cross-Repo Publish Automation Specification

> **Status:** Current  
> **Date:** 2026-05-17  
> **Owner:** Protocol Architect  
> **Classification:** Strategic — changes require protocol-architect + devops sign-off  
> **Replaces:** Manual coordination in `01-docs/05-audit/agile/cross-repo-coordination.md`

---

## 1. Purpose

When `gtcx-core` publishes packages to npm, every downstream repo that consumes those packages must be notified and offered an automated version bump. This spec defines the automation that replaces the current manual process (Slack posts, PR description mentions, standup drop-ins).

---

## 2. Current State (Manual)

Per `01-docs/05-audit/agile/cross-repo-coordination.md`:

| Step                 | Current Process                                     | Pain Point             |
| -------------------- | --------------------------------------------------- | ---------------------- |
| Detect publish       | Human posts in `ClickUp / baseline-os` Slack        | Delayed, inconsistent  |
| Identify consumers   | Human remembers which repos use which packages      | Error-prone            |
| Open bump PRs        | Engineer manually edits `package.json` in each repo | Tedious, often skipped |
| Verify compatibility | CI runs only after human opens PR                   | No proactive signal    |
| Sign-off             | PR description mentions or standup call             | Easy to miss           |

**Result:** Downstream repos lag behind published versions by days or weeks. `workspace:*` references persist longer than intended.

---

## 3. Target State (Automated)

```
gtcx-core release.yml (npm publish succeeds)
         │
         ▼
┌─────────────────────────────┐
│  cross-repo-publish.yml     │
│  (triggered on publish)     │
└─────────────┬───────────────┘
              │
    ┌─────────┼─────────┬──────────┐
    ▼         ▼         ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐
│gtcx-  │ │gtcx-  │ │gtcx-  │ │baseline│
│protocol│ │intel  │ │platform│ │-os     │
└───┬───┘ └───┬───┘ └───┬───┘ └───┬────┘
    │         │         │          │
    ▼         ▼         ▼          ▼
┌────────────────────────────────────────┐
│  Auto-opened PR: "chore(deps): bump   │
│  @gtcx/* to v3.1.1"                    │
│  + compatibility CI run                │
└────────────────────────────────────────┘
```

---

## 4. Downstream Registry

A machine-readable registry of downstream consumers lives in `gtcx-core/03-platform/scripts/downstream-registry.json`.

```json
{
  "version": "1.0",
  "downstreams": [
    {
      "repo": "gtcx-protocols",
      "owner": "gtcx-ecosystem",
      "packages": ["@gtcx/crypto", "@gtcx/types", "@gtcx/workproof"],
      "bump_strategy": "minor_auto",
      "required_checks": ["ci", "typecheck", "test"],
      "reviewers": ["protocol-architect"]
    },
    {
      "repo": "gtcx-intelligence",
      "owner": "gtcx-ecosystem",
      "packages": ["@gtcx/ai", "@gtcx/telemetry"],
      "bump_strategy": "minor_auto",
      "required_checks": ["ci", "test"],
      "reviewers": ["frontier-infra-engineer"]
    },
    {
      "repo": "gtcx-platforms",
      "owner": "gtcx-ecosystem",
      "packages": ["@gtcx/crypto", "@gtcx/types", "@gtcx/domain", "@gtcx/schemas"],
      "bump_strategy": "minor_auto",
      "required_checks": ["ci", "build"],
      "reviewers": ["platform-lead"]
    },
    {
      "repo": "gtcx-infrastructure",
      "owner": "gtcx-ecosystem",
      "packages": ["@gtcx/security", "@gtcx/telemetry"],
      "bump_strategy": "patch_manual",
      "required_checks": ["ci", "security-scan"],
      "reviewers": ["devops-lead"]
    },
    {
      "repo": "baseline-os",
      "owner": "gtcx-ecosystem",
      "packages": ["@gtcx/crypto-native"],
      "bump_strategy": "minor_manual",
      "required_checks": ["ci", "test", "typecheck"],
      "reviewers": ["protocol-architect"]
    }
  ]
}
```

**Bump Strategies:**

- `minor_auto` — Open PR automatically for minor/patch releases
- `patch_auto` — Open PR automatically for patch releases only
- `minor_manual` — Open draft PR automatically; require human to undraft
- `patch_manual` — Open draft PR for patch; require human for minor

---

## 5. Workflow

### 5.1 Trigger

The workflow runs after `release.yml` completes successfully:

```yaml
# .github/workflows/cross-repo-publish.yml
name: Cross-Repo Publish

on:
  workflow_run:
    workflows: ['Release']
    types: [completed]
    branches: [main]

jobs:
  publish:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    # ... see full workflow in 03-platform/scripts/cross-repo-publish.yml
```

### 5.2 Steps

1. **Extract published versions** from `package.json` files that changed in the release commit
2. **Load downstream registry** from `03-platform/scripts/downstream-registry.json`
3. **Filter affected downstreams** — only repos that consume changed packages
4. **For each affected downstream:**
   a. Clone the repo (shallow, single branch)
   b. Run `pnpm update <package>@<version>` for each affected package
   c. Run `pnpm install` to update lockfile
   d. Run the downstream's `required_checks` locally (best-effort)
   e. Commit changes to a branch: `gtcx-core/bump-<package>-<version>-<timestamp>`
   f. Push branch
   g. Open PR with title: `chore(deps): bump @gtcx/<package> to v<version>`
   h. Add `reviewers` from registry
   i. Add label: `cross-repo-bump`, `auto-generated`
   j. Body includes: change summary, compatibility CI link, rollback instructions
5. **Report summary** as workflow artifact + Slack notification (optional)

### 5.3 PR Template

````markdown
## Automated Dependency Bump

**Source:** gtcx-core release [${{ github.run_id }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})
**Packages updated:**

- `@gtcx/crypto`: 3.1.0 → 3.1.1
- `@gtcx/types`: 2.4.0 → 2.4.1

**Compatibility check:** ${{ steps.compat.outputs.status }}
**Breaking changes:** ${{ steps.changelog.outputs.breaking }}

### Rollback

```bash
git revert $(git log --grep="bump @gtcx" --oneline -1 | awk '{print $1}')
```
````

_This PR was auto-generated by the cross-repo publish pipeline._
Do not edit the branch name — it is used for pipeline tracking.

````

---

## 6. Compatibility Check (Best-Effort)

Before opening the PR, the pipeline runs a lightweight compatibility check in a temporary clone:

```bash
cd /tmp/downstream-clone
pnpm install
pnpm typecheck   # or fallback to tsc --noEmit
pnpm test        # or fallback to pnpm test --run
pnpm build       # if available
````

**Results:**

- `PASS` — All checks green → open normal PR
- `WARN` — Typecheck or test warnings → open PR with `needs-review` label
- `FAIL` — Build or test failure → open **draft PR** with `compatibility-failure` label + detailed error log

---

## 7. Safety Mechanisms

| Mechanism                | Purpose                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `bump_strategy` per repo | Prevents auto-merge of risky repos (infrastructure, baseline-os)                            |
| Draft PR on failure      | Never auto-open a failing PR as ready-to-merge                                              |
| Branch naming convention | `gtcx-core/bump-*` allows easy identification and bulk cleanup                              |
| Rate limiting            | Max 5 open bump PRs per downstream repo at any time                                         |
| Exclusion list           | `03-platform/scripts/downstream-registry.json` `exclude_releases` array for emergency skips |
| Human override           | Workflow can be skipped per-release by adding `[skip-cross-repo]` to release commit message |

---

## 8. Implementation Plan

| Step | Deliverable                                                 | Owner              | Effort | Target     |
| ---- | ----------------------------------------------------------- | ------------------ | ------ | ---------- |
| 1    | `03-platform/scripts/downstream-registry.json`              | Protocol Architect | S      | 2026-05-18 |
| 2    | `03-platform/scripts/open-downstream-prs.ts`                | DevOps             | M      | 2026-05-21 |
| 3    | `.github/workflows/cross-repo-publish.yml`                  | DevOps             | M      | 2026-05-22 |
| 4    | Test with gtcx-protocols (single downstream)                | DevOps             | S      | 2026-05-23 |
| 5    | Add gtcx-intelligence + gtcx-platforms                      | DevOps             | S      | 2026-05-26 |
| 6    | Add gtcx-infrastructure + baseline-os                       | DevOps             | S      | 2026-05-27 |
| 7    | Monitor + tune for 2 releases                               | DevOps             | S      | 2026-06-03 |
| 8    | Update `cross-repo-coordination.md` to reference automation | Protocol Architect | XS     | 2026-06-03 |

---

## 9. Acceptance Criteria

- [ ] A gtcx-core release auto-opens a PR in gtcx-protocols within 10 minutes
- [ ] PR includes correct version bumps, lockfile updates, and changelog summary
- [ ] Compatibility check runs before PR is opened
- [ ] Draft PR is opened if compatibility check fails
- [ ] No more than 5 open bump PRs per downstream repo
- [ ] `[skip-cross-repo]` in commit message suppresses the workflow
- [ ] Manual `workflow_dispatch` can target a single downstream repo for testing
- [ ] Registry update does not require CI redeploy (JSON file change only)

---

## 10. Rollback

If the pipeline malfunctions:

1. Disable workflow in GitHub UI
2. Close all `gtcx-core/bump-*` branches in affected repos
3. Revert to manual process documented in `01-docs/05-audit/agile/cross-repo-coordination.md`
4. Post-incident review within 48 hours

---

## 11. References

- `01-docs/05-audit/agile/cross-repo-coordination.md` — Current manual process
- `.github/workflows/release.yml` — Triggering workflow
- `01-docs/05-audit/agile/roadmap.md` — "Cross-repo event bus (typed events)" P1 Q3 2026 (future evolution)
