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

  const { createP2PNode, createLibp2pTransport } = network;
  const listenAddress = process.env.GTCX_P2P_LISTEN;
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
    const transportA = await createLibp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });
    const transportB = await createLibp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });
    const transportC = await createLibp2pTransport({
      listenAddresses,
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });

    const nodeA = createP2PNode(
      { nodeId: 'validator-a', topics: ['gtcx.mesh'], rateLimitPerMinute: 1 },
      transportA
    );
    const nodeB = createP2PNode({ nodeId: 'validator-b', topics: ['gtcx.mesh'] }, transportB);
    const nodeC = createP2PNode({ nodeId: 'validator-c', topics: ['gtcx.mesh'] }, transportC);

    const received = [];
    nodeB.subscribe('gtcx.mesh', (payload) => received.push(`B:${payload.message}`));
    nodeC.subscribe('gtcx.mesh', (payload) => received.push(`C:${payload.message}`));

    await nodeA.start();
    await nodeB.start();
    await nodeC.start();

    await sleep(2000);
    await nodeA.publish('gtcx.mesh', { message: 'hello-mesh' });
    await sleep(1000);

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

    console.log('Received before restart:', received.join(', '));

    await nodeB.stop();
    await sleep(1000);
    await nodeB.start();
    await sleep(2000);
    await nodeA.publish('gtcx.mesh', { message: 'after-restart' });
    await sleep(1000);

    console.log('Received after restart:', received.join(', '));

    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
  } catch (error) {
    console.error('Failed to run mesh demo:', error?.message ?? error);
    console.error(
      'Ensure libp2p deps are installed: pnpm add libp2p @chainsafe/libp2p-quic @chainsafe/libp2p-noise @chainsafe/libp2p-gossipsub @libp2p/bootstrap @libp2p/mdns @libp2p/identify'
    );
    process.exit(1);
  }
};

run();
