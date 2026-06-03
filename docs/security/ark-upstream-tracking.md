---
title: 'arkworks Ecosystem Upstream Advisory Tracking'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'security']
review_cycle: 'on-change'
---

---

title: 'Ark Upstream Tracking'
status: 'current'
date: '2026-05-22'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['security', 'rust', 'arkworks', 'rustsec', 'tracking']
review_cycle: 'monthly'

---

# arkworks Ecosystem Upstream Advisory Tracking

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Cryptographic Security Engineer
> **Review cadence:** Monthly (next: 2026-06-22)

Operational tracker for each RUSTSEC advisory ignored in [`rust/.cargo/audit.toml`](../../rust/.cargo/audit.toml). Required by Sprint 4 task 4.3 of the [engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md): every ignored advisory must have a documented upstream link, an escalation owner, and a reassessment date.

The advisories tracked here all flow through the **arkworks 0.4.x** dependency tree (ark-ec, ark-ff, ark-relations, ark-r1cs-std, ark-groth16, etc.) consumed by [`rust/gtcx-zkp`](../../rust/gtcx-zkp/). Upgrading to arkworks 0.5 is the strategic remediation; the current ignores are tactical risk acceptances justified individually below.

## Strategic remediation path

| Phase                                                | Target                         | Effort      | Status           |
| ---------------------------------------------------- | ------------------------------ | ----------- | ---------------- |
| Monitor arkworks 0.5 release                         | upstream `arkworks-rs/algebra` | observation | Watching         |
| Evaluate 0.5 API delta for gtcx-zkp                  | gtcx-core internal             | M           | Not started      |
| Cut 0.5 migration branch                             | gtcx-core                      | L           | Not started      |
| Verify all 6 Rust crates compile + tests pass on 0.5 | gtcx-core                      | L           | Not started      |
| Re-run cargo-fuzz campaign on 0.5 build              | gtcx-core                      | M           | Not started      |
| Remove all 4 ignores from `audit.toml`               | gtcx-core                      | XS          | Blocked by above |

**Tracking issue:** `gtcx-ecosystem/gtcx-core#infra-rust-2026-arkworks-0.5` (placeholder — open when work begins)

## Active ignores

### RUSTSEC-2025-0055 — tracing-subscriber ANSI injection

| Field                          | Value                                                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Affected crate                 | `tracing-subscriber 0.2.25`                                                                                                                                                                            |
| Dependency path                | `ark-relations` → `tracing-subscriber 0.2.25`                                                                                                                                                          |
| Consumer                       | `rust/gtcx-zkp`                                                                                                                                                                                        |
| Justification                  | GTCX does not use `tracing-subscriber` for user-facing log output; all logs are structured and processed before display. ANSI escape sequences cannot reach a terminal that an attacker could observe. |
| Upstream issue                 | [arkworks-rs/algebra — arkworks 0.5 milestone](https://github.com/arkworks-rs/algebra) — not yet released (as of 2026-05-22)                                                                           |
| Escalation owner               | Cryptographic Security Engineer                                                                                                                                                                        |
| Reassessment date              | 2026-06-22                                                                                                                                                                                             |
| Blocking sovereign engagement? | No — risk is non-applicable to gtcx-core's threat model                                                                                                                                                |

### RUSTSEC-2024-0388 — derivative unmaintained

| Field                          | Value                                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Affected crate                 | `derivative 2.2.0`                                                                                                                                                                      |
| Dependency path                | `ark-ec`, `ark-ff`, `ark-poly`, `ark-r1cs-std` → `derivative 2.2.0`                                                                                                                     |
| Consumer                       | `rust/gtcx-zkp`                                                                                                                                                                         |
| Justification                  | `derivative` is a procedural-macro crate used at compile time only. It does not appear in runtime artifacts. Unmaintained status is a supply-chain hygiene concern, not a runtime risk. |
| Upstream issue                 | [arkworks-rs/algebra/issues — derivative removal in 0.5](https://github.com/arkworks-rs/algebra) — confirmed planned for 0.5                                                            |
| Escalation owner               | Cryptographic Security Engineer                                                                                                                                                         |
| Reassessment date              | 2026-06-22                                                                                                                                                                              |
| Blocking sovereign engagement? | No — compile-time-only macro; not in trust boundary                                                                                                                                     |

### RUSTSEC-2024-0436 — paste unmaintained

| Field                          | Value                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Affected crate                 | `paste 1.0.15`                                                                                            |
| Dependency path                | `ark-ff` → `paste 1.0.15`                                                                                 |
| Consumer                       | `rust/gtcx-zkp`                                                                                           |
| Justification                  | Same shape as `derivative` — `paste` is a procedural-macro crate, compile-time only. No runtime exposure. |
| Upstream issue                 | [arkworks-rs/algebra/issues — paste removal in 0.5](https://github.com/arkworks-rs/algebra)               |
| Escalation owner               | Cryptographic Security Engineer                                                                           |
| Reassessment date              | 2026-06-22                                                                                                |
| Blocking sovereign engagement? | No — compile-time-only macro                                                                              |

### RUSTSEC-2026-0097 — rand unsoundness with custom logger

| Field                          | Value                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Affected crate                 | `rand 0.8.5`, `rand 0.9.2`                                                                                                                                                                                                |
| Dependency path                | `secp256k1`, `bulletproofs`, `ark-std` → `rand`                                                                                                                                                                           |
| Consumer                       | `rust/gtcx-crypto`, `rust/gtcx-zkp`                                                                                                                                                                                       |
| Justification                  | The unsoundness requires a specific custom-logger pattern that interacts with `rand::rng()`. GTCX does not register a custom logger that matches this pattern (verified via `grep -rE 'log::set_(boxed_)?logger' rust/`). |
| Upstream issue                 | [rust-random/rand — issue tracker, fix in `rand 0.9.3`](https://github.com/rust-random/rand) — version pinning prevents direct upgrade without arkworks/secp256k1 coordination                                            |
| Escalation owner               | Cryptographic Security Engineer                                                                                                                                                                                           |
| Reassessment date              | 2026-06-22                                                                                                                                                                                                                |
| Blocking sovereign engagement? | No — pattern not present in codebase                                                                                                                                                                                      |

## Monthly review checklist

Run on the reassessment date listed above (default: 22nd of each month):

```bash
# 1. Verify ignore list is still narrow
cat rust/.cargo/audit.toml

# 2. Run audit and confirm only the listed RUSTSECs surface
cd rust && cargo audit

# 3. Check for new advisories on the same crates
cargo audit --json | jq '.vulnerabilities.list[] | {advisory: .advisory.id, crate: .package.name}'

# 4. Check upstream arkworks 0.5 release status
gh repo view arkworks-rs/algebra --json defaultBranchRef,latestRelease

# 5. Verify no new logger registration in gtcx-core Rust code (RUSTSEC-2026-0097 check)
grep -rE 'log::set_(boxed_)?logger' rust/ || echo "No custom logger registered — RUSTSEC-2026-0097 not exposed"

# 6. Update reassessment dates and any state changes in this doc
```

## Decision log

### 2026-05-22 — Tracking doc created

- All 4 RUSTSEC ignores currently in `rust/.cargo/audit.toml` mapped to upstream paths, escalation owner, and monthly reassessment cadence.
- Strategic remediation: wait for arkworks 0.5; do not unilaterally fork or vendor.
- Sovereign-state engagement impact: zero — every ignore is either compile-time-only (procedural macro) or pattern-not-present (custom logger).
