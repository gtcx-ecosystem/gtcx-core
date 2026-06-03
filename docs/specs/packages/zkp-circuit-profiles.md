---
title: 'ZKP circuit profiles'
status: current
date: 2026-06-03
owner: protocol-architect
document_id: SPEC-ZKP-PROFILES-001
review_cycle: quarterly
tags: ['zkp', 'groth16', 'profiles', 'dtf-001']
---

# ZKP circuit profiles

## Principle

**One commodity-origin R1CS.** Registry IDs (`gh-gold-origin`, `zw-diamond-origin`, …) are **policy packs**, not separate arkworks circuits.

| Layer           | Location                                                             | Jurisdiction-specific?                                  |
| --------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| R1CS            | `CommodityOriginCircuit`                                             | No                                                      |
| Profile config  | `gtcx-zkp/src/circuit_profiles/`, `@gtcx/workproof/circuit-profiles` | Yes (data only)                                         |
| Witness builder | `@gtcx/workproof/witness`                                            | Maps predicates → typed witness                         |
| KAT filename    | `groth16-<profile-id>.kat.json`                                      | Evidence alias; `circuit` field stays `CommodityOrigin` |

## Ghana gold profile (`gh-gold-origin`)

| Field                           | Value                                                               |
| ------------------------------- | ------------------------------------------------------------------- |
| `commodity_type`                | `0`                                                                 |
| GPS bounds                      | Micro-degree bbox; longitude uses **+180° offset** in u64 witnesses |
| `min_primary` / `min_secondary` | Purity bps / grams                                                  |
| `required_certification_mask`   | `RegulatoryExportLicense` bit                                       |

Certification mask is enforced **before prove** via `validate_profile_sample` (policy gate). The R1CS does not embed country names.

## Commands

```bash
# Profile negative tests (constraint groups)
cargo test -p gtcx-zkp circuit_profiles

# KAT for profile (alias)
cargo run --bin generate-kat -- gh-gold-origin artifacts/kat
```

## Related

- [tier-5-workplan-2026-06.md](../../operations/tier-5-workplan-2026-06.md)
- DTF-5.4.1 `CircuitRegistry` (semver registry — future)
