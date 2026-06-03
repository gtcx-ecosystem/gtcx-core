---
title: 'Trust portal — ZKP circuit registry'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['governance', 'trust-portal', 'zkp', 'dtf-5-4']
review_cycle: on-change
---

# Trust portal — ZKP circuit registry (DTF-5.4.3)

> **Parent:** [trust-portal.md](./trust-portal.md) — evidence index for vendor risk and regulators.

## ZKP circuit registry — profile IDs (DTF-5.4.3)

> **Status (2026-06-03):** Tier-5 **circuit ID column** for verifier and regulator UX. One underlying Groth16 R1CS (`CommodityOrigin`); rows below are **policy packs** with semver lifecycle — not separate arkworks circuits.

**System-of-record:** [`packages/crypto/circuit-registry.manifest.json`](../../packages/crypto/circuit-registry.manifest.json) · TypeScript API [`circuit-registry.ts`](../../packages/crypto/src/circuit-registry.ts) · Spec [`zkp-circuit-profiles.md`](../specs/packages/zkp-circuit-profiles.md)

### Circuit ID column (registry snapshot)

| Circuit ID               | Version | Status     | Underlying R1CS   | Jurisdiction | Native prove       | Off-circuit policy                                                  | KAT evidence                                                                                                                        |
| ------------------------ | ------- | ---------- | ----------------- | ------------ | ------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `gh-gold-origin`         | 1.0.0   | active     | `CommodityOrigin` | GH           | Yes                | GPS bbox, purity/weight mins, `RegulatoryExportLicense` cert mask   | [`groth16-gh-gold-origin.kat.json`](../../artifacts/kat/groth16-gh-gold-origin.kat.json)                                            |
| `zw-diamond-origin`      | 1.0.0   | active     | `CommodityOrigin` | ZW           | Yes                | GPS bbox, clarity/carat mins, `RegionalCertification` cert mask     | [`groth16-zw-diamond-origin.kat.json`](../../artifacts/kat/groth16-zw-diamond-origin.kat.json)                                      |
| `gh-cocoa-origin`        | 1.0.0   | active     | `CommodityOrigin` | GH           | Yes                | GPS bbox, grade/weight mins, `OriginAuthenticated` cert mask        | Generic [`groth16-commodity-origin.kat.json`](../../artifacts/kat/groth16-commodity-origin.kat.json) (profile-specific KAT planned) |
| `commodity-origin`       | 0.1.0   | active     | `CommodityOrigin` | \* (generic) | No (registry only) | Caller-supplied bounds/mins; use named profiles for sovereign packs | [`groth16-commodity-origin.kat.json`](../../artifacts/kat/groth16-commodity-origin.kat.json)                                        |
| `gh-gold-origin-preview` | 0.9.0   | deprecated | `CommodityOrigin` | GH           | No                 | Superseded — do not issue new proofs                                | —                                                                                                                                   |

**Native prove** = Rust NAPI + `@gtcx/crypto` helpers ship for that ID. **Registry-only** rows are valid for documentation and `resolveCircuitProfile()` but are not in the native provable subset.

Resolve before prove/verify:

```typescript
import { resolveCircuitProfile } from '@gtcx/crypto';

const entry = resolveCircuitProfile('gh-gold-origin');
// entry.version, entry.status, entry.underlyingCircuit
```

Deprecated IDs throw `CircuitRegistryError` unless `allowDeprecated: true` (lab replay only).

### Off-circuit policy (verifier obligation)

Certification masks, GPS bounding boxes, and minimum grade/weight thresholds are enforced **before** `groth16_prove` via `validate_profile_sample` / `validate_profile_witness` — **not** inside the R1CS. This is intentional: country and commodity names never appear in constraints; policy is data-driven.

| What auditors should know             | Implication                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Proof verifies cryptographically      | Groth16 `CommodityOrigin` + public inputs are sound                                               |
| Proof does **not** alone prove policy | Integrators must run the same policy gate as the prover, or trust an attested prover path         |
| Minerals-board UAT                    | Scripted checks in [minerals-board-uat-protocol.md](../operations/minerals-board-uat-protocol.md) |

Implementation: [`rust/gtcx-zkp/src/circuit_profiles/validate.rs`](../../rust/gtcx-zkp/src/circuit_profiles/validate.rs) · full-audit finding closed by this section ([full-audit-2026-06-04.md](../audit/full-audit-2026-06-04.md)).

### Verify throughput (DTF-5.4.2)

Minerals-board **verifier SLA** narrative: parallel Groth16 verify on profile-bound proofs.

| Metric     | Lab result (2026-06-03)                                                                  | Gate         |
| ---------- | ---------------------------------------------------------------------------------------- | ------------ |
| Mode       | `verify` (not prove)                                                                     | —            |
| Throughput | **1603** verifications/min (12 workers, release)                                         | ≥ 1000/min   |
| Evidence   | [`zkp-profile-load-2026-06-03.json`](../audit/evidence/zkp-profile-load-2026-06-03.json) | `pass: true` |

Reproduce: `pnpm perf:zkp-profile-load` (writes dated JSON under `docs/audit/evidence/`).

### Verify registry and KATs locally

```bash
pnpm --filter @gtcx/crypto test -- circuit-registry
cargo test -p gtcx-zkp --lib lifecycle
pnpm test:kat-cross-impl
```

---
