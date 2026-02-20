# @gtcx/sync

Offline-first synchronization engine for GTCX Protocol. Handles change tracking, conflict detection, and protocol-specific resolution strategies.

## Installation

```bash
pnpm add @gtcx/sync
```

## Quick Start

```typescript
import { SyncEngine } from '@gtcx/sync';

// Create engine
const engine = new SyncEngine({
  instanceId: 'device-123',
  storage: new AsyncStorageAdapter(),
  connectivity: new NetworkInfoProvider(),
  autoSyncInterval: 30000, // 30 seconds
  syncOnConnect: true,
});

// Register protocols
engine.registerProtocol({
  protocol: 'tradepass',
  strategy: 'last-write-wins',
  endpoints: {
    getChanges: async (since, cursor) => api.getChanges(since, cursor),
    pushChanges: async (changes) => api.pushChanges(changes),
  },
});

// Start syncing
await engine.start();
```

## Tracking Changes

```typescript
// Track a local change
await engine.trackChange({
  protocol: 'tradepass',
  type: 'update',
  entityId: 'tp-123',
  entityType: 'credential',
  previousValue: oldCredential,
  newValue: newCredential,
});

// Get pending changes
const pending = await engine.getPendingChanges('tradepass');
```

## Conflict Resolution

Each protocol has a default resolution strategy:

| Protocol  | Strategy          | Rationale                                      |
| --------- | ----------------- | ---------------------------------------------- |
| TradePass | `last-write-wins` | Most recent credential update is authoritative |
| GeoTag    | `append-only`     | Location proofs are immutable, never overwrite |
| VaultMark | `chain-validated` | Custody chain integrity must be maintained     |
| PvP       | `highest-version` | Latest settlement state wins                   |
| GCI       | `highest-version` | Compliance scores use version numbers          |
| PANX      | `server-wins`     | Oracle prices are server-authoritative         |

### Manual Resolution

```typescript
// Get unresolved conflicts
const conflicts = engine.getUnresolvedConflicts('vaultmark');

// Resolve manually
await engine.resolveManually(conflictId, chosenValue);
```

## Storage Adapter

Implement `SyncStorage` for your platform:

```typescript
interface SyncStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  keys(prefix: string): Promise<string[]>;
  clear(prefix: string): Promise<void>;
  getMany<T>(keys: string[]): Promise<Map<string, T>>;
  setMany<T>(entries: Map<string, T>): Promise<void>;
}
```

### React Native Example

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage: SyncStorage = {
  async get(key) {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  async set(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async delete(key) {
    await AsyncStorage.removeItem(key);
  },
  async keys(prefix) {
    const all = await AsyncStorage.getAllKeys();
    return all.filter((k) => k.startsWith(prefix));
  },
  // ... implement others
};
```

## Connectivity Provider

```typescript
import NetInfo from '@react-native-community/netinfo';

const connectivity: ConnectivityProvider = {
  isOnline: () => NetInfo.fetch().then((state) => state.isConnected ?? false),
  onConnectivityChange: (callback) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      callback(state.isConnected ?? false);
    });
    return unsubscribe;
  },
};
```

## Events

Subscribe to sync events:

```typescript
engine.registerProtocol({
  // ...
  eventBus: {
    emit: (event) => {
      switch (event.type) {
        case 'SYNC_COMPLETED':
          console.log('Sync done:', event.result);
          break;
        case 'CONFLICT_DETECTED':
          showConflictUI(event.conflict);
          break;
        case 'OFFLINE_CHANGES_WARNING':
          showWarning(`${event.count} changes pending for ${event.oldestAge}h`);
          break;
      }
    },
  },
});
```

## Audit and Metrics Hooks (Low-Level)

For platform-specific integrations, the low-level `createSyncEngine` provides audit and metrics callbacks:

```typescript
import { createSyncEngine } from '@gtcx/sync';

const engine = createSyncEngine({
  onAudit: (event) => {
    console.log('audit', event.type, event.id);
  },
  onMetrics: (metrics) => {
    console.log('sync metrics', metrics);
  },
});
```

## Custom Strategies

```typescript
import { BaseStrategy, StrategyRegistry } from '@gtcx/sync';

class MyCustomStrategy extends BaseStrategy {
  readonly name = 'my-custom';
  readonly description = 'My custom resolution logic';

  canHandle(conflict) {
    return conflict.protocol === 'my-protocol';
  }

  async resolve(conflict) {
    // Custom logic
    return this.createResolution(conflict, resolvedValue);
  }

  explain(conflict) {
    return 'Explanation of how this works';
  }
}

// Register globally
globalStrategyRegistry.register('my-custom', new MyCustomStrategy());
```

## Principle Alignment

| Principle                | Implementation                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| P1 Single Responsibility | Each class has one job                                            |
| P2 Type Safety           | Full Zod validation, discriminated unions                         |
| P4 Dependency Injection  | Storage, connectivity, strategies injectable                      |
| P8 Offline-First         | **Core purpose** - changes tracked offline, synced when connected |
| P9 Security              | Changes include hashes, sources tracked                           |
| P11 Versioning           | Change versions for optimistic locking                            |
| P12 Observability        | All sync events emitted                                           |

## API Reference

### SyncEngine

| Method                               | Description                      |
| ------------------------------------ | -------------------------------- |
| `start()`                            | Start the sync engine            |
| `stop()`                             | Stop the sync engine             |
| `registerProtocol(config)`           | Register a protocol for syncing  |
| `trackChange(params)`                | Track a local change             |
| `sync(protocol?)`                    | Trigger manual sync              |
| `getState()`                         | Get current sync state           |
| `getUnresolvedConflicts(protocol?)`  | Get conflicts needing resolution |
| `resolveManually(conflictId, value)` | Manually resolve a conflict      |

### ChangeTracker

| Method                    | Description               |
| ------------------------- | ------------------------- |
| `track(params)`           | Record a new change       |
| `getPending(protocol?)`   | Get pending changes       |
| `markSynced(changeIds)`   | Mark changes as synced    |
| `clearPending(protocol?)` | Clear all pending changes |

### ConflictDetector

| Method                          | Description                          |
| ------------------------------- | ------------------------------------ |
| `detect(local, remote)`         | Detect conflicts between change sets |
| `detectConflict(local, remote)` | Detect conflict between two changes  |

## Security

Changes are tracked with hashes of previous and new values, enabling tamper detection during sync. Source identity (`instanceId`) is included in every change record so the server can verify the origin.

Conflict resolution strategies are protocol-specific because different data types have different integrity requirements. For example, `chain-validated` for VaultMark ensures custody chain continuity, while `append-only` for GeoTag preserves the immutability of location proofs.

## Related

- [@gtcx/events](./events.md) — Event bus used for sync lifecycle events
- [@gtcx/api-client](./api-client.md) — Uses sync engine for offline request queuing
- [@gtcx/connectivity](./connectivity.md) — Provides connectivity detection for auto-sync triggers
- [Data Models](../specs/data-models.md) — Schema definitions for synced entities
- [Shared Infrastructure](../architecture/shared-infrastructure.md) — Sync strategy by connectivity profile
