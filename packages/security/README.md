# @gtcx/security

Security validation, authorization, and audit utilities.

## Installation

```bash
pnpm add @gtcx/security
```

## Quick Start

```typescript
import { createBoundaryValidator, sanitizeString } from '@gtcx/security';
import { UuidSchema, Hash256Schema } from '@gtcx/security';

const validate = createBoundaryValidator(UuidSchema);
console.log(validate('not-a-uuid').success); // false

const clean = sanitizeString('<script>alert("xss")</script>');
```

## Sub-exports

| Path                        | Description                       |
| --------------------------- | --------------------------------- |
| `@gtcx/security/validation` | Input validation and sanitization |
| `@gtcx/security/auth`       | Authorization and permissions     |
| `@gtcx/security/offline`    | Offline security tokens           |
| `@gtcx/security/audit`      | Audit trail logging               |

## Related

- [ADR-002: Zod over JSON Schema](../../_sop/2-docs/3-engineering/6-decisions/002-zod-over-json-schema.md)

## License

MIT
