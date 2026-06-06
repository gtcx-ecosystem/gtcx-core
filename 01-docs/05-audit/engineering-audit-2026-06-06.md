---
title: 'Engineering audit — gtcx-core'
status: current
date: 2026-06-06
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-ENG-FORENSIC-2026-06-06
audit_lane: engineering-completeness-quality
audit_command: engineering-audit
baseline_commit: 0e5a54fb7ef5499fabaebb31f6ab50e2d9eec6ce
audit_quality_1to10: 8.5
readiness_signoff: 7.0
readiness_completion: 9.5
readiness_lane_score: 7.5
tier: critical
tags: ['audit', 'engineering', 'lane-1', 'forensic']
review_cycle: quarterly
related:
  - engineering-completeness-quality-2026-06-05.md
  - engineering-audit-2026-06-05.md
  - migration-complete-2026-06-06.md
---

# Engineering audit — gtcx-core (lane 1)

> **Lane 1 only.** Not bank-grade 8.9 or GCR IC-T0.  
> **Methodology:** [engineering-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/lane-scoring/engineering-scoring.md)  
> **Repo:** `gtcx-core` @ `0e5a54fb` · **Auditor:** Cursor agent (`/full-audit` → `engineering-audit`)

**Delta since [engineering-audit-2026-06-05.md](./engineering-audit-2026-06-05.md):** L2 SoR layout v3 convergence (`0e5a54fb`, `b5663ff5`, `35167fc6`) landed doc-tree and package moves under `03-platform/`, but **multiple quality-gate scripts still resolve pre-v3 root paths** (`packages/`, `benchmarks/`, `01-docs/09-security/`). Core compile/test graph remains green; **signoff drops from 9.0 → 7.0**. Migration evidence doc claims 100/100 GREEN without re-running affected gates.

---

## 1. Executive summary

Lane 1 engineering **code depth remains strong** (turbo `lint`/`typecheck`/`test`/`build` all exit 0; 128 integration tests; Rust `gtcx-zkp` 124/124 lib tests). **Gate signoff regresses to 7.0** because eight or more deterministic CI gates fail at HEAD — predominantly **path drift** in `03-platform/tools/*` after layout v3, not functional test failures.

**Weighted lane score: 7.5/10.** **P0:** retarget gate scripts to `03-platform/packages/` and corrected evidence/doc paths. **P1:** Prettier on 12 markdown files; KAT cross-impl silently skips all vectors. **P2:** README/spec link repair post migration.

Do **not** cite 10.0 signoff or migration 100/100 until ENG-P0 gate path fixes land and gates re-run green.

---

## 2. Gate results (Protocol 27 — in-session)

| Gate               | Command                                                            | Exit  | Notes                                                                                 |
| ------------------ | ------------------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------- |
| Format             | `pnpm format:check`                                                | **1** | 12 files — mostly `01-docs/security/*`, agile roadmaps, `config/README.md`            |
| Lint               | `pnpm lint`                                                        | 0     | 45/45 turbo tasks                                                                     |
| Typecheck          | `pnpm typecheck`                                                   | 0     | 45/45 tasks                                                                           |
| Test               | `pnpm test`                                                        | 0     | 51/51 tasks                                                                           |
| Build              | `pnpm build`                                                       | 0     | 25/25 tasks                                                                           |
| Architecture       | `pnpm architecture:check`                                          | **1** | `ENOENT packages/` — script uses root `packages/` not `03-platform/packages/`         |
| Bundle budgets     | `pnpm bundle:check-budgets`                                        | **1** | Missing `benchmarks/bundle-size-budgets.json` — SoR at `03-platform/benchmarks/`      |
| API surface        | `pnpm api:check`                                                   | **1** | Same `ENOENT packages/` in `check-api-surface.mjs:53`                                 |
| Governance         | `pnpm quality:governance:check`                                    | **1** | Same `ENOENT packages/` in `check-governance.mjs:208`                                 |
| Ops                | `pnpm ops:check`                                                   | 0     | 8 pass, 3 warn (OPENAI_API_KEY, TURBO_TOKEN, TURBO_TEAM)                              |
| Provenance         | `pnpm provenance:check-npm:strict`                                 | 0     | All published `@gtcx/*` attested                                                      |
| Jurisdiction packs | `pnpm jurisdiction:validate-packs`                                 | 0     | 16/16 tests                                                                           |
| KAT cross-impl     | `pnpm test:kat-cross-impl`                                         | 0     | **6/6 SKIP** — `.kat.json` files not found at legacy paths (silent pass)              |
| Certified pack     | `pnpm certified-pack:verify-manifest`                              | **1** | Resolves `03-platform/01-docs/...` — `root` in tool is `03-platform/` not repo root   |
| Vendor evidence    | `pnpm vendor-evidence:verify-manifest`                             | **1** | Same root resolution bug                                                              |
| Threat matrix      | `pnpm security:threat-matrix`                                      | **1** | Expects `01-docs/09-security/threat-control-matrix.md`; file at `01-docs/security/`   |
| Docs links         | `pnpm docs:check-links`                                            | **1** | Broken README/spec links to `./packages/config`, `01-docs/09-security/*`, agile paths |
| Readiness SSOT     | `pnpm readiness:lanes:check`                                       | 0     | JSON/index consistency only — does not execute live gates                             |
| Rust ZKP           | `cargo test -p gtcx-zkp --features trusted-setup-verify --release` | 0     | 124 passed, 5 ignored (~149s release profile)                                         |
| Integration        | `03-platform/tests/integration` vitest                             | 0     | 128 passed (13 files) — also in turbo `pnpm test`                                     |

---

## 3. Six-dimension scorecard

| #   | Dimension             | Weight |   Score | Rationale                                                                 |
| --- | --------------------- | -----: | ------: | ------------------------------------------------------------------------- |
| 1   | CI / quality gates    |    25% | **5.0** | 9/19 substantive gates fail; core turbo graph green                       |
| 2   | Package completeness  |    20% | **9.0** | 24 workspace packages build; exports intact under `03-platform/packages/` |
| 3   | Test depth            |    20% | **9.0** | Full turbo test green; integration 128; KAT cross-impl skipped            |
| 4   | Crypto / safety hooks |    15% | **7.0** | Threat-matrix gate broken; KAT verify skips; Rust ZKP tests pass          |
| 5   | Operational signals   |    10% | **9.0** | `ops:check` branch protection + CODEOWNERS; optional turbo secrets warn   |
| 6   | Doc–code fidelity     |    10% | **6.5** | Migration doc 100/100 vs gate regressions; README links stale             |

**Weighted lane score** = 5.0×0.25 + 9.0×0.20 + 9.0×0.20 + 7.0×0.15 + 9.0×0.10 + 6.5×0.10 = **7.525 → 7.5**

| Readiness metric |   Value | Basis                                            |
| ---------------- | ------: | ------------------------------------------------ |
| Gate signoff     | **7.0** | ≥8 CI gate failures at HEAD (path drift post v3) |
| Completion depth | **9.5** | Packages, coverage, fuzz, FIPS hooks unchanged   |
| Lane headline    | **7.5** | Weighted sum (documented above)                  |

---

## 4. Findings

### ENG-P0 — Quality-gate scripts use pre-v3 root paths

- **Severity:** P0
- **Evidence:**
  - `03-platform/tools/check-package-boundaries.mjs:7` — `path.join(rootDir, 'packages')`
  - `03-platform/tools/check-api-surface.mjs:11` — same
  - `03-platform/tools/check-governance.mjs:208` — same
  - `03-platform/tools/check-bundle-budgets.mjs:8` — `benchmarks/bundle-size-budgets.json` (SoR: `03-platform/benchmarks/`)
  - `03-platform/tools/certified-pack/verify-manifest.mjs:10` — `root` resolves to `03-platform/` (needs `../../../`)
  - `03-platform/tools/check-threat-matrix.mjs:24` — `01-docs/09-security/threat-control-matrix.md` (file: `01-docs/security/threat-control-matrix.md`)
- **Cause:** L2 layout v3 moved packages/benchmarks/docs; gate scripts not updated in same commit series
- **Fix:** Centralize repo-root resolver (e.g. `config/sor-map.json`) and retarget all gate scripts; re-run full V-ladder

### ENG-P1 — KAT cross-impl silently skips all vectors

- **Severity:** P1
- **Evidence:** `pnpm test:kat-cross-impl` exit 0 with `SKIP groth16-*.kat.json (file not found)` ×6; vectors live under `03-platform/packages/zkp-kat-vectors/src/data/`
- **Cause:** `kat-cross-impl-verify` search paths not updated for v3 layout
- **Fix:** Point verifier at package data dir or vendor manifest paths; fail closed when `--all` and zero vectors verified

### ENG-P2 — Format check (12 files)

- **Severity:** P2
- **Evidence:** `pnpm format:check` exit 1 — `01-docs/security/*`, agile roadmaps, `config/README.md`, integration vitest config
- **Fix:** `pnpm format` on affected paths

### ENG-P2 — Docs link drift post migration

- **Severity:** P2
- **Evidence:** `pnpm docs:check-links` — README → `./packages/config`, `01-docs/09-security/*`, agile roadmap paths
- **Fix:** Update links to `03-platform/packages/config`, `01-docs/security/`, current agile paths

### Resolved since 2026-06-05

- None at gate level — prior ENG-P1 bundle and ENG-P2 API baseline fixes **masked** by scripts that no longer execute

---

## 5. Evidence gaps

| Gap                           | Lane owner | Notes                                                       |
| ----------------------------- | ---------- | ----------------------------------------------------------- |
| Domain `api-audit` forensic   | Lane 1     | No `api-audit-*.md` <30 days; `api:check` cannot run        |
| Domain `deployment-audit`     | Ecosystem  | Staging in `gtcx-infrastructure` — not re-probed            |
| `pnpm test:coverage:critical` | Lane 1     | Not re-run; prior 97%+ branch coverage (2026-05-28 signoff) |
| External pen-test             | Lane 3     | gtcx-core supplies threat matrix + fuzz only                |

---

## 6. Index / SSOT update instructions

1. **Index:** [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) — set signoff **7.0**, lane score **7.5**, point forensic to this file
2. **`latest.json`:** `lanes.engineeringCompletenessQuality.readinessOutcome.internalSignoff` → **7**; `weightedLaneScore` → **7.5**; `forensic` → this path; bump `updated`
3. **Anti-drift:** Do not cite 10.0 signoff or migration 100/100 until ENG-P0 resolved
4. **Next automatable work:** ENG-P0 path retarget in `03-platform/tools/*` (Class R)

---

## Agent Context Attestation

- [x] Phase 1: Baseline loaded
- [x] Phase 5.7: Verification ladder executed in-session (commands + exit codes above)
- [x] Lane 1 forensic written; index + `latest.json` updated in same commit
