[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / PermissionContext

# Interface: PermissionContext

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:144](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L144)

## Properties

### actorId?

> `optional` **actorId**: `string`

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:152](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L152)

Current user ID

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:154](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L154)

Additional context

***

### ownerId?

> `optional` **ownerId**: `string`

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:150](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L150)

Resource owner (for ownership checks)

***

### permissions?

> `optional` **permissions**: `string`[]

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:146](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L146)

User's permissions (or roles to expand)

***

### roles?

> `optional` **roles**: (`"producer"` \| `"inspector"` \| `"vault_operator"` \| `"regulator"` \| `"operator"` \| `"admin"`)[]

Defined in: [03-platform/packages/security/03-platform/src/auth/permissions.ts:148](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/permissions.ts#L148)

User's roles
