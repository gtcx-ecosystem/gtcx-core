---
title: 'Cross-Repo Handoff — SLSA Provenance + CI Gate Changes'
date: '2026-06-02'
from: 'gtcx-core'
to: 'gtcx-infrastructure'
scope: 'SLSA provenance pipeline gap + new CI gate'
tags: ['handoff', 'gtcx-core', 'gtcx-infrastructure', 'slsa', 'provenance', 'ci']
status: 'open'
---

# Cross-Repo Handoff — gtcx-core → gtcx-infrastructure

## Context

gtcx-core has two items requiring gtcx-infrastructure attention:

1. **SLSA provenance attestations missing** — Confirmed issue affecting all `@gtcx/*` publishes
2. **New CI gate** — `test:kat-cross-impl` added to `.github/workflows/ci.yml`

## What gtcx-core Delivered

### New CI Gate: Cross-Implementation KAT Verification

- **File:** `.github/workflows/ci.yml`
- **Step name:** `Cross-implementation KAT verification (arkworks reference verifier)`
- **Command:** `pnpm test:kat-cross-impl`
- **What it does:** Runs `cargo run --bin kat-cross-impl-verify -- --all` which verifies all 4 Groth16 KAT files using a standalone arkworks binary (no gtcx-zkp code)
- **Timing:** ~20s compilation (cached) + <1s execution
- **When it runs:** Every PR, after `cargo test -p gtcx-zkp --lib`

### SLSA Provenance Gap (not new, but confirmed)

**Evidence (2026-05-26 coordination ticket):**

```
@gtcx/workproof@1.0.0     → no attestations
@gtcx/verification@3.1.0  → no attestations
@gtcx/resilience@0.2.0    → no attestations
@gtcx/telemetry@0.2.0     → no attestations
@gtcx/runtime@0.2.1       → no attestations
```

**Likely causes:**

1. `id-token: write` permission present but `actions/setup-node` OIDC handshake incomplete
2. `changeset publish --provenance` vs `npm publish --provenance` behavior gap

## What gtcx-infrastructure Needs to Do

### Item 1 — Investigate SLSA provenance CI gap

**Priority:** P1 if Build L3 is regulator-required; P2 otherwise
**ETA:** 2026-05-27 per coordination ticket

**Questions to answer:**

1. Is `id-token: write` actually being granted to the publish job?
2. Does `actions/setup-node@v4` successfully exchange OIDC token with npm?
3. Does `changeset publish` forward `--provenance` to the underlying `npm publish`?
4. Is the registry URL in `.npmrc` pointing to `registry.npmjs.org` (required for provenance)?

**Acceptance:** At least one `@gtcx/*` package published with `dist.attestations` present on npm.

### Item 2 — No action on new CI gate

The new `test:kat-cross-impl` step is self-contained within gtcx-core's CI. No infrastructure changes needed unless you maintain shared CI templates that gtcx-core consumes.

If gtcx-infrastructure owns a shared workflow template used by gtcx-core:

- Ensure the template allows `cargo run --bin` steps
- No other changes needed

### Item 3 — FIPS strict mode deployment awareness

**Priority:** P1 for sovereign deployments
**ETA:** Before Zimbabwe production rollout

If infrastructure manages deployment configs for regulated environments:

- Add `GTCX_FIPS_STRICT=1` to the environment variable set for gtcx-core services in those regions
- Ensure fallback to SHA-256 is acceptable (performance impact: ~2× slower than BLAKE3 for large payloads)

## References

- `gtcx-core/.github/workflows/ci.yml` — new cross-impl KAT step
- `gtcx-core/package.json` — `test:kat-cross-impl` script definition
- `baseline-os/workstream/coordination/inbound/from-gtcx-core-2026-05-26.md` — original provenance investigation ticket
- `gtcx-core/rust/gtcx-crypto/03-platform/src/hashing/mod.rs` — FIPS strict mode implementation
