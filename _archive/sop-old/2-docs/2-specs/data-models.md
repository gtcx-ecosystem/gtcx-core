# Data Models and Schemas — gtcx-core

**Status**: Active
**Last reviewed**: 2026-02-21

Canonical data models used by `gtcx-core`. Defines where models live, who owns them, and how they evolve.

## Package Ownership

| Package         | Owns                                                            |
| --------------- | --------------------------------------------------------------- |
| `@gtcx/types`   | TypeScript types for API, domain, and protocol payloads         |
| `@gtcx/schemas` | Runtime schema definitions — Core12 compliance framework        |
| `@gtcx/domain`  | Domain events, Zod schemas for domain entities, version helpers |

## Type Map

### `@gtcx/types`

| Path                             | Contents                                                         |
| -------------------------------- | ---------------------------------------------------------------- |
| `packages/types/src/models/*`    | Core domain models: lot, permit, site, user                      |
| `packages/types/src/protocols/*` | Protocol types: GCI, GeoTag, identity, PvP, TradePass, VaultMark |
| `packages/types/src/api/*`       | API request/response shapes                                      |
| `packages/types/src/common/*`    | Shared error and event types                                     |

### `@gtcx/schemas`

The Core12 compliance framework is the primary schema surface:

- `CORE12_DOMAINS` — full domain definitions
- `getDomain(domainId)` — lookup by ID
- `getControl(controlId)` — lookup control
- `getAllControls()` — full control set

These are the authoritative definitions for compliance logic and verification packages.

### `@gtcx/domain`

- `packages/domain/src/events.ts` — canonical domain event types and payloads
- `packages/domain/src/schemas.ts` — Zod schemas for domain entities

## Versioning Rules

- Type changes in `@gtcx/types` are versioned via package releases.
- Core12 schema changes must preserve stable IDs for domains and controls.
- Event payload changes must increment `version` in `DomainEvent`.
- Consumers must be tolerant to additive fields.

## Non-Goals

- No auto-generated OpenAPI/JSON Schema publishing from `@gtcx/types`.
- No commodity-specific "extension packs" — extensions are downstream responsibilities.

## References

- `eventcore.md`
- `identity-core.md`
- `packages/types.md`
- `packages/schemas.md`
