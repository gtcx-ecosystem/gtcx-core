import { describe, expect, it, afterEach, vi } from 'vitest';

import {
  MemoryPeerDiscoveryAdapter,
  PeerDiscoveryService,
  PeerReputationManager,
  createP2PNode,
  InMemoryTransport,
} from '../src/index';

describe('network coverage gaps', () => {
  afterEach(() => {
    InMemoryTransport['registry'].clear();
  });

  it('falls back to counter-based messageId when crypto.randomUUID is unavailable', async () => {
    const originalCrypto = globalThis.crypto;
    vi.stubGlobal('crypto', {});

    try {
      const adapter = new InMemoryTransport('fallback');
      const spy = vi.spyOn(adapter, 'broadcast').mockResolvedValue(undefined);
      const node = createP2PNode({ nodeId: 'fallback' }, adapter);
      await node.start();
      await node.publish('topic', 'hello');

      const envelope = spy.mock.calls[0]?.[0];
      expect(envelope.messageId).toMatch(/^msg_\d+_\d+$/);
      await node.stop();
    } finally {
      vi.stubGlobal('crypto', originalCrypto);
    }
  });

  it('drops received messages with ttl <= 0', async () => {
    const adapterA = new InMemoryTransport('A');
    const adapterB = new InMemoryTransport('B');
    const nodeB = createP2PNode({ nodeId: 'B' }, adapterB);
    await nodeB.start();
    const handler = vi.fn();
    nodeB.subscribe('topic', handler);

    await adapterA.send('B', {
      messageId: '1',
      topic: 'topic',
      payload: 'hello',
      timestamp: 1,
      source: 'A',
      hops: ['A'],
      ttl: 0,
    });

    expect(handler).not.toHaveBeenCalled();
    await nodeB.stop();
  });

  it('ignores broadcast messages on unsubscribed topics', async () => {
    const nodeA = createP2PNode({ nodeId: 'A2' }, new InMemoryTransport('A2'));
    const nodeB = createP2PNode({ nodeId: 'B2' }, new InMemoryTransport('B2'));
    await nodeA.start();
    await nodeB.start();
    const handler = vi.fn();
    nodeB.subscribe('other-topic', handler);

    await nodeA.publish('topic', 'hello');
    expect(handler).not.toHaveBeenCalled();
    await nodeA.stop();
    await nodeB.stop();
  });

  it('uses default transport error message when error has empty message', async () => {
    const adapter = new InMemoryTransport('empty-err');
    adapter.broadcast = async () => {
      throw new Error('');
    };

    const node = createP2PNode({ nodeId: 'empty-err' }, adapter);
    await node.start();
    await expect(node.publish('topic', 'payload')).rejects.toThrow('Transport send failed');
    await node.stop();
  });

  it('unsubscribe is safe when called multiple times', async () => {
    const node = createP2PNode({ nodeId: 'U2' }, new InMemoryTransport('U2'));
    await node.start();
    const handler = vi.fn();
    const unsubscribe = node.subscribe('topic', handler);
    unsubscribe();
    unsubscribe();
    await node.stop();
  });

  it('unsubscribe does not remove topic when other handlers exist', async () => {
    const nodeA = createP2PNode({ nodeId: 'U3A' }, new InMemoryTransport('U3A'));
    const nodeB = createP2PNode({ nodeId: 'U3B' }, new InMemoryTransport('U3B'));
    await nodeA.start();
    await nodeB.start();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const unsubscribe1 = nodeB.subscribe('topic', handler1);
    nodeB.subscribe('topic', handler2);
    unsubscribe1();

    await nodeA.publish('topic', 'payload');
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
    await nodeA.stop();
    await nodeB.stop();
  });

  it('start is idempotent when already online', async () => {
    const node = createP2PNode({ nodeId: 'S1' }, new InMemoryTransport('S1'));
    await node.start();
    await node.start();
    expect(node.getStatus()).toBe('online');
    await node.stop();
  });

  it('stop is idempotent when already offline', async () => {
    const node = createP2PNode({ nodeId: 'S2' }, new InMemoryTransport('S2'));
    await node.start();
    await node.stop();
    await node.stop();
    expect(node.getStatus()).toBe('offline');
  });

  it('destroy works when adapter lacks a stop method', async () => {
    const minimalAdapter = {
      start: async () => {},
      send: async () => {},
      broadcast: async () => {},
      onMessage: () => {},
      getPeers: () => [],
    } as unknown as InMemoryTransport;

    const node = createP2PNode({ nodeId: 'D2' }, minimalAdapter);
    await node.start();
    await node.destroy();
  });

  it('discovers peers with undefined reputation scores', async () => {
    const adapter = new MemoryPeerDiscoveryAdapter([
      { id: 'p1', addresses: ['a1'] },
      { id: 'p2', addresses: ['a2'] },
    ]);
    const reputation = new PeerReputationManager();
    const service = new PeerDiscoveryService([adapter], reputation);

    vi.spyOn(reputation, 'getScore').mockReturnValue(undefined as any);

    const peers = await service.discoverPeers();
    expect(peers).toHaveLength(2);
  });
});
