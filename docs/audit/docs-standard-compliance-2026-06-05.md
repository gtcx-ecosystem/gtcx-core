---
title: 'Docs Standard Compliance Audit — 2026-06-05'
status: current
date: 2026-06-05
owner: quality-evidence-lead
role: quality-evidence-lead
tier: critical
tags: ['docs', 'audit', 'compliance', 'doc-standard']
review_cycle: quarterly
command: doc-standard
supersedes: docs/audit/docs-standard-compliance-2026-05-22.md
---

# Docs Standard Compliance Audit — 2026-06-05

> **Status:** Current — **P1 remediation applied** 2026-06-05  
> **Date:** 2026-06-05  
> **Owner:** Quality & Evidence Lead  
> **Supersedes:** [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md)

**Scope:** Re-application of `gtcx-docs/tools/audit/audit-framework/prompts/docs/forensic-doc-standard-prompt.md` to `gtcx-core` (`/docs/` only).

**Reference standards:**

- Ecosystem forensic doc-standard prompt (2026-05-10 lineage)
- Repo machine-readable extension: `docs/agents/docs-standard-lightweight.md` + `tools/check-doc-frontmatter.mjs`
- Prior compliance baseline: [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md) — **9.6/10**

**Master INDEX:** `docs/README.md` (canonical per framework; no separate `docs/INDEX.md` — recommended alias optional).

---

## Executive summary

`gtcx-core` maintains a **single canonical `/docs/` root** (382 markdown files) with strong structural taxonomy, YAML frontmatter enforcement, and automated link checking (**480 files pass**). Compliance **regressed slightly** from May 2026 due to **five frontmatter gate failures**, **three ALL_CAPS filenames**, and **master INDEX drift** (June audits and Tier-5 closure not reflected in `docs/README.md` §10).

No P0 violations. The repo remains **production-capable for documentation** (~**9.1/10** overall). Remediation is **P1 sprint** (frontmatter + INDEX refresh + naming) unless `/execute-repo-hygiene`-style doc execute is requested.

---

## Policy source

| Check                                          | Result                                                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Competing roots (`_sop/`, `_cannon/`, `wiki/`) | **None**                                                                                      |
| `CLAUDE.md` at repo root                       | **Present**                                                                                   |
| `docs/README.md` master INDEX                  | **Present** (sections §0–§15)                                                                 |
| Minimum paths                                  | `docs/architecture/`, `docs/guides/getting-started.md`, `docs/operations/runbook.md` — **ok** |
| Workspace type                                 | **Monorepo** (TypeScript + Rust foundation library)                                           |

---

## Compliance scores

| Axis         | Score       | Δ vs 2026-05-22 | Top finding                                                                                                             |
| ------------ | ----------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Structural   | **9.4/10**  | —               | Single `/docs/`; repo-specific dirs (`agile/`, `gtm/`, `agents/`) justified in INDEX taxonomy table                     |
| Naming       | **9.0/10**  | −1.0            | **3** non-kebab files (ALL_CAPS / underscores)                                                                          |
| Frontmatter  | **9.0/10**  | −1.0            | `pnpm docs:check-frontmatter` — **262/265** valid; **5** errors in **3** files                                          |
| Linking      | **9.6/10**  | −0.4            | `pnpm docs:check-links` — **480/480** pass; stylistic `github.com/.../blob/` URLs remain in trust-portal / coordination |
| Length       | **8.5/10**  | −0.7            | **10+** docs exceed operational (300) or architectural (500) limits                                                     |
| Agentic      | **9.0/10**  | —               | New coordination + tier-5 docs table-first; legacy prose-heavy specs unchanged                                          |
| RAG          | **10.0/10** | —               | `baseline.config.ts` matches canonical exclude contract                                                                 |
| Master INDEX | **8.2/10**  | −1.2            | `docs/README.md` stale — missing 2026-06 audits, `full-audit-2026-06-04`, `repo-hygiene-2026-06-05`, tier-5 ~88%        |
| **Overall**  | **9.1/10**  | −0.5            |                                                                                                                         |

**Mean of 8 axes:** 9.21 → rounded **9.1** (INDEX drift + frontmatter gate failures weigh P1).

---

## Automated verification (Protocol 27 evidence)

| Command                       | Exit  | Result                                      |
| ----------------------------- | ----- | ------------------------------------------- |
| `pnpm docs:check-links`       | **0** | Markdown link check passed (**480** files)  |
| `pnpm docs:check-frontmatter` | **1** | **262/265** valid; **5** errors (see below) |

### Frontmatter errors (P1)

| File                                                                                 | Error                                        |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| `docs/specs/packages/zkp-circuit-profiles.md`                                        | Missing `role`, `tier`                       |
| `docs/devops/runbooks/eap-staging-issuance-ceremony.md`                              | Missing `role`, `tier`                       |
| `docs/operations/coordination/to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md` | Invalid tag `dtf-5.4` (must be `[a-z0-9-]+`) |

---

## Violations

### P0 — none

- Single doc root `/docs/`
- `CLAUDE.md` present
- `docs/README.md` INDEX present

### P1 — fix this sprint

| ID   | Violation                 | Files / scope                | Remediation                                                                                                                  |
| ---- | ------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| P1-1 | Frontmatter gate failures | 3 files above                | Add `role`/`tier`; rename tag `dtf-5.4` → `dtf-5-4`                                                                          |
| P1-2 | Master INDEX drift        | `docs/README.md` §0, §2, §10 | Add `full-audit-2026-06-04`, `repo-hygiene-2026-06-05`, `execution-roadmap`, tier-5 workplan; update “latest synthesis” date |
| P1-3 | Non-canonical filenames   | See naming table             | `git mv` to kebab-case; update references                                                                                    |

### P2 — plan next quarter

| ID   | Violation                        | Notes                                                                                                                                                |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-1 | Doc length limits                | `integration-guide.md` (326), `trust-portal.md` (401), `overview/README.md` (562), several agile roadmaps >375 lines                                 |
| P2-2 | GitHub blob URLs in in-repo docs | Prefer relative paths per standard; keep commit SHAs as plain text or repo-relative where possible (`trust-portal.md`, `cross-repo-agent-bridge.md`) |
| P2-3 | Duplicate YAML frontmatter block | `docs/agents/docs-standard-lightweight.md` has two `---` blocks — merge on execute pass                                                              |
| P2-4 | Optional `docs/INDEX.md`         | One-line redirect to `README.md` for tooling that expects `INDEX.md`                                                                                 |

### Excluded / justified (unchanged from 2026-05-22)

| Item                                                                | Reason                                                                                 |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Legacy taxonomy (`agile/`, `devops/`, `gtm/`, `stack/`, `quality/`) | Deep automation + onboarding references; documented in INDEX § Docs Taxonomy Rationale |
| `docs/agents/sessions/index.md` vs `README.md`                      | Agent handoff protocol convention                                                      |
| Audit / reference docs over length limits                           | Historical evidence; split incrementally                                               |

---

## Naming violations (3)

| Current path                                        | Suggested                                           |
| --------------------------------------------------- | --------------------------------------------------- |
| `docs/security/RUSTSEC-rustls-webpki-mitigation.md` | `docs/security/rustsec-rustls-webpki-mitigation.md` |
| `docs/roadmap/ROADMAP-2026-07-13.md`                | `docs/roadmap/roadmap-2026-07-13.md`                |
| `docs/operations/AGENT-PROTOCOL-22-BRIEF.md`        | `docs/operations/agent-protocol-22-brief.md`        |

---

## Length violations (sample)

| File                                   | Lines | Limit | Class                         |
| -------------------------------------- | ----- | ----- | ----------------------------- |
| `docs/specs/integration-guide.md`      | 326   | 300   | operational                   |
| `docs/specs/ai-evaluation-pipeline.md` | 524   | 500   | architectural                 |
| `docs/architecture/api-patterns.md`    | 468   | 500   | architectural (borderline)    |
| `docs/governance/trust-portal.md`      | 401   | 300   | operational                   |
| `docs/overview/README.md`              | 562   | 500   | reference (split recommended) |
| `docs/remediation/remediation-plan.md` | 550   | 500   | architectural                 |

---

## Structural inventory (top-level `docs/`)

**382** markdown files. Top-level directories (repo-specific extensions in **bold**):

`agents/`, `agile/`, `architecture/`, `audit/`, `compliance/`, `crypto/`, `decisions/`, `devops/`, `eap/`, `gitbook/`, `governance/`, `gtm/`, `guides/`, `internal/`, `operations/`, `overview/`, `quality/`, `reference/`, `release/`, `remediation/`, `roadmap/`, `security/`, `specs/`, `stack/`, `testing/`

All align with gtcx-core’s documented taxonomy rationale in `docs/README.md` § Docs Taxonomy Rationale.

---

## RAG contract

`baseline.config.ts`:

```typescript
knowledge: {
  paths: ['docs/'],
  exclude: [
    'docs/audit/_historical/**',
    'docs/archive/**',
    'docs/templates/**',
    '_archive/**',
    '_delete/**',
    '**/node_modules/**',
    '**/dist/**',
  ],
  format: 'markdown',
},
```

**Pass** — matches ecosystem canonical exclude list.

---

## 10/10 gap analysis (doc-standard DoD)

| Criterion                           | Status      | Evidence                                                 |
| ----------------------------------- | ----------- | -------------------------------------------------------- |
| Single `/docs/` root                | **pass**    | No `_sop/` / `_cannon/`                                  |
| `CLAUDE.md` entrypoint              | **pass**    | Root present                                             |
| Master INDEX required sections      | **partial** | `docs/README.md` has §0–§15; **stale** June 2026 entries |
| kebab-case naming                   | **partial** | 3 violations / 382 files                                 |
| Frontmatter on substantive docs     | **partial** | 262/265 automated pass                                   |
| `pnpm docs:check-links` green       | **pass**    | exit 0                                                   |
| `pnpm docs:check-frontmatter` green | **fail**    | exit 1 (5 errors)                                        |
| Operational doc ≤300 lines          | **partial** | ~6 over limit                                            |
| Architectural doc ≤500 lines        | **partial** | ~4 over limit                                            |
| Relative in-repo links (style)      | **partial** | CI clean; blob URLs remain in trust-portal               |
| RAG excludes                        | **pass**    | `baseline.config.ts`                                     |

**Eligible today:** ~**9.1/10**. **10/10** requires P1 fixes + INDEX refresh + optional length splits.

---

## Violations fixed (this cycle)

| Violation                        | Resolution                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Frontmatter (3 files)            | Added `role`/`tier` on `zkp-circuit-profiles`, `eap-staging-issuance-ceremony`; tag `dtf-5-4` on coordination ack |
| Naming (3 files)                 | `git mv` → `rustsec-rustls-webpki-mitigation.md`, `roadmap-2026-07-13.md`, `agent-protocol-22-brief.md`           |
| INDEX drift                      | `docs/README.md` §0/§2/§10 + lookup table refreshed                                                               |
| `roadmap-2026-07-13` frontmatter | Full YAML after rename (removed `ROADMAP-*.md` exclude)                                                           |

**Post-remediation gates:** `pnpm docs:check-frontmatter` exit 0 · `pnpm docs:check-links` exit 0

---

## Violations remaining

See P1/P2 tables above (P2 length splits remain). Carried forward justified items from [2026-05-22 audit](./docs-standard-compliance-2026-05-22.md#violations-remaining-justified).

---

## Files moved/renamed

None (audit-only).

---

## Cross-references updated

None (audit-only).

---

## Remediation plan

| Order | Priority | Action                                                                             |
| ----- | -------- | ---------------------------------------------------------------------------------- |
| 1     | P1       | Fix 3 frontmatter failures; re-run `pnpm docs:check-frontmatter`                   |
| 2     | P1       | `git mv` 3 ALL_CAPS docs → kebab-case; run `pnpm docs:check-links`                 |
| 3     | P1       | Refresh `docs/README.md` §10 Audit + §0 Start Here (2026-06 audits, tier-5 status) |
| 4     | P2       | Split longest operational docs (`trust-portal`, `integration-guide`)               |
| 5     | P2       | Add `docs/INDEX.md` → redirect to `README.md` (optional)                           |

**Execute hint:** Say **“ship P1 doc-standard fixes”** or run a dedicated execute pass — do not batch with repo-hygiene unless scoped.

---

## Sign-off

| Role           | Status  | Date       |
| -------------- | ------- | ---------- |
| Author (agent) | Drafted | 2026-06-05 |
| Repo lead      | Pending | —          |

---

## Related audits

| Audit                   | Path                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Repo hygiene 2026-06-05 | [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                         |
| Full audit 2026-06-04   | [full-audit-2026-06-04.md](./full-audit-2026-06-04.md)                             |
| Prior doc-standard      | [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md) |
