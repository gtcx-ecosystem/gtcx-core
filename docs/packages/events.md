# @gtcx/events

Type-safe event contracts and offline-capable event bus for GTCX Protocol.

## Overview

This package provides the communication backbone for GTCX Protocol:

| Component | Purpose | Principles |
|-----------|---------|------------|
| **Event Types** | Type-safe contracts per protocol | P2, P7 |
| **EventBus** | Pub/sub event handling | P4, P12 |
| **OfflineEventQueue** | Persist events when offline | P8 |
| **Serialization** | Storage and transport utilities | P11 |

```
┌─────────────────────────────────────────────────────────────┐
│                      @gtcx/events                           │
│                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│   │   Types     │   │  EventBus   │   │   Queue     │      │
│   │             │   │             │   │             │      │
│   │ TradePass   │   │ emit()      │   │ enqueue()   │      │
│   │ GeoTag      │   │ on()        │   │ sync()      │      │
│   │ VaultMark   │   │ onProtocol()│   │ getStats()  │      │
│   │ PvP         │   │ onAny()     │   │             │      │
│   │ GCI         │   │             │   │   P8: 72h   │      │
│   │ PANX        │   │             │   │   offline   │      │
│   └─────────────┘   └─────────────┘   └─────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

```bash
pnpm add @gtcx/events
```

---

## Quick Start

### Basic Event Handling

```typescript
import { EventBus } from '@gtcx/events';
import type { CredentialIssuedEvent } from '@gtcx/events/types';

const bus = new EventBus();

// Subscribe to specific event type
bus.on('TRADEPASS.CREDENTIAL_ISSUED', (event) => {
  console.log('New credential:', event.payload.tradePassId);
  console.log('Tier:', event.payload.tier);
});

// Subscribe to all events from a protocol
bus.onProtocol('geotag', (event) => {
  console.log('GeoTag event:', event.type);
});

// Subscribe to all events
bus.onAny((event) => {
  console.log(`[${event.timestamp}] ${event.type}`);
});

// Emit an event
await bus.emit({
  id: crypto.randomUUID(),
  type: 'TRADEPASS.CREDENTIAL_ISSUED',
  timestamp: new Date().toISOString(),
  version: 1,
  source: { service: 'tradepass' },
  payload: {
    tradePassId: 'tp-123',
    tier: 'BASIC',
    issuedBy: 'system',
    expiresAt: '2026-01-01T00:00:00Z',
    capabilities: ['basic-verification'],
  },
  meta: {},
});
```

### Offline Event Queue (P8)

```typescript
import { OfflineEventQueue, InMemoryQueueStorage } from '@gtcx/events';

// Create queue with 72-hour offline limit (P8)
const queue = new OfflineEventQueue({
  storage: new InMemoryQueueStorage(), // Use AsyncStorage in React Native
  maxEventAge: 72,
});

// Queue events when offline
await queue.enqueue(event);

// Check queue status
const stats = await queue.getStats();
console.log(`${stats.pending} events pending`);

// Sync when back online
const result = await queue.sync(async (event) => {
  await api.sendEvent(event);
});

console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
```

---

## Event Types

### Structure

Every GTCX event follows this structure:

```typescript
interface GTCXEvent<T, P> {
  id: string;           // UUID
  type: T;              // Event type discriminant
  timestamp: string;    // ISO 8601
  version: 1;           // Schema version
  source: EventSource;  // Origin service
  payload: P;           // Type-specific payload
  meta: EventMeta;      // Tracing, correlation, offline
}
```

### Protocol Events

| Protocol | Events | Example |
|----------|--------|---------|
| **TradePass** | 16 | `CREDENTIAL_ISSUED`, `TIER_UPGRADED` |
| **GeoTag** | 10 | `PROOF_CREATED`, `ANOMALY_DETECTED` |
| **VaultMark** | 15 | `CUSTODY_TRANSFERRED`, `CHAIN_BROKEN` |
| **PvP** | 15 | `SETTLEMENT_COMPLETED`, `ESCROW_RELEASED` |
| **GCI** | 13 | `SCORE_CALCULATED`, `CERTIFICATION_GRANTED` |
| **PANX** | 14 | `CONSENSUS_REACHED`, `PRICE_PUBLISHED` |

### Type Safety

Events are fully typed with discriminated unions:

```typescript
import type { TradePassEvent } from '@gtcx/events/types';

function handleEvent(event: TradePassEvent) {
  switch (event.type) {
    case 'TRADEPASS.CREDENTIAL_ISSUED':
      // event.payload is CredentialIssuedPayload
      console.log(event.payload.tradePassId);
      break;
    case 'TRADEPASS.TIER_UPGRADED':
      // event.payload is TierChangedPayload
      console.log(event.payload.previousTier, '→', event.payload.newTier);
      break;
  }
}
```

---

## API Reference

### EventBus

```typescript
class EventBus {
  // Subscribe to specific event type
  on<T>(type: T, handler: EventHandler): Unsubscribe;
  
  // Subscribe to all events from a protocol
  onProtocol(protocol: string, handler: EventHandler): Unsubscribe;
  
  // Subscribe to all events
  onAny(handler: EventHandler): Unsubscribe;
  
  // Subscribe with custom filter
  onFiltered(filter: EventFilter, handler: EventHandler): Unsubscribe;
  
  // Subscribe once
  once<T>(type: T, handler: EventHandler): Unsubscribe;
  
  // Emit event
  emit(event: GTCXEvent): Promise<void>;
  
  // Emit multiple events
  emitAll(events: GTCXEvent[]): Promise<void>;
  
  // Utilities
  handlerCount(type?: string): number;
  hasHandlers(type: string): boolean;
  clear(): void;
}
```

### OfflineEventQueue

```typescript
class OfflineEventQueue {
  // Queue operations
  enqueue(event: GTCXEvent, priority?: number): Promise<string>;
  dequeue(queueId: string): Promise<void>;
  get(queueId: string): Promise<QueuedEvent | null>;
  getAll(): Promise<QueuedEvent[]>;
  getStats(): Promise<QueueStats>;
  clear(): Promise<void>;
  
  // Sync operations
  sync(sender: (event) => Promise<void>): Promise<SyncResult>;
  syncToBus(bus: EventBus): Promise<SyncResult>;
  
  // Connectivity
  setOnline(online: boolean): void;
  getOnlineStatus(): boolean;
}
```

### Serialization

```typescript
// Serialize/deserialize
serializeEvent(event): string;
deserializeEvent(json): GTCXEvent;
safeDeserializeEvent(json): GTCXEvent | null;

// Validation
validateEvent(obj): boolean;
parseEvent(obj): { success, event?, errors? };

// Transformation
cloneEvent(event, overrides?): GTCXEvent;
createReplyEvent(original, type, payload, source): GTCXEvent;

// Filtering
filterByProtocol(events, protocol): GTCXEvent[];
filterByTimeRange(events, start, end): GTCXEvent[];
filterByCorrelation(events, correlationId): GTCXEvent[];

// Utilities
formatEvent(event): string;
eventSizeBytes(event): number;
buildCausationTree(events): Map<string, GTCXEvent[]>;
```

---

## Event Metadata

### Correlation & Tracing

```typescript
interface EventMeta {
  correlationId?: string;  // Links related events
  causationId?: string;    // What caused this event
  traceId?: string;        // Distributed tracing
  actorId?: string;        // Who triggered the event
  actorType?: 'user' | 'system' | 'service' | 'scheduled';
}
```

### Offline Support (P8)

```typescript
interface EventMeta {
  offline?: boolean;       // Created while offline
  syncedAt?: string;       // When synced to server
}
```

### Geographic Context

```typescript
interface EventMeta {
  geo?: {
    country?: string;      // ISO 3166-1 alpha-2
    region?: string;
    coordinates?: { lat: number; lng: number };
  };
  device?: {
    id?: string;
    type?: 'mobile' | 'tablet' | 'desktop' | 'server';
  };
}
```

---

## Principle Alignment

| Principle | Implementation |
|-----------|----------------|
| **P1** Package Structure | Clear module separation |
| **P2** Type Safety | Zod schemas, discriminated unions |
| **P3** Modularity | Small, focused functions |
| **P4** Composability | Pluggable storage, handlers |
| **P5** AI-Native | Structured events for ML analysis |
| **P6** Asset Abstraction | Protocol-agnostic event base |
| **P7** Documentation | JSDoc, README, examples |
| **P8** Offline-First | 72-hour queue, sync on reconnect |
| **P9** Security | Event validation, source tracking |
| **P10** API Stability | Versioned event schemas |
| **P11** Data Evolution | Schema version field |
| **P12** Observability | Correlation IDs, tracing |

---

## Storage Adapters

### React Native (AsyncStorage)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage: QueueStorage = {
  async get(key) {
    return AsyncStorage.getItem(key);
  },
  async set(key, value) {
    await AsyncStorage.setItem(key, value);
  },
  async delete(key) {
    await AsyncStorage.removeItem(key);
  },
  async keys(prefix) {
    const all = await AsyncStorage.getAllKeys();
    return all.filter(k => k.startsWith(prefix));
  },
  async clear(prefix) {
    const keys = await this.keys(prefix);
    await AsyncStorage.multiRemove(keys);
  },
};
```

### Browser (IndexedDB)

```typescript
// Use idb-keyval or similar
import { get, set, del, keys, clear } from 'idb-keyval';

const storage: QueueStorage = {
  get: (key) => get(key),
  set: (key, value) => set(key, value),
  delete: (key) => del(key),
  keys: async (prefix) => {
    const all = await keys();
    return all.filter(k => String(k).startsWith(prefix));
  },
  clear: async (prefix) => {
    const toDelete = await storage.keys(prefix);
    for (const key of toDelete) await del(key);
  },
};
```

---

## Related

- [@gtcx/sync](./sync.md) — Synchronization engine that consumes events from the offline queue
- [@gtcx/api-client](./api-client.md) — API client that emits events on sync completion
- [@gtcx/domain](./domain.md) — Domain services that emit typed domain events via this bus
- [EventCore Specification](../specs/eventcore.md) — Canonical event envelope format for supply-chain events
- [Data Models](../specs/data-models.md) — Schema definitions referenced by event payloads
