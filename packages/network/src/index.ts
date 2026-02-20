export * from './types';
export * from './peer-discovery';

import type {
  MessageEnvelope,
  NodeStatus,
  P2PConfig,
  P2PErrorCode,
  P2PNode,
  PeerId,
  PeerInfo,
  PublishOptions,
  Topic,
  TransportAdapter,
} from './types';

const DEFAULT_TTL = 8;
const DEFAULT_RATE_LIMIT = 120;

export class P2PError extends Error {
  code: P2PErrorCode;
  retryable: boolean;

  constructor(message: string, code: P2PErrorCode, retryable: boolean) {
    super(message);
    this.name = 'P2PError';
    this.code = code;
    this.retryable = retryable;
  }
}

export class RateLimitError extends P2PError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT', true);
    this.name = 'RateLimitError';
  }
}

export class TransportError extends P2PError {
  constructor(message: string) {
    super(message, 'TRANSPORT', true);
    this.name = 'TransportError';
  }
}

export class ConfigurationError extends P2PError {
  constructor(message: string) {
    super(message, 'CONFIG', false);
    this.name = 'ConfigurationError';
  }
}

class RateLimiter {
  private capacity: number;
  private remaining: number;
  private resetAt: number;

  constructor(limitPerMinute: number) {
    this.capacity = limitPerMinute;
    this.remaining = limitPerMinute;
    this.resetAt = Date.now() + 60_000;
  }

  allow(): boolean {
    const now = Date.now();
    if (now >= this.resetAt) {
      this.remaining = this.capacity;
      this.resetAt = now + 60_000;
    }
    if (this.remaining <= 0) {
      return false;
    }
    this.remaining -= 1;
    return true;
  }
}

let messageCounter = 0;

function createMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  messageCounter += 1;
  return `msg_${Date.now()}_${messageCounter}`;
}

export function createP2PNode(config: P2PConfig, adapter: TransportAdapter): P2PNode {
  let status: NodeStatus = 'idle';
  const subscriptions = new Map<Topic, Set<(payload: unknown, message: MessageEnvelope) => void>>();
  const limiter =
    config.rateLimitPerMinute !== undefined
      ? new RateLimiter(config.rateLimitPerMinute)
      : new RateLimiter(DEFAULT_RATE_LIMIT);

  adapter.onMessage(async (message) => {
    if (message.ttl <= 0) return;
    const handlers = subscriptions.get(message.topic);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(message.payload, message);
    }
  });

  const publish = async <T>(topic: Topic, payload: T, options?: PublishOptions): Promise<void> => {
    if (config.topics && !config.topics.includes(topic)) {
      throw new ConfigurationError(`Topic ${topic} is not allowed`);
    }
    if (!limiter.allow()) {
      throw new RateLimitError('Publish rate limit exceeded');
    }
    const envelope: MessageEnvelope<T> = {
      messageId: createMessageId(),
      topic,
      payload,
      timestamp: Date.now(),
      source: config.nodeId,
      ttl: options?.ttl ?? DEFAULT_TTL,
      hops: [config.nodeId],
    };
    try {
      await adapter.broadcast(envelope);
    } catch (error) {
      throw new TransportError((error as Error).message || 'Transport send failed');
    }
  };

  const subscribe = <T>(
    topic: Topic,
    handler: (payload: T, message: MessageEnvelope<T>) => void
  ): (() => void) => {
    if (config.topics && !config.topics.includes(topic)) {
      throw new ConfigurationError(`Topic ${topic} is not allowed`);
    }
    const existing = subscriptions.get(topic) ?? new Set();
    existing.add(handler as (payload: unknown, message: MessageEnvelope) => void);
    subscriptions.set(topic, existing);
    return () => {
      const handlers = subscriptions.get(topic);
      if (!handlers) return;
      handlers.delete(handler as (payload: unknown, message: MessageEnvelope) => void);
      if (handlers.size === 0) {
        subscriptions.delete(topic);
      }
    };
  };

  return {
    start: async () => {
      if (status === 'online' || status === 'starting') return;
      status = 'starting';
      await adapter.start();
      status = 'online';
    },
    stop: async () => {
      if (status === 'offline' || status === 'stopping') return;
      status = 'stopping';
      await adapter.stop();
      status = 'offline';
    },
    publish,
    subscribe,
    getPeers: () => adapter.getPeers(),
    getStatus: () => status,
  };
}

export class InMemoryTransport implements TransportAdapter {
  private static registry = new Map<PeerId, InMemoryTransport>();
  private handler?: (message: MessageEnvelope) => Promise<void> | void;

  constructor(private readonly nodeId: PeerId) {}

  async start(): Promise<void> {
    InMemoryTransport.registry.set(this.nodeId, this);
  }

  async stop(): Promise<void> {
    InMemoryTransport.registry.delete(this.nodeId);
  }

  async send(peerId: PeerId, message: MessageEnvelope): Promise<void> {
    const target = InMemoryTransport.registry.get(peerId);
    if (!target?.handler) return;
    await target.handler(message);
  }

  async broadcast(message: MessageEnvelope): Promise<void> {
    const deliveries = Array.from(InMemoryTransport.registry.entries())
      .filter(([peerId]) => peerId !== this.nodeId)
      .map(([, transport]) => transport.handler?.(message));
    await Promise.all(deliveries);
  }

  onMessage(handler: (message: MessageEnvelope) => Promise<void> | void): void {
    this.handler = handler;
  }

  getPeers(): PeerInfo[] {
    return Array.from(InMemoryTransport.registry.keys())
      .filter((peerId) => peerId !== this.nodeId)
      .map((peerId) => ({ id: peerId }));
  }
}
