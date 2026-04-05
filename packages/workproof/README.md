# @gtcx/workproof

TradeCV/WorkProof v2.1 — W3C VC-based employment attestations with 40 predicates, selective disclosure, and AI validation.

## Installation

```bash
pnpm add @gtcx/workproof
```

## Sub-path Exports

| Export                       | Description                          |
| ---------------------------- | ------------------------------------ |
| `@gtcx/workproof`            | Aggregates all modules               |
| `@gtcx/workproof/evidence`   | Evidence types and schemas           |
| `@gtcx/workproof/predicates` | Predicate validation (40 predicates) |
| `@gtcx/workproof/workproof`  | Core WorkProof types                 |
| `@gtcx/workproof/tradecv`    | TradeCV v2.1 specific types          |
| `@gtcx/workproof/ai`         | AI analysis integration              |
| `@gtcx/workproof/disclosure` | Selective disclosure                 |
| `@gtcx/workproof/offline`    | Offline credential support           |
| `@gtcx/workproof/trust`      | Trust chain validation               |

## Usage

```typescript
import { createWorkProof, verifyWorkProof } from '@gtcx/workproof';

// Create a signed WorkProof (W3C Verifiable Credential)
const proof = createWorkProof({
  credentialSubject: {
    id: 'did:gtcx:worker-001',
    role: 'Mining Supervisor',
    employer: 'did:gtcx:org-001',
    startDate: '2024-01-15',
    skills: ['extraction', 'safety-compliance'],
  },
  issuerDID: 'did:gtcx:org-001',
  issuerPrivateKey: privateKeyHex,
  expirationDate: '2026-01-15T00:00:00Z',
});

// Verify a WorkProof
const result = verifyWorkProof(proof, issuerPublicKeyHex);
// result.valid === true | false
// result.errors === string[]
```

```typescript
import { PREDICATE_REGISTRY } from '@gtcx/workproof';

// 40 predicates available for selective disclosure
const predicate = PREDICATE_REGISTRY['employment.verified'];
// predicate.id, predicate.description, predicate.category
```

## Dependencies

- `@gtcx/crypto` — signing and verification
- `@gtcx/types` — shared type definitions
- `@gtcx/verification` — certificate and proof generation
- `zod` — runtime schema validation

## License

MIT
