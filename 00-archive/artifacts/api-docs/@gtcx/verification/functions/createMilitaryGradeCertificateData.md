[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createMilitaryGradeCertificateData

# Function: createMilitaryGradeCertificateData()

> **createMilitaryGradeCertificateData**(`input`): `Omit`\<[`MilitaryGradeCertificate`](../interfaces/MilitaryGradeCertificate.md), `"postQuantumHash"` \| `"multiSignature"`\> & `object`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:258](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L258)

Create a military-grade certificate structure (unsigned)
Caller must sign with multi-signature crypto service

## Parameters

### input

[`CreateCertificateInput`](../interfaces/CreateCertificateInput.md)

## Returns

`Omit`\<[`MilitaryGradeCertificate`](../interfaces/MilitaryGradeCertificate.md), `"postQuantumHash"` \| `"multiSignature"`\> & `object`
