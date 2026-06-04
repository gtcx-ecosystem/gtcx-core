---
title: 'Readiness & audit lanes — agent canonical guide'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AGENT-READINESS-LANES-001
tier: critical
tags: ['agents', 'audit', 'readiness', 'governance']
review_cycle: on-change
---

# Readiness & audit lanes — agent canonical guide

**Audience:** Every AI agent (Claude, Cursor, Codex, Gemini, Kimi, Copilot) and human reviewers.

**Rule:** If any other doc disagrees with this guide, **this guide + `docs/audit/readiness-model.md` + `docs/audit/latest.json`** win. Then run `pnpm readiness:lanes:check` and fix drift.

---

## 1. Source-of-truth hierarchy

| Priority | Artifact                                                       | Purpose                                 |
| -------- | -------------------------------------------------------------- | --------------------------------------- |
| 1        | [`docs/audit/readiness-model.md`](../audit/readiness-model.md) | Five lanes, scales, tier frameworks     |
| 2        | [`docs/audit/latest.json`](../audit/latest.json)               | Machine-readable scores and tiers       |
| 3        | **This file**                                                  | Agent instructions, prompts, anti-drift |
| 4        | Lane **indexes** (`docs/audit/*-2026-06-05.md`)                | Rollups linking forensic audits         |
| 5        | Forensic audits (`docs/audit/*.md`, `docs/gtm/*.md`)           | Evidence; date-stamped                  |
| 6        | Synced agent stubs (`.agent/*.md` → `AGENTS.md`, etc.)         | Pointers only — not score SoR           |

**Cross-repo forensic prompts:** `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`

---

## 2. Two numbers — never conflate

| Kind                  | Scale    | Use for                                                                                                           |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| **Audit quality**     | **1–10** | How good the _audit document_ is                                                                                  |
| **Readiness outcome** | Per lane | Engineering 9.5/10.0; internal **9.0** composite; bank-grade **8.9**; Industry **IC-T0**; GTM-Readiness **GR-T1** |

**Forbidden:** Using bank-grade **8.9** as engineering readiness, or rating Industry/GTM **delivery** on 1–10.

---

## 3. Five lanes (names are normative)

| #   | Lane name (exact)                  | Audit quality | Readiness outcome                | Index                                                                                                     |
| --- | ---------------------------------- | ------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | Engineering completeness & quality | 8.5           | 9.5 / 10.0 signoff               | [engineering-completeness-quality-2026-06-05.md](../audit/engineering-completeness-quality-2026-06-05.md) |
| 2   | Internal compliance                | 8.5           | **9.0** composite (5 domains)    | [internal-compliance-2026-06-05.md](../audit/internal-compliance-2026-06-05.md)                           |
| 3   | **Industry Compliance**            | 8.0           | **IC-T0–IC-T4** + OPEN register  | [industry-compliance-2026-06-05.md](../audit/industry-compliance-2026-06-05.md)                           |
| 4   | Bank-grade                         | 8.5           | **8.9** certified composite only | [bank-grade-2026-06-05.md](../audit/bank-grade-2026-06-05.md)                                             |
| 5   | **GTM-Readiness**                  | 8.0           | **GR-T0–GR-T6**                  | [gtm-readiness-2026-06-05.md](../audit/gtm-readiness-2026-06-05.md)                                       |

Register SoR (lane 3): [external-dependencies-register-2026-05-28.md](../audit/external-dependencies-register-2026-05-28.md)

---

## 3b. Global Compliance Rating (GCR) — tier + status

**Canonical:** [global-compliance-rating-2026-06-05.md](../audit/global-compliance-rating-2026-06-05.md) · `latest.json` → `globalComplianceRating`

| Field          | Current     | Scale                                           |
| -------------- | ----------- | ----------------------------------------------- |
| **GCR tier**   | **GCR-T0**  | GCR-T0 (blocked) → GCR-T4 (sustained)           |
| **GCR status** | **BLOCKED** | BLOCKED · OPEN · PREP-READY · IN-FLIGHT · CLEAR |

**Rollup of lanes 2 + 3** (corporate design + industry attestation). **Never 1–10.**

**Not GCI** (Global Compliance **Index** — protocol product). **Not 8.9** (bank-grade lane 4).

Update GCR when IC tier or EXT-CORE register changes.

---

## 4. Lane 2 — Internal compliance (five domains)

Lane 2 is **not** “docs/hygiene only.” Use domain scores from [internal-compliance index](../audit/internal-compliance-2026-06-05.md):

| Domain                      | Readiness |
| --------------------------- | --------: |
| Repo hygiene & organization |       9.6 |
| Documentation quality       |       9.6 |
| AI trust & safety           |       8.8 |
| Security (in-repo)          |       8.8 |
| Corporate readiness         |       8.2 |
| **Weighted composite**      |   **9.0** |

Documentation quality sub-dimensions: hygiene, accuracy, organization, breadth, quality — see index.

---

## 5. Deprecated / forbidden language

| Do not write                              | Write instead                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| External-dependent compliance             | **Industry Compliance** (lane 3)                                                                  |
| Lane 5 “GTM” (as lane name)               | **GTM-Readiness**                                                                                 |
| Internal compliance ~9.6 (single number)  | **9.0 composite** + domain breakdown                                                              |
| S1 / S2 alone for lane 5 readiness        | **GR-T1** / **GR-T2** / below GR-T2                                                               |
| Industry compliance 8.0 as delivery score | **IC-T0** tier + register status                                                                  |
| `engineering-readiness-*.md`              | [engineering-completeness-quality index](../audit/engineering-completeness-quality-2026-06-05.md) |
| Master audit 8.9 = “repo ready”           | **Lane 4 only**; cite lane 1 for engineering                                                      |

---

## 6. Agent session protocol (readiness)

After `AGENTS.md` Phase 1–3, before scoring or procurement claims:

1. Read [`readiness-model.md`](../audit/readiness-model.md) (2 min).
2. Read [`latest.json`](../audit/latest.json) (30 sec).
3. If claiming a lane: open that lane’s **index**, not a stale master audit alone.
4. Run `pnpm readiness:lanes:check` after editing audit docs or `latest.json`.

**Questions → lane:**

| Question                                                      | Lane         |
| ------------------------------------------------------------- | ------------ |
| Are CI/tests/gates green?                                     | 1            |
| Docs, hygiene, AI safety, in-repo security, corporate design? | 2            |
| Pen-test, SOC 2 letter, ceremony delivered?                   | 3 (IC tiers) |
| Investor composite / buyer lenses?                            | 4            |
| Can we sell / pilot which buyer?                              | 5 (GR tiers) |

---

## 7. Running forensic audits (all agents)

Same workflow for every provider — no ad-hoc prompts.

1. `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
2. `commands/<command>.md` (e.g. `master-audit`, `doc-standard`, `repo-hygiene`, `gtm-audit`)
3. `prompts/<category>/<prompt>.md` referenced by the command
4. Execute against this repo; write output to path in command (usually `docs/audit/<name>-<date>.md`)
5. **Update lane index + `latest.json`** if readiness outcomes changed — do not leave orphan audits

### Command → lane map (gtcx-core)

| Framework command                     | Primary lane              | Local index to update             |
| ------------------------------------- | ------------------------- | --------------------------------- |
| `doc-standard`                        | 2 (documentation quality) | internal-compliance               |
| `repo-hygiene`                        | 2 (repo hygiene)          | internal-compliance               |
| `master-audit` / `verification-audit` | 4                         | bank-grade                        |
| `forensic-audit` / `full-audit`       | 1 + 4 (+ notes for 2–5)   | engineering + bank-grade          |
| `gtm-audit`                           | 5                         | gtm-readiness                     |
| `security-audit`                      | 2 (security) + 3 notes    | internal-compliance               |
| `10-10-roadmap`                       | 1–4 mixed                 | tag items per lane in roadmap doc |

Ecosystem catalog: [ecosystem-audit-catalog-2026-06-05.md](../audit/ecosystem-audit-catalog-2026-06-05.md)

---

## 8. After an audit — update checklist

| Changed                | Update                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Domain scores (lane 2) | `internal-compliance-2026-06-05.md`, `latest.json` → `internalCompliance.readinessOutcome` |
| IC register rows       | `external-dependencies-register-*.md`, `industry-compliance-2026-06-05.md`, `latest.json`  |
| GR tiers               | `gtm-readiness-2026-06-05.md`, `latest.json` → `gtmReadiness`                              |
| Engineering signoff    | `engineering-completeness-quality-2026-06-05.md`, signoff audit                            |
| Composite 8.9          | `master-audit-*.md`, `bank-grade-2026-06-05.md`, `latest.json` → `bankGrade` only          |
| Agent-facing summary   | `README.md` lane table, `docs/overview/README.md` banner — **same numbers as latest.json** |
| Synced stubs           | `.agent/readiness-pointer.md` if table changes → `pnpm agent:sync`                         |

---

## 9. Synced agent files (no drift)

Content in synced targets (see [agent-sync-coverage.md](./agent-sync-coverage.md)): `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `KIMI.md`, `CODEX.md`, `CONVENTIONS.md`, `.cursor/rules/main.mdc`, `.github/copilot/instructions.md` — between `AGENT-SYNC` markers, generated from `.agent/`.

| Partial                | Role                                      |
| ---------------------- | ----------------------------------------- |
| `readiness-pointer.md` | Five lanes + anti-conflation (all agents) |
| `audit-pointer.md`     | Cross-repo AGENT-START workflow           |
| `base.md`              | Build commands                            |

**Edit `.agent/*.md`, then:** `pnpm agent:sync` · CI: `pnpm agent:check`

**Never** hand-edit scores inside `AGENT-SYNC` blocks — edit indexes + `latest.json`, then sync pointers only.

---

## 10. Verification commands

```bash
pnpm readiness:lanes:check    # latest.json + required indexes + forbidden phrases
pnpm agent:check              # agent-sync drift
pnpm quality:governance:check # includes agent:check + readiness:lanes:check (CI)
pnpm docs:check-links
```

Lane 2 gates: see [internal-compliance index](../audit/internal-compliance-2026-06-05.md).

---

## 11. Related agent docs

| Doc                                                        | Role                     |
| ---------------------------------------------------------- | ------------------------ |
| [`onboarding/orientation.md`](./onboarding/orientation.md) | Codebase map + gates     |
| [`routing-rules.json`](./routing-rules.json)               | Who owns `docs/audit/**` |
| [`safety-rules.json`](./safety-rules.json)                 | SR-009 score conflation  |
| [`docs/audit/README.md`](../audit/README.md)               | Audit folder entry       |
