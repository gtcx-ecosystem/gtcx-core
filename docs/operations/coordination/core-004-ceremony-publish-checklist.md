---
title: 'CORE-004 — ceremony publish checklist (Class R prep)'
status: current
date: 2026-06-06
owner: gtcx-core
role: crypto-security-engineer
document_id: OPS-CORE-004-CHECKLIST
tier: standard
tags: ['core-004', 'trusted-setup', 'ceremony', 'launch']
review_cycle: on-change
---

# CORE-004 — ZKP ceremony publish checklist

**Launch focus:** `CORE-004` in `.baseline/launch-focus.json`  
**Blocker witness:** [core-004-xr402-blocker-2026-06-04.md](./core-004-xr402-blocker-2026-06-04.md)

Engineering gates are **green** without production seed. This checklist closes the **release-gated** remainder.

## Prerequisites (done in-repo)

- [x] `cargo test -p gtcx-zkp --features trusted-setup-verify --release` — exit 0
- [x] CI: Trusted-setup verify + conditional KAT pin step
- [x] Evidence: [core-004-trusted-setup-verify-2026-06-04.json](../../audit/evidence/core-004-trusted-setup-verify-2026-06-04.json)
- [x] Manifest template: [trusted-setup-manifest.template.json](../../audit/evidence/trusted-setup-manifest.template.json)

## Publish (Class R — custodian / ceremony)

1. Run sovereign ZKP ceremony per protocols CSP policy (not INF-86 KMS).
2. Place `transcript.seed` under `artifacts/trusted-setup/` (see [README](../../../artifacts/trusted-setup/README.md)).
3. Copy [trusted-setup-manifest.template.json](../../audit/evidence/trusted-setup-manifest.template.json) → `artifacts/trusted-setup/manifest.json`; fill `generatedAt`, `repoHead`, ceremony refs.
4. Re-run KAT generation if VK hashes drift; verify pins:

```bash
cd gtcx-core
cargo test -p gtcx-zkp --features trusted-setup-verify --release -- groth16_kat_pins_match_published_transcript
```

5. Update [execution-roadmap.md](../../audit/execution-roadmap.md) CORE-004 → **done**.
6. `pnpm agent:reconcile-launch` — refresh launch-focus implement queue.

## Not in scope (gtcx-core agent)

- INF-86 / XR-402 KMS ceremony (protocols — **done**)
- Production Ed25519 on certified-pack manifest (Legal / CSP)

## Verification ladder

```bash
pnpm agent:reconcile-launch
pnpm agent:launch:check
cargo test -p gtcx-zkp --features trusted-setup-verify --release
```
