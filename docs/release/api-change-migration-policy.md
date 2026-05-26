---
title: 'Api Change Migration Policy'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# API Change Migration Policy

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Use this policy whenever a public export changes in `gtcx-core`.

---

## Additive Changes

- Require at least a minor version bump.
- Must be usable through public exports, not just internal paths.
- Must include tests that prove the new surface works for a consumer.
- Should document any new optional fields or templates in the owning package spec.

## Breaking Changes

- Require a major version bump.
- Must include migration guidance before merge.
- Must identify downstream blast radius for affected packages.
- Must not update the API baseline until human approval is complete.

## Bug-Fix Contract Restorations

- May ship as patch releases when restoring documented behavior.
- Must include regression coverage proving the prior behavior was defective.
- Must call out behavior changes clearly if some consumers may have been relying on the bug.

## Time-Bound Consumer Sign-Off Conventions

Some downstream consumers operate under production-sensitive windows during which a coordinated breaking change carries asymmetric risk. For those windows we agree to time-bound additional sign-off requirements on top of the normal semver workflow. **Additive, patch, and minor changes continue under normal workflow throughout** — these conventions only constrain breaking (major) bumps.

### Active conventions

| Convention                                            | Window                        | Trigger                         | Sign-off shape                                                                                                                                |
| ----------------------------------------------------- | ----------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `no-major-@gtcx/types-without-mobile-signoff` (W1–W8) | 2026-05-24 through 2026-06-22 | Any major bump to `@gtcx/types` | Explicit mention of the gtcx-mobile engineering lead in the PR description, OR a comment from the gtcx-mobile engineering lead, before merge. |

`@gtcx/types` is in the `linked` changeset group with `@gtcx/crypto`, `@gtcx/identity`, `@gtcx/verification`, `@gtcx/domain`, `@gtcx/schemas`, and `@gtcx/security`. A major bump on any member of the linked group propagates through `@gtcx/types` and is therefore in scope.

### Operational surface for sign-off

The canonical channel for raising a sign-off request during this window is the **`ClickUp / baseline-os` Slack standup** (daily 09:00 GMT, starting 2026-05-26). When opening a PR that queues a major bump on any linked-group member, drop a note in `ClickUp / baseline-os` with the PR link and the proposed merge window. The gtcx-mobile engineering lead's response (in-thread or via PR comment) is the sign-off record. PRs without that record will not be merged during the window.

### After window close

When a convention's window ends, the row above is moved to the archive section below and the convention reverts to the normal semver workflow. The same record stays in this doc as a stable URL for any consumer or regulator referring back to the agreement.

### Archived conventions

_None yet — the 2026-05-24 mobile-rollout convention is the first one we have recorded under this policy._
