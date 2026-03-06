# gtcx-consensus (Rust)

Consensus engine foundations for GTCX validator nodes. Provides the primitives needed for validator agreement on credential state, event ordering, and proof validity.

## Scope

| Responsibility        | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| Validator agreement   | Consensus protocol primitives for credential and event finality |
| Event ordering        | Deterministic ordering of signed events across validator nodes  |
| Proof validity voting | Multi-validator agreement on ZKP verification outcomes          |

## Status

Planned — consensus engine foundations implemented in Rust. TypeScript integration with validator workflows is planned (not yet active).

## Planned TypeScript Integration

When active, this crate will integrate with:

- `@gtcx/events` — for event ordering and finality confirmation
- `@gtcx/verification` — for multi-validator proof acceptance

## Notes

- No TypeScript binding exists yet — this crate is not accessible from Node.js.
- Consensus semantics (BFT threshold, quorum size) are not yet finalized — subject to ADR before integration.
- Validator deployment architecture is described in `SOP/2-docs/3-engineering/guides/validator-deployment.md`.

## References

- `SOP/2-docs/2-specs/packages/events.md`
- `SOP/2-docs/2-specs/packages/verification.md`
- `SOP/2-docs/3-engineering/guides/validator-deployment.md`
- `rust/gtcx-consensus/`
