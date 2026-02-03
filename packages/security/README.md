# @gtcx/security

Security utilities for the GTCX Protocol ecosystem.

## Overview

This package provides **non-cryptographic** security utilities that complement `@gtcx/crypto`. While `@gtcx/crypto` handles cryptographic primitives (signing, hashing, encryption), this package provides:

- **Validation** - Input sanitization, Zod schemas for boundaries (P2, P9)
- **Auth** - Authentication tokens, sessions, permissions (P9)
- **Offline** - Secure storage, credential caching, tamper detection (P8)
- **Audit** - Security event logging, structured audit trails (P12)

```
┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @gtcx/crypto          @gtcx/security                           │
│  ├── keys              ├── validation/                          │
│  ├── signing           │   ├── schemas      (P2 Type Safety)    │
│  ├── hashing           │   └── sanitize     (P9 Input Val)      │
│  └── proofs            ├── auth/                                │
│                        │   ├── tokens                           │
│       Cryptographic    │   ├── sessions                         │
│       Primitives       │   └── permissions                      │
│                        ├── offline/         (P8 Offline-First)  │
│                        │   ├── secure-storage                   │
│                        │   ├── credential-cache                 │
│                        │   └── tamper-detection                 │
│                        └── audit/           (P12 Observability) │
│                            ├── events                           │
│                            └── logger                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
pnpm add @gtcx/security
```

## Quick Start

### Validation (P2, P9)

```typescript
import { 
  CommonSchemas,
  sanitizeString,
  createBoundaryValidator 
} from '@gtcx/security/validation';

// Use common schemas
const email = CommonSchemas.email.parse(input.email);
const uuid = CommonSchemas.uuid.parse(input.id);

// Sanitize untrusted input
const clean = sanitizeString(userInput, {
  maxLength: 1000,
  stripHtml: true,
  trimWhitespace: true,
});

// Create boundary validator for API endpoints
const validateRequest = createBoundaryValidator(RequestSchema);
const validated = validateRequest(rawInput); // Throws on invalid
```

### Authentication

```typescript
import { 
  createAuthToken,
  verifyAuthToken,
  createSession,
  validatePermission 
} from '@gtcx/security/auth';

// Create and verify tokens
const token = await createAuthToken({
  subject: userId,
  audience: 'gtcx-api',
  expiresIn: '1h',
});

const payload = await verifyAuthToken(token);

// Session management
const session = await createSession({
  userId,
  deviceId,
  maxAge: 72 * 60 * 60 * 1000, // 72 hours (P8 offline limit)
});

// Permission checking
const allowed = validatePermission({
  actor: session.userId,
  action: 'verify',
  resource: 'tradepass:credential',
  context: { ownerId: credentialOwnerId },
});
```

### Offline Security (P8)

```typescript
import { 
  SecureStorage,
  CredentialCache,
  verifyIntegrity 
} from '@gtcx/security/offline';

// Secure local storage
const storage = new SecureStorage({
  deviceId: await getDeviceId(),
  maxOfflineHours: 72,
  maxFailedAttempts: 10,
});

await storage.unlock(userPin);
await storage.set('credentials', myCredentials);
const creds = await storage.get('credentials');

// Credential caching with expiry
const cache = new CredentialCache(storage);
await cache.store(credential, { 
  expiresAt: Date.now() + 72 * 60 * 60 * 1000 
});

const cached = await cache.get(credentialId);
if (cached.expired) {
  // Prompt for online refresh
}

// Tamper detection
const integrity = await verifyIntegrity(data, check, trustedRootKey);
if (!integrity.valid) {
  await logSecurityEvent({
    eventType: 'TAMPER_DETECTED',
    severity: 'CRITICAL',
    reason: integrity.reason,
  });
}
```

### Audit Logging (P12)

```typescript
import { 
  logSecurityEvent,
  SecurityEventType,
  createAuditTrail 
} from '@gtcx/security/audit';

// Log security events
await logSecurityEvent({
  eventType: 'AUTH_SUCCESS',
  severity: 'INFO',
  actor: userId,
  action: 'login',
  outcome: 'SUCCESS',
  metadata: { method: 'biometric' },
});

await logSecurityEvent({
  eventType: 'ACCESS_DENIED',
  severity: 'WARN',
  actor: userId,
  resource: 'admin:settings',
  action: 'read',
  outcome: 'BLOCKED',
  reason: 'insufficient_permissions',
});

// Create audit trail for operations
const audit = createAuditTrail('custody_transfer');
audit.record('initiated', { from: vaultA, to: vaultB });
audit.record('verified', { inspector: inspectorId });
audit.record('completed', { timestamp: Date.now() });
await audit.finalize();
```

## API Reference

### Validation Module

#### Schemas

```typescript
import { CommonSchemas } from '@gtcx/security/validation';

// Identity schemas
CommonSchemas.uuid          // UUID v4
CommonSchemas.did           // W3C DID format
CommonSchemas.tradePassId   // TradePass identifier

// Data schemas
CommonSchemas.email         // Email address
CommonSchemas.phone         // E.164 phone number
CommonSchemas.url           // Valid URL
CommonSchemas.datetime      // ISO 8601 datetime
CommonSchemas.coordinates   // { lat, lng } with bounds

// Security schemas
CommonSchemas.signature     // Hex-encoded signature
CommonSchemas.publicKey     // Hex-encoded public key
CommonSchemas.hash          // SHA-256 hash
```

#### Sanitization

```typescript
import { sanitizeString, sanitizeObject } from '@gtcx/security/validation';

// String sanitization
const clean = sanitizeString(input, {
  maxLength: 1000,        // Truncate if longer
  stripHtml: true,        // Remove HTML tags
  trimWhitespace: true,   // Trim leading/trailing
  normalizeUnicode: true, // NFC normalization
});

// Object sanitization (recursive)
const cleanObj = sanitizeObject(input, {
  maxDepth: 10,           // Prevent deep nesting attacks
  maxKeys: 100,           // Limit object size
  stripProto: true,       // Remove __proto__
});
```

### Auth Module

#### Tokens

```typescript
import { createAuthToken, verifyAuthToken } from '@gtcx/security/auth';

interface TokenOptions {
  subject: string;        // User ID
  audience: string;       // Target service
  expiresIn: string;      // '1h', '24h', '72h'
  claims?: Record<string, unknown>;
}

const token = await createAuthToken(options);
const payload = await verifyAuthToken(token);
```

#### Permissions

```typescript
import { 
  Permission, 
  validatePermission,
  createPermissionChecker 
} from '@gtcx/security/auth';

// Permission format: resource:action
type Permission = 
  | 'tradepass:issue'
  | 'tradepass:verify'
  | 'tradepass:revoke'
  | 'geotag:create'
  | 'geotag:verify'
  | 'vaultmark:transfer'
  | 'gci:evaluate'
  | 'admin:*';

// Role-based permission sets
const ROLES = {
  producer: ['tradepass:verify', 'geotag:create'],
  inspector: ['tradepass:verify', 'geotag:verify', 'gci:evaluate'],
  admin: ['admin:*'],
};
```

### Offline Module

#### SecureStorage

```typescript
import { SecureStorage, SecureStorageConfig } from '@gtcx/security/offline';

interface SecureStorageConfig {
  deviceId: string;
  maxOfflineHours: number;      // Default: 72
  maxFailedAttempts: number;    // Default: 10
  wipeOnExceed: boolean;        // Default: true
}

class SecureStorage {
  constructor(config: SecureStorageConfig);
  
  unlock(secret: string): Promise<void>;
  lock(): void;
  
  set<T>(key: string, value: T): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  
  wipe(): Promise<void>;
}
```

#### Tamper Detection

```typescript
import { 
  createIntegrityCheck,
  verifyIntegrity,
  IntegrityCheck 
} from '@gtcx/security/offline';

interface IntegrityCheck {
  dataHash: string;
  signatureChain: string[];
  createdAt: string;
  lastVerified: string;
}

// Create integrity check when storing
const check = await createIntegrityCheck(data, signingKey);

// Verify on retrieval
const result = await verifyIntegrity(data, check, trustedKey);
// { valid: boolean, reason?: string }
```

### Audit Module

#### Events

```typescript
import { SecurityEvent, SecurityEventType } from '@gtcx/security/audit';

type SecurityEventType =
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'AUTH_LOCKOUT'
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'VALIDATION_FAILURE'
  | 'CRYPTO_OPERATION'
  | 'OFFLINE_SYNC'
  | 'TAMPER_DETECTED'
  | 'KEY_LIFECYCLE';

interface SecurityEvent {
  timestamp: string;
  eventType: SecurityEventType;
  severity: 'INFO' | 'WARN' | 'HIGH' | 'CRITICAL';
  actor?: string;
  resource?: string;
  action?: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  reason?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}
```

#### Logger

```typescript
import { 
  logSecurityEvent,
  registerSecurityHandler,
  SecurityHandler 
} from '@gtcx/security/audit';

// Register handler for security events
registerSecurityHandler(async (event) => {
  await analyticsService.track(event);
  
  if (event.severity === 'CRITICAL') {
    await alertService.notify(event);
  }
});

// Log events (automatically sent to handlers)
await logSecurityEvent({
  eventType: 'AUTH_FAILURE',
  severity: 'WARN',
  actor: attemptedUserId,
  outcome: 'BLOCKED',
  reason: 'invalid_credentials',
});
```

## Security Considerations

### This Package Does NOT

- Implement cryptographic primitives (use `@gtcx/crypto`)
- Store secrets (use platform-specific secure storage)
- Replace platform security (iOS Keychain, Android Keystore)
- Provide network security (use TLS)

### This Package DOES

- Provide Zod schemas for input validation (P2, P9)
- Manage authentication state and sessions
- Handle offline credential caching securely (P8)
- Enable security observability through structured logging (P12)

## Principle Alignment

| Principle | How This Package Implements |
|-----------|----------------------------|
| **P2 Type Safety** | Zod schemas for all external inputs |
| **P8 Offline-First** | SecureStorage, CredentialCache with offline limits |
| **P9 Security** | Input validation, sanitization, permission checking |
| **P12 Observability** | Structured security event logging |

## Dependencies

- `zod` - Schema validation
- `@gtcx/crypto` - Cryptographic primitives (peer)
- `@gtcx/types` - Shared type definitions (peer)

## License

Proprietary - GTCX Protocol

## References

- [Security Architecture](/docs/architecture/security.md)
- [@gtcx/crypto](/packages/crypto/README.md)
- [12 Architectural Principles](/docs/architecture/principles.md)
