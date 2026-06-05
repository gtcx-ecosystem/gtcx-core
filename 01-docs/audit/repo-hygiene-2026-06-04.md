---
title: 'gtcx-core — Repo Hygiene Audit'
date: '2026-06-04'
command: 'repo-hygiene'
workspace_type: 'monorepo'
policy_source: '01-docs/04-ops/repo/repo-hygiene-protocol.md'
allowlist_version: '1.0.0'
schema_version: '1.0.0'
overall_score: 9.8
branch: 'main'
head: '62b0cf8'
axis_scores:
  axis_1_root_cleanliness: 10.0
  axis_2_per_dir_readme: 10.0
  axis_3_build_artifacts: 10.0
  axis_4_archive_handling: 9.5
  axis_5_naming: 9.5
  axis_6_size_outliers: 10.0
  axis_7_os_junk: 10.0
  axis_8_empty_dirs: 9.0
remediation_status: complete
remediation_date: '2026-06-04'
post_remediation_score: 9.8
post_remediation_date: '2026-06-04'
files_changed: 0
p0_resolved: 0/0
p1_resolved: 5/5
---

# gtcx-core — Repo Hygiene Audit (execute)

**Audit date:** 2026-06-04  
**Command:** `execute-repo-hygiene`  
**Repo:** `gtcx-ecosystem/gtcx-core`  
**Head:** `62b0cf8` on `main`  
**Prior report:** [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md) (audit snapshot; P1 bootstrap shipped 2026-06-03)

---

## Executive summary

`gtcx-core` meets the **10/10 policy gate**: repo hygiene protocol, machine allowlist, strict root checker, and CI wiring are all present and green. P0/P1 remediation from the 2026-06-05 audit is **already applied** on `main`; this execute pass re-validated the tree without further file moves.

**Post-remediation overall score: 9.8/10** (mean of eight axes, all ≥ 9.0). Remaining gaps are **accepted P2 exceptions**: local-only empty directories under `rust/gtcx-crypto/fuzz/target/` and `.baseline/` (gitignored), and root README Tier-5 percentage drift (doc-standard overlap, not root hygiene).

---

## Policy source

| Path                                                          | Present | Used           |
| ------------------------------------------------------------- | ------- | -------------- |
| `01-docs/04-ops/repo/repo-hygiene-protocol.md`                | Yes     | Primary policy |
| `01-docs/04-ops/repo/root-allowlist.json`                     | Yes     | v1.0.0         |
| `03-platform/scripts/ops/check-workspace-root-cleanliness.py` | Yes     | Strict checker |
| `pnpm check:workspace-root-cleanliness:strict`                | Yes     | exit **0**     |
| `.github/workflows/ci.yml`                                    | Yes     | CI step wired  |

**Human-owned:** `_delete/`, `_archive/` per allowlist — excluded from enforcement.

---

## 8-axis scorecard (post-remediation)

| Axis                    | Score | Top finding                                                              |
| ----------------------- | ----- | ------------------------------------------------------------------------ |
| 1. Root cleanliness     | 10.0  | Strict checker PASS; allowlist v1.0.0                                    |
| 2. Per-directory README | 10.0  | 0 missing README under `03-platform/packages/*/` sweep                   |
| 3. Build artifacts      | 10.0  | 0 tracked build/cache paths                                              |
| 4. Archive handling     | 9.5   | Human-owned paths documented; no tracked archive sprawl                  |
| 5. Naming               | 9.5   | Root uppercase within GTCX allowlist; inventory accurate (24 + 4 config) |
| 6. Size outliers        | 10.0  | 0 tracked files >1MB                                                     |
| 7. OS/IDE junk          | 10.0  | 0 tracked `.DS_Store` / `Thumbs.db`                                      |
| 8. Empty dirs           | 9.0   | Local empty dirs under fuzz/baseline (gitignored) — P2 exception         |

**Overall:** **9.8** (policy cap removed; all axes ≥ 9.0)

---

## Violations

### P0 — none

### P1 — resolved (prior execute pass)

| ID   | Item                                       | Status               |
| ---- | ------------------------------------------ | -------------------- |
| P1-1 | Repo hygiene protocol                      | done                 |
| P1-2 | `root-allowlist.json`                      | done                 |
| P1-3 | Checker + `pnpm` script                    | done                 |
| P1-4 | Config workspace READMEs                   | done                 |
| P1-5 | `03-platform/packages/README.md` inventory | done (24 + 4 config) |

### P2 — accepted exceptions

| ID   | Item                                         | Status                          |
| ---- | -------------------------------------------- | ------------------------------- |
| P2-1 | Local empty dirs (fuzz target, `.baseline/`) | documented — gitignored         |
| P2-2 | Root README Tier-5 %                         | deferred — `doc-standard` lane  |
| P2-3 | Unrelated agent-sync drift in working tree   | out of scope for hygiene commit |

---

## Post-remediation validation

**Checker (2026-06-04):**

```text
pnpm check:workspace-root-cleanliness:strict  # exit 0
Status: PASS — Repo root matches the canonical allowlist.
```

**Manual evidence:**

```text
git ls-files | build-artifact path segments (dist, node_modules, .turbo, etc.) — 0 matches
git ls-files | .DS_Store / Thumbs.db — 0 matches
03-platform/packages/*/ README sweep — 0 MISSING
03-platform/packages/README.md — 24 runtime + 4 config (28 workspace entries)
```

**Files changed this execute pass:** 0 (validation-only; audit artifact + index updates only)

---

## 10/10 checklist

| Criterion               | ID     | Status  | Evidence                                                      |
| ----------------------- | ------ | ------- | ------------------------------------------------------------- |
| Repo hygiene protocol   | P1     | pass    | `01-docs/04-ops/repo/repo-hygiene-protocol.md`                |
| Machine allowlist       | P2     | pass    | `root-allowlist.json` v1.0.0                                  |
| Checker script          | P3     | pass    | `03-platform/scripts/ops/check-workspace-root-cleanliness.py` |
| CI wired                | P4     | pass    | `.github/workflows/ci.yml`                                    |
| Root cleanliness strict | axis 1 | pass    | checker exit 0                                                |
| Per-directory README    | axis 2 | pass    | 100% `03-platform/packages/*/` sweep                          |
| Build artifacts         | axis 3 | pass    | 0 tracked                                                     |
| Archive / human-owned   | axis 4 | pass    | allowlist `human_owned_paths`                                 |
| Naming                  | axis 5 | pass    | Root allowlist; inventory accurate                            |
| Size outliers           | axis 6 | pass    | 0 >1MB tracked                                                |
| OS junk                 | axis 7 | pass    | 0 tracked                                                     |
| Empty dirs              | axis 8 | partial | Local gitignored empties — P2 exception                       |
| Package README sweep    | M1     | pass    | All workspace package roots covered                           |
| Cross-repo stubs        | M2     | n/a     | No stub dirs at root                                          |
| Inventory accuracy      | M3     | pass    | `03-platform/packages/README.md` matches tree                 |

**Eligible band:** 9.0–10.0. **Honest score:** 9.8 (axis 8 partial blocks literal 10.0).

---

## Remaining blockers

None for P0/P1. P2 items are optional polish; do not inflate score.

---

## Reference

- Command: `gtcx-docs/tools/audit/audit-framework/commands/execute-repo-hygiene.md`
- Prior audit: [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)
