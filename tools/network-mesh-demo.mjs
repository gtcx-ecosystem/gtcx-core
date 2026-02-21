#!/usr/bin/env node

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  const moduleUrl = new URL('../packages/network/dist/index.mjs', import.meta.url);
  let network;
  try {
    network = await import(moduleUrl.href);
  } catch (error) {
    console.error(
      'Network package is not built. Run: pnpm --filter @gtcx/network build'
    );
    process.exit(1);
  }

  const { createP2PNode, Libp2pTransport } = network;
  const transportKind = process.env.GTCX_P2P_TRANSPORT ?? 'tcp';
  const listenAddress =
    process.env.GTCX_P2P_LISTEN ??
    (transportKind === 'quic'
      ? '/ip4/127.0.0.1/udp/0/quic-v1'
      : '/ip4/127.0.0.1/tcp/0');
  let listenAddresses;
  if (listenAddress) {
    try {
      const multiaddrModule = await import('@multiformats/multiaddr');
      const toMultiaddr = multiaddrModule.multiaddr ?? multiaddrModule.default ?? multiaddrModule;
      if (typeof toMultiaddr !== 'function') {
        throw new Error('multiaddr export is not a function');
      }
      listenAddresses = [toMultiaddr(listenAddress)];
    } catch (error) {
      console.error(
        'Missing @multiformats/multiaddr. Run: pnpm --filter @gtcx/network add -D @multiformats/multiaddr'
      );
      process.exit(1);
    }
  }

  try {
    const transportA = new Libp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
      allowPublishToZeroPeers: true,
      transport: transportKind,
    });
    const nodeA = createP2PNode(
      { nodeId: 'validator-a', topics: ['gtcx.mesh'], rateLimitPerMinute: 10 },
      transportA
    );

    const received = [];
    nodeA.subscribe('gtcx.mesh', () => {});

    await nodeA.start();

    const waitForAddrs = async (transport, maxWaitMs) => {
      const started = Date.now();
      while (Date.now() - started < maxWaitMs) {
        const addrs = transport.getMultiaddrs();
        if (addrs.length > 0) return addrs;
        await sleep(200);
      }
      return [];
    };

    const peerId = transportA.getPeerId?.();
    const rawAddrs = await waitForAddrs(transportA, 8000);
    if (rawAddrs.length === 0) {
      throw new Error('No listen addresses found for bootstrap');
    }
    const bootstrap = rawAddrs.map((addr) => {
      const normalized = addr.replace('/ip4/0.0.0.0/', '/ip4/127.0.0.1/');
      if (!peerId || normalized.includes('/p2p/')) return normalized;
      return `${normalized}/p2p/${peerId}`;
    });

    const transportB = new Libp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
      allowPublishToZeroPeers: true,
      bootstrap,
      transport: transportKind,
    });
    const transportC = new Libp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
      allowPublishToZeroPeers: true,
      bootstrap,
      transport: transportKind,
    });

    const nodeB = createP2PNode({ nodeId: 'validator-b', topics: ['gtcx.mesh'] }, transportB);
    const nodeC = createP2PNode({ nodeId: 'validator-c', topics: ['gtcx.mesh'] }, transportC);

    nodeB.subscribe('gtcx.mesh', (payload) => received.push(`B:${payload.message}`));
    nodeC.subscribe('gtcx.mesh', (payload) => received.push(`C:${payload.message}`));

    console.log('Bootstrap addrs:', bootstrap);

    await nodeB.start();
    await nodeC.start();
    await transportB.connect(bootstrap);
    await transportC.connect(bootstrap);
    await transportA.resubscribe();
    await transportB.resubscribe();
    await transportC.resubscribe();

    const waitForPeers = async (node, minPeers, maxWaitMs) => {
      const started = Date.now();
      while (Date.now() - started < maxWaitMs) {
        if (node.getPeers().length >= minPeers) return true;
        await sleep(500);
      }
      return false;
    };

    const aReady = await waitForPeers(nodeA, 1, 15000);
    const bReady = await waitForPeers(nodeB, 1, 15000);
    const cReady = await waitForPeers(nodeC, 1, 15000);
    console.log('Peer counts:', {
      a: nodeA.getPeers().length,
      b: nodeB.getPeers().length,
      c: nodeC.getPeers().length,
    });
    if (!aReady || !bReady || !cReady) {
      throw new Error('Peers not connected');
    }

    const waitForSubscribers = async (transport, topic, minSubs, maxWaitMs) => {
      const started = Date.now();
      while (Date.now() - started < maxWaitMs) {
        if (transport.getSubscribers?.(topic).length >= minSubs) return true;
        await sleep(500);
      }
      return false;
    };

    const subsReady = await waitForSubscribers(transportA, 'gtcx.mesh', 1, 15000);
    console.log('Subscribers on A:', transportA.getSubscribers?.('gtcx.mesh') ?? []);
    if (!subsReady) {
      throw new Error('No subscribers detected');
    }

    await sleep(2000);

    await sleep(2000);
    const publishWithRetry = async (payload, attempts = 12) => {
      for (let i = 0; i < attempts; i += 1) {
        try {
          await nodeA.publish('gtcx.mesh', payload);
          return true;
        } catch (error) {
          if (String(error?.message ?? error).includes('NoPeersSubscribedToTopic')) {
            await sleep(2000);
            continue;
          }
          throw error;
        }
      }
      return false;
    };

    const published = await publishWithRetry({ message: 'hello-mesh' });
    if (!published) {
      throw new Error('Publish failed: NoPeersSubscribedToTopic');
    }
    await sleep(2000);

    try {
      await nodeA.publish('gtcx.blocked', { message: 'blocked' });
    } catch (error) {
      console.log('Topic ACL enforced:', error?.message ?? error);
    }

    try {
      await nodeA.publish('gtcx.mesh', { message: 'rate-limit' });
    } catch (error) {
      console.log('Rate limit enforced:', error?.message ?? error);
    }

    if (!received.some((entry) => entry.startsWith('B:') || entry.startsWith('C:'))) {
      throw new Error('No peer received the initial message');
    }
    console.log('Received before restart:', received.join(', '));

    await nodeB.stop();
    await sleep(1000);
    await nodeB.start();
    await sleep(2000);
    await nodeA.publish('gtcx.mesh', { message: 'after-restart' });
    await sleep(1000);

    if (!received.some((entry) => entry.includes('after-restart'))) {
      throw new Error('No peer received the post-restart message');
    }
    console.log('Received after restart:', received.join(', '));

    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
    await transportA.stop();
    await transportB.stop();
    await transportC.stop();
  } catch (error) {
    console.error('Failed to run mesh demo:', error?.message ?? error);
    console.error(
      'Ensure libp2p deps are installed: pnpm add libp2p @libp2p/tcp @chainsafe/libp2p-quic @chainsafe/libp2p-noise @chainsafe/libp2p-gossipsub @libp2p/bootstrap @libp2p/mdns @libp2p/identify'
    );
    process.exit(1);
  }
};

run();
