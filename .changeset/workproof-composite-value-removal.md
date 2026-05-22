---
'@gtcx/workproof': major
---

Trim public surface: `CompositeValue` is no longer re-exported from the
package index. The type still exists in the package internals as part of
the `PredicateValue` discriminated union — consumers needing the shape can
pattern-match `{ kind: 'composite' }` or import the underlying Zod schema.

Background: commit `12fb184` (2026-05-13) migrated workproof barrels from
`export *` to explicit named exports as part of an API minimization pass.
`CompositeValue` was previously re-exported only via the wildcard. This
changeset declares the resulting public-surface narrowing so the next
release is semver-correct.

**Migration**

If your code did:

```ts
import type { CompositeValue } from '@gtcx/workproof';
```

Either pattern-match on the discriminated union:

```ts
import type { PredicateValue } from '@gtcx/workproof';
function handle(v: PredicateValue) {
  if (v.kind === 'composite') {
    // v is narrowed to the composite shape
  }
}
```

Or import the Zod schema for runtime validation:

```ts
import { PredicateValueSchema } from '@gtcx/workproof';
```
