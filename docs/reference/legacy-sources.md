# Legacy Source Map

This document maps legacy doc sources to the new canonical structure. It is a working checklist for consolidation.

## Legacy Sources (Keep for Now)

- `docs/architecture/*.md` → summarize into `docs/architecture/overview.md` + `docs/architecture/components.md`
- `docs/specs/*.md` → canonicalized under `docs/specs/`
- `docs/packages/*.md` → remain package references; canonical index is `docs/reference/index.md`
- `docs/rust/*` → use for Rust crate detail; canonical index is `docs/architecture/components.md`
- `docs/security/*` → merge into `docs/specs/security-framework.md` and `docs/engineering/quality-standards.md`
- `docs/quality/*` → canonical quality policy set; referenced from `docs/engineering/quality-standards.md`
- `docs/guides/*` → migrate into `docs/engineering/` where applicable
- `docs/operations/*` → canonical operations in `docs/operations/`

## Consolidation Rules

1. Canonical docs are authoritative; legacy docs are sources until replaced.
2. Avoid deleting sources until the canonical doc has been reviewed.
3. When a canonical doc is complete, mark the legacy source as “superseded” in-place or remove it.
