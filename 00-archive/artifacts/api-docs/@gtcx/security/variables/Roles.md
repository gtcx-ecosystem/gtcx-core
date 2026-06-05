[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / Roles

# Variable: Roles

> `const` **Roles**: `object`

Defined in: [03-platform/packages/security/src/auth/permissions.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/permissions.ts#L67)

Role definitions with permission sets

## Type Declaration

### admin

> `readonly` **admin**: readonly \[`"admin:*"`\]

System administrator

### inspector

> `readonly` **inspector**: readonly \[`"tradepass:verify"`, `"tradepass:read"`, `"geotag:verify"`, `"geotag:read"`, `"vaultmark:verify"`, `"vaultmark:read"`, `"gci:evaluate"`, `"gci:read"`\]

Field inspector/verifier

### operator

> `readonly` **operator**: readonly \[`"tradepass:issue"`, `"tradepass:verify"`, `"tradepass:revoke"`, `"tradepass:read"`, `"geotag:verify"`, `"geotag:read"`, `"vaultmark:create"`, `"vaultmark:verify"`, `"vaultmark:read"`, `"pvp:approve"`, `"pvp:settle"`, `"pvp:read"`, `"gci:evaluate"`, `"gci:certify"`, `"gci:read"`, `"panx:submit"`, `"panx:read"`\]

Platform operator

### producer

> `readonly` **producer**: readonly \[`"tradepass:read"`, `"geotag:create"`, `"geotag:read"`, `"vaultmark:read"`, `"pvp:read"`, `"gci:read"`, `"panx:read"`\]

Individual commodity producer

### regulator

> `readonly` **regulator**: readonly \[`"tradepass:issue"`, `"tradepass:verify"`, `"tradepass:revoke"`, `"tradepass:read"`, `"gci:certify"`, `"gci:evaluate"`, `"gci:read"`, `"admin:audit"`\]

Government regulator

### vault\_operator

> `readonly` **vault\_operator**: readonly \[`"vaultmark:create"`, `"vaultmark:transfer"`, `"vaultmark:verify"`, `"vaultmark:read"`, `"pvp:initiate"`, `"pvp:read"`\]

Vault operator
