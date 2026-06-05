[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / RegistrationConfig

# Interface: RegistrationConfig

Defined in: [03-platform/packages/services/src/registration/types.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L17)

## Properties

### maxDiscoveryAgeDays

> **maxDiscoveryAgeDays**: `number`

Defined in: [03-platform/packages/services/src/registration/types.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L25)

Maximum age of discovery in days

***

### maxPhotos

> **maxPhotos**: `number`

Defined in: [03-platform/packages/services/src/registration/types.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L23)

Maximum photos allowed

***

### minGpsAccuracy

> **minGpsAccuracy**: `number`

Defined in: [03-platform/packages/services/src/registration/types.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L19)

Minimum GPS accuracy required in meters

***

### minPhotos

> **minPhotos**: `number`

Defined in: [03-platform/packages/services/src/registration/types.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L21)

Minimum photos required

***

### requiredPhotoCategories?

> `optional` **requiredPhotoCategories**: `string`[]

Defined in: [03-platform/packages/services/src/registration/types.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L29)

Required photo categories

***

### verifyBaseUrl?

> `optional` **verifyBaseUrl**: `string`

Defined in: [03-platform/packages/services/src/registration/types.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L31)

Verification endpoint base URL

***

### workflowSteps?

> `optional` **workflowSteps**: `WorkflowStep`[]

Defined in: [03-platform/packages/services/src/registration/types.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration/types.ts#L27)

Custom workflow steps (optional override)
