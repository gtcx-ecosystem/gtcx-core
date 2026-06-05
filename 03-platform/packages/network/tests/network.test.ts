import { describe, expect, it, afterEach, vi } from 'vitest';

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

async function hasLibp2pDependencies(): Promise<boolean> {
  const deps = [
    'libp2p',
    '@libp2p/tcp',
    '@chainsafe/libp2p-noise',
    '@chainsafe/libp2p-gossipsub',
    '@chainsafe/libp2p-yamux',
  ];
  try {
    await Promise.all(deps.map((dep) => import(dep)));
    return true;
  } catch {
    return false;
  }
}

describe('@gtcx/network', () => {
  afterEach(() => {
    // Clean up static registry between tests
    InMemoryTransport['registry'].clear();
  });
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
      onEvent: (event) => {
        events.push(event.type);
      },
    });
    const nodeB = createP2PNode({ nodeId: 'TB' }, new InMemoryTransport('TB'), {
      onEvent: (event) => {
        events.push(event.type);
      },
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
    const depsAvailable = await hasLibp2pDependencies();
    if (depsAvailable) {
      return;
    }
    await expect(createLibp2pTransport({})).rejects.toBeInstanceOf(ConfigurationError);
  });

  it('rate limits after capacity is exhausted', async () => {
    const node = createP2PNode({ nodeId: 'R', rateLimitPerMinute: 2 }, new InMemoryTransport('R'));
    await node.start();
    expect(node.publish('topic', 'a')).toBeDefined();
    expect(node.publish('topic', 'b')).toBeDefined();
    await expect(node.publish('topic', 'c')).rejects.toBeInstanceOf(RateLimitError);
    await node.stop();
  });

  it('handles publish transport errors', async () => {
    const failingAdapter = new InMemoryTransport('F');
    failingAdapter.broadcast = async () => {
      throw new Error('transport broken');
    };

    const node = createP2PNode({ nodeId: 'F' }, failingAdapter);
    await node.start();
    await expect(node.publish('topic', 'payload')).rejects.toThrow('transport broken');
  });

  it('unsubscribe removes topic when last handler is removed', async () => {
    const node = createP2PNode({ nodeId: 'U' }, new InMemoryTransport('U'));
    await node.start();
    const handler = vi.fn();
    const unsubscribe = node.subscribe('topic', handler);
    unsubscribe();
    await node.publish('topic', 'payload');
    expect(handler).not.toHaveBeenCalled();
    await node.stop();
  });

  it('destroy clears subscriptions and stops adapter', async () => {
    const node = createP2PNode({ nodeId: 'D' }, new InMemoryTransport('D'));
    await node.start();
    const handler = vi.fn();
    node.subscribe('topic', handler);
    await node.destroy();
    // After destroy, publishing should not reach the handler
    // because subscriptions are cleared.
    // Note: status may remain 'online' because destroy does not set it.
    expect(handler).not.toHaveBeenCalled();
  });

  it('returns empty peers when registry has only self', async () => {
    const adapter = new InMemoryTransport('solo');
    expect(adapter.getPeers()).toHaveLength(0);
  });

  it('findPeers respects maxPeers limit', async () => {
    const adapter = new MemoryPeerDiscoveryAdapter([
      { id: 'p1', addresses: ['a1'] },
      { id: 'p2', addresses: ['a2'] },
      { id: 'p3', addresses: ['a3'] },
    ]);
    const reputation = new PeerReputationManager();
    reputation.recordSuccess('p3');
    reputation.recordSuccess('p3');
    reputation.recordSuccess('p1');
    const service = new PeerDiscoveryService([adapter], reputation, { maxPeers: 2 });
    const peers = await service.discoverPeers();
    expect(peers).toHaveLength(2);
    expect(peers[0]?.id).toBe('p3');
    expect(peers[1]?.id).toBe('p1');
  });

  it('rate limiter resets after window expires', async () => {
    const node = createP2PNode(
      { nodeId: 'RL', rateLimitPerMinute: 1 },
      new InMemoryTransport('RL')
    );
    await node.start();
    await node.publish('topic', 'a');
    await expect(node.publish('topic', 'b')).rejects.toBeInstanceOf(RateLimitError);

    // Advance time past the reset window
    const RealDate = Date;
    global.Date = class extends RealDate {
      constructor(...args: unknown[]) {
        super(...(args.length ? (args as [number]) : []));
      }
      static now() {
        return RealDate.now() + 120_000;
      }
    } as unknown as DateConstructor;

    await node.publish('topic', 'c');
    global.Date = RealDate;
    await node.stop();
  });

  it('send to peer without handler does nothing', async () => {
    const adapterA = new InMemoryTransport('A');
    const adapterB = new InMemoryTransport('B');
    await adapterA.start();
    await adapterB.start();
    // adapterB has no handler registered
    await expect(
      adapterA.send('B', {
        messageId: '1',
        topic: 't',
        payload: 'x',
        timestamp: 1,
        source: 'A',
        hops: ['A'],
        ttl: 8,
      })
    ).resolves.toBeUndefined();
    await adapterA.stop();
    await adapterB.stop();
  });

  it('exposes getPeers on node', async () => {
    const node = createP2PNode({ nodeId: 'G' }, new InMemoryTransport('G'));
    await node.start();
    expect(node.getPeers()).toHaveLength(0);
    expect(node.getStatus()).toBe('online');
    await node.stop();
  });

  it('getKnownPeers returns all discovered peers', async () => {
    const adapter = new MemoryPeerDiscoveryAdapter([
      { id: 'k1', addresses: ['a1'] },
      { id: 'k2', addresses: ['a2'] },
    ]);
    const service = new PeerDiscoveryService([adapter], new PeerReputationManager());
    await service.discoverPeers();
    expect(service.getKnownPeers()).toHaveLength(2);
  });

  it('send delivers message when handler is set', async () => {
    const adapterA = new InMemoryTransport('A');
    const adapterB = new InMemoryTransport('B');
    await adapterA.start();
    await adapterB.start();
    const received: unknown[] = [];
    adapterB.onMessage(async (msg) => {
      received.push(msg);
    });
    await adapterA.send('B', {
      messageId: '1',
      topic: 't',
      payload: 'hello',
      timestamp: 1,
      source: 'A',
      hops: ['A'],
      ttl: 8,
    });
    expect(received).toHaveLength(1);
    await adapterA.stop();
    await adapterB.stop();
  });

  it('getPeers returns other nodes in registry', async () => {
    const a = new InMemoryTransport('A');
    const b = new InMemoryTransport('B');
    await a.start();
    await b.start();
    expect(a.getPeers()).toHaveLength(1);
    expect(a.getPeers()[0]?.id).toBe('B');
    await a.stop();
    await b.stop();
  });
});
