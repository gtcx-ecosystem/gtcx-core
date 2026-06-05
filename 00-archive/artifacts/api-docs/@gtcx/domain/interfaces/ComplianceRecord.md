[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / ComplianceRecord

# Interface: ComplianceRecord

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:300](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L300)

Compliance record

## Properties

### finding

> **finding**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:319](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L319)

#### description

> **description**: `string`

#### evidence?

> `optional` **evidence**: `string`[]

#### location?

> `optional` **location**: [`Location`](Location.md)

#### reportedBy

> **reportedBy**: `string`

#### timestamp

> **timestamp**: `string`

#### verifiedBy?

> `optional` **verifiedBy**: `string`

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:301](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L301)

***

### metadata

> **metadata**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:339](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L339)

#### createdAt

> **createdAt**: `string`

#### priority

> **priority**: `number`

#### references

> **references**: `string`[]

#### tags

> **tags**: `string`[]

#### updatedAt

> **updatedAt**: `string`

***

### regulation

> **regulation**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:310](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L310)

#### authority

> **authority**: `string`

#### category

> **category**: [`ComplianceCategory`](../type-aliases/ComplianceCategory.md)

#### code

> **code**: `string`

#### description

> **description**: `string`

#### jurisdiction?

> `optional` **jurisdiction**: `string`

#### title

> **title**: `string`

***

### resolution?

> `optional` **resolution**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:328](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L328)

#### actions

> **actions**: `string`[]

#### assignedTo

> **assignedTo**: `string`

#### completedDate?

> `optional` **completedDate**: `string`

#### cost?

> `optional` **cost**: `number`

#### dueDate

> **dueDate**: `string`

#### status

> **status**: `"pending"` \| `"in_progress"` \| `"resolved"` \| `"escalated"`

***

### severity

> **severity**: [`ComplianceSeverity`](../type-aliases/ComplianceSeverity.md)

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:304](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L304)

***

### sourceApp

> **sourceApp**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:306](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L306)

***

### sourceEntityId

> **sourceEntityId**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:307](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L307)

***

### sourceEntityType

> **sourceEntityType**: `"producer"` \| `"trader"` \| `"asset_lot"` \| `"transaction"`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:308](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L308)

***

### status

> **status**: [`ComplianceStatus`](../type-aliases/ComplianceStatus.md)

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:303](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L303)

***

### type

> **type**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:302](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L302)
