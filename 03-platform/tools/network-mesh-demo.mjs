#!/usr/bin/env node

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async (predicate, timeoutMs, intervalMs = 250) => {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await predicate()) return true;
    await sleep(intervalMs);
  }
  return false;
};

const run = async () => {
  const moduleUrl = new URL('../03-platform/packages/network/dist/index.mjs', import.meta.url);
  let network;
  try {
    network = await import(moduleUrl.href);
  } catch (error) {
    console.error('Network package is not built. Run: pnpm --filter @gtcx/network build');
    process.exit(1);
  }

  const { createP2PNode, Libp2pTransport } = network;
  const transportKind = process.env.GTCX_P2P_TRANSPORT ?? 'tcp';
  const listenAddress =
    process.env.GTCX_P2P_LISTEN ??
    (transportKind === 'quic' ? '/ip4/127.0.0.1/udp/0/quic-v1' : '/ip4/127.0.0.1/tcp/0');
  const listenAddresses = listenAddress ? [listenAddress] : undefined;

  try {
    const transportA = new Libp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
      allowPublishToZeroPeers: true,
      transport: transportKind,
    });
    const nodeA = createP2PNode(
      { nodeId: 'validator-a', topics: ['gtcx.mesh'], rateLimitPerMinute: 2 },
      transportA
    );

    const received = [];
    nodeA.subscribe('gtcx.mesh', () => {});

    await nodeA.start();

    const bootstrapReady = await waitFor(
      () => (transportA.getMultiaddrs?.() ?? []).length > 0,
      8000
    );
    if (!bootstrapReady) {
      throw new Error('No listen addresses found for bootstrap');
    }

    const peerId = transportA.getPeerId?.();
    const bootstrap = (transportA.getMultiaddrs?.() ?? []).map((addr) => {
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

    const peersReady = await waitFor(
      () =>
        nodeA.getPeers().length >= 1 &&
        nodeB.getPeers().length >= 1 &&
        nodeC.getPeers().length >= 1,
      15000,
      500
    );
    if (!peersReady) {
      throw new Error('Peers not connected');
    }

    const subsReady = await waitFor(
      () => (transportA.getSubscribers?.('gtcx.mesh') ?? []).length >= 1,
      15000,
      500
    );
    if (!subsReady) {
      console.warn('No subscribers detected yet; continuing to publish test.');
    }

    const publishWithRetry = async (payload, attempts = 6) => {
      for (let i = 0; i < attempts; i += 1) {
        try {
          await nodeA.publish('gtcx.mesh', payload);
          return true;
        } catch (error) {
          if (String(error?.message ?? error).includes('NoPeersSubscribedToTopic')) {
            await sleep(1000);
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

    await sleep(1500);

    try {
      await nodeA.publish('gtcx.blocked', { message: 'blocked' });
    } catch (error) {
      console.log('Topic ACL enforced:', error?.message ?? error);
    }

    if (!received.some((entry) => entry.startsWith('B:') || entry.startsWith('C:'))) {
      throw new Error('No peer received the initial message');
    }
    console.log('Received before restart:', received.join(', '));

    await nodeB.stop();
    await sleep(1000);
    await nodeB.start();
    await transportB.connect(bootstrap);
    await transportB.resubscribe();
    await waitFor(() => nodeB.getPeers().length >= 1, 15000, 500);

    await nodeA.publish('gtcx.mesh', { message: 'after-restart' });
    await sleep(3000);

    if (!received.some((entry) => entry.includes('after-restart'))) {
      throw new Error('No peer received the post-restart message');
    }
    console.log('Received after restart:', received.join(', '));

    try {
      await nodeA.publish('gtcx.mesh', { message: 'rate-limit' });
    } catch (error) {
      console.log('Rate limit enforced:', error?.message ?? error);
    }

    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
  } catch (error) {
    console.error('Failed to run mesh demo:', error?.message ?? error);
    console.error(
      'Ensure libp2p deps are installed: pnpm add libp2p @libp2p/tcp @chainsafe/libp2p-yamux @chainsafe/libp2p-quic @chainsafe/libp2p-noise @chainsafe/libp2p-gossipsub @libp2p/bootstrap @libp2p/mdns @libp2p/identify'
    );
    process.exit(1);
  }
};

run();
