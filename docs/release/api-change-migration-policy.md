# API Change Migration Policy

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Use this policy whenever a public export changes in `gtcx-core`.

---

## Additive Changes

- Require at least a minor version bump.
- Must be usable through public exports, not just internal paths.
- Must include tests that prove the new surface works for a consumer.
- Should document any new optional fields or templates in the owning package spec.

## Breaking Changes

- Require a major version bump.
- Must include migration guidance before merge.
- Must identify downstream blast radius for affected packages.
- Must not update the API baseline until human approval is complete.

## Bug-Fix Contract Restorations

- May ship as patch releases when restoring documented behavior.
- Must include regression coverage proving the prior behavior was defective.
- Must call out behavior changes clearly if some consumers may have been relying on the bug.
