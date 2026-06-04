---
title: 'Internal compliance — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-INT-COMPLIANCE-2026-06-05
audit_lane: internal-compliance
audit_quality: 8.5
tier: critical
tags: ['audit', 'compliance', 'internal', 'index', 'domains']
review_cycle: quarterly
supersedes_note: 'Six readiness domains with scores — not docs/hygiene only'
---

# Internal compliance — index

**Lane 2 of 5** — [readiness-model.md](./readiness-model.md)

**Primary command:** `compliance-audit` → `docs/audit/compliance-audit-<date>.md`  
**Scoring:** [internal-compliance-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/lane-scoring/internal-compliance-scoring.md)

In-repo **control design, documentation, hygiene, AI safety, security posture, and corporate readiness** — not third-party Industry Compliance (lane 3) or GTM-Readiness (lane 5).

**Lane 2 audit program quality:** **8.5/10**

**Lane 2 readiness composite:** **9.0/10** (weighted domain rollup below)

---

## Domain scorecard (readiness outcomes)

Scores rate **in-repo readiness** from forensic audits — not audit-document quality alone.

| Domain                          | Readiness | Primary audit / evidence                                                                                            |
| ------------------------------- | --------: | ------------------------------------------------------------------------------------------------------------------- |
| **Repo hygiene & organization** |   **9.8** | [repo-hygiene-2026-06-04.md](./repo-hygiene-2026-06-04.md)                                                          |
| **Documentation quality**       |   **9.6** | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md)                                  |
| **AI trust & safety**           |   **8.8** | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md) · [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) |
| **Security**                    |   **8.8** | Threat matrix · [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) Phase 2                                      |
| **Corporate readiness**         |   **8.2** | [soc2-readiness.md](../compliance/soc2-readiness.md) · [sox-controls.md](../compliance/sox-controls.md)             |

**Weighted composite (15 / 25 / 15 / 25 / 20):** **9.0/10**

---

## 1 — Repo hygiene & organization

**Readiness: 9.8/10** — [repo-hygiene-2026-06-04.md](./repo-hygiene-2026-06-04.md) (execute validation)

| Axis                 |    Score | Notes                                                     |
| -------------------- | -------: | --------------------------------------------------------- |
| Root cleanliness     | **10.0** | `check:workspace-root-cleanliness:strict` PASS; allowlist |
| Per-directory README | **10.0** | 100% `packages/*/` README sweep                           |
| Build artifacts      | **10.0** | Zero tracked artifacts                                    |
| Archive handling     |  **9.5** | `_delete/` human-owned; allowlist documented              |
| Naming               |  **9.5** | Root allowlist; inventory 24 + 4 config                   |
| Size / OS junk       | **10.0** | None tracked                                              |
| Empty directories    |  **9.0** | Local fuzz/baseline empties — P2 gitignored exception     |
| Inventory accuracy   |     pass | `packages/README.md` aligned with tree                    |

**Gates:** `pnpm check:workspace-root-cleanliness:strict`

---

## 2 — Documentation quality

**Readiness: 9.6/10** — [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md)

Sub-dimensions (from doc-standard 8-axis forensic):

| Sub-dimension    |   Score | Maps from doc-standard axis                              |
| ---------------- | ------: | -------------------------------------------------------- |
| **Hygiene**      | **9.8** | Naming 10.0 · length 9.5 · single `/docs/` root          |
| **Accuracy**     | **9.9** | Frontmatter 10.0 · linking 9.8                           |
| **Organization** | **9.1** | Structural 9.4 · master INDEX 8.8                        |
| **Breadth**      | **9.2** | INDEX §0–§15 coverage; specs catalog; audit lane indexes |
| **Quality**      | **9.5** | Agentic 9.0 · RAG 10.0 · table-first coordination docs   |

**Gates:** `pnpm docs:check-frontmatter` · `pnpm docs:check-links`

---

## 3 — AI trust & safety

**Readiness: 8.8/10** — agentic maturity + safety controls (library scope)

| Sub-dimension                     |   Score | Evidence                                                                |
| --------------------------------- | ------: | ----------------------------------------------------------------------- |
| **Trust scorecard**               | **9.2** | `@gtcx/ai-eval` · 22/22 npm provenance; scorecard artifact              |
| **Agent governance**              | **9.0** | Protocol 22 · `quality:governance:check` · coordination bridge          |
| **Crypto / observability safety** | **9.0** | `sanitizeSecrets` · strict `SecurityLogger` · threat matrix             |
| **Traced verification**           | **8.0** | `traced.ts` exists; commodity-origin ZK path not fully traced           |
| **CI enforcement**                | **8.5** | `ai-eval` WARN **non-blocking** — examiners may want hard gate on pilot |

**Gaps (P2):** Wire `pnpm ai:evaluate` as blocking on release branches; extend tracing to ZK prove path.

**Refs:** [ai-evaluation-pipeline.md](../specs/ai-evaluation-pipeline.md) · [anti-inflation-audit-results-2026-05-11.md](./anti-inflation-audit-results-2026-05-11.md)

---

## 4 — Security (in-repo)

**Readiness: 8.8/10** — [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) Phase 2 (library lens)

| Area                                 |   Score | Status                                                                                |
| ------------------------------------ | ------: | ------------------------------------------------------------------------------------- |
| Data protection (FIPS, sanitization) | **9.2** | `GTCX_FIPS_STRICT` · CMVP #4816                                                       |
| Input validation (Zod, NAPI)         | **9.0** | Verification schemas + hex asserts                                                    |
| Dependency security                  | **8.5** | pnpm audit CI; `rust/.cargo/audit.toml` mitigations                                   |
| Threat control matrix (12 controls)  | **9.5** | `pnpm security:threat-matrix` PASS                                                    |
| Fuzz / property evidence             | **9.5** | 500K+ iterations zero crash ([fuzz evidence](./fuzz-campaign-evidence-2026-05-21.md)) |
| External pen-test artifact           | **n/a** | Lane 3 Industry Compliance — not in-repo                                              |

**Not in this domain:** live-stack pen-test, SOC 2 **letter** → [industry-compliance](./industry-compliance-2026-06-05.md).

**Gates:** `pnpm security:threat-matrix` · `cargo audit` / `cargo deny` (Rust CI)

---

## 5 — Corporate readiness

**Readiness: 8.2/10** — governance + SOC 2 **design** (no CPA letter in-repo)

| Sub-dimension                    |   Score | Evidence                                                                                  |
| -------------------------------- | ------: | ----------------------------------------------------------------------------------------- |
| **SOC 2 TSC alignment (design)** | **8.1** | Security CC **78%** · Confidentiality **85%** · PI **80%**                                |
| **SOX / change controls**        | **8.5** | [sox-controls.md](../compliance/sox-controls.md) · CODEOWNERS · branch protection         |
| **Governance automation**        | **9.0** | `pnpm quality:governance:check` PASS (14 scripts, 8 CODEOWNERS paths)                     |
| **Evidence pipeline**            | **8.0** | [soc2-evidence-pipeline.md](../compliance/soc2-evidence-pipeline.md) — partial automation |
| **Trust portal / buyer pack**    | **8.5** | [trust-portal-evidence.md](../governance/trust-portal-evidence.md)                        |

**Gaps:** CC1.2 board oversight documentation; formal SOC 2 Type I letter → Industry Compliance (IC-T0).

**Refs:** [soc2-readiness.md](../compliance/soc2-readiness.md) · [soc2-engagement-log.md](../compliance/soc2-engagement-log.md) · [internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md) INT-CORE-05/06 prep

---

## Canonical audits (by domain)

| Domain        | Audit / doc                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Repo hygiene  | [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                                                                          |
| Documentation | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md)                                                  |
| AI trust      | [full-audit-2026-06-04.md](./full-audit-2026-06-04.md) · `@gtcx/ai-eval`                                                            |
| Security      | [threat-control-matrix.md](../security/threat-control-matrix.md) · [fuzz-campaign-evidence](./fuzz-campaign-evidence-2026-05-21.md) |
| Corporate     | [soc2-readiness.md](../compliance/soc2-readiness.md) · [sox-controls.md](../compliance/sox-controls.md)                             |
| Cross-cutting | [internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md) · [anti-inflation](./anti-inflation-audit-results-2026-05-11.md)   |

---

## Gates (lane 2 rollup)

```bash
pnpm docs:check-frontmatter && pnpm docs:check-links
pnpm check:workspace-root-cleanliness:strict
pnpm quality:governance:check && pnpm security:threat-matrix
```

---

## Not in this lane

| Item                             | Lane                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| Delivered pen-test PDF           | [industry-compliance](./industry-compliance-2026-06-05.md) |
| SOC 2 Type I **letter** from CPA | [industry-compliance](./industry-compliance-2026-06-05.md) |
| Regulator sandbox send           | [gtm-readiness](./gtm-readiness-2026-06-05.md)             |
