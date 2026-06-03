---
title: 'Production Readiness 10/10 Roadmap'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'release']
review_cycle: 'on-change'
---

---

title: 'Production Readiness 10 10 Roadmap'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'

---

# Production Readiness 10/10 Roadmap

> **Status:** Superseded
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead
>
> **⚠️ This document is historical.** The current canonical audit and remediation
> plan is [`docs/audit/master-audit-2026-05-11.md`](../audit/master-audit-2026-05-11.md)
> and [`docs/audit/remediation-2026-05-11.md`](../audit/remediation-2026-05-11.md).

**Last reviewed:** 2026-05-09
**Current score:** 9.8/10 total production assurance
**Target score:** 10/10 production readiness
**Scope:** `gtcx-core` release assurance as a shared library, not a hosted service

## Outcome Definition

`10/10` production readiness requires all four outcomes to be true:

1. Code trust is proven by deterministic gates and release evidence.
2. Global-south operating constraints are explicit and validated.
3. Agentic work is governed, reproducible, and reviewable.
4. Enterprise adoption risk is low because external validation, compliance evidence, and signoff are complete.

## Sprint Plan

| Sprint | Theme                           | Status      | Exit Criteria                                                                                                       |
| ------ | ------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| P0     | Evidence and docs integrity     | Completed   | Broad markdown link check passes; GA evidence check is deterministic; QA docs are real, not template-only           |
| P1     | Release-candidate evidence pack | In progress | SAST, SBOM, secret scan, dependency scans, provenance, API report, KPI metrics, and heavy ZKP evidence are attached |
| P2     | External security validation    | Pending     | External pen test or security review completed; findings logged, remediated, or formally accepted                   |
| P3     | Downstream consumer validation  | Pending     | At least one downstream consumer validates production-style integration using the release artifact pack             |
| P4     | Compliance evidence collection  | Pending     | SOC2 and ISO 27001 evidence collected for the release period, not just mapped                                       |
| P5     | Final release signoff           | Pending     | Security, Platform, Product, and Compliance signoff recorded; release tag and artifact pack finalized               |

## Current Repo-Owned Work

These items can be completed inside this repo:

1. Make GA evidence summary checks deterministic.
2. Expand markdown link checking to all tracked markdown docs.
3. Replace stale QA/testing templates with repo-specific production gates.
4. Ensure release, QA, testing, audit, and roadmap docs agree on remaining blockers.
5. Keep `docs/release/ga-release/ga-release-evidence-summary.md` generated from `docs/release/ga-release/ga-release-evidence-log.md`.

## External Work Required

These items require real external artifacts:

1. External security review or pen test report.
2. Downstream consumer validation report.
3. Release-candidate SAST result.
4. Release-candidate SBOM artifact.
5. Release-candidate secret scan result.
6. SOC2 evidence collection output.
7. ISO 27001 evidence collection output.
8. Final human signoff.
9. GitHub Code Security/code scanning enabled for release-candidate SAST and SARIF evidence upload.
10. GitHub Actions release automation permission enabled before manual release dispatch can create a version PR or publish.

## 10/10 Exit Gate

Production readiness reaches `10/10` only when:

1. `docs/release/ga-release/ga-release-evidence-summary.md` shows evidence for all 15 gates.
2. `docs/release/ga-release/ga-release-status.md` has no `Pending` or `Partial` release blockers.
3. `docs/release/external-validation-findings-log.md` contains the actual external review outcome.
4. `docs/release/downstream-validation-report-template.md` has been copied into a completed downstream validation report.
5. `docs/release/final-signoff-artifact-template.md` has been copied into a completed signoff artifact.
