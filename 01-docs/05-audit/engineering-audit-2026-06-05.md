---
title: 'Engineering audit — gtcx-core'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-ENG-FORENSIC-2026-06-05
audit_lane: engineering-completeness-quality
audit_command: engineering-audit
baseline_commit: 1e8a3a6
audit_quality_1to10: 8.5
readiness_signoff: 9.0
readiness_completion: 9.5
readiness_lane_score: 9.3
tier: critical
tags: ['audit', 'engineering', 'lane-1', 'forensic']
review_cycle: quarterly
related:
  - engineering-completeness-quality-2026-06-05.md
  - full-audit-2026-06-04.md
  - internal-10-10-signoff-2026-05-28.md
  - bank-grade-audit-2026-06-07.md
---

# Engineering audit — gtcx-core (lane 1)

> **Lane 1 only.** Not bank-grade 8.9 or GCR IC-T0.  
> **Methodology:** [engineering-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/lane-scoring/engineering-scoring.md)  
> **Repo:** `gtcx-core` @ `1e8a3a6` · **Auditor:** Cursor agent (`/full-audit` → `engineering-audit`)

**Delta since [full-audit-2026-06-04.md](./full-audit-2026-06-04.md):** Turbo build cycle **resolved** (root `typecheck`/`build` green). Tier-5 jurisdiction KAT expansion (`groth16-gh-gold-origin`, `groth16-zw-diamond-origin`) landed — **two new gate regressions**: bundle budget overrun on `@gtcx/zkp-kat-vectors` and additive API baseline drift on three packages. OI-X02 + EXT-INF-002 pack acknowledgments closed; Class S ceiling unchanged (DTF-5.5.4).

---

## 1. Executive summary

Lane 1 engineering readiness is **strong but no longer 10.0 signoff** at HEAD. Core quality gates (`lint`, `typecheck`, `test`, `build`, `architecture:check`, crypto hooks) pass in-session. **Signoff drops to 9.0** because `pnpm bundle:check-budgets` and `pnpm api:check` fail — both trace to intentional Tier-5 KAT/EAP surface expansion without budget/baseline refresh. Completion depth remains **9.5** (24 packages, 6/6 KAT cross-impl, fuzz evidence, FIPS hooks).

**Weighted lane score: 9.3/10** (formula below). **P0:** none. **P1:** bundle budget. **P2:** API baseline update + manifest formatting hygiene.

---

## 2. Gate results (Protocol 27 — in-session)

| Gate               | Command                                                            | Exit  | Notes                                                                              |
| ------------------ | ------------------------------------------------------------------ | ----- | ---------------------------------------------------------------------------------- |
| Format             | `pnpm format:check`                                                | **1** | `.baseline/execution-bout.json`, `certified-pack-manifest-latest.json` unformatted |
| Lint               | `pnpm lint`                                                        | 0     | 51/51 turbo tasks                                                                  |
| Typecheck          | `pnpm typecheck`                                                   | 0     | Turbo cycle fixed since 2026-06-04                                                 |
| Test               | `pnpm test`                                                        | 0     | 51/51 tasks; 128 integration tests                                                 |
| Build              | `pnpm build`                                                       | 0     | 25/25 tasks                                                                        |
| Architecture       | `pnpm architecture:check`                                          | 0     | 24 packages, 287 source files                                                      |
| Bundle budgets     | `pnpm bundle:check-budgets`                                        | **1** | `@gtcx/zkp-kat-vectors` gzip **191,188 B** > **110,592 B**                         |
| API surface        | `pnpm api:check`                                                   | **1** | 3 additive drifts — see `quality/api-surface-report.json`                          |
| Ops                | `pnpm ops:check`                                                   | 0     | 8 pass, 3 warn (OPENAI_API_KEY, TURBO_TOKEN, TURBO_TEAM)                           |
| Provenance         | `pnpm provenance:check-npm:strict`                                 | 0     | All published packages attested                                                    |
| Jurisdiction packs | `pnpm jurisdiction:validate-packs`                                 | 0     | 16/16 tests                                                                        |
| KAT cross-impl     | `pnpm test:kat-cross-impl`                                         | 0     | 6/6 vectors (was 5/5 on 2026-06-04)                                                |
| Certified pack     | `pnpm certified-pack:verify-manifest`                              | 0     | 5 packs                                                                            |
| Vendor evidence    | `pnpm vendor-evidence:verify-manifest`                             | 0     | 22 artifacts; external gate open                                                   |
| Threat matrix      | `pnpm security:threat-matrix`                                      | 0     | 12 controls                                                                        |
| Rust ZKP           | `cargo test -p gtcx-zkp --features trusted-setup-verify --release` | 0     | Release profile                                                                    |

---

## 3. Six-dimension scorecard

| #   | Dimension             | Weight |   Score | Rationale                                                               |
| --- | --------------------- | -----: | ------: | ----------------------------------------------------------------------- |
| 1   | CI / quality gates    |    25% | **8.0** | 13/16 gates pass; bundle + API + format fail                            |
| 2   | Package completeness  |    20% | **9.0** | 24 packages bounded; additive exports intentional (DTF-5.2.x)           |
| 3   | Test depth            |    20% | **9.5** | Full turbo test green; 6 KAT circuits; integration suite 128 tests      |
| 4   | Crypto / safety hooks |    15% | **9.5** | Threat matrix, KAT cross-impl, FIPS path, trusted-setup verify          |
| 5   | Operational signals   |    10% | **9.0** | `ops:check` branch protection + CODEOWNERS; optional turbo secrets warn |
| 6   | Doc–code fidelity     |    10% | **8.5** | README tier-5 vs composite wording drift (carried from 2026-06-04)      |

**Weighted lane score** = 8.0×0.25 + 9.0×0.20 + 9.5×0.20 + 9.5×0.15 + 9.0×0.10 + 8.5×0.10 = **9.275 → 9.3**

| Readiness metric |   Value | Basis                                    |
| ---------------- | ------: | ---------------------------------------- |
| Gate signoff     | **9.0** | Two substantive CI gate failures at HEAD |
| Completion depth | **9.5** | Package/coverage/fuzz/FIPS unchanged     |
| Lane headline    | **9.3** | Weighted sum (documented above)          |

---

## 4. Findings

### ENG-P1 — Bundle budget overrun (`@gtcx/zkp-kat-vectors`)

- **Severity:** P1
- **Evidence:** `benchmarks/bundle-size-budgets.json:90-93` — budget **110,592 B**; `pnpm bundle:check-budgets` reports gzip **191,188 B**
- **Cause:** Two new jurisdiction KAT JSON artifacts (`groth16-gh-gold-origin`, `groth16-zw-diamond-origin`) added for DTF-5.2.x
- **Fix:** Raise budget with rationale update **or** externalize large KAT blobs to fetch-on-demand (keep gate meaningful)

### ENG-P2 — API surface baseline drift (additive)

- **Severity:** P2
- **Evidence:** `quality/api-surface-report.json` — `@gtcx/crypto` (+4 KAT helpers), `@gtcx/eap` (+2 evidence exports), `@gtcx/zkp-kat-vectors` (+2 vector exports)
- **Cause:** Intentional Tier-5 surface expansion; baseline not refreshed
- **Fix:** `pnpm api:update-baseline` after human review of export list

### ENG-P3 — Format check on manifest artifacts

- **Severity:** P2
- **Evidence:** `pnpm format:check` exit 1 — `01-docs/05-audit/evidence/certified-pack-manifest-latest.json`, `.baseline/execution-bout.json`
- **Cause:** Manifest rebuild without Prettier pass
- **Fix:** `pnpm format` on affected paths before commit

### Resolved since 2026-06-04

- **FA-P0-1 (closed):** Turbo build cycle `@gtcx/workproof` ↔ `@gtcx/verification` — root `typecheck`/`build` now exit 0

---

## 5. Evidence gaps

| Gap                           | Lane owner     | Notes                                                      |
| ----------------------------- | -------------- | ---------------------------------------------------------- |
| External pen-test execution   | Lane 3 / infra | gtcx-core supplies KAT + fuzz + threat matrix only         |
| `pnpm test:coverage:critical` | Lane 1         | Not re-run this session; prior signoff 97%+ (2026-05-28)   |
| Domain `api-audit` forensic   | Lane 1         | No `api-audit-*.md` &lt;30 days; drift captured inline     |
| Domain `deployment-audit`     | Ecosystem      | Staging substrate in `gtcx-infrastructure` — not re-probed |

---

## 6. Index / SSOT update instructions

1. **Index:** [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) — set signoff **9.0**, completion **9.5**, add this forensic to canonical audits table
2. **`latest.json`:** `lanes.engineeringCompletenessQuality.readinessOutcome.internalSignoff` → **9**; add `forensic` path; bump `updated`
3. **Anti-drift:** Do not cite 10.0 signoff until ENG-P1 + ENG-P2 resolved
4. **Next automatable work:** ENG-P1 budget or ENG-P2 baseline (Class S agent); not DTF-5.5.4 LOI

---

## Agent Context Attestation

- [x] Phase 1: Baseline loaded
- [x] Phase 5.4: Protocol 22 — witness mode / backlog clear
- [x] Phase 5.7: Verification ladder executed in-session (commands + exit codes above)
- [x] Lane 1 forensic written; index + `latest.json` updated in same commit
