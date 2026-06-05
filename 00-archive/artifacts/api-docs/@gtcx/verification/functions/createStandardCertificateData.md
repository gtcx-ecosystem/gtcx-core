[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createStandardCertificateData

# Function: createStandardCertificateData()

> **createStandardCertificateData**(`input`): `Omit`\<[`StandardCertificate`](../interfaces/StandardCertificate.md), `"signature"`\> & `object`

Defined in: [03-platform/packages/verification/03-platform/src/certificates/generator.ts:205](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/generator.ts#L205)

Create a standard certificate structure (unsigned)
Caller must sign with appropriate crypto service

## Parameters

### input

[`CreateCertificateInput`](../interfaces/CreateCertificateInput.md)

## Returns

`Omit`\<[`StandardCertificate`](../interfaces/StandardCertificate.md), `"signature"`\> & `object`
