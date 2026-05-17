---
title: 'Legal Sign Off'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'
---

# Legal Sign-Off — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

_Standard legal sign-off for consumer product launches (Terms of Service, Privacy Policy, GA gates) does not apply to `gtcx-core`. This repo is a shared primitives library — it has no end users, no user-facing terms, and no product GA process._

---

## Relevant Legal Consideration

The one legal area that applies to `gtcx-core` is **export control**.

The cryptographic primitives in this repo (Ed25519, secp256k1, ZKP circuits) are subject to export control review for certain distribution contexts. Trigger a review before:

- Publishing to a new registry or distribution channel outside npm/crates.io
- Distributing to a government partner or regulated entity
- Shipping to a jurisdiction with specific crypto export restrictions

See `docs/compliance/compliance-requirements.md` for the full compliance context.

---

## Open-Source License Review

Before each release, verify:

- [ ] `pnpm audit` — no license incompatibilities in npm dependencies
- [ ] `cargo audit` — no license incompatibilities in Rust dependencies
- [ ] All new dependencies reviewed for GPL/AGPL (incompatible with commercial distribution)
- [ ] SBOM generated and license inventory current

Owner: Protocol Architect
