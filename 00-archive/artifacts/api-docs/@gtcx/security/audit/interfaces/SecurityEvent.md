[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / SecurityEvent

# Interface: SecurityEvent

Defined in: [03-platform/packages/security/src/audit/events.ts:103](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L103)

Security event structure

Designed for:
- Structured logging (P12)
- AI analysis (P5)
- Compliance audit trails
- Anomaly detection

## Properties

### action?

> `optional` **action**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:123](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L123)

What action was taken

***

### actor?

> `optional` **actor**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L117)

Who performed the action (user ID, service name, etc.)

***

### eventType

> **eventType**: [`SecurityEventType`](../type-aliases/SecurityEventType.md)

Defined in: [03-platform/packages/security/src/audit/events.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L108)

Event type

***

### geo?

> `optional` **geo**: `object`

Defined in: [03-platform/packages/security/src/audit/events.ts:144](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L144)

Geographic context

#### city?

> `optional` **city**: `string`

#### country?

> `optional` **country**: `string`

#### region?

> `optional` **region**: `string`

***

### ip?

> `optional` **ip**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:138](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L138)

Client IP address (if applicable)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/security/src/audit/events.ts:156](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L156)

Additional structured metadata

***

### outcome

> **outcome**: [`SecurityOutcome`](../type-aliases/SecurityOutcome.md)

Defined in: [03-platform/packages/security/src/audit/events.ts:114](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L114)

Event outcome

***

### protocol?

> `optional` **protocol**: `"tradepass"` \| `"geotag"` \| `"vaultmark"` \| `"pvp"` \| `"gci"` \| `"panx"`

Defined in: [03-platform/packages/security/src/audit/events.ts:153](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L153)

Protocol context (which GTCX protocol)

***

### reason?

> `optional` **reason**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:126](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L126)

Reason for outcome (especially for failures)

***

### requestId?

> `optional` **requestId**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:135](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L135)

Request ID

***

### resource?

> `optional` **resource**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:120](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L120)

What was accessed/modified (resource identifier)

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:132](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L132)

Session ID

***

### severity

> **severity**: [`SecuritySeverity`](../type-aliases/SecuritySeverity.md)

Defined in: [03-platform/packages/security/src/audit/events.ts:111](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L111)

Severity level

***

### timestamp

> **timestamp**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:105](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L105)

ISO 8601 timestamp

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:129](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L129)

Correlation ID for distributed tracing

***

### userAgent?

> `optional` **userAgent**: `string`

Defined in: [03-platform/packages/security/src/audit/events.ts:141](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L141)

User agent (if applicable)
