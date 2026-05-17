---
title: 'Global South Resilience Profile'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# Global-South Resilience Profile

**Last updated:** 2026-05-06  
**Status:** Initial Sprint R2 baseline  
**Purpose:** Define the hostile operating conditions `gtcx-core` is expected to tolerate in field deployments where connectivity, power, device quality, and time trust are materially weaker than enterprise-default assumptions.

---

## Design Intent

`gtcx-core` is a foundation library for environments where any of the following may be normal:

- intermittent or multi-day connectivity loss
- low-memory Android devices
- abrupt process termination during local writes
- user-adjusted or drifting device clocks
- delayed sync replay after hours or days offline
- partial local storage corruption after power loss or device instability

The repo should not assume stable broadband, reliable NTP, uninterrupted power, or fast device replacement.

---

## Resilience Assumptions

| Condition                  | Expected reality                                                   | Required design posture                                             |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Connectivity               | `offline`, `ussd-only`, `edge`, or `degraded` links are common     | Queue or defer remote work where safe; document what cannot degrade |
| Device quality             | Low-RAM phones and constrained field devices exist                 | Keep critical state transitions deterministic and restart-safe      |
| Power stability            | Battery failures and abrupt app/process termination happen         | Persist security-critical counters and replay state safely          |
| Time trust                 | Clocks may drift, jump backward, or be corrected late              | Never rely on wall-clock ordering alone for correctness             |
| Storage integrity          | Local stores may partially write, corrupt, or lose non-atomic data | Corruption must fail safe and surface explicitly                    |
| Native crypto availability | Production must require native Rust crypto where documented        | Hard fail when native mode is required and unavailable              |

---

## Behavioral Model

### Hard fail

These conditions must stop the operation rather than silently degrade:

- `GTCX_REQUIRE_NATIVE=true` and native crypto bindings are unavailable
- cryptographic verification failure
- explicit revocation state
- tamper or corruption detected in security-critical storage state
- trust decision that depends on malformed or incomplete data

### Queue / defer

These conditions may safely defer remote or network-bound work:

- offline API requests through offline-aware clients
- sync work awaiting reconnect
- non-critical event delivery and replay

### Degrade with explicit semantics

These conditions may degrade only if the behavior is documented and visible to callers:

- reduced connectivity profile classification (`edge`, `degraded`, `satellite`)
- local development fallback for native crypto when production mode is not required
- local queue accumulation during offline periods

Silent degradation is not acceptable for trust-bearing operations.

---

## Support Tiers

| Tier | Environment profile                                      | Expected support level                                              |
| ---- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| T1   | Stable broadband, modern devices, trusted time           | Full feature set, normal release expectation                        |
| T2   | Intermittent mobile data, moderate latency, older phones | Full feature set with deferred network behavior and bounded retries |
| T3   | Long offline windows, drifting clocks, abrupt restarts   | Trust-bearing local state must remain deterministic and recoverable |
| T4   | Missing native crypto in production-required contexts    | Not supported; operation must hard fail                             |

---

## Current Evidence

Current code-addressable resilience evidence exists for:

1. persisted secure-storage lockout state and expiry across restarts
2. fail-safe behavior for corrupted persisted lockout state
3. explicit hard-fail semantics for `GTCX_REQUIRE_NATIVE=true`
4. offline/degraded connectivity classification
5. offline queue replay order that remains stable when the device clock moves backward
6. legacy offline queue entries that are backfilled to a logical sequence on reload

This is the baseline resilience suite currently enforced in CI.
The remaining gap is external-field validation, not undocumented local behavior.

---

## Next Test Targets

1. longer offline queue persistence across process or device migration
2. low-memory or queue-pressure scenarios against explicit support tiers
3. delayed offline queue replay under explicit connectivity profiles
4. external field validation against real device and network classes

---

## References

- [trust-contract-matrix.md](./trust-contract-matrix.md)
- [10-10-readiness-sprint-roadmap.md](../agile/roadmap/10-10-readiness-sprint-roadmap.md)
- [docs/specs/packages/connectivity.md](../specs/packages/connectivity.md)
