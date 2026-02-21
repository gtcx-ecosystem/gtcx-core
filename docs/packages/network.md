# @gtcx/network

P2P networking primitives for the GTCX mesh. Provides a transport‑agnostic node API plus a libp2p transport adapter.

## Scope

- `createP2PNode` lifecycle + publish/subscribe
- `InMemoryTransport` for tests
- `createLibp2pTransport` for TCP/QUIC mesh
- Peer discovery utilities
- Network telemetry events

## Quick Start (In‑Memory)

```ts
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

## libp2p Adapter

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

- `docs/specs/network-protocol.md`
- `packages/network/src/libp2p.ts`
