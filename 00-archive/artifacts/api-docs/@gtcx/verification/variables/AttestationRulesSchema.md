[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / AttestationRulesSchema

# Variable: AttestationRulesSchema

> `const` **AttestationRulesSchema**: `ZodObject`\<\{ `allowedAttestors`: `ZodArray`\<`ZodObject`\<\{ `credentialRequired`: `ZodOptional`\<`ZodEnum`\<\[`"TradePass"`, `"ProducerID"`, `"SiteID"`, `"AggregatorID"`, `"ProcessorID"`, `"TraderID"`, `"CustodyID"`, `"LogisticsID"`, `"CertifierID"`, `"BuyerID"`, `"AuthorityID"`, `"FinanceID"`, `"SecurityID"`\]\>\>; `type`: `ZodEnum`\<\[`"exact"`, `"pattern"`, `"credential"`\]\>; `value`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `credentialRequired?`: `"TradePass"` \| `"ProducerID"` \| `"SiteID"` \| `"AggregatorID"` \| `"ProcessorID"` \| `"TraderID"` \| `"CustodyID"` \| `"LogisticsID"` \| `"CertifierID"` \| `"BuyerID"` \| `"AuthorityID"` \| `"FinanceID"` \| `"SecurityID"`; `type`: `"exact"` \| `"pattern"` \| `"credential"`; `value`: `string`; \}, \{ `credentialRequired?`: `"TradePass"` \| `"ProducerID"` \| `"SiteID"` \| `"AggregatorID"` \| `"ProcessorID"` \| `"TraderID"` \| `"CustodyID"` \| `"LogisticsID"` \| `"CertifierID"` \| `"BuyerID"` \| `"AuthorityID"` \| `"FinanceID"` \| `"SecurityID"`; `type`: `"exact"` \| `"pattern"` \| `"credential"`; `value`: `string`; \}\>, `"many"`\>; `minimumAttestors`: `ZodOptional`\<`ZodNumber`\>; `multiSignatureRequired`: `ZodOptional`\<`ZodBoolean`\>; `selfAttestation`: `ZodBoolean`; \}, `"strip"`, `ZodTypeAny`, \{ `allowedAttestors`: `object`[]; `minimumAttestors?`: `number`; `multiSignatureRequired?`: `boolean`; `selfAttestation`: `boolean`; \}, \{ `allowedAttestors`: `object`[]; `minimumAttestors?`: `number`; `multiSignatureRequired?`: `boolean`; `selfAttestation`: `boolean`; \}\>

Defined in: [03-platform/packages/verification/03-platform/src/types/schemas/entities.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/schemas/entities.ts#L51)
