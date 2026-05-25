---
title: 'Engagement Readiness Sprint Roadmap'
status: 'current'
date: '2026-05-25'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'agile', 'roadmap', 'engagement', 'africa']
review_cycle: 'on-change'
---

# Engagement Readiness Sprint Roadmap

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect
> **Driver:** Imminent sovereign-state engagements (Zimbabwe, Ghana, Namibia, Botswana, DRC)
> **Window:** 4 sprints (2026-05-22 → 2026-06-19) to "ready to deploy with sovereign-state trust"

## Why this roadmap exists

GTCX has imminent engagements with five African states — Zimbabwe, Ghana, Namibia, Botswana, DRC — who want production-ready tools, not demos or pilots. They expect technology that can be trusted to perform at the highest level for commodity export and mining-compliance workloads. This roadmap closes the gap between internal readiness (composite 9.5/10 per [`docs/audit/internal-completion-audit-2026-05-21.md`](../../audit/internal-completion-audit-2026-05-21.md)) and customer-visible readiness, which is currently understated by an outdated README, an unpublished package set, and a trust portal that does not reference current evidence.

## Supporting evidence

- [Internal Completion Audit 2026-05-21](../../audit/internal-completion-audit-2026-05-21.md) — composite 9.5/10, 24/24 internal items complete
- [Fuzz Campaign Evidence 2026-05-21](../../audit/fuzz-campaign-evidence-2026-05-21.md) — 500K+ iterations, zero crashes
- [10/10 Roadmap 2026-05-19](../../audit/10-10-roadmap-2026-05-19.md) — updated to reflect M2+ trajectory
- [Master Roadmap](../../roadmap.md) — cross-program canonical roadmap
- [Trust Portal](../../governance/trust-portal.md) — regulator-facing evidence index

---

## Phase 1 — Issue Extraction

| #   | Issue                                                                                                                                                                                               | Source                 | Severity | Category    | Blocked By |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- | ----------- | ---------- |
| 1   | No `@gtcx/*` packages published to npm — downstream consumers (gtcx-protocols, gtcx-intelligence, gtcx-platforms, gtcx-app) cannot `pnpm install` released versions                                 | Readiness ledger       | Critical | Reliability | —          |
| 2   | README "Current State" and Package Readiness Matrix understate reality: claims 8.63/10 and 13 packages as "Functional / pending validation" — truth is 9.5/10 and 19/19 ≥95% branch coverage        | Readiness ledger       | Critical | Docs        | —          |
| 3   | Trust portal (`docs/governance/trust-portal.md`) does not reference the 2026-05-21 audit, fuzz evidence, or current package readiness — it is the regulator-facing surface                          | Readiness ledger       | Critical | Compliance  | —          |
| 4   | Release pipeline (`.github/workflows/release.yml`) has never executed end-to-end against npm — no v0.1.0 tag, no on-registry provenance proof, only theoretical readiness                           | Implicit from #1       | Critical | Reliability | 1          |
| 5   | Pre-existing uncommitted `package.json` edits: turbo `^2.3.0` → `^2.9.14`, `brace-expansion >=5.0.6` security override, plus `pnpm-lock.yaml` companion                                             | `git status` (session) | High     | Tech Debt   | —          |
| 6   | `TURBO_TOKEN` missing at org and repo scope — CI runs with cold cache, slows every PR and incident response                                                                                         | `pnpm ops:check`       | Medium   | DX          | —          |
| 7   | `TURBO_TEAM` missing at org scope — paired with `TURBO_TOKEN`                                                                                                                                       | `pnpm ops:check`       | Medium   | DX          | 6          |
| 8   | `OPENAI_API_KEY` missing at org — AI codeowner has no fallback if Anthropic outage; bus-factor risk during a live engagement                                                                        | `pnpm ops:check`       | Medium   | Reliability | —          |
| 9   | `@gtcx/crypto-native` odd-length-hex NAPI boundary bug (called out in README blockers) — the exact edge case a regulator's lab will find                                                            | README blockers        | High     | Reliability | —          |
| 10  | External penetration test not scheduled — $8–25K, 4–6 weeks external engagement                                                                                                                     | README blockers        | High     | Security    | —          |
| 11  | SOC 2 Type 1 attestation not scheduled — $15–45K, 8–10 weeks external engagement                                                                                                                    | README blockers        | High     | Compliance  | —          |
| 12  | `ark-*` Rust ecosystem dependencies (`derivative`, `paste`) carry unmaintained crates; tracked via `rust/.cargo/audit.toml` ignore list — upstream unresolved                                       | README blockers        | Medium   | Security    | —          |
| 13  | Zimbabwe sandbox regulator email staged but not sent — first customer engagement trigger                                                                                                            | README blockers        | High     | Compliance  | 1, 2, 3    |
| 14  | Per-jurisdiction config (`@gtcx/jurisdiction-config`) not exercised end-to-end against the 5 target states — schemas exist but no validated configs for Zimbabwe / Ghana / Namibia / Botswana / DRC | Engagement context     | High     | Compliance  | —          |
| 15  | Trust portal exists only as a markdown file in the repo — no regulator-friendly external URL, no versioning, no signed snapshots                                                                    | Engagement context     | Medium   | Compliance  | 3          |

**Severity distribution:** 4 Critical · 6 High · 5 Medium · 0 Low

---

## Phase 2 — Dependency Ordering

```
#5  blocks → #4               (clean working tree before any release pipeline run)
#1  blocks → #4, #13          (no published packages = no release proof, nothing for Zimbabwe to consume)
#2  blocks → #13              (regulator clones repo, sees outdated README)
#3  blocks → #13, #15         (regulator audits trust portal first)
#6  blocks → #7               (TURBO_TEAM needs TURBO_TOKEN)

Independent (any sprint):     #8, #9, #10, #11, #12, #14
```

**Critical path:** `#5 → #1 → #4 → #3 → #2 → #13`

---

## Phase 3 — Sprint Plan

### Sprint 1 — Front-door truth (week of 2026-05-22)

**Goal:** Anyone — regulator, downstream team, prospective customer — who clones `gtcx-core` sees accurate, current state. Working tree is clean. External secrets are set.

#### Tasks

| #   | Issue        | Files to Change                                                                         | Effort | Acceptance Criteria                                                                                                                                                                                               |
| --- | ------------ | --------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | #5           | `package.json`, `pnpm-lock.yaml`                                                        | XS     | `git diff package.json` shows no unstaged changes; `pnpm install --frozen-lockfile` succeeds; `pnpm test` green                                                                                                   |
| 1.2 | #2           | `README.md` (sections: "Current State", "Package Readiness Matrix", coverage gate text) | S      | README shows composite 9.5/10, 19/19 packages ≥95% branch; "Functional / pending validation" rows reflect 2026-05-21 audit (graduate the 13 packages or annotate explicitly); `pnpm docs:check-frontmatter` clean |
| 1.3 | #6, #7       | none (gh CLI)                                                                           | XS     | `gh secret list --org gtcx-ecosystem` includes `TURBO_TOKEN`; `gh variable list --org gtcx-ecosystem` includes `TURBO_TEAM`; `pnpm ops:check` shows both PASS                                                     |
| 1.4 | #8           | none (gh CLI)                                                                           | XS     | `gh secret list --org gtcx-ecosystem` includes `OPENAI_API_KEY`; `pnpm ops:check` shows 0 warn                                                                                                                    |
| 1.5 | #3 (partial) | `docs/governance/trust-portal.md`                                                       | S      | Trust portal links the new 2026-05-21 audit + fuzz evidence + 9.5/10 composite; every evidence row cites a file path that exists on `main`                                                                        |

#### Commit Plan

1. `chore(deps): bump turbo to ^2.9.14 and add brace-expansion override` — #1.1
2. `docs(readme): align current state and readiness matrix to 9.5/10 audit` — #1.2
3. `docs(governance): refresh trust portal with 2026-05-21 audit and fuzz evidence` — #1.5

#### Definition of Done

```bash
git status --short                                        # empty
pnpm ops:check                                            # 11 pass / 0 fail / 0 warn
pnpm docs:check-frontmatter                               # clean
pnpm docs:check-links                                     # clean
grep -E "8\.63|Functional, pending validation" README.md  # no matches
```

---

### Sprint 2 — Release pipeline proven (week of 2026-05-29)

**Goal:** The release pipeline has executed end-to-end against npm with provenance. All 21 `@gtcx/*` packages are installable by name. The `crypto-native` edge case that would embarrass us under a regulator lab is fixed.

#### Tasks

| #   | Issue           | Files to Change                                                                                                                               | Effort | Acceptance Criteria                                                                                                                                                                                                |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | #9              | `packages/crypto-native/src/index.ts` (NAPI boundary hex handler), `packages/crypto-native/tests/coverage-gaps.test.ts` (new regression test) | M      | Property-based test proves odd-length hex inputs at every NAPI entry point either normalize or throw a typed error — never panic or silently corrupt; `pnpm --filter @gtcx/crypto-native test` green               |
| 2.2 | #1 (foundation) | `.changeset/*.md` (changeset entries), `release.yml` (dry-run validation)                                                                     | M      | `pnpm changeset` creates patch entries for `@gtcx/types`, `@gtcx/crypto`, `@gtcx/schemas`, `@gtcx/utils`; `pnpm release --dry-run` succeeds with provenance manifest generated                                     |
| 2.3 | #4              | none (GitHub Actions)                                                                                                                         | M      | `workflow_dispatch` on `release.yml` runs to completion; 4 foundation packages appear on npm with `npm view @gtcx/<pkg>` returning version + provenance attestation; `artifacts/provenance-manifest.json` uploaded |
| 2.4 | #1 (remaining)  | `.changeset/*.md`                                                                                                                             | M      | Remaining 17 `@gtcx/*` packages published; `npm view @gtcx/<pkg>` returns version for all 21                                                                                                                       |
| 2.5 | #3 (completion) | `docs/governance/trust-portal.md`                                                                                                             | XS     | Trust portal includes "Published versions" section with `npm view`-resolvable URLs for all 21 packages                                                                                                             |

#### Commit Plan

1. `fix(crypto-native): handle odd-length hex at NAPI boundary` — #2.1
2. `chore(changeset): initial v0.1.0 release for foundation packages` — #2.2
3. _(automated)_ `chore: version packages` — from changesets action
4. _(automated)_ `chore: release v0.1.0` — tag + npm publish
5. `chore(changeset): v0.1.0 release for remaining packages` — #2.4
6. `docs(governance): link published npm versions in trust portal` — #2.5

#### Definition of Done

```bash
for pkg in types crypto crypto-native schemas utils domain security verification identity \
           api-client connectivity logging network sync resilience telemetry runtime \
           events workproof services ai; do
  npm view "@gtcx/$pkg" version || echo "MISSING: $pkg"
done
# all 21 return a version, no MISSING lines

gh run list --workflow=release.yml --limit 1 --json conclusion -q '.[0].conclusion'
# "success"
```

---

### Sprint 3 — Jurisdiction readiness (week of 2026-06-05)

**Goal:** Each of the 5 target states has a validated jurisdiction config exercised end-to-end through the foundation packages. Zimbabwe email is sent. Trust portal lives at an external regulator-friendly endpoint.

#### Tasks

| #   | Issue | Files to Change                                                                                                                        | Effort | Acceptance Criteria                                                                                                                                                                                                                  |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | #14   | `packages/config/jurisdiction/configs/{ZW,GH,NA,BW,CD}.json` (or equivalent), `tests/integration/jurisdictions.test.ts` (new)          | L      | Integration test loads each of 5 configs, exercises end-to-end signing + verification + WorkProof through the runtime substrate, and asserts no schema failures; `pnpm --filter @gtcx/integration-tests test -- jurisdictions` green |
| 3.2 | #15   | `docs/governance/trust-portal.md` (canonical URL header), hosting setup (out-of-repo: GitHub Pages or Vercel static deploy of `docs/`) | M      | Trust portal accessible at a stable URL (e.g., `trust.gtcx.io` or `gtcx-ecosystem.github.io/gtcx-core`); URL recorded in README; markdown links resolve from the external URL                                                        |
| 3.3 | #13   | External (Zimbabwe email) + `docs/agile/engagement-log/2026-zimbabwe-sandbox.md` (new)                                                 | S      | Zimbabwe sandbox email sent; engagement log entry created with date, contact, follow-up date; trust portal URL + npm package list included in send                                                                                   |

#### Commit Plan

1. `feat(jurisdiction-config): validated configs for ZW, GH, NA, BW, CD` — #3.1
2. `test(integration): cross-jurisdiction end-to-end verification` — #3.1
3. `docs(governance): publish trust portal at external URL` — #3.2
4. `docs(engagement): log zimbabwe sandbox engagement kickoff` — #3.3

#### Definition of Done

```bash
pnpm --filter @gtcx/integration-tests test -- jurisdictions
# 5 jurisdictions pass

curl -s https://<trust-portal-url> | grep -q "9.5/10"
# 0 (matches)

ls docs/agile/engagement-log/2026-zimbabwe-sandbox.md
# exists, includes sent-date
```

---

### Sprint 4 — Long-lead external compliance kickoff (week of 2026-06-12, work runs 4–10 more weeks)

**Goal:** External pen test and SOC 2 Type 1 are contracted and in motion. ark-* upstream situation is tracked with escalation path. Deliverable is *engagement signed, vendor selected, scope agreed\* — full completion is post-roadmap.

#### Tasks

| #   | Issue | Files to Change                                                                                | Effort | Acceptance Criteria                                                                                                               |
| --- | ----- | ---------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | #10   | `docs/security/pen-test-rfp-2026.md` (new), `docs/security/pen-test-engagement-log.md` (new)   | M      | RFP issued to ≥2 vendors; vendor selected; SoW signed; kickoff date scheduled; engagement log entry created                       |
| 4.2 | #11   | `docs/compliance/soc2-readiness-prep.md` (new), `docs/compliance/soc2-engagement-log.md` (new) | M      | Auditor selected; engagement contract signed; control matrix gap analysis underway; kickoff date scheduled                        |
| 4.3 | #12   | `rust/.cargo/audit.toml`, `docs/security/ark-upstream-tracking.md` (new)                       | S      | Tracking doc lists each ignored advisory with upstream PR/issue link + escalation owner + reassessment date; doc reviewed monthly |

#### Commit Plan

1. `docs(security): pen test RFP and engagement log` — #4.1
2. `docs(compliance): SOC 2 Type 1 readiness prep and engagement log` — #4.2
3. `docs(security): ark-* upstream advisory tracking` — #4.3

#### Definition of Done

```bash
ls docs/security/pen-test-engagement-log.md \
   docs/compliance/soc2-engagement-log.md \
   docs/security/ark-upstream-tracking.md
# all three exist

grep -E "SoW signed|contract signed" docs/security/pen-test-engagement-log.md \
                                     docs/compliance/soc2-engagement-log.md
# both match
```

---

## Phase 4 — Summary

### Issue Disposition

| Severity | Total | Sprint 1         | Sprint 2   | Sprint 3     | Sprint 4     | Deferred |
| -------- | ----- | ---------------- | ---------- | ------------ | ------------ | -------- |
| Critical | 4     | 3 (#2, #3, #5\*) | 2 (#1, #4) | 0            | 0            | 0        |
| High     | 6     | 0                | 1 (#9)     | 2 (#13, #14) | 2 (#10, #11) | 0        |
| Medium   | 5     | 3 (#6, #7, #8)   | 0          | 1 (#15)      | 1 (#12)      | 0        |
| Low      | 0     | —                | —          | —            | —            | —        |

\*#5 is tech-debt category but lands in Sprint 1 as it blocks #4.

### Deferred Items

None. Every raised issue has a home. Items that need long-lead external work (#10 pen test, #11 SOC 2) are _kicked off_ in Sprint 4 — completion is post-roadmap and runs in parallel for 4–10 weeks. They are not deferred from the plan; they are deferred from full-completion-by-sprint-end, which is structurally impossible for external vendor engagements.

### Risk Register

| Sprint | Risk                                                                 | Mitigation / Fallback                                                                                                             |
| ------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1      | README edit conflicts with concurrent agent work                     | Branch + PR; coordinate via `docs/agents/sessions/` handoff                                                                       |
| 1      | `OPENAI_API_KEY` requires org admin access                           | Verify access before sprint start; escalate to org owner if blocked                                                               |
| 2      | `pnpm release` fails due to missing changeset state                  | Run `pnpm release --dry-run` in Sprint 1 to catch early                                                                           |
| 2      | crypto-native NAPI fix uncovers deeper boundary bugs                 | Time-box fix to 2 days; if larger, scope to "throw clear error" not "fix root cause"; document remaining work for Sprint 5+       |
| 3      | Jurisdiction configs missing data (e.g., DRC has no GeoTag baseline) | Identify earliest in Sprint 2; pull jurisdiction owner into Sprint 3 planning                                                     |
| 3      | External trust portal hosting requires DNS + cert provisioning       | Use github.io fallback if custom domain not ready                                                                                 |
| 3      | Zimbabwe email contacts have changed                                 | Confirm contact in Sprint 2 via `docs/agile/engagement-log/`                                                                      |
| 4      | Pen test vendors quote longer than 6 weeks                           | Negotiate phased delivery; partial findings before final report                                                                   |
| 4      | SOC 2 readiness gap analysis reveals 3+ months of remediation        | Document and re-roadmap; do not block engagements on full SOC 2 — Type 1 attestation can be in-progress when first customer lands |

### Execution Order

**Sprint 1 first.** Three Critical-severity items (#2 README accuracy, #3 trust portal, #5 clean working tree) cost a single day of focused work and immediately raise the public-facing readiness from "stale and misleading" to "matches the internal 9.5/10." Without this, every downstream step is undermined because customers see a worse repo than what exists.

**Sprint 2 unlocks customer adoption.** Until packages are on npm with provenance, "ready to deploy" is a claim, not a fact. The crypto-native NAPI fix lands here because the first regulator lab to test odd-length hex inputs is the one to find that bug — better us than them.

**Sprint 3 makes "ready to deploy" specific to the 5 target states.** A jurisdiction config that has never been exercised through the runtime is not ready. Zimbabwe email goes last in Sprint 3 because it must reference the published packages and external trust portal — that is the credible "we're ready" signal.

**Sprint 4 starts the long-lead external compliance work** that will complete _during_ the engagement window. Pen test and SOC 2 are evidence customers want eventually; engagement contracts signed during this sprint mean we can credibly say "third-party attestation in progress, scheduled completion <date>" rather than "we haven't started."

**Total time to first credible customer engagement: 3 weeks.** External attestation completion: 4–10 weeks after Sprint 4 kickoff.

---

## Phase 5 — Status (as of 2026-05-25)

Per-task completion against the plan above. Updated on every meaningful state change.

### Sprint 1 — Front-door truth

| #   | Task                                              | Status          | Evidence                                                           |
| --- | ------------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| 1.1 | Clean working tree (turbo bump + brace-expansion) | ✅ Done         | git history                                                        |
| 1.2 | README alignment to 9.5/10 + 19/19 packages       | ✅ Done         | `README.md` reflects composite 9.5/10                              |
| 1.3 | `TURBO_TOKEN` + `TURBO_TEAM` at org               | ✅ Done         | `pnpm ops:check` shows pass                                        |
| 1.4 | `OPENAI_API_KEY` at org                           | ⏸️ User-blocked | Awaiting org admin (mint + add as org secret)                      |
| 1.6 | Master audit refresh (8.8 → 8.9/10)               | ✅ Done         | `docs/audit/master-audit-2026-05-25.md` delta refresh              |
| 1.7 | GTM pack refresh + new docs                       | ✅ Done         | 6 updated + 3 new (ADR-012 brief, SLSA guide, readiness checklist) |
| 1.5 | Trust portal refresh (2026-05-21 audit + fuzz)    | ✅ Done         | `docs/governance/trust-portal.md` updated                          |

### Sprint 2 — Release pipeline proven

| #   | Task                                      | Status            | Evidence                                                                                                                                                    |
| --- | ----------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | crypto-native odd-length-hex NAPI fix     | ✅ Done           | `packages/crypto-native/src/index.ts` — `assertHex` / `isHex` wrappers; 19 hex-validation tests                                                             |
| 2.2 | Changesets for foundation packages        | ✅ Done           | 6 changeset entries staged (connectivity, crypto, crypto-native, security, sync, workproof); linked group covers types/identity/verification/domain/schemas |
| 2.3 | First `release.yml` end-to-end publish    | ⏸️ Ready to fire  | NPM_TOKEN confirmed, provenance ready, workflow green. **Window: Wed 2026-05-28 → Fri 2026-05-30**                                                          |
| 2.4 | Remaining 17 packages published           | ⏸️ Blocked on 2.3 | Cascades from 2.3                                                                                                                                           |
| 2.5 | Trust portal "Published versions" section | ⏸️ Blocked on 2.3 | Will reflect `npm view` resolvable URLs                                                                                                                     |

### Sprint 3 — Jurisdiction readiness

| #   | Task                                       | Status                  | Evidence                                                                                                                                                                                       |
| --- | ------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | 5 jurisdiction fixtures + integration test | ✅ Done                 | `tests/integration/fixtures/jurisdiction-fixtures.ts` + `tests/integration/jurisdictions.test.ts` (21 tests, ZW/GH/NA/BW/CD)                                                                   |
| 3.2 | Trust portal at external regulator URL     | ⏸️ User-blocked         | Awaiting repo admin to enable GitHub Pages — see [hosting runbook](../../operations/trust-portal-hosting.md)                                                                                   |
| 3.3 | Zimbabwe sandbox email sent                | ⏸️ Blocked on 2.3 + 3.2 | Send-ready render staged at [`docs/gtm/renders/zimbabwe-2026.md`](../../gtm/renders/zimbabwe-2026.md). Also pre-staged Ghana/Namibia/Botswana/DRC (FR) renders for parallel send post-Zimbabwe |

### Sprint 4 — External compliance kickoff

| #   | Task                                       | Status     | Evidence                                                                                                                                                                        |
| --- | ------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Pen test RFP drafted + vendor longlist     | ✅ Drafted | [`docs/security/pen-test-rfp-2026.md`](../../security/pen-test-rfp-2026.md) + [engagement log](../../security/pen-test-engagement-log.md). **User-blocked:** vendor outreach    |
| 4.2 | SOC 2 Type 1 readiness prep + CPA criteria | ✅ Drafted | [`docs/compliance/soc2-readiness-prep.md`](../../compliance/soc2-readiness-prep.md) + [engagement log](../../compliance/soc2-engagement-log.md). **User-blocked:** CPA outreach |
| 4.3 | ark-\* upstream advisory tracker           | ✅ Done    | [`docs/security/ark-upstream-tracking.md`](../../security/ark-upstream-tracking.md)                                                                                             |

### New work completed today (2026-05-25)

| Work                                  | Repo           | Commit               | Impact                                                |
| ------------------------------------- | -------------- | -------------------- | ----------------------------------------------------- |
| ADR-012 Stage 0 — 9 entity predicates | gtcx-core      | `27184d0`            | 47 predicates, migration helper, property tests       |
| rustls-webpki CI unblock              | gtcx-core      | `aefba49`            | cargo audit passes with documented exceptions         |
| Version packages (7 changesets)       | gtcx-core      | `1ccd05a`            | workproof 1.0.0, verification 3.1.0, +8 others        |
| Migration-bridge + property tests     | gtcx-core      | `e3eab1a`, `2a10eaf` | 10 + 14 test assertions                               |
| Master audit delta refresh            | gtcx-core      | `93368b9`            | 8.8 → 8.9/10                                          |
| GTM pack refresh + new docs           | gtcx-core      | `2fdfd9c`            | 6 updated + 3 new docs                                |
| ADR-012 Stage 1 — predicate bridge    | gtcx-protocols | `2d765f9`            | 14 tests, resolves legacy IDs to canonical predicates |
| Ext-1 continental extension spec      | gtcx-core      | `8374ba9`            | Drafted, awaiting collision resolution                |

### Aggregate status

| State                | Count | Notes                                                                                                             |
| -------------------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| ✅ Done (or drafted) | 18    | All Sprint 1 except 1.4; 2.1, 2.2; 3.1; 4.1, 4.2, 4.3; ADR-012 Stage 0+1; audit refresh; GTM refresh; Ext-1 draft |
| ⏸️ User-blocked      | 4     | 1.4 (OPENAI_API_KEY), 3.2 (Pages), 4.1 vendor outreach, 4.2 CPA outreach                                          |
| ⏸️ Ready to fire     | 1     | 2.3 (publish) — workflow green, NPM_TOKEN present, window Wed–Fri                                                 |
| ⏸️ Cascade-blocked   | 3     | 2.4, 2.5, 3.3 — all unblock from 2.3 + 3.2                                                                        |
| 🔄 Awaiting decision | 1     | Ext-1 continental extension — collision resolution needed by Tue for 1.0.0 inclusion                              |

### Critical path right now

```
[Tue 05-27]    [Wed–Fri]          [admin]       [gtm-lead]
     ↓              ↓                 ↓              ↓
[Ext-1 merge?] → [fire release.yml] → [enable Pages] → [send Zimbabwe email]
     ↑                              ↑
  (optional)                   (mobile-engineering-lead)
```

**Five active decision points:**

1. **Publish** — Fire `gh workflow run release.yml` Wed–Fri (mobile-engineering-lead)
2. **Pen-test vendor** — Begin outreach from 5-vendor longlist (crypto-security-engineer)
3. **SOC 2 CPA** — Begin outreach from 4-firm shortlist (quality-evidence-lead)
4. **GitHub Pages** — Enable for trust portal hosting (repo admin)
5. **Ext-1 merge** — Resolve 3 predicate collisions by Tue if inclusion in 1.0.0 desired (protocol-architect + proposer)

Everything else either parallels this path or unblocks from it.
