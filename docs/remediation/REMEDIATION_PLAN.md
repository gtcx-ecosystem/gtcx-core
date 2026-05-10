# Remediation Plan — gtcx-core

> **Status:** Draft for approval
> **Date:** 2026-05-10
> **Owner:** Protocol Architect + Quality & Evidence Lead

This plan is Phase 1 only. It is intentionally limited to planning. No execution work beyond creating this file is authorized until approval is given.

## Scope and source set

This plan was prepared after reading the repo identity, safety rules, core spec, architecture overview, release/gate runbooks, and the current audit corpus:

- `CLAUDE.md`
- `docs/agents/onboarding/orientation.md`
- `docs/agents/workflows/safety-rules.md`
- `docs/agents/roles/quality-evidence-lead.md`
- `docs/specs/core-spec.md`
- `docs/architecture/overview.md`
- `docs/devops/runbooks/quality-runbook.md`
- `docs/devops/release-mgmt/release-checklist.md`
- `docs/audit/*.md`
- `docs/security/native-binding-audit-checklist.md`
- `docs/agile/sprints/gtcx-core-definition-of-done.md`
- `docs/agile/roadmap/10-10-readiness-sprint-roadmap.md`
- `docs/agents/workflows/tasks/audit-remediation.md`

Two important normalization rules apply:

1. When two audits disagree, this plan uses the lower or more operationally consequential score.
2. Where no repo-local audit artifact exists for a requested dimension, this plan records that as an audit-coverage gap instead of inventing a score.

## A. Executive Summary

`gtcx-core` is a strong cryptographic foundation repo, but it is not at 10/10 yet by bank-grade or ecosystem-grade standards. The remaining gaps are concentrated in five areas: institutional key custody, verified source history, external validation, low-connectivity contract proof, and cross-repo contract enforcement.

### Current scorecard to 10/10 target

| Dimension               |               Current |                  Target | Primary source                                                                             | Planning take                                                                                                 |
| ----------------------- | --------------------: | ----------------------: | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Security + compliance   |                8.9/10 |                   10/10 | `docs/audit/master-audit-2026-05-10.md`                                                    | Strong internal posture; cloud KMS, signed history, and external validation still open                        |
| Code quality            |                9.2/10 |                   10/10 | `docs/audit/master-audit-2026-05-10.md`                                                    | High quality baseline; maintainability hotspots remain                                                        |
| Architecture            |                9.0/10 |                   10/10 | `docs/audit/full-audit-2026-05-09.md` + `docs/audit/master-audit-2026-05-10.md`            | Structure is strong; contract clarity and large-file debt remain                                              |
| Tests                   |                9.0/10 |                   10/10 | `docs/audit/auto-dev-state.md`                                                             | Coverage and fuzz posture are strong; HSM and cross-repo contract proof are incomplete                        |
| CI/CD                   |                9.0/10 |                   10/10 | `docs/audit/auto-dev-state.md`                                                             | Gates are strong; org-level Actions reliability and secret setup are incomplete                               |
| Production readiness    |                8.8/10 |                   10/10 | `docs/audit/master-audit-2026-05-10.md`                                                    | Library-grade release posture is strong; external buyer proof is incomplete                                   |
| Ops                     |                9.0/10 |                   10/10 | `docs/audit/auto-dev-state.md`                                                             | Runbooks are strong; downstream consumer operability contracts need tightening                                |
| Docs                    |                9.1/10 |                   10/10 | `docs/audit/docs-standard-compliance-2026-05-10.md`                                        | Canonicalized, but still carries justified drift and prose density issues                                     |
| DX                      |               10.0/10 |                   10/10 | `docs/audit/auto-dev-state.md`                                                             | Strong today; must be preserved through enforcement, not assumed                                              |
| GTM                     |              S3 -> S4 | 10/10 evidence-complete | `docs/audit/full-audit-2026-05-09.md` + `docs/audit/master-audit-2026-05-10.md`            | Strong packet, weak external proof                                                                            |
| AI / agentic maturity   |       9.1/10 inferred |                   10/10 | `docs/audit/master-audit-2026-05-10.md` + `docs/audit/gtcx-ecosystem-rating-2026-05-08.md` | Strong governance pattern, but no repo-local SIGNAL scorecard                                                 |
| Global South resilience |                9.0/10 |                   10/10 | `docs/audit/master-audit-2026-05-10.md` + `docs/audit/gtcx-ecosystem-rating-2026-05-08.md` | Offline-first intent is real; persistence and degraded-mode proof lag intent                                  |
| Ecosystem integration   |                6.5/10 |                   10/10 | `docs/audit/gtcx-ecosystem-rating-2026-05-08.md`                                           | This is the largest numerical gap                                                                             |
| UX + design             |             Audit gap |       Explicitly scoped | `CLAUDE.md` + `docs/specs/core-spec.md`                                                    | No product UI exists in this repo; equivalent surface is API ergonomics and downstream integration experience |
| Innovation gaps         | Not separately scored |                   10/10 | `docs/audit/full-audit-2026-05-09.md` phase 6.2                                            | Moat patterns exist, but they are not yet codified as reusable contracts                                      |

### Top 5 risks if we ship as-is

1. Bank-grade buyers still cannot use cloud-managed key custody because `CloudKmsKeyStore` is design-only.
2. Supply-chain trust remains one control short of bank-grade because signed-commit Source Level 2 is documented but not enforced.
3. Ecosystem drift can still accumulate because canonical `@gtcx/*` contracts are not enforced across the 17-repo map with publish-and-consume validation.
4. Offline-first claims are stronger than the evidence for persistence, degraded-mode behavior, and low-bandwidth adaptation.
5. External credibility still depends on self-attestation because there is no external pen test, no SOC 2 letter, and no first external case study.

### Estimated sprint count

Minimum internal program size: **10 sprints**, matching the dimension order below.

Realistic path to full 10/10 evidence: **10 internal sprints plus externally gated validation work**.

The final score cannot honestly reach 10/10 until three external conditions are satisfied:

- external penetration test complete,
- external trust artifact complete or explicitly waived by a real buyer,
- downstream consumer validation against published artifacts complete.

## B. Findings Register

Only unresolved, partially closed, or audit-coverage-gap findings are listed here. Findings explicitly marked closed in source audits are treated as already remediated and are enforced going forward through the regression-prevention protocol in Section H.

| ID      | Source audit                                                        | Dimension                  | Severity | Finding                                                                                                             | Root cause                                                                                              | Remediation                                                                                   | Owner                               | Sprint | Acceptance criteria                                                                                | Evidence required                                                                                    |
| ------- | ------------------------------------------------------------------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------- | ------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| SEC-001 | `master-audit-2026-05-10`                                           | Security                   | P1       | `CloudKmsKeyStore` is design-only                                                                                   | Rust toolchain and algorithm support not yet aligned to cloud KMS backend needs                         | Approve toolchain bump, extend algorithm surface, implement and test `CloudKmsKeyStore`       | Cryptographic Security Engineer     | 1      | Feature-flagged backend builds and integration tests pass                                          | `rust/gtcx-crypto/*`, `docs/security/cloud-kms-keystore.md`, green cargo tests                       |
| ~~SEC-002~~ | `master-audit-2026-05-10`                                       | Security / Supply chain    | P1       | ~~Source Level 2 signed history is documented but not enforced~~ **CLOSED 2026-05-10**                              | Branch protection and contributor signing workflow remain incomplete                                    | Enforce required signatures, document contributor setup, prove rejection of unsigned commits  | Repo maintainer + user              | 1      | Unsigned commits are rejected on protected branch                                                  | `docs/security/slsa-attestation.md`, branch protection config, failed unsigned push proof            |
| SEC-003 | `master-audit-2026-05-10`                                           | Security / Compliance      | P1       | No external penetration test                                                                                        | Internal evidence is strong but still self-generated                                                    | Scope and commission external pen test, route findings to remediation                         | Repo lead                           | 1      | Vendor engaged or report complete; findings triaged                                                | `docs/security/pen-test-scope.md`, signed report, remediation tracker                                |
| SEC-004 | `governance/trust-portal.md` + `master-audit-2026-05-10`            | Compliance                 | P1       | No SOC 2 Type 1 attestation letter                                                                                  | Readiness exists but external attestation has not begun                                                 | Close readiness gaps, engage CPA, track evidence handoff                                      | Repo lead                           | 1      | CPA engagement active or formal buyer waiver recorded                                              | `docs/compliance/soc2-readiness.md`, engagement artifact, trust portal update                        |
| SEC-005 | `auto-dev-state.md`                                                 | Security / Ops             | P1       | Org-level secrets and tokens for AI CODEOWNER and publish path are incomplete                                       | Operational secret management not fully provisioned                                                     | Set org-level `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM`, `NPM_TOKEN` | User / ecosystem admin              | 1      | `pnpm ops:check` reports zero secret-related warnings                                              | `docs/operations/repo-bootstrap.md`, `pnpm ops:check` output                                         |
| SEC-006 | `auto-dev-state.md`                                                 | CI/CD / Ops                | P1       | GitHub Actions reliability is blocked by org-level runner or billing instability                                    | CI correctness depends on external Actions availability                                                 | Resolve org-level Actions issue and revalidate required workflows                             | User / ecosystem admin              | 1      | Next push runs normal-length workflows and required checks finish                                  | GitHub Actions run evidence, `artifacts/ci-history.json`                                             |
| SEC-007 | `native-binding-audit-checklist.md`                                 | Security / Tests           | P2       | Native binding random-input fuzzing is recommended but not enforced as a recurring job                              | Audit checklist exists without a dedicated recurring validation gate for NAPI boundary abuse            | Add nightly or scheduled fuzz/property job for `gtcx-node` entrypoints                        | Cryptographic Security Engineer     | 1      | Scheduled job exists and produces repeatable evidence                                              | `.github/workflows/*`, fuzz logs, checklist update                                                   |
| ARC-001 | `master-audit-2026-05-10`                                           | Architecture               | P1       | `packages/verification/src/types/schemas.ts` remains a 605 LOC maintainability hotspot                              | Co-located schemas were kept as a permanent exception without decomposition                             | Split by domain or formally re-justify with generated-code or co-location evidence            | Protocol Architect                  | 2      | File falls under repo threshold or exception is explicitly ratified and gated                      | file split diff or ADR / governance rule                                                             |
| ARC-002 | `full-audit-2026-05-09`                                             | Architecture               | P2       | `runtime` is a deliberate aggregator but its boundary semantics are under-documented                                | ADR-014 allowed composition but enforcement/docs remain lighter than the risk surface                   | Encode runtime-layer contract in specs and boundary checks                                    | Protocol Architect                  | 2      | Runtime package contract is explicit and architecture gate protects it                             | `docs/specs/packages/runtime.md`, `tools/check-package-boundaries.mjs`                               |
| ARC-003 | `docs-standard-compliance-2026-05-10`                               | Docs / Architecture        | P2       | Legacy top-level docs taxonomy remains alongside canonical entrypoints                                              | Path churn risk caused partial rather than full taxonomy normalization                                  | Rationalize retained dirs and document any permanent exceptions                               | Protocol Architect                  | 2      | Docs tree exception list is explicit, justified, and stable                                        | `docs/README.md`, compliance audit update, link-check pass                                           |
| ARC-004 | `docs-standard-compliance-2026-05-10`                               | Docs / DX                  | P2       | Historical docs remain prose-heavy instead of conclusion-first and table-first                                      | Cleanup prioritized correctness and frontmatter before style normalization                              | Rewrite high-traffic docs in agentic style                                                    | Quality & Evidence Lead             | 2      | Priority docs follow table-first and scoped conclusion-first format                                | doc diffs, docs-standard re-audit                                                                    |
| TST-001 | `auto-dev-state.md` + `remediation-10-10.md`                        | Tests                      | P2       | HSM integration proof in CI is incomplete until SoftHSMv2 is active                                                 | Feature exists but CI does not yet exercise the real keystore lifecycle path                            | Add SoftHSMv2-backed integration tests to CI                                                  | Cryptographic Security Engineer     | 3      | PKCS#11 lifecycle test passes in CI                                                                | `.github/workflows/ci.yml`, Rust integration test evidence                                           |
| TST-002 | `gtcx-ecosystem-rating-2026-05-08`                                  | Tests / Ecosystem          | P1       | No cross-repo contract tests against published artifacts                                                            | Repos validate locally, not as a release consumer would                                                 | Add publish-and-consume validation across downstream repos                                    | Quality & Evidence Lead             | 3      | At least one downstream consumer validates published artifacts per release candidate               | `docs/release/downstream-validation-report-template.md`, completed validation report                 |
| TST-003 | `full-audit-2026-05-09` + `remediation-10-10.md`                    | CI/CD / Supply chain       | P2       | Reproducible-build proof is partial for packages with `workspace:*` dependencies                                    | `pnpm pack` ordering behavior is nondeterministic for workspace deps                                    | Add canonicalization or alternative packaging proof path and document the exception           | Quality & Evidence Lead             | 3      | Reproducibility check is deterministic for representative packages or exception is machine-checked | `tools/check-reproducible-build.mjs`, build evidence                                                 |
| OPS-001 | `master-audit-2026-05-10` + `monitoring-setup.md`                   | Production readiness / Ops | P2       | Repo has no explicit consumer-facing SLI/SLO contract despite performance and sync claims                           | Library posture treats service monitoring as N/A, but downstream buyers still need measurable contracts | Define library-grade SLOs and verification artifacts for critical package behaviors           | Quality & Evidence Lead             | 4      | SLO table exists with measurement method and release evidence linkage                              | `docs/devops/monitoring/monitoring-setup.md`, benchmarks, release checklist                          |
| OPS-002 | `gtcx-ecosystem-rating-2026-05-08`                                  | Production readiness       | P2       | No health or operability reference contract for downstream runtime wrappers                                         | Core is a library, but downstream adopters still need standard startup, failure, and telemetry patterns | Publish downstream operability contract and reference instrumentation pack                    | Frontier Infrastructure Engineer    | 4      | Downstream production checklist and support policy cover startup, fallback, and telemetry          | `docs/release/downstream-production-readiness-checklist.md`, `docs/release/supportability-policy.md` |
| SIG-001 | `master-audit-2026-05-10` + `gtcx-ecosystem-rating-2026-05-08`      | AI / Agentic               | P1       | No repo-local SIGNAL scorecard exists; current maturity is inferred                                                 | Agentic maturity is described, not formally scored in repo                                              | Produce a repo-local SIGNAL assessment and add it to the audit set                            | Quality & Evidence Lead             | 5      | SIGNAL scorecard exists with reproducible rubric and artifact links                                | `docs/signal/` or equivalent audit artifact                                                          |
| SIG-002 | `gtcx-ecosystem-rating-2026-05-08`                                  | AI / Ecosystem             | P1       | Provenance types are mirrored across repos instead of imported canonically                                          | Ecosystem packages are not yet consumed from one canonical source                                       | Replace local mirrors with canonical package imports or generated contracts                   | Protocol Architect                  | 5      | Downstream repos consume canonical provenance contracts without local copies                       | cross-repo import diff, contract tests                                                               |
| SIG-003 | `gtcx-ecosystem-rating-2026-05-08`                                  | AI / Forensics             | P2       | No provenance replay tooling or guaranteed review-hook delivery                                                     | Provenance is captured at decision time but weak for post-hoc investigation                             | Add replay tooling and durable review-notification semantics                                  | Quality & Evidence Lead             | 5      | Review events are durable and provenance chains can be replayed                                    | tool output, runbook, durable sink config                                                            |
| SIG-004 | `full-audit-2026-05-09` + `auto-dev-state.md`                       | AI / Governance            | P2       | AI CODEOWNER is strong in design but still incomplete as audited operational evidence                               | Secrets, signed history, and real PR evidence are not yet complete end-to-end                           | Complete secrets, run on real PRs, attach evidence to trust portal                            | Repo maintainer                     | 5      | 30+ real PR reviews recorded with provider and playbook metadata                                   | `.github/workflows/ai-codeowner-review.yml`, trust portal, review logs                               |
| RES-001 | `gtcx-ecosystem-rating-2026-05-08`                                  | Global South resilience    | P1       | Persistent offline queue storage is not implemented in core                                                         | Interface exists without durable implementations                                                        | Add Node/React Native persistence adapters or narrow the contract explicitly                  | Frontier Infrastructure Engineer    | 6      | Offline queue survives restart in supported adapters                                               | implementation, restart-recovery tests, docs                                                         |
| RES-002 | `gtcx-ecosystem-rating-2026-05-08`                                  | Global South resilience    | P1       | Connectivity profiles are not wired to adaptive batching, retry jitter, or degraded-mode decisions                  | Profiles are modeled but under-used operationally                                                       | Use profiles to drive payload sizing, retry jitter, and sync strategy                         | Frontier Infrastructure Engineer    | 6      | Sync behavior changes measurably across profile tiers                                              | `@gtcx/sync` tests, benchmark/report, spec update                                                    |
| RES-003 | `gtcx-ecosystem-rating-2026-05-08`                                  | Global South resilience    | P2       | USSD, compression, no-camera, and no-GPS behavior are described at ecosystem level but not proven in core contracts | Ecosystem intent outpaced foundation-level contract tests                                               | Publish explicit boundary: what core guarantees, what downstream surfaces must implement      | Protocol Architect                  | 6      | Resilience support matrix is explicit and test-backed where core owns the contract                 | support-tier matrix, constrained-environment tests                                                   |
| UX-001  | Audit coverage gap                                                  | UX / Design                | P1       | No repo-local UX audit exists because this repo has no product UI                                                   | Repo is a primitives library, so direct UI audit was never authored                                     | Replace UI-centric UX work with API ergonomics, integration friction, and docs-consumer audit | Protocol Architect                  | 7      | Consumer ergonomics audit exists and no direct-UI work is invented in core                         | `docs/remediation/` follow-up audit, onboarding timing evidence                                      |
| UX-002  | `docs-standard-compliance-2026-05-10` + `downstream-integration.md` | UX / DX                    | P2       | Consumer experience is documented but not measured end-to-end                                                       | Install, configure, and adopt paths are described, not timed or tested                                  | Run clone -> install -> integrate -> verify path under time budget                            | Quality & Evidence Lead             | 7      | New engineer can integrate critical packages in under 30 minutes                                   | timed runbook evidence, downstream validation report                                                 |
| ECO-001 | `gtcx-ecosystem-rating-2026-05-08`                                  | Ecosystem integration      | P1       | No canonical publish-and-consume workflow exists across the ecosystem                                               | Shared packages are conceptually canonical but operationally mirrored                                   | Publish core artifacts and validate downstream consumption from registry artifacts            | Repo maintainer + downstream owners | 8      | Downstream repos consume published `@gtcx/*` artifacts in validation lanes                         | release evidence, downstream validation report                                                       |
| ECO-002 | `gtcx-ecosystem-rating-2026-05-08`                                  | Ecosystem integration      | P1       | Duplicate `@gtcx/*` package names across repos create namespace drift risk                                          | Polyrepo growth outran shared-package consolidation                                                     | Define canonical owners and eliminate or rename mirrors                                       | Ecosystem architect                 | 8      | Each shared contract has one canonical owner and one import path                                   | ecosystem contract map, CI drift check                                                               |
| ECO-003 | `gtcx-ecosystem-rating-2026-05-08` + `../README.md`                 | Ecosystem integration      | P1       | 17-repo dependency map is documented but not enforced                                                               | Dependency direction is conceptual, not machine-checked across repos                                    | Add ecosystem map plus drift gates for shared contracts, auth, telemetry, and design tokens   | Ecosystem architect                 | 8      | Contract drift gate fails on mismatch across participating repos                                   | ecosystem map, CI templates, contract tests                                                          |
| INN-001 | `full-audit-2026-05-09` phase 6.2                                   | Innovation gaps            | P2       | AI-native governance and inheritable-FIPS patterns exist but are not reusable ecosystem products                    | Valuable patterns remain repo-local documentation instead of shared infrastructure                      | Extract reusable template, policy, and test kits after first buyer proof                      | Protocol Architect                  | 9      | Reusable template or package exists and is adopted by at least one other repo                      | template repo/package, adoption evidence                                                             |
| INN-002 | `gtcx-ecosystem-architecture.md` + `full-audit-2026-05-09`          | Innovation gaps            | P2       | `gtcx-core` is foundational but does not yet expose a formal “bank-grade adoption pack” as a productized contract   | Evidence exists in many docs, but the buying surface is fragmented                                      | Consolidate trust, release, resilience, and integration evidence into one adoption pack       | Quality & Evidence Lead             | 9      | External reviewer can evaluate the repo without source-diving                                      | release artifact pack, trust portal, downstream checklist                                            |
| DOC-001 | `master-audit-2026-05-10`                                           | Docs / GTM                 | P1       | No external case study or real regulator response yet exists                                                        | GTM material is strong, but still mostly self-authored                                                  | Capture first response, first validation, and first case study                                | Repo lead                           | 10     | First external response and case-study skeleton are committed                                      | `docs/gtm/responses/*`, case study doc                                                               |
| DOC-002 | `10-10-readiness-sprint-roadmap.md` + `downstream-integration.md`   | DX / GTM                   | P1       | “Clone -> run -> deploy under 30 minutes” is a goal, not a proven artifact                                          | Onboarding quality is documented but not timed and evidenced                                            | Run and record clean-room onboarding and downstream adoption drills                           | Quality & Evidence Lead             | 10     | Timed onboarding evidence exists and passes target budget                                          | recorded run log, docs updates, acceptance note                                                      |

## C. Sprint Plan

### Sprint 1 — Security + Compliance

**Goal:** close the bank-grade trust blockers that make the repo operationally strong but institutionally incomplete.

**Exit criteria**

- `CloudKmsKeyStore` implementation path is real, tested, and gated.
- Source Level 2 enforcement path is either live or blocked only by explicit human approval.
- External pen-test and attestation work are formally initiated or formally waived by a real buyer with recorded rationale.
- `pnpm ops:check` is green on secret and org configuration prerequisites.

**Tasks**

- Close `SEC-001`, `SEC-002`, `SEC-003`, `SEC-004`, `SEC-005`, `SEC-006`, `SEC-007`.
- Add missing compliance evidence links in trust and release documents.
- Re-run full security and release gate sequence after each meaningful change.

**Risks**

- Rust toolchain change can broaden blast radius.
- Signed-commit enforcement can disrupt current contributor workflows.
- External engagements are budget and procurement gated.

**Rollback plan**

- Keep new custody backends feature-flagged.
- Land signed-commit documentation before enforcement.
- If vendor engagements stall, record them as explicit external blockers rather than silently carrying “planned” status.

### Sprint 2 — Code Quality + Architecture

**Goal:** remove maintainability debt and architectural ambiguity without opportunistic refactoring.

**Exit criteria**

- Oversized files are split or formally exceptioned with evidence.
- Runtime aggregation rules are explicit and enforced.
- Docs taxonomy exceptions are explicit and stable.
- High-traffic docs follow conclusion-first, table-first conventions.

**Tasks**

- Close `ARC-001`, `ARC-002`, `ARC-003`, `ARC-004`.
- Re-run `pnpm architecture:check`, `pnpm api:check`, and docs-standard acceptance after changes.

**Risks**

- File splits can create API or import churn.
- Docs taxonomy changes can break existing references.

**Rollback plan**

- Preserve public export surfaces.
- Use `git mv` for path changes.
- Revert any taxonomy move that increases downstream churn more than it reduces ambiguity.

### Sprint 3 — Tests + CI/CD

**Goal:** turn strong internal testing into strong release-consumer proof.

**Exit criteria**

- HSM lifecycle tests run in CI.
- Reproducible-build evidence is deterministic or exceptioned by machine-check.
- At least one downstream consumer validates published artifacts.

**Tasks**

- Close `TST-001`, `TST-002`, `TST-003`.
- Add release-candidate validation lane that exercises published artifacts rather than workspace-local source.

**Risks**

- SoftHSM and cross-repo validation can expose environmental brittleness.
- Deterministic pack verification may be constrained by upstream tool behavior.

**Rollback plan**

- Keep new validation lanes additive until they are stable.
- If upstream nondeterminism cannot be eliminated, fail on untracked drift and explicitly track the upstream exception.

### Sprint 4 — Production Readiness + Ops

**Goal:** define and prove the operational contract expected by downstream adopters.

**Exit criteria**

- Consumer-facing SLO/SLI table exists and is measured.
- Downstream operability contract exists for startup, fallback, telemetry, and release adoption.
- Release evidence pack references those metrics.

**Tasks**

- Close `OPS-001`, `OPS-002`.
- Tie benchmarks, release artifacts, and downstream readiness docs together.

**Risks**

- Library repos can overfit service-style operational patterns.
- Downstream teams may expect guarantees core cannot honestly own.

**Rollback plan**

- Keep all new ops guarantees library-scoped and testable.
- Mark downstream-only behaviors as downstream obligations, not repo promises.

### Sprint 5 — AI / Agentic Maturity

**Goal:** move from strong agentic posture to formally scored, replayable, cross-repo-governed maturity.

**Exit criteria**

- Repo-local SIGNAL scorecard exists.
- Provenance contracts are canonical across repos.
- Review events are durable and replayable.
- AI CODEOWNER has production evidence, not just design evidence.

**Tasks**

- Close `SIG-001`, `SIG-002`, `SIG-003`, `SIG-004`.
- Align outputs with `AI_NATIVE_PATTERNS.md`: intelligence in defaults and gates, not as a bolt-on interface.

**Risks**

- Cross-repo provenance consolidation can trigger breaking changes.
- Stronger durability requirements can add integration overhead.

**Rollback plan**

- Add compatibility shims for contract moves.
- Make replay tooling additive before enforcing it.

### Sprint 6 — Global South Resilience

**Goal:** make low-connectivity and constrained-environment claims provable at the foundation-contract level.

**Exit criteria**

- Persistent offline queue support is either implemented or explicitly narrowed in contract.
- Connectivity tiers affect real behavior.
- Support matrix is explicit for no-internet, no-GPS, no-camera, and low-bandwidth cases.

**Tasks**

- Close `RES-001`, `RES-002`, `RES-003`.
- Add constrained-environment tests and support-tier docs.

**Risks**

- Foundation-level persistence abstractions can blur runtime adapter ownership.
- Over-promising hardware or field-surface behaviors in core would be a category error.

**Rollback plan**

- If implementation is not viable cross-runtime, narrow the contract and move runtime-specific work to downstream repos.

### Sprint 7 — UX + Design

**Goal:** improve the repo’s real UX surface without inventing product UI work that does not belong here.

**Exit criteria**

- Consumer ergonomics audit exists.
- Clone -> integrate -> verify path is timed and repeatable.
- Docs and package entrypoints minimize integration friction.

**Tasks**

- Close `UX-001`, `UX-002`.
- Treat “UX” in this repo as API ergonomics, onboarding clarity, and evidence-pack readability.

**Risks**

- Teams may try to smuggle product-UI scope into a primitives repo.
- Time-budget targets can be skewed by local machine assumptions.

**Rollback plan**

- Reject any UI-surface work not justified by current audits.
- Keep ergonomics evidence environment-scoped and reproducible.

### Sprint 8 — Ecosystem Integration

**Goal:** move from documented dependency direction to enforced cross-repo contract integrity.

**Exit criteria**

- Published artifact consumption is real.
- Shared contracts have one canonical owner.
- Drift gates exist for critical ecosystem contracts.

**Tasks**

- Close `ECO-001`, `ECO-002`, `ECO-003`.
- Wire shared contracts for types, auth expectations, telemetry semantics, and test vectors.

**Risks**

- Cross-repo coordination can stall on ownership ambiguity.
- Publish workflow changes can surface latent versioning issues.

**Rollback plan**

- Start with validation lanes and contract maps before destructive consolidation.
- Treat name collisions as migration programs, not same-day rewrites.

### Sprint 9 — Innovation Gaps

**Goal:** convert existing moat patterns from “good internal practice” into reusable, defensible ecosystem assets.

**Exit criteria**

- AI-native governance pattern is extractable.
- Bank-grade adoption pack is cohesive.
- At least one other repo can consume the reusable pattern.

**Tasks**

- Close `INN-001`, `INN-002`.
- Package the strongest patterns: inheritable FIPS posture, AI review governance, downstream trust pack.

**Risks**

- Premature productization can freeze patterns that still need one more proving cycle.
- Reusable template extraction can consume time without near-term score lift if done too early.

**Rollback plan**

- Do not extract until the pattern has at least one real external or downstream proving loop.

### Sprint 10 — Docs + DX + GTM

**Goal:** turn strong internal evidence into externally legible proof and close onboarding credibility gaps.

**Exit criteria**

- First external response is logged.
- First case-study skeleton exists.
- Clone -> run -> deploy evidence exists.
- All open remediation findings map cleanly to “closed”, “externally blocked”, or “out of repo scope”.

**Tasks**

- Close `DOC-001`, `DOC-002`.
- Refresh trust portal, release evidence pack, and master index with current proof.

**Risks**

- External timing is not fully under repo control.
- GTM artifact quality can regress into marketing without evidence.

**Rollback plan**

- Keep every GTM claim tethered to a verifiable file, gate, or external artifact.

## D. Bank-Grade Compliance Checklist

| Control area                    | Current state                | Evidence                                                                                                            | Gap to 10/10                                                                                   | Sprint |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| Encryption at rest              | Partial                      | `docs/security/key-ceremony.md`, `docs/security/security-framework.md`                                              | Cloud-managed custody path is not shipped                                                      | 1      |
| Encryption in transit           | Strong                       | `docs/security/threat-model.md`, `docs/security/internal-security-assessment.md`                                    | External validation still absent                                                               | 1      |
| Key rotation and revocation     | Strong but partly design-led | `docs/security/key-ceremony.md`, `docs/security/pkcs11-keystore.md`                                                 | Cloud KMS and signed-history alignment remain open                                             | 1      |
| KMS / HSM evidence              | Partial                      | `docs/security/pkcs11-keystore.md`, `docs/security/cloud-kms-keystore.md`, `rust/gtcx-crypto/src/keystore.rs`       | Cloud KMS backend and CI proof missing                                                         | 1      |
| Audit logging immutability      | Strong                       | `docs/decisions/006-hash-chain-audit-trail.md`, `docs/governance/trust-portal.md`                                   | External reviewer proof and retention evidence need consolidation                              | 1, 4   |
| Tamper evidence                 | Strong                       | `artifacts/provenance-manifest.json`, `docs/security/slsa-attestation.md`                                           | Source Level 2 not enforced                                                                    | 1      |
| Retention policy                | Partial                      | `docs/compliance/sox-controls.md`, `docs/governance/trust-portal.md`                                                | Needs explicit linkage for downstream adopters                                                 | 4      |
| Data residency and PII handling | Partial                      | `docs/compliance/compliance-requirements.md`, `docs/compliance/pci-dss-scope.md`, `docs/compliance/sox-controls.md` | Library-vs-platform boundary is documented, but buyer-facing evidence pack is still fragmented | 1, 4   |
| Redaction and secrets hygiene   | Strong                       | `docs/governance/trust-portal.md`, `docs/operations/repo-bootstrap.md`, `docs/agents/workflows/safety-rules.md`     | Org secret provisioning incomplete                                                             | 1      |
| Supply chain provenance         | Strong                       | `artifacts/provenance-manifest.json`, `docs/security/slsa-attestation.md`, `.github/workflows/release.yml`          | Signed history and deterministic workspace packaging need closure                              | 1, 3   |
| SBOM and dependency integrity   | Partial                      | `.github/workflows/ci.yml`, `docs/compliance/compliance-requirements.md`, `tools/check-crypto-deps.mjs`             | Evidence artifact needs repeatable downstream validation path                                  | 3, 8   |
| License and dependency scan     | Strong                       | `docs/release/licenses/license-compliance.md`, `.github/workflows/ci.yml`                                           | External buyer packaging still fragmented                                                      | 10     |
| Separation of duties            | Partial                      | `.github/CODEOWNERS`, `.github/workflows/ai-codeowner-review.yml`, `docs/agents/workflows/safety-rules.md`          | Signed commits and durable dual-review evidence remain open                                    | 1, 5   |
| Deploy vs author control        | Partial                      | `docs/devops/release-mgmt/release-checklist.md`, `docs/release/ga-release/ga-release-checklist.md`                  | Need published-artifact consumption and external approval evidence                             | 3, 4   |

## E. Global South Resilience Checklist

This repo has no end-user UI. Its resilience obligation is therefore contract-level: package behaviors, adapters, tests, and downstream guidance.

| Item                                         | Current state                                | Evidence                                                                                          | Gap to 10/10                                                                      | Sprint |
| -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------ |
| Offline-first behavior                       | Strong intent, partial proof                 | `docs/specs/core-spec.md`, `docs/specs/packages/sync.md`, `docs/gtm/07-downstream-integration.md` | No durable queue adapter proof in core                                            | 6      |
| Low-bandwidth behavior                       | Partial                                      | `docs/specs/packages/sync.md`                                                                     | Connectivity tiers are not yet tied to adaptive batching and retry jitter         | 6      |
| Intermittent connectivity restart recovery   | Partial                                      | `docs/agile/roadmap/10-10-readiness-sprint-roadmap.md`                                            | Need constrained-environment CI path and restart tests                            | 6      |
| Low-end device support                       | Partial, downstream-owned                    | `docs/agile/roadmap/10-10-readiness-sprint-roadmap.md`                                            | Need explicit boundary for what core guarantees vs what mobile/platform repos own | 6      |
| Graceful degradation with no internet        | Partial                                      | `docs/specs/core-spec.md`, `docs/specs/packages/sync.md`                                          | Need measurable degraded-mode contract                                            | 6      |
| Graceful degradation with no GPS / no camera | Ecosystem intent only                        | `../gtcx-mobile/_delete/_sop-agile/3-agile/gtcx-ecosystem-architecture.md`                        | Need explicit support matrix; core should not claim what it does not test         | 6      |
| Compression / payload discipline             | Weak                                         | `docs/audit/gtcx-ecosystem-rating-2026-05-08.md`                                                  | No compression or payload adaptation evidence at foundation level                 | 6      |
| i18n / language surface                      | Downstream-owned, foundation impact indirect | `docs/specs/core-spec.md`                                                                         | Need contract note for locale-safe schemas and error-surface expectations         | 7      |
| Power / battery awareness                    | Downstream-owned, unscored here              | ecosystem architecture docs                                                                       | Need explicit ownership boundary, not faux coverage                               | 6, 7   |

## F. AI / Agentic Maturity Ladder

No repo-local SIGNAL artifact exists today. The ladder below is inferred from audited evidence and should be replaced by a formal SIGNAL scorecard in Sprint 5.

| Pillar                                   | Current level | Evidence                                                            | Next-level move                                                                 | Target level |
| ---------------------------------------- | ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| Governance and approval                  | L3            | CODEOWNERS, AI review workflow, safety rules, risk-tier docs        | Require signed history and durable review evidence                              | L4           |
| Provenance and decision evidence         | L3            | provenance types, trust portal, release provenance, review metadata | Eliminate local mirrors and add replay tooling                                  | L4           |
| Ambient intelligence in engineering flow | L3            | default redaction, traced ops, review playbooks                     | Promote defaults and confidence signals into all consequential automation paths | L4           |
| Cross-repo contract awareness            | L2            | conceptual ecosystem map, downstream checklists                     | Add machine-checked cross-repo drift gates                                      | L4           |
| Forensics and replay                     | L2            | trust-bearing docs and event references                             | Add deterministic provenance replay + durable sinks                             | L4           |

### Where intelligence should feel like gravity

- Secret redaction should happen by default, not by opt-in.
- Provenance capture should happen during release and review, not after an incident.
- Risk-tier gate selection should happen from metadata, not operator memory.
- Cross-repo drift detection should happen in CI, not during quarterly audits.

### Where intelligence should not exist

- No AI sidebar, no “run AI” button, no chat-first cryptographic review surface.
- No raw AI approval of consequential changes.
- No marketing-grade “AI-powered” language in trust-bearing repo artifacts.

## G. Ecosystem Integration Map

Canonical inventory source for the current 17-repo map: `../README.md` and `../gtcx-mobile/_delete/_sop-agile/3-agile/gtcx-ecosystem-architecture.md`.

`gtcx-core` depends on **no other ecosystem repo**. It is the lowest-level shared foundation. It is depended on directly or conceptually by the 16 repos below.

| Repo                  | Layer        | Relation to `gtcx-core`                                         | Shared contract surface                                | Current drift risk |
| --------------------- | ------------ | --------------------------------------------------------------- | ------------------------------------------------------ | ------------------ |
| `baseline-os`         | Foundation   | Adjacent foundation; should not own core contracts              | agent runtime assumptions, governance patterns         | Medium             |
| `ledger-ui`           | Foundation   | Adjacent; consumes design-facing trust docs, not code contracts | design/token expectations in adoption packs            | Medium             |
| `gtcx-infrastructure` | Foundation   | Operability and release substrate for core                      | CI/CD, provenance, release evidence                    | Low                |
| `gtcx-protocols`      | Protocols    | Direct consumer                                                 | types, crypto, verification, test vectors              | High               |
| `gtcx-mobile`         | Protocols    | Direct consumer via mobile/offline paths                        | identity, sync, signing, offline contracts             | High               |
| `gtcx-hardware`       | Protocols    | Conceptual consumer                                             | crypto, attestation, custody proofs                    | Medium             |
| `exploration-os`      | Economic     | Conceptual / indirect consumer                                  | schemas, identity, provenance data shapes              | Medium             |
| `terra-os`            | Economic     | Conceptual / indirect consumer                                  | identity, sync, verification, event contracts          | Medium             |
| `griot-ai`            | Intelligence | Indirect consumer                                               | provenance, telemetry semantics                        | Medium             |
| `nyota-ai`            | Intelligence | Indirect consumer                                               | notification payloads, trust metadata                  | Medium             |
| `gtcx-intelligence`   | Intelligence | Direct consumer                                                 | provenance types, auth, policy contracts               | High               |
| `compliance-os`       | Intelligence | Direct or indirect consumer                                     | evidence schemas, compliance contracts, provenance     | High               |
| `sensei-ai`           | Intelligence | Indirect consumer                                               | document/provenance schemas                            | Medium             |
| `terminal-os`         | Markets      | Indirect consumer via protocols/intelligence                    | telemetry, evidence, contract readability              | Medium             |
| `gtcx-markets`        | Markets      | Indirect consumer via protocols/core packages                   | identity, verification, custody, settlement primitives | High               |
| `veritas`             | Markets      | Direct/indirect trust consumer                                  | verification, attestation, provenance                  | High               |

### Shared contracts that must not drift

- `@gtcx/types` and provenance types
- cryptographic primitives and test vectors
- verification bundle formats and QR contracts
- auth and signing semantics
- telemetry and trace semantics
- release evidence and downstream validation artifacts

### How drift is prevented at 10/10

- One canonical owner per shared contract.
- Published-artifact consumption tests in downstream repos.
- CI drift gates for shared contracts and telemetry semantics.
- Explicit ecosystem map with contract ownership and blast radius.

## H. Evidence & Verification Protocol

Every “done” claim in this program must resolve to a command, artifact, or external deliverable.

| Dimension               | Metric                                                               | How measured                        | Regression-prevention gate                                                              | Required artifact                                          |
| ----------------------- | -------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Security + compliance   | Open P1 security findings = 0                                        | audit tracker + gate review         | `pnpm security:secret-scan`, `pnpm security:threat-matrix`, release checklist           | trust portal, pen-test status, attestation status          |
| Code quality            | lint/type/API drift = 0                                              | CI gates                            | `pnpm lint`, `pnpm typecheck`, `pnpm api:check`                                         | API report, gate results                                   |
| Architecture            | boundary violations = 0; hotspot exceptions explicit                 | boundary gate + architecture review | `pnpm architecture:check`                                                               | trust-contract matrix, package specs, ADRs where needed    |
| Tests                   | flaky critical tests = 0; coverage and integration evidence complete | CI + scheduled jobs                 | `pnpm test`, `pnpm test:coverage:critical`, Rust fuzz/job lanes                         | coverage report, HSM integration evidence                  |
| CI/CD                   | required workflows complete and reliable                             | GitHub Actions history              | branch protection required checks                                                       | successful workflow runs, `artifacts/ci-history.json`      |
| Production readiness    | release evidence pack complete                                       | release checklist                   | `pnpm provenance:generate`, `pnpm release:ga:evidence:check`, `pnpm perf:check-budgets` | provenance manifest, perf report, release evidence summary |
| Ops                     | downstream operability contract complete                             | checklist + timed drill             | release and downstream readiness checks                                                 | supportability policy, downstream checklist                |
| Docs                    | docs-standard score = 10/10 or justified exceptions only             | docs audit                          | `pnpm docs`, `pnpm docs:check-links`                                                    | docs-standard audit update                                 |
| DX                      | clone -> run -> integrate budget met                                 | clean-room drill                    | onboarding verification lane                                                            | timed onboarding log                                       |
| GTM                     | external proof artifacts present                                     | artifact review                     | none purely internal; must be attached to trust docs                                    | regulator response, case study, buyer artifact             |
| AI / SIGNAL             | repo-local scorecard present and improving                           | SIGNAL audit                        | AI CODEOWNER + governance checks                                                        | SIGNAL artifact, review evidence                           |
| Global South resilience | constrained-environment scenarios pass                               | test matrix + benchmarks            | resilience test lanes                                                                   | support matrix, scenario results                           |
| Ecosystem integration   | published-artifact contract tests pass downstream                    | cross-repo validation               | release candidate validation lanes                                                      | completed downstream validation report                     |
| Innovation              | reusable pattern adopted beyond this repo                            | adoption evidence                   | none; measured by reuse and proof                                                       | template/package adoption evidence                         |

### CI gates required to enforce 10/10 going forward

- `pnpm architecture:check`
- `pnpm quality:governance:check`
- `pnpm security:secret-scan`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage:critical`
- `pnpm build`
- `pnpm api:check`
- `pnpm quality:kpi:collect`
- `pnpm quality:kpi:export`
- `pnpm provenance:generate`
- `pnpm release:ga:evidence:check`
- `pnpm docs`
- `pnpm docs:check-links`
- `pnpm security:threat-matrix`
- `pnpm perf:update-history`
- `pnpm perf:check-budgets`
- Rust fmt / clippy / test / fuzz sequence from `docs/devops/runbooks/quality-runbook.md`
- New: downstream published-artifact validation lane
- New: repo-local SIGNAL scorecard refresh
- New: constrained-environment resilience lane

## Approval gate

If this plan is approved, execution begins with Sprint 1 only. No later sprint should begin until the prior sprint’s exit criteria have evidence attached.
