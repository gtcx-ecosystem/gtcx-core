# Spec-to-Code Traceability Matrix (gtcx-core)

Maps `SOP/2-docs/2-specs/` to implementation in `packages/*` and `rust/*`.

## Summary by Spec

| Spec                    | Primary Code Areas                                      | Status      | Notes                           |
| ----------------------- | ------------------------------------------------------- | ----------- | ------------------------------- |
| `data-models.md`        | `packages/types`, `packages/schemas`, `packages/domain` | Implemented | Core12 schemas + shared types   |
| `eventcore.md`          | `packages/domain`, `packages/events`                    | Implemented | Domain events + typed event bus |
| `identity-core.md`      | `packages/identity`, `packages/crypto`                  | Implemented | DID creation + document helpers |
| `network-protocol.md`   | `packages/network`                                      | Implemented | TCP/QUIC mesh + libp2p adapter  |
| `security-framework.md` | `packages/crypto`, `packages/security`, `rust/gtcx-zkp` | Implemented | Native crypto + ZKP proofs      |

## Known Full-Spec Gaps

| Capability                | Current Status | Location                            | Notes                                                  |
| ------------------------- | -------------- | ----------------------------------- | ------------------------------------------------------ |
| Native crypto bindings    | Implemented    | `packages/crypto-native`            | Optional backend, enforced via `GTCX_REQUIRE_NATIVE=1` |
| DID resolution backend    | External       | `packages/identity/src/resolver.ts` | Resolver interface; storage/deployment required        |
| ZKP system (TS bridge)    | Partial        | `packages/crypto/src/zkp.ts`        | TS placeholder; Rust provides real proofs              |
| P2P serialization formats | Partial        | `packages/network/src/*`            | JSON only; no CBOR/Protobuf                            |

## References

- `SOP/2-docs/2-specs/`
- `SOP/2-docs/1-architecture/`
- `SOP/2-docs/2-specs/packages/`
