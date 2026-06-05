[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / PredicateDefinition

# Interface: PredicateDefinition

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L32)

Predicate definition structure
Each predicate is a first-class entity, not just a string

## Properties

### ai

> **ai**: [`AIMetadata`](AIMetadata.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:54](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L54)

AI metadata for reasoning

***

### attestation

> **attestation**: [`AttestationRules`](AttestationRules.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L48)

Attestation rules

***

### confidence

> **confidence**: [`ConfidenceRules`](ConfidenceRules.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L50)

Confidence scoring

***

### description

> **description**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L38)

Description of what this predicate verifies

***

### domain

> **domain**: [`PredicateDomain`](../type-aliases/PredicateDomain.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L40)

Domain this predicate belongs to

***

### evidence

> **evidence**: [`EvidenceRequirements`](EvidenceRequirements.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L46)

Evidence requirements

***

### name

> **name**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L36)

Human-readable name

***

### schema

> **schema**: [`PredicateSchema`](PredicateSchema.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L44)

Schema for the predicate value

***

### temporal

> **temporal**: [`TemporalRules`](TemporalRules.md)

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:52](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L52)

Temporal validity

***

### uri

> **uri**: `` `tradepass://${string}/${string}/${string}` ``

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L34)

Unique predicate URI

***

### version

> **version**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/predicates.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/predicates.ts#L42)

Version for evolution
