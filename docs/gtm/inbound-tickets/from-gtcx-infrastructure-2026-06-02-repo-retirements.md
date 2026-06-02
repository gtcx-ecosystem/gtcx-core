---
title: 'Inbound — ecosystem repo retirements (infra ADR-012)'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
tags: ['gtm', 'cross-repo', 'gtcx-infrastructure', 'ecosystem']
---

# Inbound — gtcx-infrastructure (2026-06-02)

**Source:** [`gtcx-infrastructure/docs/architecture/decisions/ADR-012-deprecate-gtcx-core12-gtcx-amis.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/architecture/decisions/ADR-012-deprecate-gtcx-core12-gtcx-amis.md) (repo retirement ADR — not WorkProof ADR-012 in this repo).

**Ask for gtcx-core:** Confirm no published docs, examples, or consumer guides still point at deleted GitHub repos; keep npm / package identity aligned with `sensei-ai` and `compliance-os` only.

## Deletions completed (2026-06-01)

| Repo                           | Superseded by                        | gtcx-core action                                          |
| ------------------------------ | ------------------------------------ | --------------------------------------------------------- |
| `gtcx-core12`                  | `compliance-os` → `services/core12/` | None required — no references found in gtcx-core at audit |
| `gtcx-amis`                    | `sensei-ai`                          | None required — root package is `@gtcx/*` only            |
| `sensei-ai-docs-*` (3 mirrors) | `sensei-ai`                          | N/A                                                       |
| `agx-demo1`, `sgx-demo`        | —                                    | N/A                                                       |

## Still active — do not link as product repos

| Repo                | Canonical       | Notes                                                              |
| ------------------- | --------------- | ------------------------------------------------------------------ |
| `gtcx-complianceos` | `compliance-os` | Migration **complete** 2026-06-02 — GitHub delete pending approval |

## Infrastructure ADR checklist (gtcx-core slice)

| #   | Item                                                                                                                                                           | Status                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Grep `gtcx-core12`, `gtcx-amis`, `sensei-ai-docs` in `docs/`, `packages/`, README                                                                              | ✅ Clean (2026-06-02)                                                  |
| 2   | Downstream integration doc lists live consumers only                                                                                                           | ✅ See [07-downstream-integration.md](../07-downstream-integration.md) |
| 3   | npm provenance guide does not cite deleted repos as publish sources                                                                                            | ✅ [15-slsa-provenance-guide.md](../15-slsa-provenance-guide.md)       |
| 4   | Trust portal / package names remain `@gtcx/*` from **this** repo                                                                                               | ✅ No rename to `gtcx-amis`                                            |
| 5   | Cross-link ecosystem vision → `gtcx-docs` [retired-repositories](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/reference/retired-repositories.md) | Optional one-liner in GTM README                                       |

## Pending (ecosystem — not gtcx-core blockers)

| Item                              | Owner     | Tracker                                                                                                                                                                       |
| --------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gtcx-complianceos` GitHub delete | ops       | Migration complete — see [`MIGRATION-COMPLETE`](https://github.com/gtcx-ecosystem/compliance-os/blob/main/docs/_historical/gtcx-complianceos-migration/MIGRATION-COMPLETE.md) |
| Notify `#engineering` Slack       | infra ADR | Open in [infra ADR-012](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/architecture/decisions/ADR-012-deprecate-gtcx-core12-gtcx-amis.md)               |
| Local backups on external drive   | ops       | `_local-backups/2026-06-01-retired-repos/sync-to-external-drive.sh`                                                                                                           |

## Backups

`/Users/amanianai/Sites/gtcx-ecosystem/_local-backups/2026-06-01-retired-repos/` — bundles for all deleted repos except `gtcx-complianceos` (repo still on GitHub).

## Related in gtcx-core

| Doc                                                                           | Note                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------- |
| [14-adr-012-ecosystem-integration.md](../14-adr-012-ecosystem-integration.md) | **WorkProof** predicate ADR-012 — different topic |
| [07-downstream-integration.md](../07-downstream-integration.md)               | npm provenance pins for ecosystem consumers       |
