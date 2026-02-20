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

  try {
    const transportA = await createLibp2pTransport({
      listenAddresses: ['/ip4/0.0.0.0/udp/0/quic-v1'],
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });
    const transportB = await createLibp2pTransport({
      listenAddresses: ['/ip4/0.0.0.0/udp/0/quic-v1'],
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });
    const transportC = await createLibp2pTransport({
      listenAddresses: ['/ip4/0.0.0.0/udp/0/quic-v1'],
      topics: ['gtcx.mesh'],
      enableMdns: true,
    });

    const nodeA = createP2PNode({ nodeId: 'validator-a', topics: ['gtcx.mesh'] }, transportA);
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

    console.log('Received:', received.join(', '));

    await nodeA.stop();
    await nodeB.stop();
    await nodeC.stop();
  } catch (error) {
    console.error('Failed to run mesh demo:', error?.message ?? error);
    console.error(
      'Ensure libp2p deps are installed: pnpm add libp2p @libp2p/quic @chainsafe/libp2p-noise @chainsafe/libp2p-gossipsub @libp2p/bootstrap @libp2p/mdns'
    );
    process.exit(1);
  }
};

run();
