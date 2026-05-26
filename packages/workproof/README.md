# @gtcx/workproof

TradeCV/WorkProof v2.2 — W3C VC-based employment attestations with 57 predicates across 10 categories and selective disclosure.

## Installation

```bash
pnpm add @gtcx/workproof
```

## Sub-path Exports

| Export                       | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| `@gtcx/workproof`            | Aggregates all modules                                                    |
| `@gtcx/workproof/evidence`   | Evidence types and schemas                                                |
| `@gtcx/workproof/predicates` | Predicate validation (57 predicates across 10 categories)                 |
| `@gtcx/workproof/workproof`  | Core WorkProof types                                                      |
| `@gtcx/workproof/tradecv`    | TradeCV v2.2 specific types                                               |
| `@gtcx/workproof/ai`         | AI validation types and schemas (no runtime AI — see `gtcx-intelligence`) |
| `@gtcx/workproof/disclosure` | Selective disclosure                                                      |
| `@gtcx/workproof/offline`    | Offline credential support                                                |
| `@gtcx/workproof/trust`      | Trust chain validation                                                    |

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
import { WORKPROOF_PREDICATES, WORKPROOF_PREDICATE_URIS } from '@gtcx/workproof';

// 57 predicates available for selective disclosure
const predicate = WORKPROOF_PREDICATES.IdentityVerified;
// predicate.uri === 'tradepass://workproof/identity/verified'
// predicate.name, predicate.description, predicate.domain
```

## Dependencies

- `@gtcx/crypto` — signing and verification
- `@gtcx/types` — shared type definitions
- `@gtcx/verification` — certificate and proof generation
- `zod` — runtime schema validation

## License

MIT
