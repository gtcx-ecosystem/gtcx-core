# Quickstart: First GTCX Core Integration

**Time to complete:** 15 minutes

This guide shows a minimal local integration using only packages in this repo.

## 1. Install Dependencies

```bash
pnpm add @gtcx/crypto @gtcx/identity @gtcx/events @gtcx/network
```

## 2. Create an Identity + DID

```ts
import { createIdentity, createDID, createDIDDocument } from '@gtcx/identity';

const { identity, privateKey } = await createIdentity({
  securityLevel: 'standard',
  metadata: { userRole: 'operator' },
});

const did = createDID(identity);
const didDoc = createDIDDocument(identity);

console.log(did);
console.log(didDoc);
```

## 3. Sign and Verify a Payload

```ts
import { sign, verify } from '@gtcx/crypto';

const message = new TextEncoder().encode('hello gtcx');
const signature = sign(message, privateKey);
const ok = verify(signature, message, identity.publicKey);

console.log({ ok });
```

## 4. Emit a Domain Event

```ts
import { TypedEventBus } from '@gtcx/events';
import { DomainEventFactory } from '@gtcx/domain';

const bus = new TypedEventBus();
const factory = new DomainEventFactory();

bus.onAny((event) => console.log(event.type, event.payload));

bus.emit(
  factory.registrationStarted({
    sessionId: 'session-1',
    commodityType: 'gold',
    producerId: 'producer-1',
  })
);
```

## 5. Send a P2P Message (In‑Memory)

```ts
import { createP2PNode, InMemoryTransport } from '@gtcx/network';

const nodeA = createP2PNode({ nodeId: 'A' }, new InMemoryTransport('A'));
const nodeB = createP2PNode({ nodeId: 'B' }, new InMemoryTransport('B'));

await nodeA.start();
await nodeB.start();

nodeB.subscribe('gtcx.updates', (payload) => {
  console.log('received', payload);
});

await nodeA.publish('gtcx.updates', { status: 'ok' });
```

## Next Steps

- Review `docs/specs/*` for system‑level specs.
- Review `docs/packages/*` for package‑level APIs.
