[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / ComplianceDashboard

# Interface: ComplianceDashboard

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:387](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L387)

Compliance dashboard

## Properties

### byCategory

> **byCategory**: `Record`\<`string`, \{ `compliant`: `number`; `total`: `number`; `trend`: `"up"` \| `"down"` \| `"stable"`; `violations`: `number`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:397](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L397)

***

### overview

> **overview**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:388](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L388)

#### complianceScore

> **complianceScore**: `number`

#### compliantPercentage

> **compliantPercentage**: `number`

#### criticalViolations

> **criticalViolations**: `number`

#### pendingIssues

> **pendingIssues**: `number`

#### totalRecords

> **totalRecords**: `number`

#### trendDirection

> **trendDirection**: `"improving"` \| `"declining"` \| `"stable"`

***

### recentActivity

> **recentActivity**: [`ComplianceRecord`](ComplianceRecord.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:408](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L408)

***

### upcomingDeadlines

> **upcomingDeadlines**: `object`[]

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:409](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L409)

#### daysRemaining

> **daysRemaining**: `number`

#### record

> **record**: [`ComplianceRecord`](ComplianceRecord.md)

***

### urgentActions

> **urgentActions**: [`ComplianceRecord`](ComplianceRecord.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:407](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L407)
