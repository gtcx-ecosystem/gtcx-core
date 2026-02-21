import { ConfigurationError, TransportError } from './errors';
import type {
  MessageEnvelope,
  PeerId,
  PeerInfo,
  Topic,
  TransportAdapter,
  P2PTransportKind,
} from './types';

export interface Libp2pTransportConfig {
  listenAddresses?: string[];
  bootstrap?: string[];
  topics?: Topic[];
  allowPublishToZeroPeers?: boolean;
  enableMdns?: boolean;
  transport?: P2PTransportKind;
}

interface Libp2pRuntime {
  node: {
    start: () => Promise<void> | void;
    stop: () => Promise<void> | void;
    peerId?: { toString: () => string };
    peerStore?: { get: (peerId: unknown) => Promise<{ protocols?: string[] }> };
    getPeers?: () => PeerId[];
    getMultiaddrs?: () => Array<{ toString: () => string }>;
    dial?: (address: unknown) => Promise<void>;
    getConnections?: () => Array<{
      remotePeer?: { toString: () => string };
      multiplexer?: string;
      encryption?: string;
      direction?: string;
      status?: string;
    }>;
    getProtocols?: (peerId?: PeerId) => Promise<string[]> | string[];
    services?: { pubsub?: unknown };
  };
  pubsub?: {
    publish: (topic: string, data: Uint8Array) => Promise<unknown>;
    subscribe: (topic: string) => Promise<void> | void;
    getPeers?: () => Array<{ toString?: () => string } | string>;
    getSubscribers?: (topic: string) => Array<{ toString?: () => string } | string>;
    getTopics?: () => string[];
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
    const [libp2pModule, noiseModule, gossipsubModule, identifyModule, yamuxModule] =
      await Promise.all([
        import('libp2p'),
        import('@chainsafe/libp2p-noise'),
        import('@chainsafe/libp2p-gossipsub'),
        import('@libp2p/identify'),
        import('@chainsafe/libp2p-yamux'),
      ]);

    const transportKind: P2PTransportKind = config.transport ?? 'tcp';
    const transportModule =
      transportKind === 'tcp'
        ? await import('@libp2p/tcp')
        : await import('@chainsafe/libp2p-quic');

    const createLibp2p = resolveFactory<Promise<Libp2pRuntime['node']>>(
      libp2pModule,
      'createLibp2p'
    );
    const noise = resolveFactory(noiseModule, 'noise');
    const gossipsub = resolveFactory(gossipsubModule, 'gossipsub');
    const identify = resolveFactory(identifyModule, 'identify');
    const yamux = resolveFactory(yamuxModule, 'yamux');
    const transportFactory =
      transportKind === 'tcp'
        ? resolveFactory(transportModule, 'tcp')
        : resolveFactory(transportModule, 'quic');

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
      const needsCoercion = listenAddresses.some(
        (addr) =>
          typeof addr === 'string' ||
          typeof (addr as { nodeAddress?: unknown })?.nodeAddress !== 'function'
      );
      if (needsCoercion) {
        try {
          const multiaddrModule = await import('@multiformats/multiaddr');
          const toMultiaddr = resolveFactory(multiaddrModule, 'multiaddr');
          listenAddresses = listenAddresses.map((addr) => {
            if (typeof addr === 'string') {
              return toMultiaddr(addr);
            }
            if (typeof (addr as { nodeAddress?: unknown })?.nodeAddress !== 'function') {
              return toMultiaddr(String(addr));
            }
            return addr;
          });
        } catch (error) {
          throw new ConfigurationError(
            'multiaddr conversion failed. Install @multiformats/multiaddr or pass Multiaddr instances.'
          );
        }
      }
    }

    const node = await createLibp2p({
      addresses: listenAddresses ? { listen: listenAddresses as any[] } : undefined,
      transports: [transportFactory()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      peerDiscovery: peerDiscovery.length > 0 ? (peerDiscovery as unknown as any[]) : undefined,
      services: {
        identify: identify(),
        pubsub: gossipsub({
          allowPublishToZeroTopicPeers: config.allowPublishToZeroPeers ?? true,
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
      ? 'libp2p dependencies are missing. Install libp2p, @libp2p/tcp (or @chainsafe/libp2p-quic), @chainsafe/libp2p-yamux, @chainsafe/libp2p-noise, @chainsafe/libp2p-gossipsub.'
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
  private started = false;

  constructor(config: Libp2pTransportConfig) {
    this.config = config;
    this.topics = config.topics ?? [];
  }

  async start(): Promise<void> {
    if (this.started) return;
    this.runtime = await loadLibp2p(this.config);
    await Promise.resolve(this.runtime.node.start());
    this.started = true;
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
    if (!this.runtime || !this.started) return;
    await Promise.resolve(this.runtime.node.stop());
    this.started = false;
  }

  async resubscribe(): Promise<void> {
    if (!this.runtime?.pubsub) return;
    for (const topic of this.topics) {
      await this.runtime.pubsub.subscribe(topic);
    }
  }

  getSubscribers(topic: string): string[] {
    if (!this.runtime?.pubsub?.getSubscribers) return [];
    return this.runtime.pubsub
      .getSubscribers(topic)
      .map((peer) => (typeof peer === 'string' ? peer : (peer?.toString?.() ?? '')))
      .filter(Boolean);
  }

  getPubsubPeers(): string[] {
    if (!this.runtime?.pubsub?.getPeers) return [];
    return this.runtime.pubsub
      .getPeers()
      .map((peer) => (typeof peer === 'string' ? peer : (peer?.toString?.() ?? '')))
      .filter(Boolean);
  }

  getTopics(): string[] {
    if (!this.runtime?.pubsub?.getTopics) return [];
    return this.runtime.pubsub.getTopics().filter(Boolean);
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

  getConnectionInfo(): Array<{
    peer: string;
    multiplexer?: string;
    encryption?: string;
    direction?: string;
    status?: string;
  }> {
    if (!this.runtime?.node.getConnections) return [];
    return this.runtime.node.getConnections().map((conn) => ({
      peer: conn.remotePeer?.toString?.() ?? '',
      multiplexer: conn.multiplexer,
      encryption: conn.encryption,
      direction: conn.direction,
      status: conn.status,
    }));
  }

  getMultiaddrs(): string[] {
    if (!this.runtime) return [];
    const addrs = this.runtime.node.getMultiaddrs?.() ?? [];
    return addrs.map((addr) => addr.toString());
  }

  getPeerId(): string | null {
    return this.runtime?.node.peerId?.toString?.() ?? null;
  }

  async getProtocols(peerId?: PeerId): Promise<string[]> {
    const node = this.runtime?.node;
    if (!node?.getProtocols) return [];
    const result = node.getProtocols(peerId);
    return Array.isArray(result) ? result : await result;
  }

  async getPeerProtocols(peerId: PeerId): Promise<string[]> {
    const store = this.runtime?.node.peerStore;
    if (!store?.get) return [];
    try {
      const nodePeerId = this.runtime?.node.peerId;
      const lookupId =
        typeof peerId === 'string' && nodePeerId?.toString?.() === peerId ? nodePeerId : peerId;
      const info = await store.get(lookupId);
      return info?.protocols ?? [];
    } catch {
      return [];
    }
  }

  async connect(addresses: string[]): Promise<void> {
    if (!this.runtime?.node.dial) return;
    if (!addresses.length) return;
    const multiaddrModule = await import('@multiformats/multiaddr');
    const toMultiaddr = resolveFactory(multiaddrModule, 'multiaddr');
    const targets = addresses.map((addr) => toMultiaddr(addr));
    await Promise.all(targets.map((addr) => this.runtime!.node.dial!(addr)));
  }

  private handleEvent(event: unknown): void {
    const detail = (event as { detail?: { data?: Uint8Array; topic?: string } }).detail;
    if (!detail?.data) return;
    const raw = detail.data as unknown as { subarray?: () => Uint8Array };
    const data =
      detail.data instanceof Uint8Array
        ? detail.data
        : typeof raw?.subarray === 'function'
          ? raw.subarray()
          : null;
    if (!data) return;
    const decoded = decodeEnvelope(data);
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
