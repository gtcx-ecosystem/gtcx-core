# First Integration Guide

How to integrate `@gtcx/*` packages into a downstream repo for the first time.

## Step 1 — Add Dependencies

In the downstream repo's `package.json`:

```json
{
  "dependencies": {
    "@gtcx/crypto": "workspace:*",
    "@gtcx/identity": "workspace:*",
    "@gtcx/schemas": "workspace:*"
  }
}
```

Or as versioned packages if consuming from the registry:

```json
{
  "dependencies": {
    "@gtcx/crypto": "^1.0.0",
    "@gtcx/identity": "^1.0.0",
    "@gtcx/schemas": "^1.0.0"
  }
}
```

## Step 2 — Validate at Every Boundary

All data entering a service must be validated with Zod schemas from `@gtcx/schemas` or `@gtcx/domain`:

```typescript
import { assetLotSchema } from '@gtcx/schemas';

const result = assetLotSchema.safeParse(input);
if (!result.success) throw new ValidationError(result.error);
```

## Step 3 — Authenticate with Identity

All downstream flows start by resolving identity:

```typescript
import { createIdentity, resolveDid } from '@gtcx/identity';

const identity = await createIdentity({ method: 'gtcx' });
const didDoc = await resolveDid(identity.did);
```

## Step 4 — Sign Events

All events entering the audit trail are signed:

```typescript
import { sign } from '@gtcx/crypto';

const signature = await sign(payload, privateKey);
```

## Step 5 — Use the Error Taxonomy

Per ADR-012, errors in service paths must use typed codes and preserve `cause`:

```typescript
import { GtcxError, ErrorCode } from '@gtcx/types';

throw new GtcxError(ErrorCode.ValidationFailed, 'Invalid asset lot', { cause: err });
```

## References

- `SOP/2-docs/1-architecture/integration-patterns.md`
- `SOP/2-docs/2-specs/data-models.md`
- `SOP/2-docs/2-specs/identity-core.md`
- `SOP/2-docs/1-architecture/decisions/012-error-taxonomy-and-cause-propagation.md`
