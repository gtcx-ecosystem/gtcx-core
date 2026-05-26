---
title: 'Trust Portal Hosting'
status: 'current'
date: '2026-05-22'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['operations', 'trust-portal', 'gitbook', 'hosting']
review_cycle: 'on-change'
---

# Trust Portal Hosting Runbook

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Frontier Infrastructure Engineer

Operational runbook for publishing the [trust portal](../governance/trust-portal.md) via GitBook at a regulator-friendly URL. Required by Sprint 3 task 3.2 of the [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md).

## What this gives you

GitBook space: `https://gtcx-protocol.gitbook.io/gtcx-open-source/`

The trust portal and supporting documentation are published via GitBook sync from the `docs/` directory. GitBook rebuilds automatically when the synced source changes.

## What's already in the repo

| Artifact                          | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `docs/gitbook/`                   | GitBook-structured external-facing product docs |
| `docs/governance/trust-portal.md` | Canonical external-facing evidence index        |

## One-time setup

GitBook sync is configured at the organization level. No per-repo CI workflow is required.

### 1. Verify GitBook sync is active

Check that the `gtcx-open-source` GitBook space is synced to `gtcx-ecosystem/gtcx-core/docs`.

### 2. Verify the site

```bash
curl -fsS https://gtcx-protocol.gitbook.io/gtcx-open-source/governance/trust-portal \
  | grep -q "gtcx-core Trust Portal" \
  && echo "Site live"
```

## Custom domain

GitBook custom domains are configured in the GitBook workspace settings, not in this repo.

1. Open the `gtcx-open-source` space in GitBook
2. Settings → Domains → Add custom domain
3. Follow GitBook's DNS verification instructions
4. Update internal references to use the custom domain once provisioned

## Verifying the deployed site

After every GitBook sync, the site should answer for these representative paths:

| Path                                                            | Should render                           |
| --------------------------------------------------------------- | --------------------------------------- |
| `/`                                                             | `docs/README.md` (master INDEX)         |
| `/governance/trust-portal`                                      | The current trust portal evidence index |
| `/audit/internal-completion-audit-2026-05-21`                   | The 9.5/10 internal completion audit    |
| `/audit/fuzz-campaign-evidence-2026-05-21`                      | Fuzz campaign evidence                  |
| `/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22` | Engagement readiness roadmap            |
| `/audit/anti-inflation-audit-results-2026-05-11`                | Forensic anti-inflation audit           |

Relative links between docs are resolved by GitBook's sync engine. No source changes needed for `.md` → page mapping.

## Known limitations

- GitBook rendering is polished and regulator-friendly out of the box.
- GitBook sync is automatic on source changes; no build timeout concerns.
- Public repo sync requires a GitBook plan with GitHub integration enabled.

## Reverting

If a sync breaks the site:

1. Identify the bad commit via GitBook's sync history
2. Revert the offending change in this repo
3. GitBook will re-sync automatically

To temporarily take the site offline:

1. GitBook space settings → Visibility → Private (or unpublish)
2. Alternatively: disconnect the GitHub sync source
