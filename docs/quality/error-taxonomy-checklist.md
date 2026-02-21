# Error Taxonomy Adoption Checklist

**Updated**: 2026-02-21

Reference: `docs/adr/012-error-taxonomy-and-cause-propagation.md`

## Required for New Code

- [ ] Use standardized `ErrorCode` from `@gtcx/types` where applicable.
- [ ] Preserve wrapped error context via `Error.cause`.
- [ ] Avoid dropping root failure details when rethrowing.
- [ ] Keep user‑facing messages stable and actionable.
- [ ] Include test coverage for primary error paths.

## Required for Public Service APIs

- [ ] Validate input and return deterministic failures for invalid payloads.
- [ ] Distinguish validation errors from infrastructure failures.
- [ ] Document expected error semantics in package docs.

## Verification

- [ ] Critical package tests pass with coverage thresholds.
- [ ] No placeholder error throws in exported production paths.
