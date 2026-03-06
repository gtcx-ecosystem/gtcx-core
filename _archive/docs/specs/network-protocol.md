# Network Protocol (P2P Mesh)

**Status**: Active (2026-02-21)

This document captures the implemented network protocol surface in `@gtcx/network`. It describes the message envelope, node behavior, and transport adapters used today.

## Purpose

- Provide a transport‑agnostic P2P API for GTCX services.
- Support offline-first mesh behavior with rate limits and topic allowlists.
- Emit telemetry events for observability.

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

The `createP2PNode` factory composes a node with a transport adapter:

- `start()` / `stop()` lifecycle
- `publish(topic, payload, { ttl? })`
- `subscribe(topic, handler)`
- `getPeers()` / `getStatus()`

## Transport Adapters (Current)

- **In‑memory** adapter for local development.
- **libp2p** adapter for real mesh transport.
  - Supports TCP and QUIC.
  - Uses gossipsub for pub/sub.
  - Emits discovery and peer error telemetry.

The mesh demo is run with:

```
GTCX_P2P_TRANSPORT=quic pnpm --filter @gtcx/network build && pnpm network:mesh:demo
```

## Controls and Constraints

- **Rate limiting**: per‑node publish rate limit (default 120/min).
- **Topic allowlist**: `P2PConfig.topics` restricts publish/subscribe.
- **TTL**: messages drop when TTL is exhausted.

## Telemetry

`NetworkTelemetryEvent` emits `p2p.start`, `p2p.stop`, `p2p.publish`, `p2p.receive`, `p2p.rate_limited`, `p2p.peer_discovered`, `p2p.peer_error`.

## Non‑Goals (Current)

- No global tier routing spec or consensus protocol in this repo.
- No formal QoS guarantees beyond rate limiting + TTL.

## References

- `docs/packages/network.md`
- `packages/network/src/types.ts`
- `packages/network/src/libp2p.ts`
