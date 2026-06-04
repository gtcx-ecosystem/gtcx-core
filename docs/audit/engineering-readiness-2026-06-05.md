---
title: 'Engineering readiness — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-ENG-READINESS-2026-06-05
audit_type: engineering-readiness
composite: 9.5
tier: critical
tags: ['audit', 'engineering', 'ci', 'quality']
review_cycle: quarterly
supersedes_note: 'Splits engineering from master-audit composite; see readiness-model.md'
---

# Engineering readiness — gtcx-core

**Date:** 2026-06-05  
**Branch:** `main` @ post-`775156a`  
**Composite:** **9.5/10** — in-repo, machine-verifiable work complete  
**Model:** [readiness-model.md](./readiness-model.md)

---

## What this measures

Code quality, tests, CI, architecture boundaries, supply-chain publishing, docs/repo hygiene, and **DTF technical moat** work that engineers can ship in this repo.

**Out of scope:** pen-test PDF, SOC 2 letter, sandbox emails, pilot MSAs → [compliance-attestation](./compliance-attestation-2026-06-05.md) and [gtm-readiness](./gtm-readiness-2026-06-05.md).

---

## Score breakdown

| Dimension           | Weight | Score | Evidence                                                  |
| ------------------- | -----: | ----: | --------------------------------------------------------- |
| Code & tests        |    25% |   9.3 | 51/51 turbo test tasks; arch 9.3 post-remediation         |
| CI & ops gates      |    20% |   9.5 | format/lint/typecheck/build/architecture green            |
| Supply chain        |    15% |   9.5 | 22/22 npm Sigstore (`pnpm provenance:check-npm:strict`)   |
| Docs & repo hygiene |    15% |   9.6 | frontmatter 281/281; workspace-root strict PASS           |
| Crypto mechanical   |    15% |   9.4 | FIPS tests 63/63; fuzz 500K+ zero crashes; KAT cross-impl |
| DTF technical moat  |    10% |   8.8 | Tier 5 ~88%; CORE-004 ceremony = compliance lane          |

**Weighted composite:** **9.5/10** (rounded)

---

## Gate evidence (Protocol 27)

| Command                                        | Exit | When                        |
| ---------------------------------------------- | ---: | --------------------------- |
| `pnpm format:check`                            |    0 | 2026-06-05                  |
| `pnpm lint`                                    |    0 | 45/45 tasks                 |
| `pnpm typecheck`                               |    0 | turbo graph green (FA-P0-1) |
| `pnpm test`                                    |    0 | 51/51 tasks                 |
| `pnpm build`                                   |    0 | 25/25 tasks                 |
| `pnpm architecture:check`                      |    0 | 24 packages, 287 files      |
| `pnpm jurisdiction:validate-packs`             |    0 | 16/16                       |
| `pnpm provenance:check-npm:strict`             |    0 | 22/22                       |
| `pnpm docs:check-frontmatter`                  |    0 | 281/281                     |
| `pnpm check:workspace-root-cleanliness:strict` |    0 | PASS                        |

---

## Open engineering items (P2 — not blockers)

| ID        | Item                           | Notes                                 |
| --------- | ------------------------------ | ------------------------------------- |
| ENG-P2-01 | `@gtcx/network` libp2p Phase 2 | Scaffolding honest in README          |
| ENG-P2-02 | USSD protocol                  | Profile enum only                     |
| ENG-P2-03 | `ops:check` 3 warns            | TURBO\_\*, OPENAI_API_KEY org scope   |
| ENG-P2-04 | ark-\* transitive advisories   | Mitigated in `rust/.cargo/audit.toml` |

---

## Source audits

- [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md) — 24/24 internal items
- [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md) — 9.6/10
- [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) — 9.6/10
- [fuzz-campaign-evidence-2026-05-21.md](./fuzz-campaign-evidence-2026-05-21.md)

**Next engineering milestone:** CORE-004 code path after XR-402 — tracked under compliance lane until ceremony runs.
