---
title: 'Quality Assurance — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'devops']
review_cycle: 'on-change'
---

---

title: 'Qa Process'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'

---

# Quality Assurance — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Owner**: Quality & Evidence Lead
**Review Cycle**: Quarterly or after major release process changes

---

## Quality Philosophy

Quality in `gtcx-core` is enforced by automated gates, not manual gating. Every CI gate is mandatory. No package ships unless all gates pass. The Quality & Evidence Lead owns the gate definitions and monitors for regressions.

---

## Test Coverage Requirements

| Layer             | Requirement                                    | Enforcement                                   |
| ----------------- | ---------------------------------------------- | --------------------------------------------- |
| Unit tests (TS)   | All exported functions tested                  | Vitest — blocks merge                         |
| Unit tests (Rust) | All crate public API tested                    | `cargo test --workspace --lib` — blocks merge |
| Integration tests | Cross-package interactions (crypto ↔ identity) | Vitest integration suite — blocks merge       |
| Critical paths    | Crypto signing, hashing, ZKP — 100% branch     | `pnpm test:coverage:critical` — blocks merge  |
| API surface       | No unintentional breaking changes              | `pnpm api:check` — blocks merge               |
| Performance       | Signing, hashing within budget targets         | `pnpm perf:check-budgets` — blocks release    |

---

## Gate Sequence

See the full gate sequence with commands at:
`01-docs/devops/runbooks/quality-runbook.md`

Summary (TypeScript → Rust → evidence):

1. Architecture boundaries (`pnpm architecture:check`)
2. Lint + format + typecheck + tests
3. Build all 22 public TypeScript packages (+ config workspace packages)
4. API surface check
5. Critical coverage threshold
6. Performance budgets
7. Rust: `cargo clippy -D warnings && cargo test --workspace --lib`
8. Provenance generation + docs

---

## Package-Level Quality Standards

| Area                  | Standard                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| Exported API          | Every exported symbol has a test and a spec in `01-docs/specs/03-platform/packages/` |
| Error handling        | Package-local typed errors follow ADR-012 cause propagation standards                |
| Key material          | `Zeroizing<T>` on all key structs; confirmed by code review                          |
| RFC test vectors      | Required for all crypto primitives (signing, hashing, HD keys)                       |
| Unsafe code           | `#![deny(unsafe_code)]` enforced in all crypto crates                                |
| No `unwrap()` in libs | Enforced via Clippy — `clippy::unwrap_used` deny                                     |

---

## Defect Classification

| Priority | Definition                                               | Fix SLA                   |
| -------- | -------------------------------------------------------- | ------------------------- |
| P0       | Security vulnerability, data loss, key material exposure | Fix before any release    |
| P1       | Core API broken (signing, verification, sync)            | Fix within current sprint |
| P2       | Non-critical package broken, workaround exists           | Fix within 2 sprints      |
| P3       | Documentation error, minor API inconsistency             | Backlog                   |

---

## UAT (Package Acceptance)

UAT for `gtcx-core` means: evidence that new or changed packages meet their spec before release.

**Required for release:**

- All package specs in `01-docs/specs/03-platform/packages/` match the implementation
- UAT evidence log updated for significant changes
- Performance benchmark history updated (`pnpm perf:update-history`)
- API surface baseline updated if surface changes were intentional

**Who signs off:**

- Quality & Evidence Lead: gate sequence passed, evidence collected
- Cryptographic Security Engineer: required for any crypto package change
- Protocol Architect: required for any API surface change

---

## Release Readiness Checklist

Before publishing any version:

- [ ] All CI gates passing on the release commit
- [ ] `pnpm audit` — no critical or high severity advisories
- [ ] `cargo audit` — no critical or high severity advisories
- [ ] Changeset reviewed — semver bump correct
- [ ] CHANGELOG accurate
- [ ] Spec-to-code traceability map updated (if new package or scope change)
- [ ] SBOM and provenance artifacts generated
- [ ] Quality & Evidence Lead sign-off
- [ ] Cryptographic Security Engineer sign-off (if crypto packages changed)

---

## QA Metrics

Tracked per release:

| Metric                              | Target       |
| ----------------------------------- | ------------ |
| CI pass rate on `main`              | ≥ 99%        |
| Critical path test coverage         | 100%         |
| API surface regressions (unplanned) | 0            |
| Performance budget violations       | 0 at release |
| Open P0/P1 defects at release       | 0            |
