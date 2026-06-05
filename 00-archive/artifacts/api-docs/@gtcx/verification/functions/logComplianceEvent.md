[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / logComplianceEvent

# Function: logComplianceEvent()

> **logComplianceEvent**(`event`): `void`

Defined in: [03-platform/packages/verification/03-platform/src/traced/compliance.ts:9](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/traced/compliance.ts#L9)

## Parameters

### event

#### credentialType?

`string`

#### gciScore?

`number`

#### metadata?

`Record`\<`string`, `unknown`\>

#### reason?

`string`

#### subjectId

`string`

#### success

`boolean`

#### type

`"verification_requested"` \| `"verification_completed"` \| `"verification_failed"` \| `"claim_issued"` \| `"claim_revoked"`

## Returns

`void`
