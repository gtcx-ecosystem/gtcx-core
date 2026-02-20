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
