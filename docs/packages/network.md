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

## Architecture Notes

- `TransportAdapter` allows libp2p or mesh backends to be injected.
- `InMemoryTransport` is designed for tests and local simulations.
- Rate limiting is enforced per node to prevent spam.
- Optional topic allowlists prevent unauthorized publish/subscribe.
- `PeerDiscoveryService` aggregates discovery adapters and applies reputation scores.

## Related

- [Network Protocol Spec](../specs/network-protocol.md)
- [@gtcx/connectivity](./connectivity.md)
