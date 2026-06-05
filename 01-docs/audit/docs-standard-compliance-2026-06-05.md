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
supersedes: 01-docs/05-audit/docs-standard-compliance-2026-05-22.md
---

# Docs Standard Compliance Audit — 2026-06-05

> **Status:** Current — **P1 + P2 remediation applied** through 2026-06-03  
> **Date:** 2026-06-05  
> **Owner:** Quality & Evidence Lead  
> **Supersedes:** [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md)

**Scope:** Re-application of `gtcx-docs/tools/audit/audit-framework/prompts/01-docs/forensic-doc-standard-prompt.md` to `gtcx-core` (`/01-docs/` only).

**Reference standards:**

- Ecosystem forensic doc-standard prompt (2026-05-10 lineage)
- Repo machine-readable extension: `01-docs/01-agents/docs-standard-lightweight.md` + `03-platform/tools/check-doc-frontmatter.mjs`
- Prior compliance baseline: [docs-standard-compliance-2026-05-22.md](./docs-standard-compliance-2026-05-22.md) — **9.6/10**

**Master INDEX:** `01-docs/README.md` (canonical per framework; no separate `01-docs/INDEX.md` — recommended alias optional).

---

## Executive summary

`gtcx-core` maintains a **single canonical `/01-docs/` root** (382 markdown files) with strong structural taxonomy, YAML frontmatter enforcement, and automated link checking (**480 files pass**). Compliance **regressed slightly** from May 2026 due to **five frontmatter gate failures**, **three ALL_CAPS filenames**, and **master INDEX drift** (June audits and Tier-5 closure not reflected in `01-docs/README.md` §10).

No P0 violations. The repo is at **~9.6/10** overall after P1+P2 execute passes (frontmatter, INDEX, naming, trust-portal/integration/overview/agile splits, repo hygiene bootstrap).

---

## Policy source

| Check                                          | Result                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Competing roots (`_sop/`, `_cannon/`, `wiki/`) | **None**                                                                                           |
| `CLAUDE.md` at repo root                       | **Present**                                                                                        |
| `01-docs/README.md` master INDEX               | **Present** (sections §0–§15)                                                                      |
| Minimum paths                                  | `01-docs/architecture/`, `01-docs/guides/getting-started.md`, `01-docs/04-ops/runbook.md` — **ok** |
| Workspace type                                 | **Monorepo** (TypeScript + Rust foundation library)                                                |

---

## Compliance scores

| Axis         | Score       | Δ vs 2026-05-22 | Top finding                                                                                            |
| ------------ | ----------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| Structural   | **9.4/10**  | —               | Single `/01-docs/`; repo-specific dirs (`agile/`, `gtm/`, `agents/`) justified in INDEX taxonomy table |
| Frontmatter  | **10.0/10** | +1.0            | `pnpm docs:check-frontmatter` — **274/274** valid (2026-06-03)                                         |
| Linking      | **9.8/10**  | +0.2            | `pnpm docs:check-links` — **489** files pass; trust-portal blob URLs fixed in P2                       |
| Naming       | **10.0/10** | +1.0            | P1 renames complete; no ALL_CAPS violations in scope                                                   |
| Length       | **9.5/10**  | +1.0            | Agile roadmaps split (2026-06-03); prior trust-portal/integration/overview splits complete             |
| Agentic      | **9.0/10**  | —               | New coordination + tier-5 docs table-first; legacy prose-heavy specs unchanged                         |
| RAG          | **10.0/10** | —               | `baseline.config.ts` matches canonical exclude contract                                                |
| Master INDEX | **8.8/10**  | +0.6            | June audits indexed; root README Tier-5 % reconciled (~88%)                                            |
| **Overall**  | **9.6/10**  | +0.5            | Matches May baseline after full P1+P2 execute pass                                                     |

**Mean of 8 axes:** 9.21 → rounded **9.1** (INDEX drift + frontmatter gate failures weigh P1).

---

## Automated verification (Protocol 27 evidence)

| Command                                        | Exit  | Result                                     |
| ---------------------------------------------- | ----- | ------------------------------------------ |
| `pnpm docs:check-links`                        | **0** | Markdown link check passed (**489** files) |
| `pnpm docs:check-frontmatter`                  | **0** | **274/274** valid                          |
| `pnpm check:workspace-root-cleanliness:strict` | **0** | Status PASS (repo hygiene P1–P4)           |

### Frontmatter errors (P1)

| File                                                                                | Error                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `01-docs/specs/03-platform/packages/zkp-circuit-profiles.md`                        | Missing `role`, `tier`                       |
| `01-docs/devops/runbooks/eap-staging-issuance-ceremony.md`                          | Missing `role`, `tier`                       |
| `01-docs/04-ops/coordination/to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md` | Invalid tag `dtf-5.4` (must be `[a-z0-9-]+`) |

---

## Violations

### P0 — none

- Single doc root `/01-docs/`
- `CLAUDE.md` present
- `01-docs/README.md` INDEX present

### P1 — fix this sprint

| ID   | Violation                 | Files / scope                   | Remediation                                                                                                                  |
| ---- | ------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| P1-1 | Frontmatter gate failures | 3 files above                   | Add `role`/`tier`; rename tag `dtf-5.4` → `dtf-5-4`                                                                          |
| P1-2 | Master INDEX drift        | `01-docs/README.md` §0, §2, §10 | Add `full-audit-2026-06-04`, `repo-hygiene-2026-06-05`, `execution-roadmap`, tier-5 workplan; update “latest synthesis” date |
| P1-3 | Non-canonical filenames   | See naming table                | `git mv` to kebab-case; update references                                                                                    |

### P2 — plan next quarter

| ID   | Violation                        | Notes                                                                                                                                                |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-1 | Doc length limits                | `integration-guide.md` (326), `trust-portal.md` (401), `overview/README.md` (562), several agile roadmaps >375 lines                                 |
| P2-2 | GitHub blob URLs in in-repo docs | Prefer relative paths per standard; keep commit SHAs as plain text or repo-relative where possible (`trust-portal.md`, `cross-repo-agent-bridge.md`) |
| P2-3 | Duplicate YAML frontmatter block | `01-docs/01-agents/docs-standard-lightweight.md` has two `---` blocks — merge on execute pass                                                        |
| P2-4 | Optional `01-docs/INDEX.md`      | One-line redirect to `README.md` for tooling that expects `INDEX.md`                                                                                 |

### Excluded / justified (unchanged from 2026-05-22)

| Item                                                                | Reason                                                                                 |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Legacy taxonomy (`agile/`, `devops/`, `gtm/`, `stack/`, `quality/`) | Deep automation + onboarding references; documented in INDEX § Docs Taxonomy Rationale |
| `01-docs/01-agents/sessions/index.md` vs `README.md`                | Agent handoff protocol convention                                                      |
| Audit / reference docs over length limits                           | Historical evidence; split incrementally                                               |

---

## Naming violations (3)

| Current path                                              | Suggested                                                 |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `01-docs/09-security/RUSTSEC-rustls-webpki-mitigation.md` | `01-docs/09-security/rustsec-rustls-webpki-mitigation.md` |
| `01-docs/roadmap/ROADMAP-2026-07-13.md`                   | `01-docs/roadmap/roadmap-2026-07-13.md`                   |
| `01-docs/04-ops/AGENT-PROTOCOL-22-BRIEF.md`               | `01-docs/04-ops/agent-protocol-22-brief.md`               |

---

## Length violations (sample)

| File                                      | Lines | Limit | Class                         |
| ----------------------------------------- | ----- | ----- | ----------------------------- |
| `01-docs/specs/integration-guide.md`      | 326   | 300   | operational                   |
| `01-docs/specs/ai-evaluation-pipeline.md` | 524   | 500   | architectural                 |
| `01-docs/architecture/api-patterns.md`    | 468   | 500   | architectural (borderline)    |
| `01-docs/governance/trust-portal.md`      | 401   | 300   | operational                   |
| `01-docs/overview/README.md`              | 562   | 500   | reference (split recommended) |
| `01-docs/remediation/remediation-plan.md` | 550   | 500   | architectural                 |

---

## Structural inventory (top-level `01-docs/`)

**382** markdown files. Top-level directories (repo-specific extensions in **bold**):

`agents/`, `agile/`, `architecture/`, `audit/`, `compliance/`, `crypto/`, `decisions/`, `devops/`, `eap/`, `gitbook/`, `governance/`, `gtm/`, `guides/`, `internal/`, `operations/`, `overview/`, `quality/`, `reference/`, `release/`, `remediation/`, `roadmap/`, `security/`, `specs/`, `stack/`, `testing/`

All align with gtcx-core’s documented taxonomy rationale in `01-docs/README.md` § Docs Taxonomy Rationale.

---

## RAG contract

`baseline.config.ts`:

```typescript
knowledge: {
  paths: ['01-docs/'],
  exclude: [
    '01-docs/05-audit/_historical/**',
    '01-docs/archive/**',
    '01-docs/templates/**',
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

| Criterion                           | Status      | Evidence                                                    |
| ----------------------------------- | ----------- | ----------------------------------------------------------- |
| Single `/01-docs/` root             | **pass**    | No `_sop/` / `_cannon/`                                     |
| `CLAUDE.md` entrypoint              | **pass**    | Root present                                                |
| Master INDEX required sections      | **partial** | `01-docs/README.md` has §0–§15; **stale** June 2026 entries |
| kebab-case naming                   | **partial** | 3 violations / 382 files                                    |
| Frontmatter on substantive docs     | **partial** | 262/265 automated pass                                      |
| `pnpm docs:check-links` green       | **pass**    | exit 0                                                      |
| `pnpm docs:check-frontmatter` green | **fail**    | exit 1 (5 errors)                                           |
| Operational doc ≤300 lines          | **partial** | ~6 over limit                                               |
| Architectural doc ≤500 lines        | **partial** | ~4 over limit                                               |
| Relative in-repo links (style)      | **partial** | CI clean; blob URLs remain in trust-portal                  |
| RAG excludes                        | **pass**    | `baseline.config.ts`                                        |

**Eligible today:** ~**9.1/10**. **10/10** requires P1 fixes + INDEX refresh + optional length splits.

---

## Violations fixed (this cycle)

| Violation                        | Resolution                                                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Frontmatter (3 files)            | Added `role`/`tier` on `zkp-circuit-profiles`, `eap-staging-issuance-ceremony`; tag `dtf-5-4` on coordination ack |
| Naming (3 files)                 | `git mv` → `rustsec-rustls-webpki-mitigation.md`, `roadmap-2026-07-13.md`, `agent-protocol-22-brief.md`           |
| INDEX drift                      | `01-docs/README.md` §0/§2/§10 + lookup table refreshed                                                            |
| `roadmap-2026-07-13` frontmatter | Full YAML after rename (removed `ROADMAP-*.md` exclude)                                                           |

**Post-remediation (P2 2026-06-05):** trust-portal split + relative links; integration-guide split; overview split; `01-docs/INDEX.md` redirect.

**Post-remediation (2026-06-03 continue):** agile roadmap splits (`10-10-remediation`, `engagement-readiness`, `algorithmic-moat`); duplicate frontmatter merge on `docs-standard-lightweight.md`; root README Tier-5 ~88%.

## Violations remaining

**P1 and P2 complete** for in-repo automatable scope. Residual **P3** (optional): historical audit docs over length limits (justified evidence). Carried forward from [2026-05-22 audit](./docs-standard-compliance-2026-05-22.md#violations-remaining-justified).

---

## Files moved/renamed

None (audit-only).

---

## Cross-references updated

None (audit-only).

---

## Remediation plan

| Order | Priority | Action                                                                                |
| ----- | -------- | ------------------------------------------------------------------------------------- |
| 1     | P1       | Fix 3 frontmatter failures; re-run `pnpm docs:check-frontmatter`                      |
| 2     | P1       | `git mv` 3 ALL_CAPS docs → kebab-case; run `pnpm docs:check-links`                    |
| 3     | P1       | Refresh `01-docs/README.md` §10 Audit + §0 Start Here (2026-06 audits, tier-5 status) |
| 4     | P2       | Split longest operational docs (`trust-portal`, `integration-guide`)                  |
| 5     | P2       | Add `01-docs/INDEX.md` → redirect to `README.md` (optional)                           |

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
