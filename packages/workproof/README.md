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

## Dependencies

- `@gtcx/crypto` — signing and verification
- `@gtcx/types` — shared type definitions
- `@gtcx/verification` — certificate and proof generation
- `zod` — runtime schema validation

## License

MIT
