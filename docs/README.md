# Documentation

**Last updated:** 2026-05-27
**Latest synthesis:** [`audit/master-audit-2026-05-27-fresh.md`](./audit/master-audit-2026-05-27-fresh.md) (fresh master audit, composite 8.9/10)
**Conflict-free guarantee:** Canonical repo documentation lives under `docs/`. Generated artifacts and staged-delete material are intentionally excluded from the source-of-truth set.

## §0 Start Here

| Document                                                                 | Purpose                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| [`start-here.md`](./start-here.md)                                       | Fastest path to repo identity, current state, and next reads  |
| [`agents/onboarding/orientation.md`](./agents/onboarding/orientation.md) | Session-start protocol and codebase map                       |
| [`architecture/overview.md`](./architecture/overview.md)                 | Trust boundaries, package layering, and architecture overview |

## §1 For External Reviewers

| Document                                                                                       | Purpose                                                        |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`governance/trust-portal.md`](./governance/trust-portal.md)                                   | Evidence index for vendor risk teams, regulators, and auditors |
| [`gtm/00-executive-brief.md`](./gtm/00-executive-brief.md)                                     | External-facing summary of the repo's role in the ecosystem    |
| [`release/enterprise-release-artifact-pack.md`](./release/enterprise-release-artifact-pack.md) | Enterprise supportability and release-readiness posture        |

## §2 Roadmap & Plans

| Document                                                                                                                               | Purpose                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md`](./agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) | **Active** sovereign-state engagement readiness — 4 sprints (Zimbabwe → Ghana → Namibia → Botswana → DRC)  |
| [`agile/roadmap/roadmap.md`](./agile/roadmap/roadmap.md)                                                                               | Current delivery roadmap                                                                                   |
| [`audit/10-10-remediation-plan-2026-05-27.md`](./audit/10-10-remediation-plan-2026-05-27.md)                                           | **Latest** comprehensive 10/10 remediation — docs, hygiene, GTM, ecosystem, SLSA, new issues               |
| [`audit/remediation-2026-05-11.md`](./audit/remediation-2026-05-11.md)                                                                 | Bank-grade readiness roadmap (partial — superseded by 2026-05-27 plan)                                     |
| [`release/production-readiness-10-10-roadmap.md`](./release/production-readiness-10-10-roadmap.md)                                     | ~~Release-grade readiness plan~~ (deprecated — superseded by `audit/10-10-remediation-plan-2026-05-27.md`) |

## §3 ADRs

| Document                                                                     | Purpose                                      |
| ---------------------------------------------------------------------------- | -------------------------------------------- |
| [`decisions/README.md`](./decisions/README.md)                               | ADR index with numbered decisions and status |
| [`decisions/014-runtime-substrate.md`](./decisions/014-runtime-substrate.md) | Latest major architectural decision          |

## §4 Architecture & Engineering

| Document                                                                           | Purpose                                                                                                                       |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`architecture/system-overview.md`](./architecture/system-overview.md)             | **Canonical** Protocol 13 Tier 1 system overview with Mermaid diagrams (system arch, data flow, trust boundaries, deployment) |
| [`architecture/ecosystem-integration.md`](./architecture/ecosystem-integration.md) | **Canonical** Protocol 13 Tier 1 cross-repo dependency map; 14 consumers tracked with Mermaid integration diagrams            |
| [`architecture/business-logic.md`](./architecture/business-logic.md)               | Protocol 13 Tier 2 library-adapted value model — compounding-foundation network effects across the ecosystem                  |
| [`architecture/adoption-model.md`](./architecture/adoption-model.md)               | Protocol 13 Tier 2 adoption funnel — workspace-to-npm-to-external paths with Mermaid sequence diagrams                        |
| [`architecture/overview.md`](./architecture/overview.md)                           | Module-level architecture overview (companion to system-overview.md)                                                          |
| [`architecture/trust-contract-matrix.md`](./architecture/trust-contract-matrix.md) | Trust boundary matrix across core surfaces                                                                                    |
| [`architecture/structural-debt.md`](./architecture/structural-debt.md)             | Tracked structural debt for `docs/` (21 subdirs → 9 target) — deferred consolidation plan                                     |
| [`devops/overview.md`](./devops/overview.md)                                       | Entry point into CI/CD and operational engineering docs                                                                       |
| [`stack/tech-stack.md`](./stack/tech-stack.md)                                     | Stack rationale and constraints                                                                                               |

## §5 Specs

| Document                                                     | Purpose                           |
| ------------------------------------------------------------ | --------------------------------- |
| [`specs/core-spec.md`](./specs/core-spec.md)                 | Core shared-library specification |
| [`specs/packages/README.md`](./specs/packages/README.md)     | Package-level spec index          |
| [`specs/integration-guide.md`](./specs/integration-guide.md) | Downstream integration guidance   |

## §6 Operations

| Document                                                                       | Purpose                                   |
| ------------------------------------------------------------------------------ | ----------------------------------------- |
| [`operations/runbook.md`](./operations/runbook.md)                             | Operator entrypoint                       |
| [`operations/repo-bootstrap.md`](./operations/repo-bootstrap.md)               | Operational prerequisites verifier output |
| [`devops/runbooks/quality-runbook.md`](./devops/runbooks/quality-runbook.md)   | Gate sequence and CI triage               |
| [`devops/runbooks/incident-runbook.md`](./devops/runbooks/incident-runbook.md) | Incident response procedure               |

## §7 Security

| Document                                                                         | Purpose                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`security/security-framework.md`](./security/security-framework.md)             | Security control model                                                |
| [`security/threat-model.md`](./security/threat-model.md)                         | Threat model and mitigations                                          |
| [`security/fips-validation-boundary.md`](./security/fips-validation-boundary.md) | FIPS boundary statement                                               |
| [`security/pkcs11-keystore.md`](./security/pkcs11-keystore.md)                   | Hardware-backed keystore design                                       |
| [`security/vulnerability-disclosure.md`](./security/vulnerability-disclosure.md) | **Protocol 1 v2.0 P2** — VDP policy per CERT CVD + ISO/IEC 29147:2018 |
| [`security/trust-center.md`](./security/trust-center.md)                         | Redirect to canonical `governance/trust-portal.md`                    |
| [`security/pen-test-rfp-2026.md`](./security/pen-test-rfp-2026.md)               | Pen test RFP + vendor outreach (Sprint 4.1)                           |
| [`security/pen-test-engagement-log.md`](./security/pen-test-engagement-log.md)   | Append-only log of pen-test vendor outreach, SoW, kickoff state       |
| [`security/ark-upstream-tracking.md`](./security/ark-upstream-tracking.md)       | Tracker for arkworks 0.5 migration + ignored advisories               |

## §8 Compliance

| Document                                                                               | Purpose                                                                                   |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`compliance/soc2-readiness.md`](./compliance/soc2-readiness.md)                       | SOC 2 readiness gap analysis                                                              |
| [`compliance/soc2-readiness-prep.md`](./compliance/soc2-readiness-prep.md)             | SOC 2 Type 1 engagement prep — closes the remaining gap before CPA fieldwork (Sprint 4.2) |
| [`compliance/soc2-engagement-log.md`](./compliance/soc2-engagement-log.md)             | Append-only log of SOC 2 CPA outreach, contract, and kickoff state                        |
| [`compliance/compliance-requirements.md`](./compliance/compliance-requirements.md)     | Compliance obligations and scope                                                          |
| [`compliance/spec-to-code-traceability.md`](./compliance/spec-to-code-traceability.md) | Traceability from docs to implementation                                                  |

## §9 Governance

| Document                                                       | Purpose                            |
| -------------------------------------------------------------- | ---------------------------------- |
| [`governance/trust-portal.md`](./governance/trust-portal.md)   | Public trust evidence index        |
| [`agents/governance/README.md`](./agents/governance/README.md) | AI review governance and playbooks |

## §10 Audit

| Document                                                                                           | Purpose                                                                              |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`audit/master-audit-2026-05-27-fresh.md`](./audit/master-audit-2026-05-27-fresh.md)               | **Latest** fresh master audit — composite 8.9/10, 0 P0, 3 P1, 2 P2                   |
| [`audit/internal-completion-audit-2026-05-21.md`](./audit/internal-completion-audit-2026-05-21.md) | **Latest** internal completion audit — composite 9.5/10, 24/24 items                 |
| [`audit/fuzz-campaign-evidence-2026-05-21.md`](./audit/fuzz-campaign-evidence-2026-05-21.md)       | 500K+ libFuzzer iterations across 6 primitives, 0 crashes / panics / ASAN violations |
| [`audit/docs-standard-compliance-2026-05-22.md`](./audit/docs-standard-compliance-2026-05-22.md)   | Protocol 1 v2.0 documentation compliance audit                                       |
| [`audit/full-audit-2026-05-09.md`](./audit/full-audit-2026-05-09.md)                               | Prior full forensic audit                                                            |
| [`audit/auto-dev-state.md`](./audit/auto-dev-state.md)                                             | Rolling posture and session state                                                    |
| [`audit/remediation-2026-05-11.md`](./audit/remediation-2026-05-11.md)                             | Prior 10/10 remediation plan                                                         |
| [`audit/remediation-10-10.md`](./audit/remediation-10-10.md)                                       | ~~Prior remediation plan~~ (deprecated)                                              |
| [`audit/gtcx-ecosystem-rating-2026-05-08.md`](./audit/gtcx-ecosystem-rating-2026-05-08.md)         | Prior ecosystem-level assessment                                                     |

## §11 Repo-Specific Sections

| Document                                                                                     | Purpose                                                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [`gtm/README.md`](./gtm/README.md)                                                           | GTM and regulator-facing packet index                                                 |
| [`gtm/sandbox-intro-email-template.md`](./gtm/sandbox-intro-email-template.md)               | **Canonical** sandbox intro email template + per-country parameter table              |
| [`gtm/sandbox-intro-email-template.fr.md`](./gtm/sandbox-intro-email-template.fr.md)         | French variant for Francophone targets (DRC primary)                                  |
| [`gtm/renders/README.md`](./gtm/renders/README.md)                                           | Send-ready per-country renders index (Zimbabwe / Ghana / Namibia / Botswana / DRC-FR) |
| [`release/README.md`](./release/README.md)                                                   | Release artifact set                                                                  |
| [`devops/release-mgmt/npm-publish-runbook.md`](./devops/release-mgmt/npm-publish-runbook.md) | Operational runbook for first-publish to npm + post-publish verification              |
| [`operations/trust-portal-hosting.md`](./operations/trust-portal-hosting.md)                 | GitHub Pages hosting runbook for the trust portal                                     |
| [`testing/README.md`](./testing/README.md)                                                   | Test policy entrypoint                                                                |
| [`agile/engagement-log/dashboard.md`](./agile/engagement-log/dashboard.md)                   | Cross-jurisdiction status across all 5 active sovereign-state engagements             |
| [`agile/engagement-log/playbook.md`](./agile/engagement-log/playbook.md)                     | Generic sovereign-state engagement playbook (7-phase flow)                            |
| [`agile/cross-repo-coordination.md`](./agile/cross-repo-coordination.md)                     | Active coordination threads with other gtcx-ecosystem repos                           |
| [`quality/10-10-remediation-tracker.md`](./quality/10-10-remediation-tracker.md)             | Quality-tracker view of remediation work                                              |

## §12 Onboarding & Roles

| Document                                                                           | Purpose                |
| ---------------------------------------------------------------------------------- | ---------------------- |
| [`guides/getting-started.md`](./guides/getting-started.md)                         | Contributor quickstart |
| [`agents/overview.md`](./agents/overview.md)                                       | Agent workspace index  |
| [`agents/roles/quality-evidence-lead.md`](./agents/roles/quality-evidence-lead.md) | Example role guide     |

## §13 Product & Strategy

| Document                                                               | Purpose                                     |
| ---------------------------------------------------------------------- | ------------------------------------------- |
| [`gtm/08-target-markets.md`](./gtm/08-target-markets.md)               | Market and regulator targeting              |
| [`gtm/06-budget-readiness-plan.md`](./gtm/06-budget-readiness-plan.md) | Commercial readiness and evidence economics |

## §14 Reference

| Document                                                                                        | Purpose                                        |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`reference/api-reference.md`](./reference/api-reference.md)                                    | API documentation contract and generation path |
| `gtcx-docs/docs/governance/protocols/2-repo-setup/protocol.md` (Protocol 2 — version lifecycle) | Versioning and compatibility conventions       |
| [`stack/dependency-boundaries.md`](./stack/dependency-boundaries.md)                            | Dependency and layering guidance               |

## §15 Examples

| Document                                                                                             | Purpose                                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [`../packages/crypto/tests/property-based.test.ts`](../packages/crypto/tests/property-based.test.ts) | Example property-based verification surface |
| [`../tests/integration/full-pipeline.test.ts`](../tests/integration/full-pipeline.test.ts)           | Example end-to-end integration behavior     |

## Docs Taxonomy Rationale

The `docs/` tree is organized by consumer, not by source team. Directories are retained when they serve a distinct external audience:

| Directory     | Retained | Rationale                                                                                       |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `agile/`      | Yes      | Delivery roadmap and sprint evidence for investors and regulators                               |
| `devops/`     | Yes      | CI/CD, runbooks, and release management for operators                                           |
| `stack/`      | Yes      | Tech-stack decisions and dependency boundaries for architects                                   |
| `quality/`    | Yes      | Remediation trackers and quality gates for auditors                                             |
| `deployment/` | ~~No~~   | Collapsed into `devops/release-mgmt/` — content was publishing-oriented, not service-deployment |

**Note on file size limits:** No TypeScript or Rust source files currently exceed 500 LOC. The largest source files are intentionally kept just below the limit and should be split before crossing it.

Deprecated docs (superseded by newer versions) are retained in-place with frontmatter warnings so git history remains canonical. They are excluded from link-check and index surfaces.

## Document Lifecycle Conventions

- ADRs are immutable once accepted; supersede with a new ADR.
- Audit snapshots are date-versioned and preserved.
- Runbooks are living operational documents and should stay aligned with the current gate and release flow.
- Generated API docs are reproducible artifacts, not tracked canonical docs.

## What's NOT in `/docs`

| Path                           | Why                                               |
| ------------------------------ | ------------------------------------------------- |
| [`../CLAUDE.md`](../CLAUDE.md) | Repo entrypoint and hard rules                    |
| `artifacts/api-docs/`          | Generated Typedoc output, intentionally untracked |
| [`../tools/`](../tools/)       | Executable utilities and quality gates            |

## How to Find Something

| Question                              | Go here                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| How do I start a session safely?      | [`agents/onboarding/orientation.md`](./agents/onboarding/orientation.md)             |
| What are the required quality gates?  | [`operations/runbook.md`](./operations/runbook.md)                                   |
| What is the current security posture? | [`governance/trust-portal.md`](./governance/trust-portal.md)                         |
| Where is the package contract?        | [`specs/packages/README.md`](./specs/packages/README.md)                             |
| What changed in the latest audit?     | [`audit/master-audit-2026-05-27-fresh.md`](./audit/master-audit-2026-05-27-fresh.md) |
