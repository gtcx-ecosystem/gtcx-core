import { describe, expect, it } from 'vitest';

import {
  ConfigurationError,
  MemoryPeerDiscoveryAdapter,
  PeerDiscoveryService,
  PeerReputationManager,
  createLibp2pTransport,
  createP2PNode,
  InMemoryTransport,
  RateLimitError,
} from '../src/index';

describe('@gtcx/network', () => {
  it('delivers messages across in-memory peers', async () => {
    const nodeA = createP2PNode({ nodeId: 'A' }, new InMemoryTransport('A'));
    const nodeB = createP2PNode({ nodeId: 'B' }, new InMemoryTransport('B'));
    const nodeC = createP2PNode({ nodeId: 'C' }, new InMemoryTransport('C'));

    await nodeA.start();
    await nodeB.start();
    await nodeC.start();

    const received: string[] = [];
    nodeB.subscribe<string>('topic', (payload) => received.push(`B:${payload}`));
    nodeC.subscribe<string>('topic', (payload) => received.push(`C:${payload}`));

    await nodeA.publish('topic', 'hello');

    expect(received.sort()).toEqual(['B:hello', 'C:hello']);

    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
  });

  it('emits telemetry events for publish and receive', async () => {
    const events: string[] = [];
    const nodeA = createP2PNode({ nodeId: 'TA' }, new InMemoryTransport('TA'), {
      onEvent: (event) => events.push(event.type),
    });
    const nodeB = createP2PNode({ nodeId: 'TB' }, new InMemoryTransport('TB'), {
      onEvent: (event) => events.push(event.type),
    });

    await nodeA.start();
    await nodeB.start();

    nodeB.subscribe<string>('topic', () => {});
    await nodeA.publish('topic', 'payload');

    expect(events).toContain('p2p.publish');
    expect(events).toContain('p2p.receive');

    await nodeA.stop();
    await nodeB.stop();
  });

  it('enforces publish rate limits', async () => {
    const node = createP2PNode({ nodeId: 'R', rateLimitPerMinute: 1 }, new InMemoryTransport('R'));
    await node.start();
    await node.publish('topic', 'first');
    await expect(node.publish('topic', 'second')).rejects.toBeInstanceOf(RateLimitError);
    await node.stop();
  });

  it('handles node drop and recovery', async () => {
    const nodeA = createP2PNode({ nodeId: 'A2' }, new InMemoryTransport('A2'));
    const nodeB = createP2PNode({ nodeId: 'B2' }, new InMemoryTransport('B2'));

    await nodeA.start();
    await nodeB.start();

    const received: string[] = [];
    nodeB.subscribe<string>('topic', (payload) => received.push(payload));

    await nodeB.stop();
    await nodeA.publish('topic', 'missed');
    expect(received).toEqual([]);

    await nodeB.start();
    await nodeA.publish('topic', 'back');
    expect(received).toEqual(['back']);

    await nodeA.stop();
    await nodeB.stop();
  });

  it('enforces topic allowlist', async () => {
    const node = createP2PNode({ nodeId: 'T', topics: ['allowed'] }, new InMemoryTransport('T'));
    await node.start();

    expect(() => node.subscribe('forbidden', () => {})).toThrow(ConfigurationError);
    await expect(node.publish('forbidden', 'payload')).rejects.toBeInstanceOf(ConfigurationError);

    await node.stop();
  });

  it('discovers peers via adapters and applies reputation scores', async () => {
    const reputation = new PeerReputationManager();
    reputation.recordSuccess('peer-1');
    reputation.recordFailure('peer-2');

    const adapter = new MemoryPeerDiscoveryAdapter([
      { id: 'peer-1', addresses: ['addr-1'] },
      { id: 'peer-2', addresses: ['addr-2'] },
    ]);
    const discoveredEvents: string[] = [];
    const service = new PeerDiscoveryService([adapter], reputation, { maxPeers: 10 }, (peer) => {
      discoveredEvents.push(peer.id);
    });

    const discovered = await service.discoverPeers();
    expect(discovered).toHaveLength(2);
    expect(discovered[0]?.id).toBe('peer-1');
    expect(discovered[0]?.score).toBeGreaterThan(discovered[1]?.score ?? 0);
    expect(discoveredEvents).toEqual(['peer-1', 'peer-2']);
  });

  it('throws configuration error when libp2p dependencies are missing', async () => {
    await expect(createLibp2pTransport({})).rejects.toBeInstanceOf(ConfigurationError);
  });
});
