# @gtcx/identity

Identity management package for GTCX Protocol. Provides DID creation, credential management, and identity lifecycle operations.

## Installation

```bash
pnpm add @gtcx/identity
```

## Features

- **Identity Creation**: Standard and enhanced (multi-sig) identity generation
- **DID Support**: W3C DID-compatible identifier creation and resolution
- **Key Management**: Ed25519 and Secp256k1 key pair support
- **Security Levels**: Standard, enhanced, and military-grade security options

## Usage

### Create a Standard Identity

```typescript
import { createIdentity, createDID } from '@gtcx/identity';

// Create identity
const { identity, privateKey } = await createIdentity({
  securityLevel: 'standard',
  metadata: {
    userRole: 'miner',
    deviceId: 'device-123',
  },
});

// Store privateKey securely (platform-specific)
await secureStorage.set(identity.privateKeyRef, privateKey);

// Get DID
const did = createDID(identity);
// -> "did:gtcx:a1b2c3d4e5f6..."
```

### Create an Enhanced Identity (Multi-Sig)

```typescript
import { createEnhancedIdentity } from '@gtcx/identity';

const { identity, privateKeys } = await createEnhancedIdentity({
  securityLevel: 'military',
  metadata: {
    userRole: 'inspector',
    deviceId: 'device-456',
  },
});

// Store both private keys
await secureStorage.set(identity.multiKeyPairs.ed25519.privateKeyRef, privateKeys.ed25519);
await secureStorage.set(identity.multiKeyPairs.secp256k1.privateKeyRef, privateKeys.secp256k1);
```

### Validate Identity

```typescript
import { validateIdentity, isIdentityExpired } from '@gtcx/identity';

const { valid, errors } = validateIdentity(identity);
if (!valid) {
  console.error('Invalid identity:', errors);
}

if (isIdentityExpired(identity)) {
  console.warn('Identity has expired');
}
```

### DID Document

```typescript
import { createDIDDocument, parseDID } from '@gtcx/identity';

const document = createDIDDocument(identity);
// W3C-compatible DID Document

const parsed = parseDID('did:gtcx:a1b2c3d4');
// { method: 'gtcx', identifier: 'a1b2c3d4' }
```

## Architecture

```
@gtcx/identity
├── identity.ts    # Identity creation & lifecycle
├── did.ts         # DID operations
└── index.ts       # Public exports

Dependencies:
├── @gtcx/crypto   # Cryptographic primitives
└── @gtcx/types    # Type definitions
```

## Security Levels

| Level | Keys | Use Case |
|-------|------|----------|
| `standard` | Ed25519 | General users |
| `enhanced` | Ed25519 + Secp256k1 | High-value transactions |
| `military` | Multi-sig + quantum-resistant hash | Critical operations |

## Platform Usage

### React Native (Mobile)

Use with `@gtcx/mobile-shared` for SecureStore integration:

```typescript
import { mobileIdentity } from '@gtcx/mobile-shared';

const identity = await mobileIdentity.getOrCreateIdentity({
  metadata: { userRole: 'miner' },
});
```

### Node.js (Backend)

Direct usage with your preferred secure storage:

```typescript
import { createIdentity } from '@gtcx/identity';
import { SecretManager } from './your-secret-manager';

const { identity, privateKey } = await createIdentity();
await SecretManager.store(identity.privateKeyRef, privateKey);
```

## License

Apache-2.0
