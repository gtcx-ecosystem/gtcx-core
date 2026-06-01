---
title: 'GA Release Records'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'release']
review_cycle: 'on-change'
---

# GA Release Records

Active log of `gtcx-core` package releases. Add an entry here when packages are published.

## Release Log

| Date | Packages Released | Versions | CI All Green | Crypto Eng Sign-off | Notes |
| ---- | ----------------- | -------- | :----------: | :-----------------: | ----- |

## How to Use

When a release is cut via Changesets:

1. Add a row to the table above
2. List every package published in this release
3. Confirm CI gates passed (link to GitHub Actions run if available)
4. Record Cryptographic Security Engineer sign-off if any crypto packages changed

For the full release gate sequence, see:
`docs/devops/release-mgmt/release-checklist.md`
