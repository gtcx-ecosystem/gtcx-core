# @gtcx/network

P2P networking primitives for GTCX validator mesh and edge connectivity.

## Installation

```bash
pnpm add @gtcx/network
```

## Quick Start (In-Memory)

```typescript
import { createP2PNode, InMemoryTransport } from '@gtcx/network';

const nodeA = createP2PNode({ nodeId: 'A' }, new InMemoryTransport('A'));
const nodeB = createP2PNode({ nodeId: 'B' }, new InMemoryTransport('B'));

await nodeA.start();
await nodeB.start();

nodeB.subscribe('updates', (payload) => {
  console.log('received', payload);
});

await nodeA.publish('updates', { status: 'ok' });
```

## Telemetry

```typescript
const node = createP2PNode({ nodeId: 'A' }, new InMemoryTransport('A'), {
  onEvent: (event) => {
    console.log(event.type, event.topic);
  },
});
```

## libp2p (QUIC + gossipsub)

```bash
pnpm add libp2p @libp2p/quic @chainsafe/libp2p-noise @chainsafe/libp2p-gossipsub @libp2p/bootstrap @libp2p/mdns
```

```typescript
import { createP2PNode, createLibp2pTransport } from '@gtcx/network';

const transport = await createLibp2pTransport({
  listenAddresses: ['/ip4/0.0.0.0/udp/0/quic-v1'],
  topics: ['gtcx.mesh'],
  enableMdns: true,
});
const node = createP2PNode({ nodeId: 'validator-1' }, transport);
await node.start();
```

## Topic Allowlist

```typescript
const node = createP2PNode({ nodeId: 'A', topics: ['updates'] }, new InMemoryTransport('A'));
```

## API

| Export                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `createP2PNode`         | Create a P2P node from a transport adapter |
| `InMemoryTransport`     | Local transport adapter for tests and dev  |
| `PeerDiscoveryService`  | Adapter-driven peer discovery service      |
| `PeerReputationManager` | Simple peer reputation scoring             |
| `P2PConfig`             | Node configuration type                    |
| `TransportAdapter`      | Adapter interface for libp2p/mesh backends |

## License

MIT
