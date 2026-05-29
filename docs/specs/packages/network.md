---
title: "Package Spec — `@gtcx/network`"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

---
title: 'Network'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/network`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

P2P networking layer for the GTCX protocol. Provides a factory-based P2P node (`createP2PNode`), pluggable transport adapters (in-memory for testing, libp2p for production), peer discovery with reputation scoring, and rate-limited publication. Built on libp2p with GossipSub for pubsub messaging, QUIC and TCP transports, mDNS and bootstrap-based peer discovery, NOISE protocol encryption, and Yamux stream multiplexing.

---

## Public API

### P2P Node Factory

| Export                                       | Description                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `createP2PNode(config, adapter, telemetry?)` | Factory: creates a `P2PNode` from a config, transport adapter, and optional telemetry           |
| `P2PNode`                                    | Interface: the running P2P node (start, stop, publish, subscribe, getPeers, getStatus, destroy) |
| `P2PConfig`                                  | Interface: `{ nodeId, maxPeers?, rateLimitPerMinute?, topics? }`                                |
| `NodeStatus`                                 | Type: `'idle' \| 'starting' \| 'online' \| 'stopping' \| 'offline'`                             |
| `PeerId`                                     | Type: `string` — libp2p peer identifier                                                         |
| `PeerInfo`                                   | Interface: `{ id: PeerId; addresses?: string[]; metadata?: Record<string, string> }`            |

### Messaging

| Export               | Description                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `MessageEnvelope<T>` | Interface: typed message with `messageId`, `topic`, `payload`, `timestamp`, `source`, `ttl`, `hops` |
| `Topic`              | Type: `string` — pubsub topic                                                                       |
| `PublishOptions`     | Interface: `{ ttl?: number }`                                                                       |

### Transport Adapters

| Export                          | Description                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `TransportAdapter`              | Interface: pluggable transport contract (start, stop, send, broadcast, onMessage, getPeers)               |
| `InMemoryTransport`             | Class: in-memory transport for testing — static registry of peers                                         |
| `Libp2pTransport`               | Class: full libp2p transport with GossipSub pubsub                                                        |
| `Libp2pTransportConfig`         | Interface: `{ listenAddresses?, bootstrap?, topics?, allowPublishToZeroPeers?, enableMdns?, transport? }` |
| `createLibp2pTransport(config)` | Factory: creates and starts a `Libp2pTransport` instance                                                  |
| `P2PTransportKind`              | Type: `'tcp' \| 'quic'`                                                                                   |

### Peer Discovery

| Export                       | Description                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `PeerDiscoveryService`       | Class: discovers peers through pluggable adapters, scored by reputation                        |
| `PeerReputationManager`      | Class: tracks peer reputation scores (success +1, failure -5, range -100 to 100)               |
| `PeerDiscoveryAdapter`       | Interface: `{ name: string; discover(): Promise<PeerInfo[]> }`                                 |
| `PeerDiscoveryConfig`        | Interface: `{ maxPeers?, peerExchangeEnabled?, dnsEnabled?, mdnsEnabled?, bluetoothEnabled? }` |
| `DiscoveredPeer`             | Interface: extends `PeerInfo` with `lastSeen` and `score`                                      |
| `MemoryPeerDiscoveryAdapter` | Class: in-memory adapter for testing — returns a fixed list of peers                           |

### Telemetry

| Export                  | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `NetworkTelemetryEvent` | Interface: `{ type, timestamp, nodeId, peerId?, topic?, metadata? }` |
| `TelemetryOptions`      | Interface: `{ onEvent?: TelemetryHandler }`                          |
| `TelemetryHandler`      | Type: `(event: NetworkTelemetryEvent) => Promise<void> \| void`      |

### Errors

| Export               | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `P2PError`           | Base error class with `code: P2PErrorCode` and `retryable: boolean` |
| `ConfigurationError` | Invalid node configuration (not retryable)                          |
| `RateLimitError`     | Publication rate limit exceeded (retryable)                         |
| `TransportError`     | Network transport failure (retryable)                               |
| `P2PErrorCode`       | Type: `'RATE_LIMIT' \| 'TRANSPORT' \| 'CONFIG'`                     |

---

## Dependencies (peer, all optional)

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

All libp2p dependencies are declared as optional peer dependencies. The `InMemoryTransport` and `createP2PNode` factory work without any of them installed. The `Libp2pTransport` dynamically imports them at runtime and throws `ConfigurationError` if they are missing.

---

## Rate Limiting

Default publication rate limit: 120 messages per minute per node. Configurable via `P2PConfig.rateLimitPerMinute`. `RateLimitError` is thrown (not swallowed) on limit breach — callers must handle.

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

- [`docs/specs/packages/sync.md`](./sync.md) — sync engine that uses this transport
- [`docs/specs/packages/connectivity.md`](./connectivity.md) — connectivity layer
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
