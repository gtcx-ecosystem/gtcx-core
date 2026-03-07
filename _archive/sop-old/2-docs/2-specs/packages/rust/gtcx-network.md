# gtcx-network (Rust)

libp2p-based transport primitives for the GTCX mesh networking layer. Used by `@gtcx/network` when native transport performance is required.

## Scope

| Responsibility     | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| libp2p transport   | Peer discovery, connection management, stream multiplexing       |
| Mesh topology      | Peer routing and relay support for low-connectivity environments |
| Transport security | Noise protocol for encrypted peer sessions                       |

## TypeScript Relationship

`@gtcx/network` exposes a `TransportAdapter` interface. The `LibP2PTransport` adapter uses `gtcx-network` native bindings when available, otherwise falls back to a JS libp2p implementation.

```
@gtcx/network
  └── LibP2PTransport
        └── gtcx-network (native, optional)
```

## Notes

- Native usage is optional — `@gtcx/network` is fully functional without this crate via JS libp2p.
- This crate provides performance benefits for high-throughput validator nodes and relay nodes.
- The TypeScript in-memory transport (`InMemoryTransport`) does not use this crate at all.

## Status

Active — libp2p transport primitives implemented. Native binding integration with `@gtcx/network` is in progress.

## References

- `SOP/2-docs/2-specs/packages/network.md`
- `SOP/2-docs/2-specs/network-protocol.md`
- `rust/gtcx-network/`
