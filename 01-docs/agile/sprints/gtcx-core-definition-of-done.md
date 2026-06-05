---
title: 'Definition of Done — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agile']
review_cycle: 'on-change'
---

---

title: 'Gtcx Core Definition Of Done'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agile']
review_cycle: 'on-change'

---

# Definition of Done — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Quality criteria that must be satisfied before any work item in `gtcx-core` is considered complete.

---

## User Story DoD

### Development

- [ ] Feature implemented per acceptance criteria
- [ ] Code committed using conventional commit format
- [ ] Code reviewed by at least one peer; all comments addressed
- [ ] No TODO comments or debug code left in

### CI Gates

- [ ] `pnpm architecture:check` — zero violations
- [ ] `pnpm lint` — zero errors
- [ ] `pnpm typecheck` — zero type errors
- [ ] `pnpm test` — all tests pass
- [ ] `pnpm build` — all packages build cleanly
- [ ] `pnpm api:check` — API surface reviewed (no unintentional changes)
- [ ] Package risk tier checked in `quality/package-risk-tiers.json`; tier-specific gates satisfied

### Documentation

- [ ] Affected package spec in `01-docs/specs/packages/` updated if behavior changed
- [ ] ADR written if an architectural decision was made (status: `Proposed`)
- [ ] UAT scenario documented if applicable
- [ ] Trust-bearing behavior changes reflected in `01-docs/architecture/trust-contract-matrix.md` when applicable

---

## Sprint DoD

- [ ] All committed stories meet User Story DoD
- [ ] Sprint goal achieved (or partially achieved with documented rationale)
- [ ] Quality gates green: `pnpm architecture:check`, `pnpm api:check`, `pnpm perf:check-budgets`
- [ ] UAT evidence logged in `01-docs/05-audit/agile/testing/uat-evidence-log.md`
- [ ] Sprint retrospective completed and action items assigned

---

## Release DoD

- [ ] All pre-release gates pass (see `01-docs/devops/release-mgmt/release-checklist.md`)
- [ ] Heavy ZKP proof validation completed within last 7 days
- [ ] UAT evidence log updated
- [ ] CODEOWNERS approval obtained
- [ ] Release notes updated
- [ ] `quality/api-surface-baseline.json` updated (if API changed, human approval required)
- [ ] `GTCX_REQUIRE_NATIVE=true` enforced in production environment

---

## Cryptographic Work DoD

All changes to security-sensitive packages must additionally satisfy:

- [ ] **Audited libraries only** — No custom cryptographic primitives. Use only audited crates (`ed25519-dalek`, `blake3`, `sha2`, `bellman`, `bulletproofs`)
- [ ] **Zeroizing private keys** — All private key material wrapped in `Zeroizing<T>` for automatic memory clearing on drop
- [ ] **No unsafe code** — `#![deny(unsafe_code)]` enforced at crate level; any exception requires written justification and security review
- [ ] **Constant-time comparison** — All secret comparisons use constant-time operations (`subtle::ConstantTimeEq` or equivalent)
- [ ] **Standard test vectors** — Unit tests include test vectors from relevant RFCs, NIST publications, or library reference implementations
- [ ] **Fuzz targets** — All parsers and deserialization routines have `cargo-fuzz` targets with minimum 10M iterations before initial merge
- [ ] **Cryptographic Security Engineer review** — Designated reviewer must approve the PR
- [ ] **Tier evidence attached** — Release/audit evidence updated when trust-bearing behavior or public security contracts change

**Recommended for cryptographic work:**

- Property-based testing with `proptest` for algebraic invariants
- Benchmarks for all hot-path operations (`criterion`)
- Threat model assumptions documented in module-level doc comments

---

## Quality Gates (gtcx-core Thresholds)

| Gate                              | Threshold  |
| --------------------------------- | ---------- |
| Architecture violations           | 0          |
| Lint errors                       | 0          |
| Type errors                       | 0          |
| Critical security vulnerabilities | 0          |
| API surface unintentional breaks  | 0          |
| Performance regression vs. budget | 0% allowed |

---

## Reference

- [`01-docs/devops/release-mgmt/release-checklist.md`](../../devops/release-mgmt/release-checklist.md) — release gate checklist
- [`01-docs/devops/runbooks/quality-runbook.md`](../../devops/runbooks/quality-runbook.md) — full gate sequence
- [`01-docs/09-security/security-framework.md`](../../security/security-framework.md) — security standards
- [`quality/package-risk-tiers.json`](../../../quality/package-risk-tiers.json) — risk tier manifest
- [`01-docs/architecture/trust-contract-matrix.md`](../../architecture/trust-contract-matrix.md) — trust-bearing API contracts
