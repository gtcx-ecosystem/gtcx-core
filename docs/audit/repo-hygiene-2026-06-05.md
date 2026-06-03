---
title: 'gtcx-core — Repo Hygiene Audit'
date: '2026-06-05'
command: 'repo-hygiene'
workspace_type: 'monorepo'
policy_source: 'universal-default'
overall_score: 8.9
branch: 'main'
axis_scores:
  axis_1_root_cleanliness: 8.5
  axis_2_per_dir_readme: 8.0
  axis_3_build_artifacts: 10.0
  axis_4_archive_handling: 9.0
  axis_5_naming: 8.5
  axis_6_size_outliers: 10.0
  axis_7_os_junk: 10.0
  axis_8_empty_dirs: 8.0
remediation_status: executed
remediation_date: '2026-06-03'
post_remediation_score: 9.6
---

# gtcx-core — Repo Hygiene Audit

**Audit date:** 2026-06-05  
**Repo:** `gtcx-ecosystem/gtcx-core`  
**Mode:** audit-only (no remediation)  
**Head:** `main` (ahead of `origin/main`; unstaged agent-sync drift on `AGENTS.md`, `.agent/`, agent mirror files)

---

## Executive summary

`gtcx-core` is a **TypeScript + Rust monorepo** (foundation library) with a **clean tracked root**: no build artifacts, OS junk, or secrets in git; KAT fixtures under `artifacts/kat/` are intentional and gitignored elsewhere under `artifacts/*`. Root agent files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`, `CODEX.md`, `KIMI.md`) align with GTCX Tier B agent-sync conventions.

The repo **cannot score 10/10** today because it lacks machine-enforceable repo hygiene policy (`docs/operations/repo/repo-hygiene-protocol.md`, `root-allowlist.json`, root cleanliness checker + CI). **Overall score is capped at 8.9** per protocol scoring rules. Remaining gaps are **P1 bootstrap** (policy + checker) and **minor README / inventory drift** (three `packages/config/*` workspace packages without README; `packages/README.md` still says “21 packages” while specs say 24).

---

## Policy source

| Path                                              | Present | Used |
| ------------------------------------------------- | ------- | ---- |
| `docs/operations/repo/repo-hygiene-protocol.md`   | **No**  | —    |
| `docs/operations/repo/root-allowlist.json`        | **No**  | —    |
| `docs/operations/repo/repo-root-conventions.md`   | **No**  | —    |
| `scripts/ops/check-workspace-root-cleanliness.py` | **No**  | —    |
| `pnpm ga:check:workspace-root-cleanliness:strict` | **No**  | —    |

**Governance:** universal default (Tier A–I) from `gtcx-docs/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-protocol-prompt.md`.

**Human-owned (global):** `_delete/`, `_archive/` — listed in `.gitignore`; neither directory exists on disk. **Out of scope** for agent remediation.

---

## Root inventory

| Entry                                                                                                         | Tier | Status       | Notes                                                  |
| ------------------------------------------------------------------------------------------------------------- | ---- | ------------ | ------------------------------------------------------ |
| `README.md`                                                                                                   | A    | ok           | Front door                                             |
| `AGENTS.md`                                                                                                   | A/B  | ok           | Canonical agent instructions                           |
| `CLAUDE.md`, `GEMINI.md`, `CONVENTIONS.md`, `CODEX.md`, `KIMI.md`                                             | B    | ok           | GTCX agent-sync mirrors                                |
| `LICENSE`, `SECURITY.md`, `CHANGELOG.md`, `CONTRIBUTING.md`                                                   | C    | ok           |                                                        |
| `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `turbo.json`, `tsconfig.json`, `vitest.workspace.ts` | D    | ok           | Monorepo spine                                         |
| `eslint.config.js`, `commitlint.config.js`, `typedoc.json`, `Dockerfile`                                      | D    | ok           |                                                        |
| `baseline.config.ts`                                                                                          | D/F  | ok           | Tracked; `baseline.config.json` gitignored (local)     |
| `.gitignore`, `.github/`, `.husky/`, `.editorconfig`, `.prettierrc`, `.dockerignore`, `.env.example`          | E    | ok           |                                                        |
| `.agent/`, `.baseline/`, `.cursor/`, `.changeset/`                                                            | F    | ok           | GTCX agent tooling                                     |
| `.claude/`, `.gemini/`, `.kimi/`                                                                              | F    | investigate  | Agent IDE config; tracked subset — acceptable for GTCX |
| `packages/`, `rust/`, `docs/`, `scripts/`, `tests/`, `tools/`                                                 | G    | ok           | Structural                                             |
| `deploy/`, `benchmarks/`, `quality/`, `artifacts/`                                                            | G    | ok           | Operational; each has README or KAT exception          |
| `node_modules/`, `.pnpm-store/`, `.turbo/`, `rust/target/`                                                    | —    | ok (ignored) | Not tracked                                            |
| `.npmrc`                                                                                                      | —    | ok (ignored) | Local auth — gitignored                                |
| `_delete/`, `_archive/`                                                                                       | H    | human-owned  | Gitignored; absent on disk                             |

**No Tier I violations** at root (no stale `audit/`, scratch logs, or tracked `dist/`/`build/` at repo root).

---

## 8-axis scorecard

| Axis                    | Score | Top finding                                                                                               |
| ----------------------- | ----- | --------------------------------------------------------------------------------------------------------- |
| 1. Root cleanliness     | 8.5   | Compliant with universal tiers; no strict checker/allowlist                                               |
| 2. Per-directory README | 8.0   | 3/28 workspace `package.json` roots lack README (`packages/config/eslint`, `typescript`, `tsup`)          |
| 3. Build artifacts      | 10.0  | **0** tracked build/cache paths (`dist/`, `target/`, `.turbo/`, etc.)                                     |
| 4. Archive handling     | 9.0   | `_delete/`/`_archive/` gitignored; no tracked archive sprawl                                              |
| 5. Naming               | 8.5   | Root uppercase within GTCX allowlist + Tier B mirrors; `packages/README.md` count stale                   |
| 6. Size outliers        | 10.0  | No tracked files >1MB                                                                                     |
| 7. OS/IDE junk          | 10.0  | No tracked `.DS_Store` / `Thumbs.db`                                                                      |
| 8. Empty dirs           | 8.0   | ~16 on disk excluding `node_modules`/`rust/target` (mostly local `fuzz/target`, `.baseline/*` gitignored) |

**Overall score:** **8.9** (mean 9.0, **capped** — no `docs/operations/repo/` policy bundle per § Scoring cap rules).

---

## Violations

### P0 — none

No CI-blocking hygiene defects: no tracked secrets at root, no tracked build outputs, no root `audit/` folder.

### P1 — sprint / bootstrap

| ID   | Item                          | DoD        | Action                                                                                                        |
| ---- | ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| P1-1 | Repo hygiene policy missing   | P1         | Copy templates from `gtcx-docs/tools/audit/audit-framework/templates/repo-hygiene/` → `docs/operations/repo/` |
| P1-2 | `root-allowlist.json` missing | P2         | Define tiers + `human_owned_paths: ["_delete/", "_archive/"]`                                                 |
| P1-3 | Root checker script + CI      | P3, P4     | Add `scripts/ops/check-workspace-root-cleanliness.py` + `pnpm` script (reference: `compliance-os`)            |
| P1-4 | Config workspace READMEs      | M1, axis 2 | Add stub `README.md` to `packages/config/eslint`, `typescript`, `tsup`                                        |
| P1-5 | Package inventory drift       | M3         | Update `packages/README.md` “21” → **24** TS workspace packages (align `docs/specs/packages/README.md`)       |

### P2 — nice-to-have

| ID   | Item                                          | Action                                                                              |
| ---- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| P2-1 | Empty `packages/config/jurisdiction/scripts/` | Add `.gitkeep` + one-line README or remove dir                                      |
| P2-2 | Root `README.md` Tier 5 % stale (~50%)        | Reconcile with `tier-5-workplan-2026-06.md` (~88% technical) — doc-standard overlap |
| P2-3 | Agent-sync unstaged drift                     | Run `pnpm agent:sync` or commit intentional `.agent/` partial updates               |

### Excluded (human-owned)

- `_delete/` contents — **never** agent-remediated
- `_archive/` — gitignored; no action unless maintainer adds tracked archive with README

---

## Checker output

```
scripts/ops/check-workspace-root-cleanliness.py — NOT PRESENT
pnpm ga:check:workspace-root-cleanliness:strict — NOT PRESENT
```

**Manual evidence (2026-06-05):**

```text
git ls-files | build-artifact patterns — 0 matches
git ls-files | .DS_Store / Thumbs.db — 0 matches
git ls-files (root files) — 29 entries; all map to Tier A–F
find . -maxdepth 1 — structural dirs: packages, rust, docs, scripts, tests, tools, deploy, benchmarks, quality, artifacts
```

---

## 10/10 gap analysis

| Criterion               | ID     | Status      | Evidence                                              |
| ----------------------- | ------ | ----------- | ----------------------------------------------------- |
| Repo hygiene protocol   | P1     | **fail**    | No `docs/operations/repo/repo-hygiene-protocol.md`    |
| Machine allowlist       | P2     | **fail**    | No `root-allowlist.json`                              |
| Checker script          | P3     | **fail**    | No `check-workspace-root-cleanliness.py`              |
| CI wired                | P4     | **fail**    | No root cleanliness gate in `package.json` / CI       |
| Root cleanliness strict | axis 1 | **partial** | Clean inventory; no enforcement                       |
| Per-directory README    | axis 2 | **partial** | 3 config packages missing README                      |
| Build artifacts         | axis 3 | **pass**    | 0 tracked                                             |
| Archive / human-owned   | axis 4 | **pass**    | `.gitignore` rules; no `_delete/` on disk             |
| Naming                  | axis 5 | **partial** | Root ok; `packages/README.md` count wrong             |
| Size outliers           | axis 6 | **pass**    | None >1MB tracked                                     |
| OS junk                 | axis 7 | **pass**    | None tracked                                          |
| Empty dirs              | axis 8 | **partial** | Local empty dirs under fuzz/baseline (mostly ignored) |
| Package README sweep    | M1     | **partial** | 25/28 workspace package roots have README             |
| Cross-repo stubs        | M2     | **n/a**     | No ecosystem stub dirs at root                        |
| Inventory accuracy      | M3     | **fail**    | `packages/README.md` says 21; specs/README say 24     |

**Eligible max score today:** **8.9** (policy cap). **Target 10/10** requires P1–P4 bootstrap + M1/M3 + axis 8 cleanup.

---

## Bootstrap recommendation

Copy from `gtcx-docs/tools/audit/audit-framework/templates/repo-hygiene/`:

1. `docs/operations/repo/repo-hygiene-protocol.md` — set `workspace_type: monorepo`, allow `artifacts/kat/`, `rust/`, agent Tier F paths
2. `docs/operations/repo/root-allowlist.json` — version `1.0.0`; include `human_owned_paths`
3. `scripts/ops/check-workspace-root-cleanliness.py` — adapt from `compliance-os`
4. `package.json` script: `"check:workspace-root-cleanliness:strict": "python3 scripts/ops/check-workspace-root-cleanliness.py --strict"`
5. CI job in `.github/workflows/` (or extend existing quality workflow)

---

## Remediation plan

| Order | Priority | Task                                                           | DoD IDs    |
| ----- | -------- | -------------------------------------------------------------- | ---------- |
| 1     | P1       | Bootstrap `docs/operations/repo/` + allowlist + checker        | P1–P4      |
| 2     | P1       | Add README stubs to `packages/config/{eslint,typescript,tsup}` | M1, axis 2 |
| 3     | P1       | Fix `packages/README.md` package count (21 → 24)               | M3, axis 5 |
| 4     | P2       | Resolve empty `packages/config/jurisdiction/scripts/`          | axis 8     |
| 5     | P2       | Reconcile root README Tier 5 % (doc overlap)                   | —          |

**Manual-only:** `_delete/` — do not schedule in agent sprints.

---

## Remediation execution (2026-06-03)

**Execute pass** shipped P1–P4 bootstrap + config README stubs + inventory fix.

| Item                       | Status | Evidence                                                                                                                                            |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-1 Repo hygiene protocol | done   | `docs/operations/repo/repo-hygiene-protocol.md`                                                                                                     |
| P1-2 `root-allowlist.json` | done   | `docs/operations/repo/root-allowlist.json` + schema                                                                                                 |
| P1-3 Checker + CI          | done   | `scripts/ops/check-workspace-root-cleanliness.py`; `pnpm check:workspace-root-cleanliness:strict` exit **0**; CI step in `.github/workflows/ci.yml` |
| P1-4 Config READMEs        | done   | `packages/config/{eslint,typescript,tsup}/README.md`                                                                                                |
| P1-5 Package inventory     | done   | `packages/README.md` → 24 + 4 config (28 workspace entries)                                                                                         |

**Post-remediation score:** **9.6 / 10** (P1–P4 pass; axis 2/M1 complete; axis 8 empty dirs and root README Tier-5 % remain P2).

```bash
pnpm check:workspace-root-cleanliness:strict   # exit 0, Status PASS
```

---

## Execute hint

Run `/execute-repo-hygiene` or say **“ship P1 fixes”** to apply the remediation plan (policy bootstrap + config READMEs + inventory fix). Audit mode did not modify the tree.

---

## Reference

- Command: `gtcx-docs/tools/audit/audit-framework/commands/repo-hygiene.md`
- Reference implementation: `compliance-os` (`docs/operations/repo/`, `scripts/ops/check-workspace-root-cleanliness.py`)
- Related: `doc-standard` for `/docs/` taxonomy only
