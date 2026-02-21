# @gtcx/types

Canonical TypeScript type definitions used across the GTCX ecosystem.

## Scope

- Core models (`lot`, `permit`, `site`, `user`)
- Protocol payloads (`gci`, `geotag`, `identity`, `pvp`, `tradepass`, `vaultmark`)
- API request/response types
- Common errors and event types

## Structure

- `packages/types/src/models/*`
- `packages/types/src/protocols/*`
- `packages/types/src/api/*`
- `packages/types/src/common/*`

## Notes

- This package is types‑only; runtime validation is handled elsewhere.

## References

- `docs/specs/data-models.md`
