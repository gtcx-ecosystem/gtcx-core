# Legal

Release-gate legal review for `gtcx-core`.

## Scope

Standard product-launch legal review (ToS, privacy, DPAs, user data) does not apply — this is a library with no end users.

The one legal concern specific to this repo is **export control** for cryptographic primitives. Before distributing to a new registry, government partner, or jurisdiction with specific crypto export restrictions, trigger an export control policy review.

See `_sop/2-docs/3-engineering/5-compliance/compliance-requirements.md` for the full export control context.

## Per-Release Legal Check

Before publishing any release that includes changes to crypto packages (`@gtcx/crypto`, `gtcx-crypto`, `gtcx-zkp`):

- [ ] Export control scope unchanged (no new jurisdictions, no new distribution channels)
- [ ] SBOM generated and attached to release
- [ ] Open-source license inventory current (see `4-licenses/`)
