---
title: 'Verification Review Playbook'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

---

title: 'Verification'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'

---

# Verification Review Playbook

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Version:** 1.0.0
**Applies to:** `03-platform/packages/verification/`, `03-platform/packages/workproof/`
**Owner role:** `01-docs/01-agents/roles/crypto-security-engineer.md`

---

## 1. Schema-evolution requires baseline + changeset

**Rule:** Breaking changes to Zod schemas in `03-platform/packages/verification/03-platform/src/types/schemas.ts` and `03-platform/packages/workproof/03-platform/src/` (renamed fields, narrowed types, required → required-different, removed fields) require:

- An updated API surface baseline (`pnpm api:update-baseline`)
- A changeset entry in `.changeset/` with `major` bump
- A migration helper if the change affects on-the-wire data

**Violation pattern:**

- Diff modifies a Zod schema by:
  - Removing a field
  - Renaming a field (look for paired add+remove of fields with same parent)
  - Changing a `z.string()` to `z.string().uuid()` or other narrower validation
  - Marking a previously optional field as required
- Diff does not modify `quality/api-surface-baseline.json`
- Diff does not include a `.changeset/*.md` with `'@gtcx/verification': major` or equivalent

**Category:** `schema-breaking`
**Severity:** `high`
**References:** `01-docs/decisions/013-api-baseline-and-performance-budget-gates.md`, `01-docs/decisions/002-zod-over-json-schema.md`

---

## 2. Hash-chain integrity preserved in proof bundles

**Rule:** Proof bundles in `03-platform/packages/verification/03-platform/src/proofs/` rely on hash-chain linkage. Every bundle entry's `prev_hash` must point to the previous entry. Modifications must not introduce a code path that produces a bundle without computing or signing over `prev_hash`.

**Violation pattern:**

- Diff modifies bundle generation and removes `prev_hash` from the signed payload
- Diff adds a code path that mutates a finalized bundle (chain entries should be append-only)
- Diff modifies signature scope to exclude `prev_hash` or `payload` fields

**Category:** `cryptographic-correctness`
**Severity:** `critical`
**References:** `01-docs/decisions/006-hash-chain-audit-trail.md`

---

## 3. QR proof bundle recency window

**Rule:** `03-platform/packages/verification/03-platform/src/traced/qr.ts` enforces a recency window on QR-encoded proof bundles. Changes to the window value require:

- A test vector update reflecting the new window
- An entry in the threat model explaining the new window's rationale (replay-attack tradeoff)

**Violation pattern:**

- Diff modifies the recency window constant
- No corresponding test vector change in `03-platform/packages/verification/tests/`
- No `01-docs/09-security/threat-model.md` update

**Category:** `documentation`
**Severity:** `medium`
**References:** SA-005, AT-003 (`,auto-dev-state.md`)

---

## 4. Certificate revocation path preserved

**Rule:** `03-platform/packages/verification/03-platform/src/certificates/` accepts a `RevocationChecker` interface (post-Sprint 2) that callers must supply. Removing the interface, defaulting to a no-op, or short-circuiting the check is a critical finding.

**Violation pattern:**

- Diff removes the `RevocationChecker` interface or its required parameter
- Diff defaults the checker to a no-op (`() => false`, `() => null`)
- Diff adds a code path that accepts a certificate without invoking the supplied checker

**Category:** `revocation-path`
**Severity:** `critical`
**References:** SA-004, AT-002

---

## 5. Domain separation in proof commitments

**Rule:** Proof commitments must include a type-prefix string in their hash inputs. Mixing commitment types across the same hash space enables cross-protocol confusion.

**Violation pattern:**

- Diff adds a new proof type and computes a commitment via `hash256(witness)` without a type-prefix string
- Diff removes a type prefix from an existing commitment

**Category:** `domain-separation`
**Severity:** `high`

---

## 6. Commodity migration helpers continue to round-trip

**Rule:** Modifications to `03-platform/packages/verification/03-platform/src/commodities.ts` must preserve the round-trip property of `migrateGoldLotData` and `migrateLegacyLotData` for all existing fixtures in `03-platform/packages/verification/tests/`.

**Violation pattern:**

- Diff modifies a migration helper
- Diff does not run or extend the migration round-trip test suite
- Diff renames a field that an existing fixture relies on

**Category:** `schema-breaking`
**Severity:** `high`

---

## 7. API surface baseline updated for public additions

**Rule:** New exports from `03-platform/packages/verification/03-platform/src/index.ts` and `03-platform/packages/workproof/03-platform/src/index.ts` require an updated `quality/api-surface-baseline.json`. The CI gate `api:check` will fail otherwise; flag preemptively.

**Violation pattern:**

- Diff adds an `export` statement in a verification or workproof index file
- `quality/api-surface-baseline.json` is not modified in the same PR

**Category:** `api-surface-drift`
**Severity:** `medium`

---

## 8. Test vectors for new proof types

**Rule:** New proof types added to `03-platform/packages/verification/03-platform/src/proofs/` or `03-platform/packages/workproof/03-platform/src/predicates/` must include:

- At least one positive test vector (valid proof, accepted)
- At least one negative test vector (tampered proof, rejected)

**Violation pattern:**

- Diff adds a new proof type definition
- No corresponding test fixture in `03-platform/packages/verification/tests/` or `03-platform/packages/workproof/tests/`
- Existing tests do not exercise the new proof type

**Category:** `test-vector-missing`
**Severity:** `high`

---

## 9. Photo hash coverage in proof bundles with photos

**Rule:** Proof bundles that reference photos must include hash coverage of those photos in the signed payload. Otherwise photos can be substituted post-issuance.

**Violation pattern:**

- Diff modifies bundle generation in a way that excludes photo hashes from the signed payload
- Diff adds a new bundle variant that accepts photos but does not include them in the signature scope

**Category:** `cryptographic-correctness`
**Severity:** `critical`

---

## 10. Certificate field validation rules

**Rule:** Certificate validation rules — purity ranges (e.g., gold: 0–1000 fineness), expiration formats (RFC 3339 dates), required signing party fields — must remain enforced in the Zod schema. Loosening these (e.g., changing `.min(0).max(1000)` to no constraint) is a finding.

**Violation pattern:**

- Diff removes `.min`, `.max`, `.refine`, or `.regex` calls from certificate field schemas
- Diff replaces strict types with `z.any()` or `z.unknown()`
- Diff adds `.optional()` on a field previously required

**Category:** `schema-breaking`
**Severity:** `high`

---

## 11. WorkProof predicate registry consistency

**Rule:** `03-platform/packages/workproof/03-platform/src/predicates/` registry has 47 predicates across 9 categories. Adding or removing predicates requires:

- Updated TypeScript type union
- Updated registry export
- A test exercising the new predicate

**Violation pattern:**

- Diff adds or removes a predicate file in `03-platform/packages/workproof/03-platform/src/predicates/definitions/`
- The corresponding registry export or type union is not updated
- No test added for new predicates

**Category:** `schema-breaking`
**Severity:** `medium`

---

## 12. AI validation types preserve attestation chain

**Rule:** `03-platform/packages/workproof/03-platform/src/` AI validation types must preserve the attestation chain — the signing entity, the validator entity, and the timestamp must all be present and signed over.

**Violation pattern:**

- Diff modifies an AI validation type to make any of `signer`, `validator`, or `timestamp` optional
- Diff modifies serialization to exclude any of these fields from the signed payload

**Category:** `audit-trail`
**Severity:** `high`

---

## Severity-to-decision mapping

Critical findings (`cryptographic-correctness`, `revocation-path`) → `REQUEST_CHANGES`. Two or more `high` findings → `REQUEST_CHANGES`. Otherwise → `COMMENT`.

## Changelog

- **1.0.0** (2026-05-09) — Initial 12 checks covering schema evolution, hash-chain integrity, revocation, photo hash coverage, and predicate registry consistency.
