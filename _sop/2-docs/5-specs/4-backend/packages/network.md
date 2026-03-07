# Package Spec — `@gtcx/network`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

P2P networking layer for the GTCX protocol. Built on libp2p with GossipSub for pubsub messaging, QUIC and TCP transports, mDNS and bootstrap-based peer discovery, and NOISE protocol encryption. Provides the typed message envelope and rate-limited publication primitives used by the validator and edge node implementations.

---

## Public API

### P2P Node

| Export       | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `P2PNode`    | Interface: the running libp2p node                                         |
| `P2PConfig`  | Type: node configuration — transports, peer discovery, pubsub, rate limits |
| `NodeStatus` | Type: node lifecycle status                                                |
| `PeerId`     | Type: libp2p peer identifier                                               |
| `PeerInfo`   | Type: peer metadata                                                        |

### Messaging

| Export             | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `MessageEnvelope`  | Type: typed message with topic, payload, sender, TTL   |
| `Topic`            | Type: pubsub topic string                              |
| `PublishOptions`   | Type: publication options — TTL, priority              |
| `TransportAdapter` | Interface: pluggable transport (QUIC, TCP, WebSockets) |

### Peer Discovery

| Export                   | From                                  |
| ------------------------ | ------------------------------------- |
| `peer-discovery` exports | mDNS local + bootstrap node discovery |

### Telemetry

| Export                  | Description                      |
| ----------------------- | -------------------------------- |
| `NetworkTelemetryEvent` | Type: structured telemetry event |
| `TelemetryOptions`      | Type: telemetry configuration    |

### Errors

| Export               | Description                     |
| -------------------- | ------------------------------- |
| `ConfigurationError` | Invalid node configuration      |
| `RateLimitError`     | Publication rate limit exceeded |
| `TransportError`     | Network transport failure       |

---

## Dependencies (npm)

| Dependency                    | Role                         |
| ----------------------------- | ---------------------------- |
| `libp2p`                      | P2P networking foundation    |
| `@chainsafe/libp2p-gossipsub` | GossipSub pubsub protocol    |
| `@chainsafe/libp2p-noise`     | NOISE encryption handshake   |
| `@chainsafe/libp2p-quic`      | QUIC transport               |
| `@chainsafe/libp2p-yamux`     | Stream multiplexer           |
| `@libp2p/bootstrap`           | Bootstrap peer discovery     |
| `@libp2p/identify`            | Peer identification protocol |
| `@libp2p/mdns`                | Local peer discovery         |
| `@libp2p/tcp`                 | TCP transport                |
| `@multiformats/multiaddr`     | Multiaddr encoding           |

---

## Rate Limiting

Default publication rate limit: 120 messages per minute per topic. Configurable via `P2PConfig`. `RateLimitError` is thrown (not swallowed) on limit breach — callers must handle.

Message TTL default: 8 hops.

---

## Non-Goals

- Does not implement sync logic — that is `@gtcx/sync`
- Does not manage connectivity detection — that is `@gtcx/connectivity`
- Does not encrypt message payloads — transport encryption (NOISE) is provided; payload-level encryption is a caller responsibility

---

## Implementation

`packages/network/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/sync.md`](./sync.md) — sync engine that uses this transport
- [`_sop/2-docs/5-specs/4-backend/packages/connectivity.md`](./connectivity.md) — connectivity layer
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
