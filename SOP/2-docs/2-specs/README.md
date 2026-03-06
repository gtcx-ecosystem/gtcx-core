# Specifications — gtcx-core

Canonical system and package specifications for `gtcx-core`. This is the source of truth for what the repo does, how its components behave, and what contracts downstream repos depend on.

## System Specs

| File                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `core-spec.md`        | Top-level system specification — purpose, scope, NFRs        |
| `data-models.md`      | Canonical data models and schema ownership                   |
| `identity-core.md`    | DID + credential model for GTCX participants                 |
| `network-protocol.md` | P2P mesh protocol — envelope, node API, transport adapters   |
| `eventcore.md`        | Domain event model — envelope, event types, schema evolution |

## Package Specs

See `packages/README.md` for the per-package specification index covering all 18 TypeScript packages and 6 Rust crates.
