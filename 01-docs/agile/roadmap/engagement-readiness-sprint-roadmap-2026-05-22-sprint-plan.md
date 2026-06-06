---
title: 'Engagement Readiness — Sprint Plan Detail'
status: 'current'
date: '2026-05-22'
owner: 'gtcx-core'
role: 'protocol-architect'
tier: 'standard'
tags: ['agile', 'roadmap', 'engagement']
review_cycle: 'on-change'
---

# Engagement Readiness — Sprint Plan Detail

> Parent: [Engagement Readiness Sprint Roadmap](./engagement-readiness-sprint-roadmap-2026-05-22.md)

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
| 1.5 | #3 (partial) | `01-docs/governance/trust-portal.md`                                                    | S      | Trust portal links the new 2026-05-21 audit + fuzz evidence + 9.5/10 composite; every evidence row cites a file path that exists on `main`                                                                        |

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

| #   | Issue           | Files to Change                                                                                                                                                       | Effort | Acceptance Criteria                                                                                                                                                                                                |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | #9              | `03-platform/packages/crypto-native/src/index.ts` (NAPI boundary hex handler), `03-platform/packages/crypto-native/tests/coverage-gaps.test.ts` (new regression test) | M      | Property-based test proves odd-length hex inputs at every NAPI entry point either normalize or throw a typed error — never panic or silently corrupt; `pnpm --filter @gtcx/crypto-native test` green               |
| 2.2 | #1 (foundation) | `.changeset/*.md` (changeset entries), `release.yml` (dry-run validation)                                                                                             | M      | `pnpm changeset` creates patch entries for `@gtcx/types`, `@gtcx/crypto`, `@gtcx/schemas`, `@gtcx/utils`; `pnpm release --dry-run` succeeds with provenance manifest generated                                     |
| 2.3 | #4              | none (GitHub Actions)                                                                                                                                                 | M      | `workflow_dispatch` on `release.yml` runs to completion; 4 foundation packages appear on npm with `npm view @gtcx/<pkg>` returning version + provenance attestation; `artifacts/provenance-manifest.json` uploaded |
| 2.4 | #1 (remaining)  | `.changeset/*.md`                                                                                                                                                     | M      | Remaining 17 `@gtcx/*` packages published; `npm view @gtcx/<pkg>` returns version for all 21                                                                                                                       |
| 2.5 | #3 (completion) | `01-docs/governance/trust-portal.md`                                                                                                                                  | XS     | Trust portal includes "Published versions" section with `npm view`-resolvable URLs for all 21 packages                                                                                                             |

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

| #   | Issue | Files to Change                                                                                                                              | Effort | Acceptance Criteria                                                                                                                                                                                                                  |
| --- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 3.1 | #14   | `03-platform/packages/config/jurisdiction/configs/{ZW,GH,NA,BW,CD}.json` (or equivalent), `tests/integration/jurisdictions.test.ts` (new)    | L      | Integration test loads each of 5 configs, exercises end-to-end signing + verification + WorkProof through the runtime substrate, and asserts no schema failures; `pnpm --filter @gtcx/integration-tests test -- jurisdictions` green |
| 3.2 | #15   | `01-docs/governance/trust-portal.md` (canonical URL header), hosting setup (out-of-repo: GitHub Pages or Vercel static deploy of `01-docs/`) | M      | Trust portal accessible at GitBook (`gtcx-protocol.gitbook.io/gtcx-open-source`); URL recorded in README; markdown links resolve from the external URL                                                                               |
| 3.3 | #13   | External (Zimbabwe email) + `01-docs/05-audit/agile/engagement-log/2026-zimbabwe-sandbox.md` (new)                                           | S      | Zimbabwe sandbox email sent; engagement log entry created with date, contact, follow-up date; trust portal URL + npm package list included in send                                                                                   |

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

ls 01-docs/05-audit/agile/engagement-log/2026-zimbabwe-sandbox.md
# exists, includes sent-date
```

---

### Sprint 4 — Long-lead external compliance kickoff (week of 2026-06-12, work runs 4–10 more weeks)

**Goal:** External pen test and SOC 2 Type 1 are contracted and in motion. ark-* upstream situation is tracked with escalation path. Deliverable is *engagement signed, vendor selected, scope agreed\* — full completion is post-roadmap.

#### Tasks

| #   | Issue | Files to Change                                                                                            | Effort | Acceptance Criteria                                                                                                               |
| --- | ----- | ---------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | #10   | `01-docs/09-security/pen-test-rfp-2026.md` (new), `01-docs/09-security/pen-test-engagement-log.md` (new)   | M      | RFP issued to ≥2 vendors; vendor selected; SoW signed; kickoff date scheduled; engagement log entry created                       |
| 4.2 | #11   | `01-docs/10-compliance/soc2-readiness-prep.md` (new), `01-docs/10-compliance/soc2-engagement-log.md` (new) | M      | Auditor selected; engagement contract signed; control matrix gap analysis underway; kickoff date scheduled                        |
| 4.3 | #12   | `rust/.cargo/audit.toml`, `01-docs/09-security/ark-upstream-tracking.md` (new)                             | S      | Tracking doc lists each ignored advisory with upstream PR/issue link + escalation owner + reassessment date; doc reviewed monthly |

#### Commit Plan

1. `docs(security): pen test RFP and engagement log` — #4.1
2. `docs(compliance): SOC 2 Type 1 readiness prep and engagement log` — #4.2
3. `docs(security): ark-* upstream advisory tracking` — #4.3

#### Definition of Done

```bash
ls 01-docs/09-security/pen-test-engagement-log.md \
   01-docs/10-compliance/soc2-engagement-log.md \
   01-docs/09-security/ark-upstream-tracking.md
# all three exist

grep -E "SoW signed|contract signed" 01-docs/09-security/pen-test-engagement-log.md \
                                     01-docs/10-compliance/soc2-engagement-log.md
# both match
```

---
