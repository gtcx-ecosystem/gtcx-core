---
title: 'gtcx-core — Repo Hygiene Audit'
date: '2026-06-05'
command: 'repo-hygiene'
workspace_type: 'monorepo'
policy_source: '01-docs/04-ops/repo/repo-hygiene-protocol.md'
allowlist_version: '1.0.0'
schema_version: '1.0.0'
overall_score: 7.4
branch: 'main'
head: '598d168'
axis_scores:
  axis_1_root_cleanliness: 7.0
  axis_2_per_dir_readme: 9.0
  axis_3_build_artifacts: 10.0
  axis_4_archive_handling: 9.5
  axis_5_naming: 8.5
  axis_6_size_outliers: 10.0
  axis_7_os_junk: 10.0
  axis_8_empty_dirs: 10.0
remediation_status: audit-only
uncapped_mean: 9.1
p0_cap_applied: true
---

# gtcx-core — Repo Hygiene Audit

**Audit date:** 2026-06-05  
**Repo:** `gtcx-ecosystem/gtcx-core`  
**Mode:** audit-only (no remediation)  
**Head:** `598d168` on `main`  
**Prior report:** [repo-hygiene-2026-06-04.md](./repo-hygiene-2026-06-04.md) (post-bootstrap 9.6 claim — superseded by allowlist drift)

---

## Executive summary

`gtcx-core` is a **TypeScript + Rust monorepo** with **machine-enforceable repo hygiene bootstrapped** (`01-docs/04-ops/repo/repo-hygiene-protocol.md`, `root-allowlist.json`, `03-platform/scripts/ops/check-workspace-root-cleanliness.py`, CI step in `.github/workflows/ci.yml`). Deterministic axes (build artifacts, size outliers, OS junk, empty dirs) are **clean at 10.0**.

**Regression since 2026-06-03 execute pass:** strict root checker **fails** on two non-human-owned entries — tracked `bin/` (agent CLI) and untracked `workspace/` (ecosystem workspace v2 scaffold). This is a **P0** per protocol (strict checker blocked). **Overall score is capped at 7.4** despite an uncapped axis mean of **9.1**.

**P1 fix path:** add `bin` and `workspace` to `root-allowlist.json`, add `README.md` stubs, re-run `pnpm check:workspace-root-cleanliness:strict` to restore ≥9.6 eligibility.

---

## Policy source

| Path                                                          | Present | Used                           |
| ------------------------------------------------------------- | ------- | ------------------------------ |
| `01-docs/04-ops/repo/repo-hygiene-protocol.md`                | **Yes** | SSOT                           |
| `01-docs/04-ops/repo/root-allowlist.json`                     | **Yes** | v1.0.0                         |
| `01-docs/04-ops/repo/repo-root-conventions.md`                | No      | —                              |
| `03-platform/scripts/ops/check-workspace-root-cleanliness.py` | **Yes** | strict + sidecar               |
| `pnpm check:workspace-root-cleanliness:strict`                | **Yes** | `package.json`                 |
| CI wired                                                      | **Yes** | `.github/workflows/ci.yml` L43 |

**Human-owned (allowlist):** `_delete/` — convention only; not on disk. **Out of scope** for agent remediation.

---

## Root inventory

| Entry                                                                                                         | Tier | Status        | Notes                                                  |
| ------------------------------------------------------------------------------------------------------------- | ---- | ------------- | ------------------------------------------------------ |
| `README.md`, `AGENTS.md`                                                                                      | A    | ok            | Front door                                             |
| `CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`, `CODEX.md`, `KIMI.md`                                             | B    | ok            | Agent-sync mirrors                                     |
| `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`                                                   | C    | ok            |                                                        |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`, `tsconfig.json`, `vitest.workspace.ts` | D    | ok            | Monorepo spine                                         |
| `eslint.config.js`, `commitlint.config.js`, `typedoc.json`, `Dockerfile`, `baseline.config.ts`                | D    | ok            |                                                        |
| `.gitignore`, `.github/`, `.husky/`, dotfiles                                                                 | E    | ok            |                                                        |
| `.agent/`, `.baseline/`, `.cursor/`, `.changeset/`, `.claude/`, `.gemini/`, `.kimi/`                          | F    | ok            | GTCX agent tooling                                     |
| `03-platform/packages/`, `rust/`, `01-docs/`, `03-platform/scripts/`, `tests/`, `03-platform/tools/`          | G    | ok            | Structural + README                                    |
| `deploy/`, `benchmarks/`, `quality/`, `artifacts/`                                                            | G    | ok            | Each has README                                        |
| `bin/`                                                                                                        | —    | **violation** | Tracked agent CLI — **not in allowlist**               |
| `workspace/`                                                                                                  | —    | **violation** | Untracked v2 workspace scaffold — **not in allowlist** |
| `node_modules/`, `.pnpm-store/`, `.turbo/`, `rust/target/`                                                    | —    | ok (ignored)  | Not tracked                                            |
| `_delete/`, `_archive/`                                                                                       | H    | human-owned   | Gitignored; absent                                     |

---

## 8-axis scorecard

| Axis                    | Score | Top finding                                                                                                    |
| ----------------------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| 1. Root cleanliness     | 7.0   | Strict checker **BLOCKED** — `bin`, `workspace` not in `root-allowlist.json`                                   |
| 2. Per-directory README | 9.0   | All `03-platform/packages/*/` + `03-platform/packages/config/*/` have README; `bin/`, `workspace/` lack README |
| 3. Build artifacts      | 10.0  | Sidecar count **0**                                                                                            |
| 4. Archive handling     | 9.5   | No tracked `_archive/`; `_delete/` human-owned convention preserved                                            |
| 5. Naming               | 8.5   | kebab-case under `01-docs/`; allowlist drift vs legitimate new dirs                                            |
| 6. Size outliers        | 10.0  | Sidecar count **0** (threshold 500KB)                                                                          |
| 7. OS/IDE junk          | 10.0  | Sidecar count **0**                                                                                            |
| 8. Empty dirs           | 10.0  | Sidecar count **0**                                                                                            |

**Uncapped mean:** **9.1/10**  
**Overall score (P0 cap applied):** **7.4/10** — strict checker failure open

---

## Violations

### P0 — CI / blocking

| ID   | Item                          | Evidence                                                                                  |
| ---- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| P0-1 | Strict root cleanliness fails | `pnpm check:workspace-root-cleanliness:strict` exit **1** — `bin`, `workspace` unexpected |

### P1 — sprint

| ID   | Item                     | DoD        | Action                                                                                                  |
| ---- | ------------------------ | ---------- | ------------------------------------------------------------------------------------------------------- |
| P1-1 | Allowlist drift          | P2, axis 1 | Add `bin` and `workspace` to `allowed_directories` in `root-allowlist.json`; bump `updated`             |
| P1-2 | README gaps              | axis 2, M1 | Add `bin/README.md`, `workspace/README.md` (pointer to `workspace/manifest.json` + ecosystem framework) |
| P1-3 | Protocol overlay         | P1         | Update `repo-hygiene-protocol.md` Tier G table to document `bin/` + `workspace/`                        |
| P1-4 | Untracked workspace tree | axis 1     | Commit or gitignore `workspace/` + `03-platform/scripts/workspace/` intentionally after allowlist pass  |

### P2 — nice-to-have

| ID   | Item                               | Action                                                                                                           |
| ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| P2-1 | `.local/repo-hygiene-sidecar.json` | Add `.local/` to gitignore if not already (sidecar is local evidence)                                            |
| P2-2 | Agent-sync drift                   | Unstaged `.baseline/memory/session.md`, launch-focus — refresh via `pnpm agent:sync` or commit session artifacts |

### Excluded (human-owned)

- `_delete/` — never agent-remediated

---

## Checker output

```text
$ pnpm check:workspace-root-cleanliness:strict
# Workspace Root Cleanliness
Policy: 01-docs/04-ops/repo/repo-hygiene-protocol.md
Allowlist: 01-docs/04-ops/repo/root-allowlist.json (v1.0.0, schema v1.0.0)
Status: BLOCKED
Issues:
- Unexpected root entry `bin` — not in root-allowlist.json.
- Unexpected root entry `workspace` — not in root-allowlist.json.
exit 1
```

**Sidecar** (`.local/repo-hygiene-sidecar.json`):

```json
{
  "deterministic_axes": {
    "axis_3_build_artifacts": { "count": 0 },
    "axis_6_size_outliers": { "count": 0 },
    "axis_7_os_junk": { "count": 0 },
    "axis_8_empty_dirs": { "count": 0 }
  }
}
```

---

## 10/10 gap analysis

| Criterion               | ID     | Status      | Evidence                                                          |
| ----------------------- | ------ | ----------- | ----------------------------------------------------------------- |
| Repo hygiene protocol   | P1     | **pass**    | `01-docs/04-ops/repo/repo-hygiene-protocol.md`                    |
| Machine allowlist       | P2     | **partial** | Present; missing `bin`, `workspace`                               |
| Checker script          | P3     | **pass**    | `03-platform/scripts/ops/check-workspace-root-cleanliness.py`     |
| CI wired                | P4     | **pass**    | `.github/workflows/ci.yml`                                        |
| Root cleanliness strict | axis 1 | **fail**    | Strict exit 1                                                     |
| Per-directory README    | axis 2 | **partial** | `bin/`, `workspace/` missing README                               |
| Build artifacts         | axis 3 | **pass**    | 0 tracked                                                         |
| Archive / human-owned   | axis 4 | **pass**    | Convention honored                                                |
| Naming                  | axis 5 | **partial** | Allowlist drift                                                   |
| Size outliers           | axis 6 | **pass**    | 0 >500KB tracked                                                  |
| OS junk                 | axis 7 | **pass**    | 0 tracked                                                         |
| Empty dirs              | axis 8 | **pass**    | Sidecar 0                                                         |
| Package README sweep    | M1     | **pass**    | 100% `03-platform/packages/*/` + `03-platform/packages/config/*/` |
| Cross-repo stubs        | M2     | **n/a**     | No stub dirs at root                                              |
| Inventory accuracy      | M3     | **pass**    | `03-platform/packages/README.md` states 24 + 4 config             |

**Eligible max today:** **7.4** (P0 open). **Target 10/10** after P1-1–P1-2 + strict green.

---

## Bootstrap recommendation

Policy bundle **already bootstrapped** (2026-06-03). No template copy required. Remaining work is **allowlist amendment** for agent + workspace dirs, not greenfield bootstrap.

---

## Remediation plan

| Order | Priority | Task                                                                  | DoD IDs    |
| ----- | -------- | --------------------------------------------------------------------- | ---------- |
| 1     | P0/P1    | Add `bin`, `workspace` to `root-allowlist.json`                       | P2, axis 1 |
| 2     | P1       | Add README stubs for `bin/`, `workspace/`                             | axis 2     |
| 3     | P1       | Update `repo-hygiene-protocol.md` Tier G                              | P1         |
| 4     | P1       | Re-run `pnpm check:workspace-root-cleanliness:strict` — expect exit 0 | axis 1, P4 |
| 5     | P2       | Resolve untracked `workspace/` commit policy                          | axis 1     |

**Manual-only:** `_delete/` — do not schedule in agent sprints.

---

## Execute hint

Run `/execute-repo-hygiene` or say **"ship P1 fixes"** to allowlist `bin` + `workspace`, add READMEs, and restore strict PASS.

---

## Reference

- Command: `gtcx-docs/tools/audit/audit-framework/commands/repo-hygiene.md`
- Prior execute pass: [repo-hygiene-2026-06-04.md](./repo-hygiene-2026-06-04.md)
- Related: `doc-standard` for `/01-docs/` taxonomy only
