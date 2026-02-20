import { ConfigurationError, TransportError } from './errors';
import type { MessageEnvelope, PeerId, PeerInfo, Topic, TransportAdapter } from './types';

export interface Libp2pTransportConfig {
  listenAddresses?: string[];
  bootstrap?: string[];
  topics?: Topic[];
  allowPublishToZeroPeers?: boolean;
  enableMdns?: boolean;
}

interface Libp2pRuntime {
  node: {
    start: () => Promise<void> | void;
    stop: () => Promise<void> | void;
    getPeers?: () => PeerId[];
    getConnections?: () => Array<{ remotePeer?: { toString: () => string } }>;
    services?: { pubsub?: unknown };
  };
  pubsub?: {
    publish: (topic: string, data: Uint8Array) => Promise<unknown>;
    subscribe: (topic: string) => Promise<void> | void;
    addEventListener?: (event: string, handler: (event: unknown) => void) => void;
    removeEventListener?: (event: string, handler: (event: unknown) => void) => void;
  };
}

type FactoryFn<T = unknown> = (...args: any[]) => T;

function resolveFactory<T = unknown>(module: unknown, name: string): FactoryFn<T> {
  const record = module as Record<string, unknown>;
  const candidate = record[name] ?? record['default'] ?? record;
  if (typeof candidate !== 'function') {
    throw new ConfigurationError(`${name} factory not available from module`);
  }
  return candidate as FactoryFn<T>;
}

async function loadLibp2p(config: Libp2pTransportConfig): Promise<Libp2pRuntime> {
  try {
    const [libp2pModule, quicModule, noiseModule, gossipsubModule, identifyModule] =
      await Promise.all([
        import('libp2p'),
        import('@chainsafe/libp2p-quic'),
        import('@chainsafe/libp2p-noise'),
        import('@chainsafe/libp2p-gossipsub'),
        import('@libp2p/identify'),
      ]);

    const createLibp2p = resolveFactory<Promise<Libp2pRuntime['node']>>(
      libp2pModule,
      'createLibp2p'
    );
    const quic = resolveFactory(quicModule, 'quic');
    const noise = resolveFactory(noiseModule, 'noise');
    const gossipsub = resolveFactory(gossipsubModule, 'gossipsub');
    const identify = resolveFactory(identifyModule, 'identify');

    const peerDiscovery: unknown[] = [];
    if (config.bootstrap && config.bootstrap.length > 0) {
      try {
        const bootstrapModule = await import('@libp2p/bootstrap');
        const bootstrap = resolveFactory(bootstrapModule, 'bootstrap');
        peerDiscovery.push(bootstrap({ list: config.bootstrap }));
      } catch (error) {
        throw new ConfigurationError('Bootstrap requires @libp2p/bootstrap');
      }
    }
    if (config.enableMdns) {
      try {
        const mdnsModule = await import('@libp2p/mdns');
        const mdns = resolveFactory(mdnsModule, 'mdns');
        peerDiscovery.push(mdns());
      } catch (error) {
        throw new ConfigurationError('mDNS requires @libp2p/mdns');
      }
    }

    let listenAddresses: unknown[] | undefined = config.listenAddresses
      ? [...config.listenAddresses]
      : undefined;
    if (listenAddresses && listenAddresses.length > 0) {
      try {
        const multiaddrModule = await import('@multiformats/multiaddr');
        const toMultiaddr = resolveFactory(multiaddrModule, 'multiaddr');
        listenAddresses = listenAddresses.map((addr) => toMultiaddr(addr));
      } catch {
        // Fall back to string addresses if multiaddr isn't available.
      }
    }

    const node = await createLibp2p({
      addresses: listenAddresses ? { listen: listenAddresses as any[] } : undefined,
      transports: [quic()],
      connectionEncryption: [noise()],
      peerDiscovery: peerDiscovery.length > 0 ? (peerDiscovery as unknown as any[]) : undefined,
      services: {
        identify: identify(),
        pubsub: gossipsub({
          allowPublishToZeroPeers: config.allowPublishToZeroPeers ?? true,
        }),
      },
    });

    return {
      node,
      pubsub: node.services?.pubsub as Libp2pRuntime['pubsub'],
    };
  } catch (error) {
    const err = error as Error & { code?: string };
    const isMissingDep = err?.code === 'ERR_MODULE_NOT_FOUND';
    const message = isMissingDep
      ? 'libp2p dependencies are missing. Install libp2p, @chainsafe/libp2p-quic, @chainsafe/libp2p-noise, @chainsafe/libp2p-gossipsub.'
      : `libp2p init failed: ${err?.message ?? String(error)}`;
    throw new ConfigurationError(message);
  }
}

function encodeEnvelope(envelope: MessageEnvelope): Uint8Array {
  const text = JSON.stringify(envelope);
  return new TextEncoder().encode(text);
}

function decodeEnvelope(data: Uint8Array): MessageEnvelope | null {
  try {
    const text = new TextDecoder().decode(data);
    return JSON.parse(text) as MessageEnvelope;
  } catch {
    return null;
  }
}

export class Libp2pTransport implements TransportAdapter {
  private handler?: (message: MessageEnvelope) => Promise<void> | void;
  private runtime?: Libp2pRuntime;
  private readonly topics: Topic[];
  private readonly config: Libp2pTransportConfig;

  constructor(config: Libp2pTransportConfig) {
    this.config = config;
    this.topics = config.topics ?? [];
  }

  async start(): Promise<void> {
    this.runtime = await loadLibp2p(this.config);
    await Promise.resolve(this.runtime.node.start());
    if (this.runtime.pubsub) {
      for (const topic of this.topics) {
        await this.runtime.pubsub.subscribe(topic);
      }
      if (this.handler && this.runtime.pubsub.addEventListener) {
        this.runtime.pubsub.addEventListener('message', (event) => this.handleEvent(event));
      }
    }
  }

  async stop(): Promise<void> {
    if (!this.runtime) return;
    await Promise.resolve(this.runtime.node.stop());
  }

  async send(_peerId: PeerId, message: MessageEnvelope): Promise<void> {
    await this.broadcast(message);
  }

  async broadcast(message: MessageEnvelope): Promise<void> {
    if (!this.runtime?.pubsub) {
      throw new TransportError('pubsub service is unavailable');
    }
    await this.runtime.pubsub.publish(message.topic, encodeEnvelope(message));
  }

  onMessage(handler: (message: MessageEnvelope) => Promise<void> | void): void {
    this.handler = handler;
  }

  getPeers(): PeerInfo[] {
    if (!this.runtime) return [];
    const peers = this.runtime.node.getPeers?.() ?? [];
    if (peers.length > 0) {
      return peers.map((peerId) => ({ id: peerId }));
    }
    const connections = this.runtime.node.getConnections?.() ?? [];
    return connections
      .map((conn) => conn.remotePeer?.toString?.())
      .filter(Boolean)
      .map((peerId) => ({ id: peerId as string }));
  }

  private handleEvent(event: unknown): void {
    const detail = (event as { detail?: { data?: Uint8Array; topic?: string } }).detail;
    if (!detail?.data) return;
    const decoded = decodeEnvelope(detail.data);
    if (!decoded) return;
    const envelope =
      detail.topic && decoded.topic !== detail.topic
        ? { ...decoded, topic: detail.topic }
        : decoded;
    this.handler?.(envelope);
  }
}

export async function createLibp2pTransport(
  config: Libp2pTransportConfig
): Promise<Libp2pTransport> {
  const transport = new Libp2pTransport(config);
  await transport.start();
  return transport;
}
