import { describe, expect, it } from 'vitest';

import { ConfigurationError, createP2PNode, InMemoryTransport, RateLimitError } from '../src/index';

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
});
