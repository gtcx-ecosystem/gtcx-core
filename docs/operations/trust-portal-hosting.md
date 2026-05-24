---
title: 'Trust Portal Hosting'
status: 'current'
date: '2026-05-22'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['operations', 'trust-portal', 'github-pages', 'hosting']
review_cycle: 'on-change'
---

# Trust Portal Hosting Runbook

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Frontier Infrastructure Engineer

Operational runbook for publishing the [trust portal](../governance/trust-portal.md) and supporting documentation as a static site at a regulator-friendly URL. Required by Sprint 3 task 3.2 of the [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md).

## What this gives you

A stable, public, no-NDA URL serving the entire `/docs` tree. Initial URL:

```
https://gtcx-ecosystem.github.io/gtcx-core/
```

After custom DNS:

```
https://trust.gtcx.io
```

The site auto-rebuilds and redeploys on every push to `main` that touches `docs/**` or the Pages workflow itself.

## What's already in the repo

| Artifact                      | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `docs/_config.yml`            | Jekyll config: theme (`minima`), plugins, baseurl |
| `docs/Gemfile`                | Pinned to `github-pages` gem set for parity       |
| `.github/workflows/pages.yml` | Builds Jekyll, uploads artifact, deploys to Pages |

## One-time setup (manual, requires repo admin)

The workflow runs automatically but requires Pages to be enabled in the repo settings. This is a one-time admin action that cannot be automated from CI.

### 1. Enable GitHub Pages with Actions as the source

```bash
# Visit: https://github.com/gtcx-ecosystem/gtcx-core/settings/pages
# Source: GitHub Actions
```

Or via the API:

```bash
gh api -X PUT repos/gtcx-ecosystem/gtcx-core/pages \
  -f build_type=workflow \
  -f source.branch=main
```

### 2. Trigger the first build

```bash
gh workflow run pages.yml --repo gtcx-ecosystem/gtcx-core
gh run watch --repo gtcx-ecosystem/gtcx-core
```

### 3. Verify the site

```bash
curl -fsS https://gtcx-ecosystem.github.io/gtcx-core/ \
  | grep -q "gtcx-core Trust Portal" \
  && echo "Site live"
```

## Custom domain (`trust.gtcx.io`)

Add the DNS records, commit the `CNAME` file, then verify.

### 1. DNS records (at the registrar for `gtcx.io`)

```
trust.gtcx.io.  CNAME  gtcx-ecosystem.github.io.
```

For apex domain coverage, add A records pointing at GitHub's Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).

### 2. Add CNAME file

```bash
echo "trust.gtcx.io" > docs/CNAME
git add docs/CNAME
git commit -m "feat(pages): add trust.gtcx.io custom domain"
git push
```

### 3. Enable HTTPS in Pages settings

```bash
# In GitHub UI: Settings → Pages → Enforce HTTPS (after Let's Encrypt issues the cert)
```

The certificate provisioning is automatic and usually completes within 5–30 minutes.

### 4. Update internal references

Update `url` in `docs/_config.yml` from `https://gtcx-ecosystem.github.io` to `https://trust.gtcx.io` and drop the `baseurl`. Update the URL in `README.md` and `docs/governance/trust-portal.md`.

## Verifying the deployed site

After every deploy, the GitHub Pages environment URL is posted on the workflow run. The site should answer for these representative paths:

| Path                                                            | Should render                           |
| --------------------------------------------------------------- | --------------------------------------- |
| `/`                                                             | `docs/README.md` (master INDEX)         |
| `/governance/trust-portal`                                      | The current trust portal evidence index |
| `/audit/internal-completion-audit-2026-05-21`                   | The 9.5/10 internal completion audit    |
| `/audit/fuzz-campaign-evidence-2026-05-21`                      | Fuzz campaign evidence                  |
| `/agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22` | Engagement readiness roadmap            |
| `/audit/anti-inflation-audit-results-2026-05-11`                | Forensic anti-inflation audit           |

Relative links between docs use the `jekyll-relative-links` plugin and resolve `.md` → `.html` automatically at build time. No source changes needed.

## Known limitations

- Jekyll minima is functional, not designer-polished. Acceptable for regulator/auditor use; if a marketing-grade site is needed later, swap the theme via `docs/_config.yml`.
- GitHub Pages builds time out at 10 minutes. Current docs tree builds in ~15 seconds.
- Pages requires the repo to be public, or the repo owner to have a paid plan for private-repo Pages. `gtcx-core` is public, so no constraint.

## Reverting

If a build breaks the site:

```bash
gh run list --workflow=pages.yml --limit 5
gh run view <run-id>          # diagnose
git revert <bad-commit>       # roll forward by reverting the offending change
git push                      # triggers a fresh build
```

To temporarily take the site offline:

```bash
# Repo Settings → Pages → Source: None
# (or via API: gh api -X DELETE repos/gtcx-ecosystem/gtcx-core/pages)
```
