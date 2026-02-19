# Section 9: Network Protocols

## Document Control

| Attribute              | Value                   |
| ---------------------- | ----------------------- |
| **Section**            | 9 of 14                 |
| **Title**              | Network Protocols       |
| **Status**             | Publication-Ready       |
| **Primary Principles** | P1, P3, P4, P8, P9, P12 |

---

## 9.1 Overview

This section defines the network protocol specifications for GTCX Protocol v3.0, establishing:

- **Message transport** for reliable inter-node communication
- **Peer discovery** for network formation and maintenance
- **Mesh networking** for offline-capable regional clusters
- **Consensus messaging** for PANX Oracle coordination
- **Sync protocols** for offline-first operation

### Network Design Philosophy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     GTCX NETWORK PRINCIPLES                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. OFFLINE-FIRST                                                       │
│     Network partitions are normal, not exceptional                      │
│     Every node operates autonomously when disconnected                  │
│                                                                         │
│  2. MESH RESILIENCE                                                     │
│     No single point of failure                                          │
│     Regional clusters self-organize                                     │
│                                                                         │
│  3. BANDWIDTH EFFICIENCY                                                │
│     Optimized for frontier market connectivity                          │
│     Progressive enhancement from SMS to broadband                       │
│                                                                         │
│  4. SOVEREIGN ROUTING                                                   │
│     Data residency respects jurisdictional requirements                 │
│     Government nodes have priority routing                              │
│                                                                         │
│  5. CRYPTOGRAPHIC INTEGRITY                                             │
│     All messages signed and verified                                    │
│     Replay protection built-in                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9.2 Network Topology

### 9.2.1 Hierarchical Network Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GTCX NETWORK TOPOLOGY                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GLOBAL TIER (Internet Backbone)                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │   │
│  │  │ Gateway │◄──►│ Gateway │◄──►│ Gateway │◄──►│ Gateway │      │   │
│  │  │  (EU)   │    │ (Africa)│    │  (ME)   │    │  (APAC) │      │   │
│  │  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘      │   │
│  └───────│──────────────│──────────────│──────────────│───────────┘   │
│          │              │              │              │               │
│  REGIONAL TIER (Country Networks)                                       │
│  ┌───────│──────────────│──────────────────────────────────────────┐  │
│  │       ▼              ▼                                          │  │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │  │
│  │  │Regional │    │Regional │    │Regional │                     │  │
│  │  │Hub (GH) │    │Hub (RW) │    │Hub (CD) │                     │  │
│  │  └────┬────┘    └────┬────┘    └────┬────┘                     │  │
│  └───────│──────────────│──────────────│──────────────────────────┘  │
│          │              │              │                              │
│  LOCAL TIER (Mesh Clusters)                                            │
│  ┌───────│──────────────│──────────────────────────────────────────┐  │
│  │       ▼              ▼              ▼                           │  │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │  │
│  │  │  Mesh   │    │  Mesh   │    │  Mesh   │                     │  │
│  │  │Cluster  │    │Cluster  │    │Cluster  │                     │  │
│  │  │(Ashanti)│    │(Kigali) │    │(Kolwezi)│                     │  │
│  │  └────┬────┘    └────┬────┘    └────┬────┘                     │  │
│  └───────│──────────────│──────────────│──────────────────────────┘  │
│          │              │              │                              │
│  EDGE TIER (Field Devices)                                             │
│  ┌───────│──────────────│──────────────│──────────────────────────┐  │
│  │       ▼              ▼              ▼                           │  │
│  │    📱 📱 📱       📱 📱 📱       📱 📱 📱                      │  │
│  │    VIA  VXA       VIA  VXA       VIA  VXA                      │  │
│  │    TapKit         TapKit         TapKit                        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2.2 Node Types

```typescript
// network/node-types.ts
import { z } from 'zod';

/**
 * GTCX Node Types
 */
export const NodeTypeSchema = z.enum([
  'gateway', // Global tier - cross-regional routing
  'regional_hub', // Regional tier - country-level coordination
  'validator', // PANX consensus participant
  'relay', // Message relay and caching
  'mesh_anchor', // Local mesh cluster anchor
  'edge', // Mobile/field devices
]);

export type NodeType = z.infer<typeof NodeTypeSchema>;

/**
 * Node capabilities by type
 */
export const NodeCapabilities: Record<NodeType, NodeCapabilitySet> = {
  gateway: {
    routing: true,
    consensus: true,
    storage: 'full',
    relay: true,
    meshAnchor: false,
    offline: false,
    bandwidth: 'high',
  },
  regional_hub: {
    routing: true,
    consensus: true,
    storage: 'full',
    relay: true,
    meshAnchor: true,
    offline: false,
    bandwidth: 'high',
  },
  validator: {
    routing: false,
    consensus: true,
    storage: 'partial',
    relay: true,
    meshAnchor: false,
    offline: false,
    bandwidth: 'medium',
  },
  relay: {
    routing: true,
    consensus: false,
    storage: 'cache',
    relay: true,
    meshAnchor: false,
    offline: false,
    bandwidth: 'medium',
  },
  mesh_anchor: {
    routing: true,
    consensus: false,
    storage: 'local',
    relay: true,
    meshAnchor: true,
    offline: true,
    bandwidth: 'low',
  },
  edge: {
    routing: false,
    consensus: false,
    storage: 'local',
    relay: false,
    meshAnchor: false,
    offline: true,
    bandwidth: 'variable',
  },
};

interface NodeCapabilitySet {
  routing: boolean;
  consensus: boolean;
  storage: 'full' | 'partial' | 'cache' | 'local';
  relay: boolean;
  meshAnchor: boolean;
  offline: boolean;
  bandwidth: 'high' | 'medium' | 'low' | 'variable';
}
```

### 9.2.3 Node Identity

```typescript
// network/node-identity.ts

/**
 * Node identity schema
 */
export const NodeIdentitySchema = z.object({
  /** Node DID */
  nodeId: z.string().regex(/^did:gtcx:node_[a-f0-9]{16}$/),

  /** Node type */
  type: NodeTypeSchema,

  /** Operating region */
  region: z.string(),

  /** Jurisdiction */
  jurisdiction: CountryCodeSchema,

  /** Public key for verification */
  publicKey: PublicKeyMultibaseSchema,

  /** Network endpoints */
  endpoints: z.array(
    z.object({
      protocol: z.enum(['wss', 'https', 'mqtt', 'ble', 'lora']),
      address: z.string(),
      priority: z.number().int().min(0).max(100),
    })
  ),

  /** Capabilities */
  capabilities: z.array(z.string()),

  /** Version information */
  version: z.object({
    protocol: SemVerSchema,
    software: SemVerSchema,
  }),

  /** Registration timestamp */
  registeredAt: DateTimeSchema,

  /** Last seen timestamp */
  lastSeen: DateTimeSchema,
});

export type NodeIdentity = z.infer<typeof NodeIdentitySchema>;
```

---

## 9.3 Message Transport

### 9.3.1 Message Envelope

```typescript
// network/message.ts
import { z } from 'zod';

/**
 * Message types
 */
export const MessageTypeSchema = z.enum([
  // Identity messages
  'identity.verify',
  'identity.update',
  'identity.revoke',

  // Asset messages
  'asset.register',
  'asset.transfer',
  'asset.verify',

  // Compliance messages
  'gci.request',
  'gci.response',
  'gci.update',

  // Custody messages
  'custody.intake',
  'custody.transfer',
  'custody.release',

  // Settlement messages
  'escrow.create',
  'escrow.fund',
  'escrow.release',
  'escrow.dispute',

  // Consensus messages
  'panx.request',
  'panx.pre_prepare',
  'panx.prepare',
  'panx.commit',
  'panx.reply',

  // Sync messages
  'sync.request',
  'sync.response',
  'sync.ack',

  // Network messages
  'peer.announce',
  'peer.discover',
  'peer.heartbeat',

  // System messages
  'system.alert',
  'system.config',
]);

export type MessageType = z.infer<typeof MessageTypeSchema>;

/**
 * Message priority levels
 */
export const MessagePrioritySchema = z.enum([
  'critical', // System emergencies, security alerts
  'high', // Consensus messages, settlements
  'normal', // Standard operations
  'low', // Sync, discovery, heartbeats
  'bulk', // Batch data transfers
]);

/**
 * Message envelope schema
 */
export const MessageEnvelopeSchema = z.object({
  /** Unique message ID */
  messageId: z.string().regex(/^msg:[a-f0-9]{32}$/),

  /** Protocol version */
  version: z.literal('3.0'),

  /** Message type */
  type: MessageTypeSchema,

  /** Priority level */
  priority: MessagePrioritySchema.default('normal'),

  /** Sender node identity */
  sender: z.object({
    nodeId: z.string(),
    publicKey: z.string(),
  }),

  /** Recipient(s) */
  recipient: z.union([
    z.object({ nodeId: z.string() }), // Direct
    z.object({ broadcast: z.literal(true) }), // Broadcast
    z.object({ region: z.string() }), // Regional
    z.object({ topic: z.string() }), // Topic-based
  ]),

  /** Routing hints */
  routing: z.object({
    ttl: z.number().int().min(0).max(255).default(64),
    hops: z.array(z.string()).default([]),
    preferredPath: z.array(z.string()).optional(),
    jurisdiction: CountryCodeSchema.optional(),
  }),

  /** Timestamps */
  timestamps: z.object({
    created: DateTimeSchema,
    expires: DateTimeSchema.optional(),
  }),

  /** Correlation for request-response */
  correlation: z
    .object({
      requestId: z.string().optional(),
      conversationId: z.string().optional(),
    })
    .optional(),

  /** Payload (encrypted or plaintext) */
  payload: z.object({
    contentType: z.enum(['application/json', 'application/cbor']),
    encoding: z.enum(['none', 'gzip', 'zstd']).default('none'),
    encrypted: z.boolean().default(false),
    data: z.string(), // Base64 if encrypted, JSON string if not
  }),

  /** Cryptographic signature */
  signature: z.object({
    algorithm: z.literal('Ed25519'),
    keyId: z.string(),
    value: SignatureSchema,
  }),
});

export type MessageEnvelope = z.infer<typeof MessageEnvelopeSchema>;
```

### 9.3.2 Transport Protocols

```typescript
// network/transport.ts

/**
 * Transport protocol configuration
 */
export const TransportConfig = {
  /**
   * WebSocket Secure (primary for real-time)
   */
  wss: {
    protocol: 'wss',
    port: 443,
    path: '/gtcx/v3/ws',
    features: {
      bidirectional: true,
      realtime: true,
      compression: true,
      multiplexing: true,
    },
    reconnect: {
      enabled: true,
      initialDelayMs: 1000,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      maxAttempts: 10,
    },
    heartbeat: {
      intervalMs: 30000,
      timeoutMs: 10000,
    },
  },

  /**
   * HTTPS (fallback for request-response)
   */
  https: {
    protocol: 'https',
    port: 443,
    basePath: '/gtcx/v3/api',
    features: {
      bidirectional: false,
      realtime: false,
      compression: true,
      multiplexing: false,
    },
    timeout: {
      connectMs: 10000,
      readMs: 30000,
      writeMs: 30000,
    },
    retry: {
      maxAttempts: 3,
      backoffMs: [1000, 2000, 4000],
    },
  },

  /**
   * MQTT (IoT devices, low bandwidth)
   */
  mqtt: {
    protocol: 'mqtts',
    port: 8883,
    features: {
      bidirectional: true,
      realtime: true,
      compression: false,
      multiplexing: true,
    },
    qos: {
      default: 1, // At least once
      consensus: 2, // Exactly once
      heartbeat: 0, // At most once
    },
    keepAlive: 60,
    cleanSession: false,
  },

  /**
   * Bluetooth Low Energy (mesh networking)
   */
  ble: {
    protocol: 'ble',
    serviceUUID: '0000GTCX-0000-1000-8000-00805F9B34FB',
    features: {
      bidirectional: true,
      realtime: true,
      compression: true,
      multiplexing: false,
    },
    mtu: 512,
    connectionInterval: {
      minMs: 15,
      maxMs: 30,
    },
  },

  /**
   * LoRa (long range, low power)
   */
  lora: {
    protocol: 'lora',
    frequency: 868, // MHz (EU) or 915 (US/AU)
    features: {
      bidirectional: true,
      realtime: false,
      compression: true,
      multiplexing: false,
    },
    spreadingFactor: 7,
    bandwidth: 125, // kHz
    maxPayload: 222, // bytes
  },

  /**
   * SMS/USSD (ultimate fallback)
   */
  sms: {
    protocol: 'sms',
    features: {
      bidirectional: true,
      realtime: false,
      compression: true,
      multiplexing: false,
    },
    maxLength: 160,
    encoding: 'base64url',
  },
} as const;

/**
 * Transport selector based on conditions
 */
export function selectTransport(
  messageType: MessageType,
  networkConditions: NetworkConditions,
  deviceCapabilities: DeviceCapabilities
): TransportProtocol {
  // Critical messages use most reliable transport
  if (messageType.startsWith('panx.') || messageType.startsWith('escrow.')) {
    if (networkConditions.hasInternet) {
      return 'wss';
    }
    if (deviceCapabilities.hasBLE) {
      return 'ble';
    }
    return 'sms';
  }

  // IoT devices prefer MQTT
  if (deviceCapabilities.isIoT) {
    return 'mqtt';
  }

  // Low bandwidth prefers MQTT or LoRa
  if (networkConditions.bandwidth === 'low') {
    if (deviceCapabilities.hasLoRa) {
      return 'lora';
    }
    return 'mqtt';
  }

  // Default to WebSocket
  return networkConditions.hasInternet ? 'wss' : 'ble';
}

interface NetworkConditions {
  hasInternet: boolean;
  bandwidth: 'high' | 'medium' | 'low' | 'none';
  latencyMs: number;
  packetLoss: number;
}

interface DeviceCapabilities {
  isIoT: boolean;
  hasBLE: boolean;
  hasLoRa: boolean;
  hasWiFi: boolean;
  hasCellular: boolean;
}

type TransportProtocol = 'wss' | 'https' | 'mqtt' | 'ble' | 'lora' | 'sms';
```

### 9.3.3 Message Serialization

```typescript
// network/serialization.ts

/**
 * Message serialization formats
 */
export const SerializationFormats = {
  /**
   * JSON - Human readable, widely supported
   */
  json: {
    contentType: 'application/json',
    serialize: (data: unknown) => JSON.stringify(data),
    deserialize: (data: string) => JSON.parse(data),
    overhead: 'high',
    humanReadable: true,
  },

  /**
   * CBOR - Compact binary, self-describing
   */
  cbor: {
    contentType: 'application/cbor',
    serialize: (data: unknown) => cbor.encode(data),
    deserialize: (data: Uint8Array) => cbor.decode(data),
    overhead: 'low',
    humanReadable: false,
  },

  /**
   * MessagePack - Compact binary
   */
  msgpack: {
    contentType: 'application/msgpack',
    serialize: (data: unknown) => msgpack.encode(data),
    deserialize: (data: Uint8Array) => msgpack.decode(data),
    overhead: 'low',
    humanReadable: false,
  },
} as const;

/**
 * Compression algorithms
 */
export const CompressionAlgorithms = {
  none: {
    compress: (data: Uint8Array) => data,
    decompress: (data: Uint8Array) => data,
    ratio: 1.0,
  },
  gzip: {
    compress: (data: Uint8Array) => gzip(data),
    decompress: (data: Uint8Array) => gunzip(data),
    ratio: 0.3, // Typical compression ratio
  },
  zstd: {
    compress: (data: Uint8Array) => zstd.compress(data),
    decompress: (data: Uint8Array) => zstd.decompress(data),
    ratio: 0.25, // Better compression than gzip
  },
} as const;

/**
 * Select optimal serialization based on context
 */
export function selectSerialization(
  payloadSize: number,
  transport: TransportProtocol,
  debug: boolean = false
): { format: 'json' | 'cbor'; compression: 'none' | 'gzip' | 'zstd' } {
  // Debug mode uses JSON for readability
  if (debug) {
    return { format: 'json', compression: 'none' };
  }

  // Low bandwidth transports use CBOR + compression
  if (transport === 'lora' || transport === 'sms') {
    return { format: 'cbor', compression: 'zstd' };
  }

  // Large payloads use CBOR + compression
  if (payloadSize > 1024) {
    return { format: 'cbor', compression: 'gzip' };
  }

  // Default to CBOR without compression
  return { format: 'cbor', compression: 'none' };
}
```

---

## 9.4 Peer Discovery

### 9.4.1 Discovery Methods

```typescript
// network/discovery.ts
import { z } from 'zod';

/**
 * Peer discovery configuration
 */
export const PeerDiscoveryConfig = {
  /**
   * DNS seed discovery (bootstrap)
   */
  dnsSeed: {
    enabled: true,
    seeds: ['seed1.gtcx.network', 'seed2.gtcx.network', 'seed3.gtcx.network'],
    refreshIntervalMs: 3600000, // 1 hour
    timeout: 5000,
  },

  /**
   * Peer exchange protocol (PEX)
   */
  peerExchange: {
    enabled: true,
    maxPeersToShare: 20,
    requestIntervalMs: 60000, // 1 minute
    minReputation: 50,
  },

  /**
   * mDNS discovery (local network)
   */
  mdns: {
    enabled: true,
    serviceType: '_gtcx._tcp',
    domain: 'local',
    ttl: 120,
  },

  /**
   * Bluetooth discovery (mesh)
   */
  bluetooth: {
    enabled: true,
    scanIntervalMs: 30000,
    scanDurationMs: 10000,
    serviceUUID: '0000GTCX-0000-1000-8000-00805F9B34FB',
  },

  /**
   * Static peers (configured)
   */
  static: {
    enabled: true,
    peers: [], // Configured at deployment
  },
} as const;

/**
 * Discovered peer schema
 */
export const DiscoveredPeerSchema = z.object({
  nodeId: z.string(),
  type: NodeTypeSchema,
  endpoints: z.array(
    z.object({
      protocol: z.string(),
      address: z.string(),
      port: z.number().optional(),
    })
  ),
  discoveryMethod: z.enum(['dns_seed', 'peer_exchange', 'mdns', 'bluetooth', 'static']),
  discoveredAt: DateTimeSchema,
  reputation: z.number().min(0).max(100).optional(),
  region: z.string().optional(),
  jurisdiction: CountryCodeSchema.optional(),
});

export type DiscoveredPeer = z.infer<typeof DiscoveredPeerSchema>;

/**
 * Peer discovery service
 */
export class PeerDiscoveryService {
  private discoveredPeers: Map<string, DiscoveredPeer> = new Map();
  private reputationManager: PeerReputationManager;

  constructor(
    private readonly config: typeof PeerDiscoveryConfig,
    private readonly logger: ILogger
  ) {
    this.reputationManager = new PeerReputationManager();
  }

  /**
   * Discover peers using all enabled methods
   */
  async discoverPeers(): Promise<DiscoveredPeer[]> {
    const discovered: DiscoveredPeer[] = [];

    // DNS seed discovery (bootstrap)
    if (this.config.dnsSeed.enabled) {
      const dnsPeers = await this.discoverFromDNS();
      discovered.push(...dnsPeers);
    }

    // Peer exchange from connected peers
    if (this.config.peerExchange.enabled) {
      const exchangePeers = await this.discoverFromPeerExchange();
      discovered.push(...exchangePeers);
    }

    // mDNS for local network
    if (this.config.mdns.enabled) {
      const mdnsPeers = await this.discoverFromMDNS();
      discovered.push(...mdnsPeers);
    }

    // Bluetooth for mesh
    if (this.config.bluetooth.enabled) {
      const btPeers = await this.discoverFromBluetooth();
      discovered.push(...btPeers);
    }

    // Add static peers
    if (this.config.static.enabled) {
      discovered.push(...this.config.static.peers);
    }

    // Filter by reputation
    const filtered = discovered.filter(
      (peer) =>
        this.reputationManager.getReputation(peer.nodeId) >= this.config.peerExchange.minReputation
    );

    // Update cache
    for (const peer of filtered) {
      this.discoveredPeers.set(peer.nodeId, peer);
    }

    return filtered;
  }

  private async discoverFromDNS(): Promise<DiscoveredPeer[]> {
    const peers: DiscoveredPeer[] = [];

    for (const seed of this.config.dnsSeed.seeds) {
      try {
        const records = await dns.resolveTxt(`_gtcx.${seed}`);
        for (const record of records) {
          const peer = this.parseDNSRecord(record);
          if (peer) {
            peers.push({ ...peer, discoveryMethod: 'dns_seed' });
          }
        }
      } catch (error) {
        this.logger.warn('DNS seed discovery failed', { seed, error });
      }
    }

    return peers;
  }

  private async discoverFromPeerExchange(): Promise<DiscoveredPeer[]> {
    // Request peer lists from connected peers
    const connectedPeers = this.getConnectedPeers();
    const discovered: DiscoveredPeer[] = [];

    for (const peer of connectedPeers) {
      try {
        const response = await this.requestPeerList(peer);
        discovered.push(
          ...response.peers.map((p) => ({
            ...p,
            discoveryMethod: 'peer_exchange' as const,
          }))
        );
      } catch (error) {
        this.logger.warn('Peer exchange failed', { peer: peer.nodeId, error });
      }
    }

    return discovered;
  }

  private async discoverFromMDNS(): Promise<DiscoveredPeer[]> {
    // Multicast DNS discovery for local network
    return new Promise((resolve) => {
      const discovered: DiscoveredPeer[] = [];
      const browser = mdns.createBrowser(mdns.tcp(this.config.mdns.serviceType));

      browser.on('serviceUp', (service: any) => {
        discovered.push({
          nodeId: service.txtRecord?.nodeId || `local-${service.name}`,
          type: service.txtRecord?.type || 'edge',
          endpoints: [
            {
              protocol: 'wss',
              address: service.addresses[0],
              port: service.port,
            },
          ],
          discoveryMethod: 'mdns',
          discoveredAt: new Date().toISOString(),
        });
      });

      browser.start();

      setTimeout(() => {
        browser.stop();
        resolve(discovered);
      }, 5000);
    });
  }

  private async discoverFromBluetooth(): Promise<DiscoveredPeer[]> {
    // BLE scanning for mesh peers
    const discovered: DiscoveredPeer[] = [];

    // Implementation depends on platform (React Native, Node.js, etc.)
    const devices = await this.scanBLEDevices();

    for (const device of devices) {
      if (device.serviceUUIDs?.includes(this.config.bluetooth.serviceUUID)) {
        discovered.push({
          nodeId: device.id,
          type: 'edge',
          endpoints: [
            {
              protocol: 'ble',
              address: device.id,
            },
          ],
          discoveryMethod: 'bluetooth',
          discoveredAt: new Date().toISOString(),
        });
      }
    }

    return discovered;
  }
}
```

### 9.4.2 Peer Reputation

```typescript
// network/reputation.ts

/**
 * Peer reputation factors
 */
export const ReputationFactors = {
  /** Message delivery success rate */
  deliveryRate: { weight: 0.3, decay: 0.95 },

  /** Response latency */
  latency: { weight: 0.2, decay: 0.9 },

  /** Uptime/availability */
  uptime: { weight: 0.2, decay: 0.99 },

  /** Consensus participation */
  consensus: { weight: 0.2, decay: 0.95 },

  /** Protocol compliance */
  compliance: { weight: 0.1, decay: 0.9 },
} as const;

/**
 * Peer reputation manager
 */
export class PeerReputationManager {
  private scores: Map<string, PeerScore> = new Map();

  /**
   * Get current reputation score
   */
  getReputation(nodeId: string): number {
    const score = this.scores.get(nodeId);
    if (!score) return 50; // Default neutral score

    return this.calculateCompositeScore(score);
  }

  /**
   * Update reputation based on interaction
   */
  updateReputation(nodeId: string, event: ReputationEvent): void {
    let score = this.scores.get(nodeId) || this.createDefaultScore();

    switch (event.type) {
      case 'message_delivered':
        score.deliverySuccesses++;
        score.deliveryAttempts++;
        break;

      case 'message_failed':
        score.deliveryAttempts++;
        break;

      case 'response_received':
        score.responseLatencies.push(event.latencyMs);
        if (score.responseLatencies.length > 100) {
          score.responseLatencies.shift();
        }
        break;

      case 'heartbeat_received':
        score.lastSeen = new Date();
        score.heartbeatsReceived++;
        break;

      case 'heartbeat_missed':
        score.heartbeatsMissed++;
        break;

      case 'consensus_participated':
        score.consensusParticipations++;
        break;

      case 'protocol_violation':
        score.protocolViolations++;
        break;
    }

    this.scores.set(nodeId, score);
  }

  /**
   * Apply decay to all scores (run periodically)
   */
  applyDecay(): void {
    for (const [nodeId, score] of this.scores) {
      // Apply decay based on time since last interaction
      const hoursSinceLastSeen = (Date.now() - score.lastSeen.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSeen > 24) {
        // Peer hasn't been seen in 24+ hours
        score.uptimeScore *= 0.9;
      }

      this.scores.set(nodeId, score);
    }
  }

  private calculateCompositeScore(score: PeerScore): number {
    const factors = ReputationFactors;

    // Delivery rate (0-100)
    const deliveryRate =
      score.deliveryAttempts > 0 ? (score.deliverySuccesses / score.deliveryAttempts) * 100 : 50;

    // Latency score (inverse, lower is better)
    const avgLatency =
      score.responseLatencies.length > 0
        ? score.responseLatencies.reduce((a, b) => a + b) / score.responseLatencies.length
        : 500;
    const latencyScore = Math.max(0, 100 - avgLatency / 10);

    // Uptime score
    const uptimeScore =
      score.heartbeatsReceived > 0
        ? (score.heartbeatsReceived / (score.heartbeatsReceived + score.heartbeatsMissed)) * 100
        : 50;

    // Consensus score
    const consensusScore = Math.min(100, score.consensusParticipations * 5);

    // Compliance score (penalized by violations)
    const complianceScore = Math.max(0, 100 - score.protocolViolations * 10);

    // Weighted composite
    return (
      deliveryRate * factors.deliveryRate.weight +
      latencyScore * factors.latency.weight +
      uptimeScore * factors.uptime.weight +
      consensusScore * factors.consensus.weight +
      complianceScore * factors.compliance.weight
    );
  }

  private createDefaultScore(): PeerScore {
    return {
      deliverySuccesses: 0,
      deliveryAttempts: 0,
      responseLatencies: [],
      heartbeatsReceived: 0,
      heartbeatsMissed: 0,
      consensusParticipations: 0,
      protocolViolations: 0,
      uptimeScore: 50,
      lastSeen: new Date(),
    };
  }
}

interface PeerScore {
  deliverySuccesses: number;
  deliveryAttempts: number;
  responseLatencies: number[];
  heartbeatsReceived: number;
  heartbeatsMissed: number;
  consensusParticipations: number;
  protocolViolations: number;
  uptimeScore: number;
  lastSeen: Date;
}

interface ReputationEvent {
  type:
    | 'message_delivered'
    | 'message_failed'
    | 'response_received'
    | 'heartbeat_received'
    | 'heartbeat_missed'
    | 'consensus_participated'
    | 'protocol_violation';
  latencyMs?: number;
  details?: string;
}
```

---

## 9.5 Mesh Networking

### 9.5.1 Mesh Cluster Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MESH CLUSTER TOPOLOGY                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ┌─────────────────────┐                              │
│                    │    MESH ANCHOR      │                              │
│                    │   (Vault/Station)   │                              │
│                    │  ┌───────────────┐  │                              │
│                    │  │ Local Storage │  │                              │
│                    │  │ Sync Queue    │  │                              │
│                    │  │ Routing Table │  │                              │
│                    │  └───────────────┘  │                              │
│                    └──────────┬──────────┘                              │
│                               │                                         │
│            ┌──────────────────┼──────────────────┐                      │
│            │                  │                  │                      │
│            ▼                  ▼                  ▼                      │
│    ┌───────────┐      ┌───────────┐      ┌───────────┐                 │
│    │  RELAY    │◄────►│  RELAY    │◄────►│  RELAY    │                 │
│    │  NODE 1   │      │  NODE 2   │      │  NODE 3   │                 │
│    └─────┬─────┘      └─────┬─────┘      └─────┬─────┘                 │
│          │                  │                  │                        │
│    ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐                 │
│    │           │      │           │      │           │                 │
│    ▼           ▼      ▼           ▼      ▼           ▼                 │
│ ┌─────┐    ┌─────┐ ┌─────┐    ┌─────┐ ┌─────┐    ┌─────┐              │
│ │Edge │    │Edge │ │Edge │    │Edge │ │Edge │    │Edge │              │
│ │ 1.1 │◄──►│ 1.2 │ │ 2.1 │◄──►│ 2.2 │ │ 3.1 │◄──►│ 3.2 │              │
│ └─────┘    └─────┘ └─────┘    └─────┘ └─────┘    └─────┘              │
│                                                                         │
│  Legend:                                                                │
│  ─────► WiFi/Internet     ◄────► BLE/LoRa Mesh                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.5.2 Mesh Protocol

```typescript
// network/mesh.ts
import { z } from 'zod';

/**
 * Mesh cluster configuration
 */
export const MeshClusterConfigSchema = z.object({
  /** Cluster identifier */
  clusterId: z.string().regex(/^mesh:[a-z]{2}-[a-z0-9]{4,12}$/),

  /** Anchor node ID */
  anchorNodeId: z.string(),

  /** Maximum hops in cluster */
  maxHops: z.number().int().min(1).max(10).default(5),

  /** Sync interval to anchor */
  syncIntervalMs: z.number().int().min(60000).default(300000), // 5 min

  /** Maximum offline duration */
  maxOfflineDurationMs: z.number().int().default(2592000000), // 30 days

  /** BLE configuration */
  ble: z.object({
    enabled: z.boolean().default(true),
    serviceUUID: z.string(),
    scanIntervalMs: z.number().int().default(30000),
    advertisingIntervalMs: z.number().int().default(1000),
  }),

  /** LoRa configuration */
  lora: z
    .object({
      enabled: z.boolean().default(false),
      frequency: z.number(),
      spreadingFactor: z.number().int().min(7).max(12),
      bandwidth: z.number(),
    })
    .optional(),
});

export type MeshClusterConfig = z.infer<typeof MeshClusterConfigSchema>;

/**
 * Mesh routing table entry
 */
export const MeshRouteSchema = z.object({
  destination: z.string(),
  nextHop: z.string(),
  hopCount: z.number().int().min(1),
  lastUpdated: DateTimeSchema,
  metric: z.number(), // Lower is better
  expires: DateTimeSchema,
});

export type MeshRoute = z.infer<typeof MeshRouteSchema>;

/**
 * Mesh network service
 */
export class MeshNetworkService {
  private routingTable: Map<string, MeshRoute> = new Map();
  private neighbors: Map<string, MeshNeighbor> = new Map();
  private messageCache: LRUCache<string, MessageEnvelope>;

  constructor(
    private readonly config: MeshClusterConfig,
    private readonly bleAdapter: IBLEAdapter,
    private readonly loraAdapter?: ILoRaAdapter
  ) {
    this.messageCache = new LRUCache({ max: 1000 });
  }

  /**
   * Start mesh networking
   */
  async start(): Promise<void> {
    // Start BLE advertising and scanning
    if (this.config.ble.enabled) {
      await this.startBLEMesh();
    }

    // Start LoRa if configured
    if (this.config.lora?.enabled && this.loraAdapter) {
      await this.startLoRaMesh();
    }

    // Start periodic route maintenance
    this.startRouteMaintenanceLoop();
  }

  /**
   * Send message through mesh
   */
  async sendMessage(message: MessageEnvelope): Promise<boolean> {
    // Check if already processed (loop prevention)
    if (this.messageCache.has(message.messageId)) {
      return false;
    }
    this.messageCache.set(message.messageId, message);

    // Determine next hop
    const destination = this.extractDestination(message);
    const route = this.routingTable.get(destination);

    if (route) {
      // Forward to next hop
      return this.forwardToNode(route.nextHop, message);
    }

    // No route - broadcast to neighbors
    return this.broadcastToNeighbors(message);
  }

  /**
   * Handle incoming mesh message
   */
  async handleMessage(source: string, message: MessageEnvelope): Promise<void> {
    // Check for duplicate
    if (this.messageCache.has(message.messageId)) {
      return;
    }
    this.messageCache.set(message.messageId, message);

    // Update routing table from message path
    this.updateRoutingFromMessage(source, message);

    // Check if message is for us
    const destination = this.extractDestination(message);
    if (this.isLocalDestination(destination)) {
      await this.deliverLocally(message);
      return;
    }

    // Check TTL
    if (message.routing.ttl <= 1) {
      return; // Message expired
    }

    // Forward with decremented TTL
    const forwarded = {
      ...message,
      routing: {
        ...message.routing,
        ttl: message.routing.ttl - 1,
        hops: [...message.routing.hops, this.getLocalNodeId()],
      },
    };

    await this.sendMessage(forwarded);
  }

  private async startBLEMesh(): Promise<void> {
    // Start advertising our presence
    await this.bleAdapter.startAdvertising({
      serviceUUIDs: [this.config.ble.serviceUUID],
      localName: `GTCX-${this.getLocalNodeId().slice(-8)}`,
      manufacturerData: this.createAdvertisingData(),
    });

    // Start scanning for neighbors
    await this.bleAdapter.startScanning([this.config.ble.serviceUUID], async (device) => {
      await this.handleDiscoveredBLEDevice(device);
    });
  }

  private async startLoRaMesh(): Promise<void> {
    if (!this.loraAdapter) return;

    await this.loraAdapter.configure({
      frequency: this.config.lora!.frequency,
      spreadingFactor: this.config.lora!.spreadingFactor,
      bandwidth: this.config.lora!.bandwidth,
    });

    this.loraAdapter.onReceive(async (data) => {
      const message = this.deserializeLoRaMessage(data);
      if (message) {
        await this.handleMessage('lora', message);
      }
    });
  }

  private startRouteMaintenanceLoop(): void {
    setInterval(() => {
      // Remove expired routes
      const now = new Date();
      for (const [dest, route] of this.routingTable) {
        if (new Date(route.expires) < now) {
          this.routingTable.delete(dest);
        }
      }

      // Send route advertisements
      this.sendRouteAdvertisement();
    }, 60000); // Every minute
  }

  private updateRoutingFromMessage(source: string, message: MessageEnvelope): void {
    // Learn routes from message hops
    const hops = message.routing.hops;

    for (let i = 0; i < hops.length; i++) {
      const node = hops[i];
      const hopCount = hops.length - i;

      const existing = this.routingTable.get(node);
      if (!existing || existing.hopCount > hopCount) {
        this.routingTable.set(node, {
          destination: node,
          nextHop: source,
          hopCount,
          lastUpdated: new Date().toISOString(),
          metric: hopCount,
          expires: new Date(Date.now() + 300000).toISOString(), // 5 min
        });
      }
    }
  }
}

interface MeshNeighbor {
  nodeId: string;
  transport: 'ble' | 'lora' | 'wifi';
  rssi: number;
  lastSeen: Date;
}
```

---

## 9.6 Consensus Messaging (PANX)

### 9.6.1 PANX Message Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PANX CONSENSUS FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CLIENT              LEADER               VALIDATORS (n)                │
│    │                   │                      │                         │
│    │ 1. REQUEST        │                      │                         │
│    │──────────────────►│                      │                         │
│    │                   │                      │                         │
│    │                   │ 2. PRE-PREPARE       │                         │
│    │                   │─────────────────────►│                         │
│    │                   │                      │                         │
│    │                   │ 3. PREPARE           │                         │
│    │                   │◄─────────────────────│                         │
│    │                   │─────────────────────►│                         │
│    │                   │      (all-to-all)    │                         │
│    │                   │                      │                         │
│    │                   │ 4. COMMIT            │                         │
│    │                   │◄─────────────────────│                         │
│    │                   │─────────────────────►│                         │
│    │                   │      (all-to-all)    │                         │
│    │                   │                      │                         │
│    │ 5. REPLY          │                      │                         │
│    │◄──────────────────│◄─────────────────────│                         │
│    │   (f+1 matching)  │                      │                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.6.2 Consensus Message Schemas

```typescript
// network/consensus-messages.ts
import { z } from 'zod';

/**
 * PANX Request message
 */
export const PANXRequestSchema = z.object({
  type: z.literal('panx.request'),
  requestId: z.string().uuid(),

  /** Client information */
  client: z.object({
    did: GTCXDIDSchema,
    publicKey: PublicKeyMultibaseSchema,
  }),

  /** Operation to validate */
  operation: z.object({
    type: z.enum([
      'custody_transfer',
      'settlement_release',
      'gci_update',
      'credential_issue',
      'emergency_action',
    ]),
    data: z.record(z.string(), z.unknown()),
    requiredWeight: z.number().min(0).max(1).default(0.67),
  }),

  /** Timestamp */
  timestamp: DateTimeSchema,

  /** Client signature */
  signature: SignatureSchema,
});

export type PANXRequest = z.infer<typeof PANXRequestSchema>;

/**
 * PANX Pre-Prepare message (leader only)
 */
export const PANXPrePrepareSchema = z.object({
  type: z.literal('panx.pre_prepare'),

  /** View number */
  view: z.number().int().nonnegative(),

  /** Sequence number */
  sequence: z.number().int().nonnegative(),

  /** Digest of request */
  requestDigest: SHA256HashSchema,

  /** Original request */
  request: PANXRequestSchema,

  /** Leader information */
  leader: z.object({
    validatorId: z.string(),
    weight: z.number(),
  }),

  /** Leader signature */
  signature: SignatureSchema,
});

export type PANXPrePrepare = z.infer<typeof PANXPrePrepareSchema>;

/**
 * PANX Prepare message
 */
export const PANXPrepareSchema = z.object({
  type: z.literal('panx.prepare'),

  view: z.number().int().nonnegative(),
  sequence: z.number().int().nonnegative(),
  requestDigest: SHA256HashSchema,

  /** Validator information */
  validator: z.object({
    validatorId: z.string(),
    tier: z.enum(['government', 'enterprise', 'community', 'academic']),
    weight: z.number(),
  }),

  /** Validator's vote */
  vote: z.enum(['approve', 'reject', 'abstain']),

  /** Reason for rejection (if applicable) */
  rejectReason: z.string().optional(),

  /** Validator signature */
  signature: SignatureSchema,
});

export type PANXPrepare = z.infer<typeof PANXPrepareSchema>;

/**
 * PANX Commit message
 */
export const PANXCommitSchema = z.object({
  type: z.literal('panx.commit'),

  view: z.number().int().nonnegative(),
  sequence: z.number().int().nonnegative(),
  requestDigest: SHA256HashSchema,

  /** Validator information */
  validator: z.object({
    validatorId: z.string(),
    weight: z.number(),
  }),

  /** Commit confirmation */
  committed: z.boolean(),

  /** Validator signature */
  signature: SignatureSchema,
});

export type PANXCommit = z.infer<typeof PANXCommitSchema>;

/**
 * PANX Reply message
 */
export const PANXReplySchema = z.object({
  type: z.literal('panx.reply'),

  requestId: z.string().uuid(),
  view: z.number().int().nonnegative(),
  sequence: z.number().int().nonnegative(),

  /** Result */
  result: z.enum(['approved', 'rejected', 'timeout']),

  /** Aggregated weight of approvals */
  approvalWeight: z.number().min(0).max(1),

  /** Vote breakdown */
  votes: z.array(
    z.object({
      validatorId: z.string(),
      tier: z.string(),
      weight: z.number(),
      vote: z.enum(['approve', 'reject', 'abstain']),
    })
  ),

  /** Execution result (if approved) */
  execution: z
    .object({
      success: z.boolean(),
      txId: z.string().optional(),
      error: z.string().optional(),
    })
    .optional(),

  /** Timestamp */
  timestamp: DateTimeSchema,

  /** Aggregate signature */
  aggregateSignature: z.string(),
});

export type PANXReply = z.infer<typeof PANXReplySchema>;
```

### 9.6.3 Validator Weight Configuration

```typescript
// network/validator-weights.ts

/**
 * PANX Validator tier configuration
 */
export const ValidatorTiers = {
  government: {
    baseWeight: 0.4,
    maxValidators: 5,
    minStake: 100000, // USD equivalent
    requirements: ['government_attestation', 'kyb_verified'],
  },
  enterprise: {
    baseWeight: 0.3,
    maxValidators: 10,
    minStake: 50000,
    requirements: ['business_license', 'kyb_verified', 'financial_audit'],
  },
  community: {
    baseWeight: 0.2,
    maxValidators: 20,
    minStake: 5000,
    requirements: ['cooperative_membership', 'community_endorsement'],
  },
  academic: {
    baseWeight: 0.1,
    maxValidators: 5,
    minStake: 10000,
    requirements: ['institutional_affiliation', 'research_credentials'],
  },
} as const;

/**
 * Calculate effective validator weight
 */
export function calculateValidatorWeight(
  validator: ValidatorInfo,
  tier: keyof typeof ValidatorTiers
): number {
  const tierConfig = ValidatorTiers[tier];
  const baseWeight = tierConfig.baseWeight;

  // Weight distributed among validators in tier
  const tierValidatorCount = validator.tierValidatorCount;
  const perValidatorWeight = baseWeight / tierConfig.maxValidators;

  // Reputation modifier (0.8 to 1.2)
  const reputationModifier = 0.8 + validator.reputation / 250;

  // Stake modifier (bonus for excess stake)
  const stakeModifier = Math.min(
    1.2,
    1 + (validator.stake - tierConfig.minStake) / (tierConfig.minStake * 10)
  );

  return perValidatorWeight * reputationModifier * stakeModifier;
}

interface ValidatorInfo {
  validatorId: string;
  tier: string;
  reputation: number; // 0-100
  stake: number;
  tierValidatorCount: number;
}
```

---

## 9.7 Sync Protocols

### 9.7.1 Offline Sync Architecture

```typescript
// network/sync.ts
import { z } from 'zod';

/**
 * Sync request schema
 */
export const SyncRequestSchema = z.object({
  type: z.literal('sync.request'),

  /** Requesting node */
  nodeId: z.string(),

  /** Sync scope */
  scope: z.enum([
    'full', // Full sync from genesis
    'incremental', // Delta sync since checkpoint
    'selective', // Specific data types only
  ]),

  /** Checkpoint for incremental sync */
  checkpoint: z
    .object({
      sequenceNumber: z.number().int(),
      merkleRoot: SHA256HashSchema,
      timestamp: DateTimeSchema,
    })
    .optional(),

  /** Filters for selective sync */
  filters: z
    .object({
      entityTypes: z.array(z.string()).optional(),
      jurisdictions: z.array(z.string()).optional(),
      sinceTimestamp: DateTimeSchema.optional(),
    })
    .optional(),

  /** Bandwidth hints */
  bandwidth: z
    .object({
      maxBytesPerSecond: z.number().int().optional(),
      preferCompression: z.boolean().default(true),
    })
    .optional(),
});

export type SyncRequest = z.infer<typeof SyncRequestSchema>;

/**
 * Sync response schema
 */
export const SyncResponseSchema = z.object({
  type: z.literal('sync.response'),

  /** Response to request */
  requestId: z.string(),

  /** Sync status */
  status: z.enum(['complete', 'partial', 'error']),

  /** Data batches */
  batches: z.array(
    z.object({
      batchId: z.string(),
      sequenceStart: z.number().int(),
      sequenceEnd: z.number().int(),
      entityCount: z.number().int(),
      compressedSize: z.number().int(),
      merkleRoot: SHA256HashSchema,
      data: z.string(), // Base64 encoded, possibly compressed
    })
  ),

  /** New checkpoint */
  newCheckpoint: z.object({
    sequenceNumber: z.number().int(),
    merkleRoot: SHA256HashSchema,
    timestamp: DateTimeSchema,
  }),

  /** Continuation token for pagination */
  continuationToken: z.string().optional(),

  /** Error details */
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

export type SyncResponse = z.infer<typeof SyncResponseSchema>;

/**
 * Offline sync service
 */
export class OfflineSyncService {
  private queue: OfflineQueue;
  private checkpoint: SyncCheckpoint;

  constructor(
    private readonly storage: ILocalStorage,
    private readonly network: INetworkService,
    private readonly logger: ILogger
  ) {
    this.queue = new OfflineQueue(storage);
    this.checkpoint = this.loadCheckpoint();
  }

  /**
   * Queue operation for sync when online
   */
  async queueOperation(operation: QueuedOperation): Promise<void> {
    await this.queue.enqueue({
      ...operation,
      queuedAt: new Date().toISOString(),
      retryCount: 0,
    });
  }

  /**
   * Sync with network when connectivity available
   */
  async sync(): Promise<SyncResult> {
    const result: SyncResult = {
      uploaded: 0,
      downloaded: 0,
      conflicts: [],
      errors: [],
    };

    try {
      // 1. Upload queued operations
      await this.uploadQueuedOperations(result);

      // 2. Download updates since checkpoint
      await this.downloadUpdates(result);

      // 3. Resolve any conflicts
      await this.resolveConflicts(result);

      // 4. Update checkpoint
      await this.updateCheckpoint();
    } catch (error) {
      result.errors.push({
        phase: 'sync',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return result;
  }

  private async uploadQueuedOperations(result: SyncResult): Promise<void> {
    const operations = await this.queue.getAll();

    for (const op of operations) {
      try {
        const response = await this.network.sendMessage({
          type: op.type as MessageType,
          payload: op.payload,
          priority: 'high',
        });

        if (response.success) {
          await this.queue.remove(op.id);
          result.uploaded++;
        } else {
          op.retryCount++;
          if (op.retryCount >= 3) {
            result.errors.push({
              phase: 'upload',
              operationId: op.id,
              error: response.error || 'Max retries exceeded',
            });
            await this.queue.remove(op.id);
          } else {
            await this.queue.update(op);
          }
        }
      } catch (error) {
        result.errors.push({
          phase: 'upload',
          operationId: op.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private async downloadUpdates(result: SyncResult): Promise<void> {
    let continuationToken: string | undefined;

    do {
      const response = await this.network.sendSyncRequest({
        scope: 'incremental',
        checkpoint: this.checkpoint,
        continuationToken,
      });

      for (const batch of response.batches) {
        const data = await this.decompressAndVerify(batch);
        await this.applyBatch(data, result);
      }

      continuationToken = response.continuationToken;
    } while (continuationToken);
  }

  private async resolveConflicts(result: SyncResult): Promise<void> {
    // Use CRDT merge for automatic conflict resolution
    const conflicts = await this.storage.getConflicts();

    for (const conflict of conflicts) {
      const resolved = this.crdtMerge(conflict.local, conflict.remote);
      await this.storage.resolveConflict(conflict.id, resolved);
      result.conflicts.push({
        entityId: conflict.entityId,
        resolution: 'crdt_merge',
      });
    }
  }

  private crdtMerge(local: any, remote: any): any {
    // Last-writer-wins with vector clock comparison
    if (local._vectorClock && remote._vectorClock) {
      const comparison = compareVectorClocks(local._vectorClock, remote._vectorClock);
      if (comparison > 0) return local;
      if (comparison < 0) return remote;
    }

    // Timestamp fallback
    const localTime = new Date(local.updatedAt || 0).getTime();
    const remoteTime = new Date(remote.updatedAt || 0).getTime();

    return remoteTime > localTime ? remote : local;
  }
}

interface SyncResult {
  uploaded: number;
  downloaded: number;
  conflicts: Array<{ entityId: string; resolution: string }>;
  errors: Array<{ phase: string; operationId?: string; error: string }>;
}

interface SyncCheckpoint {
  sequenceNumber: number;
  merkleRoot: string;
  timestamp: string;
}

interface QueuedOperation {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  queuedAt: string;
  retryCount: number;
}
```

---

## 9.8 Network Security

### 9.8.1 Message Authentication

```typescript
// network/security.ts

/**
 * Message authentication
 */
export class MessageAuthenticator {
  constructor(
    private readonly signer: ISigner,
    private readonly verifier: IVerifier
  ) {}

  /**
   * Sign outgoing message
   */
  async signMessage(message: Omit<MessageEnvelope, 'signature'>): Promise<MessageEnvelope> {
    // Create canonical representation
    const canonical = this.canonicalize(message);

    // Sign the canonical form
    const signature = await this.signer.sign(new TextEncoder().encode(canonical));

    return {
      ...message,
      signature: {
        algorithm: 'Ed25519',
        keyId: this.signer.getKeyId(),
        value: signature.value,
      },
    };
  }

  /**
   * Verify incoming message
   */
  async verifyMessage(message: MessageEnvelope): Promise<boolean> {
    // Extract signature
    const { signature, ...messageWithoutSig } = message;

    // Get sender's public key
    const publicKey = await this.verifier.getPublicKey(message.sender.nodeId);
    if (!publicKey) {
      return false;
    }

    // Verify signature
    const canonical = this.canonicalize(messageWithoutSig);
    return this.verifier.verify(new TextEncoder().encode(canonical), signature.value, publicKey);
  }

  private canonicalize(obj: Record<string, unknown>): string {
    // JSON Canonicalization Scheme (RFC 8785)
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
}

/**
 * Replay protection
 */
export class ReplayProtector {
  private seenMessages: LRUCache<string, number>;
  private readonly windowMs: number;

  constructor(windowMs: number = 300000) {
    // 5 minute window
    this.seenMessages = new LRUCache({ max: 100000, ttl: windowMs });
    this.windowMs = windowMs;
  }

  /**
   * Check if message is replay
   */
  isReplay(messageId: string, timestamp: string): boolean {
    // Check if already seen
    if (this.seenMessages.has(messageId)) {
      return true;
    }

    // Check timestamp freshness
    const messageTime = new Date(timestamp).getTime();
    const now = Date.now();

    if (Math.abs(now - messageTime) > this.windowMs) {
      return true; // Too old or too far in future
    }

    // Mark as seen
    this.seenMessages.set(messageId, now);
    return false;
  }
}
```

---

## 9.9 Performance Targets

| Metric                         | Target     | Measurement         |
| ------------------------------ | ---------- | ------------------- |
| **Message Latency (regional)** | <100ms     | P95 one-way         |
| **Message Latency (global)**   | <500ms     | P95 one-way         |
| **Consensus Finality**         | <3s        | Time to commit      |
| **Throughput**                 | >5,000 TPS | Messages per second |
| **Peer Discovery**             | <30s       | Bootstrap time      |
| **Mesh Formation**             | <60s       | Local cluster       |
| **Offline Queue**              | 45 days    | Max duration        |
| **Sync Speed**                 | >1 MB/s    | Download rate       |

---

## 9.10 Integration Points

### 9.10.1 Inputs

| Source           | Data           | Purpose                     |
| ---------------- | -------------- | --------------------------- |
| **All Services** | Messages       | Inter-service communication |
| **Edge Devices** | Operations     | Field data collection       |
| **Validators**   | Consensus msgs | PANX participation          |

### 9.10.2 Outputs

| Destination    | Data            | Purpose                |
| -------------- | --------------- | ---------------------- |
| **TradePass™** | Identity msgs   | Credential sync        |
| **GCI™**       | Score updates   | Compliance data        |
| **VaultMark™** | Custody msgs    | Transfer coordination  |
| **PvP™**       | Settlement msgs | Payment coordination   |
| **PANX™**      | Consensus       | Verification consensus |

---

_End of Section 9_
