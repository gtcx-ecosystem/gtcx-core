# @gtcx/identity

Identity management with DID (Decentralized Identifier) support.

## Installation

```bash
pnpm add @gtcx/identity
```

## Quick Start

```typescript
import { createIdentity, createDID, validateIdentity } from '@gtcx/identity';

const { identity, privateKey } = await createIdentity({
  metadata: { userId: 'inspector-001' },
});

const did = createDID(identity);
console.log(did); // did:gtcx:...
console.log(validateIdentity(identity).valid); // true
```

## API

| Export                            | Description                       |
| --------------------------------- | --------------------------------- |
| `createIdentity(opts?)`           | Create identity with Ed25519 keys |
| `createEnhancedIdentity()`        | Dual-key identity                 |
| `deriveIdentity(parent, context)` | Derive child identity             |
| `validateIdentity(identity)`      | Validate structure                |
| `isIdentityExpired(identity)`     | Check expiration                  |
| `createDID(identity)`             | Create DID string                 |
| `parseDID(did)`                   | Parse DID components              |
| `isValidDID(did)`                 | Validate DID format               |
| `createDIDDocument(identity)`     | W3C DID document                  |

## Related

- [ADR-005: Ed25519 over secp256k1](../../docs/adr/005-ed25519-over-secp256k1.md)

## License

MIT
