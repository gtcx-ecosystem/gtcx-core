# Network Protocol — P2P Mesh

**Status**: Active
**Last reviewed**: 2026-02-21

Describes the P2P network protocol surface implemented in `@gtcx/network`. Covers the message envelope, node API, transport adapters, and operational constraints.

## Purpose

- Provide a transport-agnostic P2P API for GTCX services.
- Support offline-first mesh behavior with rate limiting and topic allowlists.
- Emit structured telemetry for observability.

## Message Envelope

Defined in `packages/network/src/types.ts`:

```ts
export interface MessageEnvelope<T = unknown> {
  messageId: string;
  topic: string;
  payload: T;
  timestamp: number; // Unix ms
  source: string; // PeerId
  ttl: number;
  hops: string[]; // PeerId path
}
```

## Node API

The `createP2PNode` factory composes a node with an injected transport adapter:

| Method                           | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `start()` / `stop()`             | Node lifecycle                                |
| `publish(topic, payload, opts?)` | Publish to a topic with optional TTL override |
| `subscribe(topic, handler)`      | Register a message handler                    |
| `getPeers()`                     | List currently connected peers                |
| `getStatus()`                    | Node health and connectivity state            |

## Transport Adapters

| Adapter             | Use case                                        |
| ------------------- | ----------------------------------------------- |
| `InMemoryTransport` | Local development and testing                   |
| `LibP2PTransport`   | Real mesh — TCP and QUIC via libp2p + gossipsub |

libp2p adapter emits peer discovery and peer error telemetry events.

Run the mesh demo:

```bash
GTCX_P2P_TRANSPORT=quic pnpm --filter @gtcx/network build && pnpm network:mesh:demo
```

## Operational Constraints

| Constraint      | Default                             |
| --------------- | ----------------------------------- |
| Rate limit      | 120 publishes/minute per node       |
| Topic allowlist | Configured via `P2PConfig.topics`   |
| TTL enforcement | Messages dropped when TTL exhausted |

## Telemetry Events

`NetworkTelemetryEvent` emits the following event types:

`p2p.start`, `p2p.stop`, `p2p.publish`, `p2p.receive`, `p2p.rate_limited`, `p2p.peer_discovered`, `p2p.peer_error`

See `../operations/runbooks/telemetry-schema.md` for the full telemetry field spec.

## Non-Goals

- No global tier routing or consensus protocol in this repo.
- No formal QoS guarantees beyond rate limiting and TTL.

## References

- `packages/network.md`
- `packages/network/src/types.ts`
- `packages/network/src/libp2p.ts`
