import { ConfigurationError, TransportError } from './errors';
import type { MessageEnvelope, PeerId, PeerInfo, Topic, TransportAdapter } from './types';

export interface Libp2pTransportConfig {
  listenAddresses?: string[];
  bootstrap?: string[];
  topics?: Topic[];
  allowPublishToZeroPeers?: boolean;
}

interface Libp2pRuntime {
  node: {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    getPeers?: () => PeerId[];
    getConnections?: () => Array<{ remotePeer?: { toString: () => string } }>;
    services?: { pubsub?: unknown };
  };
  pubsub?: {
    publish: (topic: string, data: Uint8Array) => Promise<void>;
    subscribe: (topic: string) => Promise<void> | void;
    addEventListener?: (event: string, handler: (event: unknown) => void) => void;
    removeEventListener?: (event: string, handler: (event: unknown) => void) => void;
  };
}

async function loadLibp2p(config: Libp2pTransportConfig): Promise<Libp2pRuntime> {
  try {
    const [{ createLibp2p }, { quic }, { noise }, { gossipsub }] = await Promise.all([
      import('libp2p'),
      import('@libp2p/quic'),
      import('@chainsafe/libp2p-noise'),
      import('@chainsafe/libp2p-gossipsub'),
    ]);

    const node = await createLibp2p({
      addresses: config.listenAddresses ? { listen: config.listenAddresses } : undefined,
      transports: [quic()],
      connectionEncryption: [noise()],
      services: {
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
    throw new ConfigurationError(
      'libp2p dependencies are missing. Install libp2p, @libp2p/quic, @chainsafe/libp2p-noise, @chainsafe/libp2p-gossipsub.'
    );
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
    await this.runtime.node.start();
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
    await this.runtime.node.stop();
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
