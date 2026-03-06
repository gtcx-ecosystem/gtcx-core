# @gtcx/workproof

TradeCV / WorkProof v2.1 — W3C Verifiable Credential-based work attestation schemas, predicates, and disclosure helpers.

## Scope

- Evidence schemas
- Predicate registry (40 predicates)
- WorkProof and TradeCV credential structures
- Selective disclosure helpers
- Offline-compatible structures
- Trust signal definitions
- AI validation integration schemas

## Structure (`packages/workproof/src/`)

| Subfolder     | Contents                                    |
| ------------- | ------------------------------------------- |
| `evidence/`   | Evidence schema definitions                 |
| `predicates/` | Predicate registry — 40 predicate types     |
| `tradecv/`    | TradeCV credential structures               |
| `disclosure/` | Selective disclosure helpers                |
| `offline/`    | Offline-compatible structures               |
| `trust/`      | Trust signal definitions                    |
| `ai/`         | AI-related schemas for WorkProof validation |

## Notes

- WorkProof implements W3C VC data model conventions.
- Predicates cover skills, certifications, employment history, and domain-specific trade competencies.
- Disclosure helpers support partial reveal without exposing the full credential.

## References

- `packages/workproof/src/index.ts`
