---
title: 'gtcx-core — Repo Hygiene Audit'
date: '2026-06-05'
command: 'repo-hygiene'
workspace_type: 'monorepo'
policy_source: '01-docs/operations/repo/repo-hygiene-protocol.md'
allowlist_version: '2.0.0'
schema_version: '1.0.0'
overall_score: 9.7
branch: 'main'
head: '64f5b0e3'
axis_scores:
  axis_1_root_cleanliness: 10.0
  axis_2_per_dir_readme: 8.5
  axis_3_build_artifacts: 10.0
  axis_4_archive_handling: 9.5
  axis_5_naming: 9.5
  axis_6_size_outliers: 10.0
  axis_7_os_junk: 10.0
  axis_8_empty_dirs: 10.0
remediation_status: audit-only
p0_cap_applied: false
supersedes: '01-docs/05-audit/repo-hygiene-2026-06-05.md (morning pass — P0 allowlist drift)'
---

# gtcx-core — Repo Hygiene Audit

**Audit date:** 2026-06-05 (evening re-run)  
**Repo:** `gtcx-ecosystem/gtcx-core`  
**Mode:** audit-only (no remediation)  
**Head:** `64f5b0e3` on `main`  
**Prior report:** [repo-hygiene-2026-06-05.md](../audit/repo-hygiene-2026-06-05.md) (morning — P0 cap 7.4 on `bin/` + `workspace/` drift)

---

## Executive summary

`gtcx-core` completed the **five-hub v2 root restructure** (`00-archive`, `01-docs`, `02-ops`, `03-platform`, `04-ship`, `05-audit`, `config`, `rust`) with **allowlist v2.0.0** and strict root checker **PASS**. Deterministic axes (build artifacts, size outliers, OS junk, empty dirs) remain **10.0** via sidecar.

**Regression resolved:** morning audit failed on root `bin/` and `workspace/`; both moved under `03-platform/` and removed from root tier. **Overall score: 9.7/10** (up from capped **7.4**).

**Remaining P1:** three hub directories lack `README.md` (`00-archive/`, `03-platform/`, `05-audit/` — latter has `AGENT-START.md` only). **P2:** untracked `.DS_Store` at root (not tracked; add to local cleanup).

---

## Policy source

| Path                                                          | Present | Used                           |
| ------------------------------------------------------------- | ------- | ------------------------------ |
| `01-docs/operations/repo/repo-hygiene-protocol.md`            | **Yes** | SSOT (five-hub v2)             |
| `01-docs/operations/repo/root-allowlist.json`                 | **Yes** | v2.0.0                         |
| `01-docs/operations/repo/repo-root-conventions.md`            | No      | —                              |
| `03-platform/scripts/ops/check-workspace-root-cleanliness.py` | **Yes** | strict + sidecar               |
| `pnpm check:workspace-root-cleanliness:strict`                | **Yes** | `package.json`                 |
| CI wired                                                      | **Yes** | `.github/workflows/ci.yml` L43 |

**Human-owned (allowlist):** `_delete/` — convention only; not on disk. **Out of scope** for agent remediation.

---

## Root inventory

| Entry                                                                                   | Tier | Status       | Notes                                      |
| --------------------------------------------------------------------------------------- | ---- | ------------ | ------------------------------------------ |
| `README.md`, `AGENTS.md`                                                                | A    | ok           | Front door                                 |
| `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`                             | C    | ok           |                                            |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`, `tsconfig.json`  | D    | ok           | Monorepo spine                             |
| `eslint.config.js`, `commitlint.config.js`, `baseline.config.ts`, `hygiene.config.json` | D    | ok           |                                            |
| `.gitignore`, `.github/`, `.husky/`, dotfiles                                           | E    | ok           |                                            |
| `.agent/`, `.baseline/`, `.cursor/`, `.changeset/`, `.claude/`, `.gemini/`, `.kimi/`    | F    | ok           | GTCX agent tooling                         |
| `00-archive/`                                                                           | G    | ok           | Historical artifacts; **no README** (P1)   |
| `01-docs/`, `02-ops/`, `04-ship/`, `config/`, `rust/`                                   | G    | ok           | Each has README                            |
| `03-platform/`                                                                          | G    | ok           | packages/scripts/tools/bin; **no README**  |
| `05-audit/`                                                                             | G    | ok           | `AGENT-START.md` only — **no README** (P1) |
| `node_modules/`, `.pnpm-store/`, `.turbo/`, `rust/target/`                              | —    | ok (ignored) | Not tracked                                |
| `_delete/`, `_archive/` (root)                                                          | H    | human-owned  | Gitignored convention                      |

**Removed from root (v2 fix):** `bin/`, `workspace/`, `packages/`, `agents/`, `deploy/`, `benchmarks/`, `quality/`, `artifacts/` — relocated under hub dirs per allowlist v2.

---

## 8-axis scorecard

| Axis                    | Score | Top finding                                                                |
| ----------------------- | ----- | -------------------------------------------------------------------------- |
| 1. Root cleanliness     | 10.0  | Strict checker **PASS** — allowlist v2.0.0 matches all root entries        |
| 2. Per-directory README | 8.5   | Hub README gaps: `00-archive/`, `03-platform/`, `05-audit/`                |
| 3. Build artifacts      | 10.0  | Sidecar count **0**                                                        |
| 4. Archive handling     | 9.5   | `00-archive/` tracked with artifacts; `_delete/` human-owned preserved     |
| 5. Naming               | 9.5   | Five-hub kebab-case; agent mirrors under dot dirs (`.claude/`, `.gemini/`) |
| 6. Size outliers        | 10.0  | Sidecar count **0** (threshold 500KB)                                      |
| 7. OS/IDE junk          | 10.0  | Sidecar count **0** tracked; untracked `.DS_Store` at root (local only)    |
| 8. Empty dirs           | 10.0  | Sidecar count **0**                                                        |

**Overall score:** **9.7/10** — no P0 cap

---

## Violations

### P0 — CI / blocking

None — strict checker exit **0**.

### P1 — sprint

| ID   | Item             | DoD        | Action                                                          |
| ---- | ---------------- | ---------- | --------------------------------------------------------------- |
| P1-1 | Hub README gaps  | axis 2, M1 | Add `README.md` to `00-archive/`, `03-platform/`, `05-audit/`   |
| P1-2 | Protocol overlay | P1         | Confirm `repo-hygiene-protocol.md` Tier G matches v2 hub layout |
| P1-3 | Migration WIP    | axis 5     | Commit or reconcile untracked `01-docs/04-ops/` tree migration  |

### P2 — nice-to-have

| ID   | Item                  | Action                                                                        |
| ---- | --------------------- | ----------------------------------------------------------------------------- |
| P2-1 | Untracked `.DS_Store` | Delete locally; verify `.gitignore` covers pattern                            |
| P2-2 | Legacy audit redirect | `01-docs/audit/README.md` redirects here — do not add files under legacy path |

### Excluded (human-owned)

- `_delete/` — never agent-remediated

---

## Checker output

```text
$ pnpm check:workspace-root-cleanliness:strict
# Workspace Root Cleanliness
Policy: 01-docs/operations/repo/repo-hygiene-protocol.md
Allowlist: 01-docs/operations/repo/root-allowlist.json (v2.0.0, schema v1.0.0)
Status: PASS
Repo root matches the canonical allowlist.
exit 0
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

| Criterion               | ID     | Status      | Evidence                                                      |
| ----------------------- | ------ | ----------- | ------------------------------------------------------------- |
| Repo hygiene protocol   | P1     | **pass**    | `01-docs/operations/repo/repo-hygiene-protocol.md`            |
| Machine allowlist       | P2     | **pass**    | v2.0.0 — five-hub layout                                      |
| Checker script          | P3     | **pass**    | `03-platform/scripts/ops/check-workspace-root-cleanliness.py` |
| CI wired                | P4     | **pass**    | `.github/workflows/ci.yml`                                    |
| Root cleanliness strict | axis 1 | **pass**    | Strict exit 0                                                 |
| Per-directory README    | axis 2 | **partial** | 3 hub dirs missing README                                     |
| Build artifacts         | axis 3 | **pass**    | 0 tracked                                                     |
| Archive / human-owned   | axis 4 | **pass**    | Convention honored                                            |
| Naming                  | axis 5 | **pass**    | v2 allowlist aligned                                          |
| Size outliers           | axis 6 | **pass**    | 0 >500KB tracked                                              |
| OS junk                 | axis 7 | **pass**    | 0 tracked                                                     |
| Empty dirs              | axis 8 | **pass**    | Sidecar 0                                                     |
| Package README sweep    | M1     | **pass**    | 100% `03-platform/packages/*/`                                |
| Cross-repo stubs        | M2     | **n/a**     | No stub dirs at root                                          |
| Inventory accuracy      | M3     | **pass**    | 25 package dirs under `03-platform/packages/`                 |

**Eligible max today:** **9.7**. **Target 10/10** after P1-1 hub README stubs.

---

## Bootstrap recommendation

Policy bundle **bootstrapped and upgraded to v2** (five-hub). No greenfield template copy required. Remaining work is **hub README stubs**, not policy bootstrap.

---

## Remediation plan

| Order | Priority | Task                                                          | DoD IDs |
| ----- | -------- | ------------------------------------------------------------- | ------- |
| 1     | P1       | Add `README.md` to `00-archive/`, `03-platform/`, `05-audit/` | axis 2  |
| 2     | P1       | Reconcile `01-docs/` migration WIP commit                     | axis 5  |
| 3     | P2       | Remove local `.DS_Store` at root                              | axis 7  |

**Manual-only:** `_delete/` — do not schedule in agent sprints.

---

## Execute hint

Run `/execute-repo-hygiene` or say **"ship P1 fixes"** to add hub README stubs and reach 10/10 eligibility.

---

## Reference

- Command: `gtcx-docs/03-platform/tools/audit/audit-framework/commands/repo-hygiene.md`
- Morning pass (superseded): [repo-hygiene-2026-06-05.md](../audit/repo-hygiene-2026-06-05.md)
- Related: `doc-standard` for `/01-docs/` taxonomy only
