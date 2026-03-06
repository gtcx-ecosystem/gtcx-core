# @gtcx/types

Canonical TypeScript type definitions shared across the GTCX ecosystem. Types only — no runtime validation.

## Scope

- Core domain models
- Protocol payload types
- API request/response shapes
- Shared error and event types

## Structure

| Path                            | Contents                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| `packages/types/src/models/`    | `lot`, `permit`, `site`, `user`                              |
| `packages/types/src/protocols/` | `gci`, `geotag`, `identity`, `pvp`, `tradepass`, `vaultmark` |
| `packages/types/src/api/`       | API request/response shapes                                  |
| `packages/types/src/common/`    | Shared error and event types                                 |

## Notes

- Types only — runtime validation is handled by `@gtcx/schemas` and `@gtcx/domain`.
- Protocol types map directly to the six GTCX verification protocols.

## References

- `../../../specs/data-models.md`
- `schemas.md`
