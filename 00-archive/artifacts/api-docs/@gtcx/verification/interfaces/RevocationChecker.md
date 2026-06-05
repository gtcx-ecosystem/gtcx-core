[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / RevocationChecker

# Interface: RevocationChecker

Defined in: [03-platform/packages/verification/src/certificates/revocation.ts:139](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/revocation.ts#L139)

Pluggable revocation backend.

Implementations consult the source of truth for revocation status —
an HTTP status-list endpoint (RFC 5280 §5), a distributed ledger,
an internal database, or an AI-driven anomaly detector.

Implementations SHOULD return within a reasonable timeout (≤ 5s).
Callers MUST treat timeouts and errors as "potentially revoked" — never
as "not revoked". The fail-closed posture is the security-correct default
because a transient backend failure must not silently downgrade trust.

## Methods

### check()

> **check**(`certificate`): `Promise`\<[`RevocationStatus`](RevocationStatus.md)\>

Defined in: [03-platform/packages/verification/src/certificates/revocation.ts:148](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/revocation.ts#L148)

Check whether a certificate has been revoked.

#### Parameters

##### certificate

[`Certificate`](Certificate.md)

The certificate whose status is being queried.

#### Returns

`Promise`\<[`RevocationStatus`](RevocationStatus.md)\>

Resolves with the revocation status. Implementations that
         cannot answer authoritatively SHOULD return `{ revoked: true,
         reason: '<backend-error>' }` rather than `{ revoked: false }`.
