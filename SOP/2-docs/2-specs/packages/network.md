# @gtcx/network

P2P networking primitives for the GTCX validator mesh. Transport-agnostic node API with in-memory and libp2p adapters.

## Scope

- `createP2PNode` lifecycle and publish/subscribe API
- `InMemoryTransport` for local development and testing
- `createLibp2pTransport` for TCP/QUIC mesh transport
- Peer discovery utilities
- Network telemetry events

## Quick Start — In-Memory

```ts
import { createP2PNode, InMemoryTransport } from '@gtcx/network';

const nodeA = createP2PNode({ nodeId: 'A' }, new InMemoryTransport('A'));
const nodeB = createP2PNode({ nodeId: 'B' }, new InMemoryTransport('B'));

await nodeA.start();
await nodeB.start();

nodeB.subscribe('gtcx.updates', (payload) => console.log('received', payload));
await nodeA.publish('gtcx.updates', { status: 'ok' });
```

## libp2p Adapter (TCP / QUIC)

```ts
import { createP2PNode, createLibp2pTransport } from '@gtcx/network';

const transport = await createLibp2pTransport({
  transport: 'quic',
  listenAddresses: ['/ip4/127.0.0.1/udp/0/quic-v1'],
  topics: ['gtcx.mesh'],
  enableMdns: true,
});

const node = createP2PNode({ nodeId: 'validator-1' }, transport);
await node.start();
```

## References

- `../../../specs/network-protocol.md`
- `packages/network/src/libp2p.ts`
