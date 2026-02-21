# Data Models and Schemas (gtcx-core)

**Status**: Active (2026-02-21)

This document describes the canonical data models used by `gtcx-core` and where they live in the repo. It focuses on what is implemented today, with clear extension points for future schemas.

## Scope

The data model surface in this repo is split across three primary packages:

1. `@gtcx/types` — TypeScript types for API, domain, and protocol payloads.
2. `@gtcx/schemas` — runtime schema definitions (Core12 framework domains + controls).
3. `@gtcx/domain` — domain events and schema/version helpers.

## Package Map

- `packages/types/src/models/*` — core models (lot, permit, site, user).
- `packages/types/src/protocols/*` — protocol types (gci, geotag, identity, pvp, tradepass, vaultmark).
- `packages/types/src/api/*` — API request/response shapes.
- `packages/types/src/common/*` — shared error and event types.

- `packages/schemas/src/core12/*` — Core12 domain and control definitions.
- `packages/domain/src/events.ts` — canonical domain event types and payloads.
- `packages/domain/src/schemas.ts` — Zod schemas for domain entities.

## Core12 Framework (Schemas)

`@gtcx/schemas` currently exposes the Core12 framework (domain/control definitions) with helpers:

- `CORE12_DOMAINS`
- `getDomain(domainId)`
- `getControl(controlId)`
- `getAllControls()`

These are the authoritative definitions used by compliance logic and verification packages.

## Type Ownership

- **Domain objects**: defined in `@gtcx/types` and re-used across packages.
- **Validation**: performed where needed via `@gtcx/schemas` or package-local validators.
- **Events**: emitted via `@gtcx/domain` (see `docs/specs/eventcore.md`).

## Versioning

- Type changes in `@gtcx/types` are versioned via package releases.
- Core12 schema changes must preserve stable IDs for domains and controls.
- Event payload changes must increment `version` in `DomainEvent`.

## Non‑Goals (Current)

- No full industry-specific schemas (e.g., commodity-specific “extension packs”).
- No auto-generated OpenAPI/JSON Schema publishing from `@gtcx/types` yet.

## References

- `eventcore.md`
- `identity-core.md`
- `docs/packages/types.md`
- `docs/packages/schemas.md`
