# Service Level Objectives

Last updated: 2026-02-19

## Scope

Critical package surfaces:

- `@gtcx/crypto`
- `@gtcx/verification`
- `@gtcx/security`
- `@gtcx/domain`
- `@gtcx/services`

## SLO Targets

| SLO                             | Target                   | Measurement                               |
| ------------------------------- | ------------------------ | ----------------------------------------- |
| CI quality gates success rate   | `>= 98%` rolling 30 days | CI workflow pass/fail                     |
| Critical test suite flake rate  | `< 1%`                   | Re-run instability rate                   |
| Mean time to detect regressions | `< 1 PR cycle`           | PR to failing gate interval               |
| Docs/API drift incidents        | `0`                      | API baseline + docs gate failures on main |
| High severity escape defects    | `< 1/month`              | Post-release incident log                 |

## Error Budget Policy

If any monthly SLO exceeds budget:

1. Freeze non-critical changes for impacted surfaces.
2. Open corrective action issue with owner and deadline.
3. Require two consecutive green weeks before lifting freeze.
