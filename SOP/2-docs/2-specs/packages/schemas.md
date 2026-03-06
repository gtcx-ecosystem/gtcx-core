# @gtcx/schemas

Runtime schema definitions for the Core12 compliance framework. Provides typed domain and control structures with lookup helpers.

## Scope

- Core12 domain and control definitions
- Lookup helpers for compliance logic and verification packages

## Key Exports (`packages/schemas/src/index.ts`)

| Export                  | Description                            |
| ----------------------- | -------------------------------------- |
| `CORE12_DOMAINS`        | Full dataset of Core12 domains         |
| `getDomain(domainId)`   | Look up a domain by ID                 |
| `getControl(controlId)` | Look up a control by ID                |
| `getAllControls()`      | Return all controls across all domains |
| `Domain`                | Domain type                            |
| `Control`               | Control type                           |
| `FrameworkMapping`      | Framework-to-control mapping type      |

## Notes

- Core12 schema IDs are stable — breaking ID changes require ecosystem coordination.
- These definitions are the authoritative source for compliance and verification packages.

## References

- `../../../specs/data-models.md`
- `types.md`
