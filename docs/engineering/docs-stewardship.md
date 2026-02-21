# Documentation Stewardship

**Updated**: 2026-02-21

This policy defines how documentation is maintained so primary agents can rely on it as the source of truth.

## Ownership

- **Architecture & Specs**: Engineering leads
- **Packages**: Package owners
- **Operations**: DevOps / Platform
- **Quality**: Quality lead
- **Security**: Security lead

## Update Triggers

Update docs when:

- A public API changes.
- A protocol or spec changes.
- A CI gate, runbook, or operational policy changes.
- A new package or Rust crate is added.

## Review Cadence

- **Weekly**: verify `docs/specs` and `docs/packages` against code changes.
- **Monthly**: review `docs/quality`, `docs/operations`, and threat matrix.
- **Release**: run `pnpm docs:check-links` and verify `docs/quality` checklists.

## Quality Bar

- Docs must reflect current code (no aspirational content).
- Any “planned” items must be explicitly labeled as such.
- Canonical docs live in `docs/`; avoid new legacy material.

## Enforcement

- PRs touching code **must** update affected docs.
- Use `pnpm docs:check-links` to catch broken references.
