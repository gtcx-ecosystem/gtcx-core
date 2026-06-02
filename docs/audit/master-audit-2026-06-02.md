---
audit_type: master
target_repo: gtcx-core
audit_date: '2026-06-02'
composite: 8.7
composite_raw: 8.73
investor: 8.9
enterprise: 8.4
sov_dfi: 8.8
p0_count: 0
p1_count: 2
p2_count: 3
caps_fired: 0
---

## Audit Metadata

- **Repo**: `gtcx-ecosystem/gtcx-core`
- **Scope**: single repo master audit (ecosystem rubric; no multi-repo rollup)
- **Audit date**: 2026-06-02
- **Auditor**: Cursor agent session (GPT-5.2)
- **Comparison baseline**: `docs/audit/master-audit-2026-05-27.md` (composite 8.9)

## Evidence Reviewed

- **Repo state**
  - `git log --oneline -20` (recent docs + release tooling changes)
  - `gh api repos/gtcx-ecosystem/gtcx-core --jq '{visibility:.visibility,private:.private,default_branch:.default_branch}'` → `{"default_branch":"main","private":true,"visibility":"private"}`
- **Verification gates (executed)**
  - `pnpm install` — pass (lockfile up to date)
  - `pnpm architecture:check` — pass (22 packages, 250 source files)
  - `pnpm typecheck` — pass
  - `pnpm lint` — pass
  - `pnpm test` — pass (`Tasks: 47 successful, 47 total`; `@gtcx/workproof` 376 tests)
  - `pnpm build` — pass (`Tasks: 23 successful, 23 total`)
- **Supply chain / provenance**
  - Release workflow guardrails in `.github/workflows/release.yml`
  - Current trust surface in `docs/governance/trust-portal.md`
- **Security**
  - Cargo audit policy: `rust/.cargo/audit.toml`
  - Dependabot open alerts (via `gh api repos/.../dependabot/alerts?state=open`)
- **GTM reality check**
  - `docs/gtm/gtm-reality-check-2026-06-02.md`
  - `docs/audit/ci-confirmation-2026-06-01.md`

## Findings

### Critical

- None.

### High

- **[P1] Supply-chain provenance publish blocked by private repo visibility** `docs/governance/trust-portal.md:50`, `.github/workflows/release.yml:223-234`  
  The repo is currently `private` (verified via GitHub API). The release workflow explicitly fails provenance publishing when visibility is not `public`. This blocks publishing `@gtcx/ai-eval@0.1.4` with Sigstore provenance and risks drift between the stated trust posture and what auditors can verify.  
  **Fix:** Make `gtcx-ecosystem/gtcx-core` public (required by npm provenance), then re-run `release.yml` with `provenance_republish=true` to publish `@gtcx/ai-eval@0.1.4` with attestations. If policy requires private, update trust surfaces to explicitly mark npm provenance as **not available** (and accept loss of attestations).

### Medium

- **[P1] Open Dependabot alert: `rustls-webpki` (high)** `rust/.cargo/audit.toml:29-41`  
  There is an open high-severity GitHub alert for `rustls-webpki` (<0.103.13). The repo currently mitigates via documented `cargo-audit` ignore entries and a threat assessment doc pointer. This is defensible engineering hygiene, but enterprise buyers will still treat “open high alert” as diligence friction until the upstream dependency is remediated.  
  **Fix:** Track upstream AWS SDK / `aws-smithy-http-client` migration to a patched `rustls-webpki`, then remove the ignore entries once the lockfile moves past the vulnerable range; keep the mitigation doc current.

- **[P2] Trust portal headline overstates current publish reality (22/22)** `docs/governance/trust-portal.md:50,99`  
  The trust portal “Bottom line” claims “npm Sigstore provenance on 22/22 public packages”, while the same document marks `@gtcx/ai-eval` as “Pending publish”. This creates spec-fidelity drift in the highest-visibility summary section.  
  **Fix:** Make the headline conditional (e.g. “21/21 core attested; ai-eval pending publish”) until `@gtcx/ai-eval@0.1.4` is actually on npm with attestations.

### Low

- **[P2] Multiple master-audit snapshots within a short window** `docs/audit/`  
  There are many `master-audit-2026-05-*.md` files including “fresh/refresh” variants. This is useful forensic trail, but increases discoverability noise for auditors.  
  **Fix:** Keep the most recent master audit as the canonical pointer from `docs/overview/README.md`; optionally move experimental variants to `docs/audit/_historical/`.

## Core Scorecard

| Dimension                         | Weight | Score | Confidence | Notes                                                                                                           |
| --------------------------------- | -----: | ----: | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Code Quality                      |     15 |   9.5 | A          | Typecheck/lint/test/build all pass; property tests and integration tests present.                               |
| Repo / Folder Hygiene             |     10 |   8.5 | B          | Strong structure; doc/audit snapshot volume + some legacy doc-gate debt remains.                                |
| Security                          |     20 |   8.5 | A          | Threat controls + secret scan exist; open `rustls-webpki` high alert mitigated but still friction.              |
| Global South Resilience           |     15 |   8.8 | B          | Offline-first primitives and resilience packages; strongest evidence remains test-level.                        |
| Ecosystem Integration             |     15 |   9.0 | A          | Downstream npm consumer pinning complete; clear package boundary discipline.                                    |
| Agentic Maturity                  |     10 |   8.8 | A          | `ai-eval` scorecard pipeline exists; trust gating documented; WARN is non-blocking but needs buyer FAQ.         |
| Enterprise / Production Readiness |     15 |   8.0 | B          | Release pipeline strong, but provenance publish depends on repo visibility + external artifacts (pen-test/SOC). |

### Core Weighted Score

- **Raw weighted score**: 8.73
- **Applied caps**: none
- **Final core score**: **8.7**

## Lens Scores

### Investor / Sequoia-Style

| Area                           | Weight | Score | Notes                                                          |
| ------------------------------ | -----: | ----: | -------------------------------------------------------------- |
| Technical Differentiation      |     25 |   8.8 | Crypto primitives + evidence volume + provenance tooling.      |
| Execution Credibility          |     25 |   9.0 | Gates pass; audit trail strong; consistent shipping.           |
| Ecosystem Leverage             |     20 |   9.0 | Downstream pinning + shared primitives; compounding value.     |
| Commercialization Readiness    |     15 |   8.0 | Library adoption is S1; sovereign pilot blockers are external. |
| Platform Compounding Potential |     15 |   9.0 | Trust portal + repeatable evidence + ecosystem integration.    |

- **Final investor lens score**: **8.9**

### Enterprise Buyer

| Area                           | Weight | Score | Notes                                                         |
| ------------------------------ | -----: | ----: | ------------------------------------------------------------- |
| Control Environment            |     25 |   8.5 | Strong controls; pen-test/SOC are external blockers.          |
| Security and Auditability      |     25 |   8.5 | Threat matrix + evidence; open alerts mitigated but visible.  |
| Integration Reliability        |     20 |   8.8 | Package boundaries enforced; downstream pinning policy clear. |
| Operability and Supportability |     15 |   8.0 | Library-only; operational posture lives downstream.           |
| Deployment Readiness           |     15 |   8.0 | CI/release strong; provenance requires public repo + OIDC.    |

- **Final enterprise buyer lens score**: **8.4**

### African Sovereign / DFI

| Area                           | Weight | Score | Notes                                                                   |
| ------------------------------ | -----: | ----: | ----------------------------------------------------------------------- |
| Mission and Regional Fit       |     15 |   9.2 | Explicit Global South framing; offline resilience posture.              |
| Global South Resilience        |     25 |   8.8 | Good primitives; live deployment evidence is downstream.                |
| Governance and Trust           |     25 |   8.5 | Trust portal strong; provenance publish must remain public.             |
| Institutional Interoperability |     15 |   8.5 | Evidence and compliance mappings exist; sandbox package is infra-owned. |
| Long-Term Strategic Value      |     20 |   9.0 | Compounding trust layer with verifiable evidence.                       |

- **Final sovereign / DFI lens score**: **8.8**

## Top Remediation Items

| Priority | Item                                                                                                       | Owner                    | Dependency                               | Target               |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------- | -------------------- |
| P1       | Keep `gtcx-core` public when publishing with provenance; publish `@gtcx/ai-eval@0.1.4` with attestations   | platform / release owner | GitHub visibility policy + `release.yml` | 1 week               |
| P1       | Resolve `rustls-webpki` high alert by upgrading transitive AWS SDK chain; remove RUSTSEC ignores when safe | crypto-security-engineer | Upstream dependency release              | 2–6 weeks (upstream) |
| P2       | Fix trust portal headline drift (22/22 claim vs pending publish)                                           | protocol-architect       | `@gtcx/ai-eval` publish completion       | 1 day                |
| P2       | Consolidate master-audit “fresh/refresh” variants under `_historical/`                                     | quality-evidence-lead    | None                                     | 1 day                |
| P2       | Add buyer-facing explanation for `ai-eval` WARN semantics (procurement FAQ)                                | eng + gtm                | None                                     | 1 week               |

## One-Point-Uplift Conditions

- **Core score +1.0**: keep provenance publish continuously operable (visibility policy + release run), close high-severity dependency alert upstream (or eliminate exposure), and close the external trust blockers (pen-test + SOC artifacts) tracked in infrastructure XC.
- **Enterprise buyer +1.0**: deliver third-party pen-test report + SOC 2 Type I (or equivalent) and demonstrate stable release provenance without policy toggles.
- **Sovereign / DFI +1.0**: complete infrastructure-run live testnet evidence package and submit first sandbox pack with regulator responses; keep provenance and evidence chain verifiable without special access.

## Final Summary

- **Core verdict**: **8.7/10** — production-capable foundation library with strong evidence, but supply-chain publish consistency is currently policy-fragile (repo visibility) and one high-severity dependency alert remains open (mitigated).
- **Investor verdict**: **8.9/10** — compounding trust layer with credible shipping; next value inflection is ecosystem pilot closure (infra XC) and `ai-eval` publish completion.
- **Enterprise verdict**: **8.4/10** — strong engineering and controls, but procurement friction remains until provenance publishing is stable and external assurance artifacts exist.
- **Sovereign / DFI verdict**: **8.8/10** — strong foundation aligned to Global South realities; the buyer-facing decision is gated by infrastructure-owned deployment + external clearance.
