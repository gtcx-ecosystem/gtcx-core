# @gtcx/domain

Commodity-agnostic domain services for GTCX Protocol. Provides asset registration, trading, and compliance services with full dependency injection, offline queue support, and AI-native observability.

## Installation

```bash
pnpm add @gtcx/domain zod
```

## Quick Start

```typescript
import {
  AssetLotRegistrationService,
  TradingService,
  UnifiedComplianceService,
  InMemoryEventEmitter,
  InMemoryMetricsCollector,
  InMemoryOperationLogger,
  OfflineQueue,
} from '@gtcx/domain';

// Create observability infrastructure
const eventEmitter = new InMemoryEventEmitter();
const metrics = new InMemoryMetricsCollector();
const operationLogger = new InMemoryOperationLogger();
const offlineQueue = new OfflineQueue();

// Subscribe to all events
eventEmitter.onAny((event) => {
  console.log(`[${event.type}]`, event.payload);
});

// Create services with full dependency injection
const registration = new AssetLotRegistrationService(
  {
    cryptoService, // Your ICryptoService implementation
    locationService, // Your ILocationService implementation
    storageService, // Your IStorageService implementation
    eventEmitter, // Domain events
  },
  {
    minPhotos: 2,
    minGpsAccuracy: 10,
  }
);

// Register asset (all input validated at runtime via Zod)
const assetLot = await registration.registerAssetLot({
  commodityType: 'gold',
  producerId: '550e8400-e29b-41d4-a716-446655440000',
  discoveryLocation: {
    latitude: 5.5502,
    longitude: -1.55,
    accuracy: 5,
    timestamp: Date.now(),
  },
  photos: [
    { uri: 'file://photo1.jpg', timestamp: Date.now() },
    { uri: 'file://photo2.jpg', timestamp: Date.now() },
  ],
  estimatedWeight: 250,
  weightUnit: 'g',
});
```

---

## API Reference

### Services

#### AssetLotRegistrationService

```typescript
import { AssetLotRegistrationService } from '@gtcx/domain';

const service = new AssetLotRegistrationService(dependencies, {
  minGpsAccuracy: 10, // Max GPS error (meters)
  minPhotos: 2, // Minimum photos required
  maxPhotos: 10, // Maximum photos allowed
  maxDiscoveryAgeDays: 30, // Max age of discovery
});

// Methods
service.getWorkflowSteps(); // Get registration steps
service.validateRegistrationData(data); // Validate before submit
service.calculateProgress(partialData); // Check completion %
await service.registerAssetLot(data); // Full registration
```

#### TradingService

```typescript
import { TradingService } from '@gtcx/domain';

const service = new TradingService(dependencies, {
  defaultCurrency: 'USD',
  defaultSpread: 2.5,
  sellerMarkup: 5,
  highValueThreshold: 10000,
});

// Methods
await service.getCurrentMarketPrices('gold', ['nugget', 'dust']);
await service.calculateFairPrice(assetLot);
await service.findTradingOpportunities({ commodityType: 'gold', minPurity: 90 });
await service.executeTrade(tradeRequest);
await service.getTradeAnalytics('gold', '7d');
```

#### UnifiedComplianceService

```typescript
import { UnifiedComplianceService } from '@gtcx/domain';

const service = new UnifiedComplianceService(dependencies, {
  defaultJurisdiction: 'GH',
  highValueThreshold: 10000,
});

// Methods
service.registerFramework(ghanaFramework); // Add regulations
await service.checkAssetLotCompliance(assetLot); // Check asset
await service.checkTransactionCompliance(tx); // Check transaction
await service.generateComplianceReport(options); // Generate report
await service.getComplianceDashboard(); // Get overview
```

---

### Validation (P2 + P9)

All input is validated at runtime using Zod schemas:

```typescript
import {
  validateRegistrationData,
  safeValidateTradeRequest,
  AssetRegistrationDataSchema,
} from '@gtcx/domain';

// Throws ZodError on invalid input
const validated = validateRegistrationData(untrustedInput);

// Safe parse - returns result object
const result = safeValidateTradeRequest(data);
if (!result.success) {
  console.error(result.error.errors);
}

// Direct schema access
const custom = AssetRegistrationDataSchema.pick({ commodityType: true });
```

**Available Schemas:**

- `AssetRegistrationDataSchema` - Asset registration input
- `TradeRequestSchema` - Trade execution input
- `ComplianceReportOptionsSchema` - Report generation options
- `LocationSchema` - GPS coordinates
- `PhotoMetadataSchema` - Photo evidence
- Primitive schemas: `UuidSchema`, `CurrencyCodeSchema`, `PercentageSchema`

---

### Events (P12)

All services emit typed domain events:

```typescript
import { InMemoryEventEmitter, DomainEventFactory } from '@gtcx/domain';

const emitter = new InMemoryEventEmitter();

// Subscribe to specific event types
emitter.on('registration.completed', (event) => {
  console.log('Registered:', event.payload.assetLotId);
});

// Subscribe to all events
emitter.onAny((event) => {
  analytics.track(event.type, event.payload);
});

// Get events by correlation ID (for tracing)
const related = emitter.getEvents().filter((e) => e.correlationId === traceId);
```

**Event Types:**

| Category     | Events                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Registration | `started`, `validated`, `completed`, `failed`, `progress_updated`                              |
| Trading      | `price_calculated`, `opportunity_found`, `trade_initiated`, `trade_executed`, `trade_failed`   |
| Compliance   | `check_started`, `check_completed`, `violation_detected`, `warning_issued`, `report_generated` |

---

### Metrics (P12)

Prometheus-compatible metrics collection:

```typescript
import { InMemoryMetricsCollector, ServiceMetrics, METRIC_NAMES } from '@gtcx/domain';

const collector = new InMemoryMetricsCollector();

// Record metrics
collector.increment(METRIC_NAMES.REGISTRATION_TOTAL, { commodity: 'gold' });
collector.histogram(METRIC_NAMES.TRADE_DURATION, 1234, { status: 'success' });
collector.gauge(METRIC_NAMES.QUEUE_SIZE, 42);

// Service-specific metrics helper
const serviceMetrics = new ServiceMetrics(collector, 'registration');
const timer = serviceMetrics.startTimer();
// ... operation ...
serviceMetrics.success('register', timer());

// Export as Prometheus format
const prometheus = collector.toPrometheus();
```

---

### AI Integration (P5)

Full AI provider interface and hooks:

```typescript
import {
  IAIProvider,
  AIServiceHooks,
  AIContextBuilder,
  InMemoryOperationLogger,
} from '@gtcx/domain';

// Implement AI provider
const aiProvider: IAIProvider = {
  async analyzeRegistration(assetLot, context) {
    return {
      type: 'registration_analysis',
      confidence: 0.95,
      result: {
        qualityAssessment: 'high',
        priceEstimate: { min: 4000, max: 4500, expected: 4200 },
        riskFactors: [],
      },
      timestamp: Date.now(),
    };
  },
  // ... other methods
};

// Build context for AI
const context = new AIContextBuilder()
  .operation('registration.validate')
  .withAssetLots([assetLot])
  .withMarket({ commodityType: 'gold', currentPrice: 1950, priceHistory: [] })
  .build();

// Operation logging for AI analysis
const logger = new InMemoryOperationLogger();
const opId = logger.start('registration.register', { commodityType: 'gold' });
// ... operation ...
logger.success(
  opId,
  { assetLotId: 'xxx' },
  {
    suggestedNextOps: ['compliance.check_asset'],
    confidence: 0.95,
  }
);
```

---

### Offline Queue (P8)

Queue operations for offline execution with conflict resolution:

```typescript
import { OfflineQueue, InMemoryQueueStorage } from '@gtcx/domain';

const queue = new OfflineQueue({
  storage: new InMemoryQueueStorage(),
  onConflict: async (conflict) => {
    // Handle manual conflict resolution
    return conflict.localData; // or conflict.serverData
  },
});

// Enqueue operation
const opId = await queue.enqueue('registration', registrationData, {
  priority: 10,
  conflictStrategy: 'last_write', // or 'client_wins', 'server_wins', 'merge', 'manual'
  metadata: { entityId: assetLot.id, version: 1 },
});

// Process queue
const next = queue.getNext();
if (next) {
  queue.markProcessing(next.id);
  try {
    await processOperation(next);
    await queue.markCompleted(next.id);
  } catch (error) {
    await queue.markFailed(next.id, error.message);
  }
}

// Handle conflicts
await queue.markConflict(opId, serverData);

// Get queue stats
const stats = queue.getStats();
// { total: 10, pending: 5, processing: 1, completed: 3, failed: 0, conflicts: 1 }
```

---

### Schema Migrations (P11)

Handle data evolution across schema versions:

```typescript
import {
  SchemaMigrator,
  defaultMigrator,
  ensureVersioned,
  migrateAndUnwrap,
  SCHEMA_VERSIONS,
} from '@gtcx/domain';

// Check current versions
console.log(SCHEMA_VERSIONS.asset_lot); // '1.1.0'

// Wrap legacy data
const versioned = defaultMigrator.wrap(legacyData, 'asset_lot', '1.0.0');

// Check if migration needed
if (defaultMigrator.needsMigration(versioned)) {
  const migrated = defaultMigrator.migrate(versioned);
  console.log('Migrated to:', migrated._schemaVersion);
}

// One-step migrate and unwrap
const currentData = migrateAndUnwrap(legacyData, 'asset_lot');

// Register custom migrations
const migrator = new SchemaMigrator();
migrator.registerMigration({
  id: 'custom_1.1.0_to_1.2.0',
  fromVersion: '1.1.0',
  toVersion: '1.2.0',
  entityTypes: ['asset_lot'],
  description: 'Add new field',
  migrate: (data) => ({ ...data, newField: 'default' }),
  rollback: (data) => {
    delete data.newField;
    return data;
  },
});
```

---

### Versioning & Deprecation (P10)

Track API stability and deprecations:

```typescript
import {
  API_VERSION,
  checkVersionCompatibility,
  isDeprecated,
  getStability,
  isStable,
  CHANGELOG,
} from '@gtcx/domain';

// Check API version
console.log(API_VERSION.full); // '1.0.0'

// Check client compatibility
const compat = checkVersionCompatibility('1.0.0');
if (!compat.compatible) {
  console.error(compat.errors);
}

// Check feature stability
if (isStable('AssetLotRegistrationService')) {
  // Safe to use in production
}

// Check deprecations
const deprecation = isDeprecated('SomeOldMethod');
if (deprecation) {
  console.warn(`Deprecated: use ${deprecation.replacement}`);
}

// Get changelog
const changes = CHANGELOG[0].changes;
```

---

## Security Considerations (P7)

### Threat Model

| Threat                  | Risk   | Mitigation                                    |
| ----------------------- | ------ | --------------------------------------------- |
| **Malformed Input**     | Medium | Zod validation at all entry points            |
| **Injection Attacks**   | Medium | Schema blocks `__proto__` keys, sanitization  |
| **Prototype Pollution** | High   | `sanitizeKeys()` in internal utils            |
| **License Spoofing**    | High   | Delegated to `IComplianceService`             |
| **Price Manipulation**  | High   | Prices from signed PANX attestations          |
| **Replay Attacks**      | Medium | Transaction IDs include timestamp + nonce     |
| **PII Leakage**         | Medium | `sanitizeForLogging()` redacts sensitive data |
| **Rate Limiting**       | Medium | `RateLimiter` class available                 |

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     UNTRUSTED ZONE                          │
│  User input, API requests, storage reads, network data      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  ZOD VALIDATION   │
                    │  (schemas.ts)     │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      TRUSTED ZONE                           │
│  Validated data within service methods                      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                 EXTERNAL SERVICES (via DI)                  │
│  ICryptoService, IStorageService, IPriceService             │
│  (Must be properly implemented and verified)                │
└─────────────────────────────────────────────────────────────┘
```

### Internal Utilities

```typescript
import {
  sanitizeKeys, // Remove dangerous object keys
  sanitizeForLogging, // Redact PII for logs
  redactPII, // Redact PII from strings
  RateLimiter, // Rate limit operations
  withRetry, // Retry with exponential backoff
} from '@gtcx/domain/internal'; // ⚠️ Internal API - may change
```

---

## Service Interfaces

Implement these interfaces to integrate with your infrastructure:

```typescript
interface ICryptoService {
  createHash(data: string): Promise<string>;
  sign(data: string): Promise<string>;
  verify(data: string, signature: string): Promise<boolean>;
  getPublicKey?(): Promise<string>;
  signTransaction?(data: unknown): Promise<CryptoProof>;
}

interface ILocationService {
  getCurrentLocation(): Promise<Location>;
  getAddress(lat: number, lng: number): Promise<string>;
}

interface IStorageService {
  saveAssetLot(lot: AssetLot): Promise<void>;
  getAssetLot(id: string): Promise<AssetLot | null>;
  saveCertificate(cert: AssetCertificate): Promise<void>;
  saveTransaction(tx: Transaction): Promise<void>;
}

interface IPriceService {
  getMarketPrice(commodityType: string): Promise<number>;
  getPriceHistory(commodityType: string, days: number): Promise<PriceHistory[]>;
}

interface IComplianceService {
  validateLicenses(traderId: string): Promise<boolean>;
  checkCompliance(entityId: string, type: string): Promise<ComplianceRecord[]>;
}
```

---

## Commodity-Agnostic Design (P6)

All services support any commodity type:

```typescript
// Gold (Ghana pilot)
const gold = new AssetLotRegistrationService(deps, { minPhotos: 2 });

// Cocoa (future)
const cocoa = new AssetLotRegistrationService(deps, {
  minPhotos: 4,
  requiredPhotoCategories: ['bag', 'label', 'quality'],
});

// Minerals (future)
const minerals = new TradingService(deps, {
  defaultCurrency: 'ZAR',
  highValueThreshold: 50000,
});
```

---

## Testing

```typescript
import {
  InMemoryEventEmitter,
  InMemoryMetricsCollector,
  InMemoryOperationLogger,
  InMemoryQueueStorage,
  nullEventEmitter,
  nullMetricsCollector,
  nullOperationLogger,
  nullAIProvider,
} from '@gtcx/domain';

// Use in-memory implementations
const emitter = new InMemoryEventEmitter();
const metrics = new InMemoryMetricsCollector();

// After test, inspect
const events = emitter.getEventsByType('registration.completed');
const stats = metrics.getHistogramStats('gtcx_registration_duration_ms');

// Or use null implementations
const service = new TradingService({
  ...deps,
  eventEmitter: nullEventEmitter,
});
```

---

## Changelog

## Principle Alignment

| Principle            | Implementation                                                 |
| -------------------- | -------------------------------------------------------------- |
| P1 Package Structure | Clean `src/` + `internal/` separation; no circular deps        |
| P2 Type Safety       | Zod schemas at all service boundaries                          |
| P3 Modularity        | Independent services with granular exports                     |
| P4 Composability     | Full dependency injection for all external services            |
| P5 AI-Native         | AI provider interface, hooks, and structured operation logging |
| P6 Asset Abstraction | `commodityType: string` throughout — no hardcoded commodities  |
| P8 Offline-First     | OfflineQueue with conflict resolution strategies               |
| P9 Security          | Input validation, sanitization, rate limiting, threat model    |
| P10 API Stability    | Versioning, deprecation markers, changelog                     |
| P11 Data Evolution   | Schema versioning with migration registry                      |
| P12 Observability    | Domain events, Prometheus metrics, AI logging                  |

## Related

- [@gtcx/events](./events.md) — Event bus used by domain services for pub/sub
- [@gtcx/crypto](./crypto.md) — Cryptographic operations injected via `ICryptoService`
- [@gtcx/sync](./sync.md) — Synchronization engine for offline queue drain
- [Data Models](../specs/data-models.md) — Schema definitions for assets, transactions, and compliance
- [Identity Core](../specs/identity-core.md) — TradePass identity model used by domain services
