export type PeerId = string;
export type Topic = string;

export type NodeStatus = 'idle' | 'starting' | 'online' | 'stopping' | 'offline';

export interface PeerInfo {
  id: PeerId;
  addresses?: string[];
  metadata?: Record<string, string>;
}

export interface MessageEnvelope<T = unknown> {
  messageId: string;
  topic: Topic;
  payload: T;
  timestamp: number;
  source: PeerId;
  ttl: number;
  hops: PeerId[];
}

export interface P2PConfig {
  nodeId: PeerId;
  maxPeers?: number;
  rateLimitPerMinute?: number;
  topics?: Topic[];
}

export interface PublishOptions {
  ttl?: number;
}

export interface NetworkTelemetryEvent {
  type:
    | 'p2p.start'
    | 'p2p.stop'
    | 'p2p.publish'
    | 'p2p.receive'
    | 'p2p.rate_limited'
    | 'p2p.peer_discovered'
    | 'p2p.peer_error';
  timestamp: string;
  nodeId: PeerId;
  peerId?: PeerId;
  topic?: Topic;
  metadata?: Record<string, unknown>;
}

export interface TelemetryHandler {
  (event: NetworkTelemetryEvent): Promise<void> | void;
}

export interface TelemetryOptions {
  onEvent?: TelemetryHandler;
}

export interface TransportAdapter {
  start(): Promise<void>;
  stop(): Promise<void>;
  send(peerId: PeerId, message: MessageEnvelope): Promise<void>;
  broadcast(message: MessageEnvelope): Promise<void>;
  onMessage(handler: (message: MessageEnvelope) => Promise<void> | void): void;
  getPeers(): PeerInfo[];
}

export interface P2PNode {
  start(): Promise<void>;
  stop(): Promise<void>;
  publish<T>(topic: Topic, payload: T, options?: PublishOptions): Promise<void>;
  subscribe<T>(
    topic: Topic,
    handler: (payload: T, message: MessageEnvelope<T>) => void
  ): () => void;
  getPeers(): PeerInfo[];
  getStatus(): NodeStatus;
}

export type P2PErrorCode = 'RATE_LIMIT' | 'TRANSPORT' | 'CONFIG';
