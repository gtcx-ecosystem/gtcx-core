---
title: 'Certified pack pipeline (DTF-5.5.2)'
status: current
date: 2026-06-06
owner: gtcx-core
story_id: DTF-5.5.2
document_id: OPS-CERT-PACK-001
---

# Certified pack pipeline — DTF-5.5.2

**Class R (agents execute):** export engagement packs, build content-addressed manifest, verify in CI.

**Class S (human only):** **DTF-5.5.4** design-partner LOI or regulator letter — names circuit + pack hash for Tier 5 commercial exit ([`tiers.md`](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/frameworks/defensibility-tiers/v1.0.0/tiers.md) criterion **5-C2**).

## Commands (Protocol 27)

```bash
cd gtcx-core
pnpm jurisdiction:validate-packs    # DTF-5.5.1 prerequisite
pnpm certified-pack:build-manifest  # export + manifest → exit 0
pnpm certified-pack:verify-manifest # re-hash verify → exit 0
```

**Outputs:**

| Artifact                    | Path                                                      |
| --------------------------- | --------------------------------------------------------- |
| Pack JSON (5 jurisdictions) | `artifacts/certified-pack/packs/*-engagement-pack.json`   |
| Machine manifest            | `artifacts/certified-pack/manifest.json`                  |
| Evidence witness            | `docs/audit/evidence/certified-pack-manifest-latest.json` |

## Agent rules

- **Execute** build + verify in-session; report command → exit code.
- **Do not** claim Tier 5 **commercial** closed without redacted LOI/letter in `docs/audit/evidence/` (DTF-5.5.4).
- Production Ed25519 delivery signature is **ceremony-gated** (protocols CSP / Legal) — hash manifest is sufficient for engineering pipeline v1.

## Related

- [`tier-5-workplan-2026-06.md`](./tier-5-workplan-2026-06.md)
- [`from-gtcx-core-tier5-commercial-unblock-2026-06-06.md`](./coordination/from-gtcx-core-tier5-commercial-unblock-2026-06-06.md)
