# @gtcx/identity

Identity generation and DID utilities for GTCX. Provides identity creation, DID creation, DID documents, and a pluggable resolver interface.

## Scope

- Identity generation (`createIdentity`, `createEnhancedIdentity`)
- DID creation and parsing (`createDID`, `parseDID`, `isValidDID`)
- DID document construction (`createDIDDocument`)
- Resolver interface + helpers (`resolveDID`, `resolveDIDWithMetadata`)

## Key Exports

From `packages/identity/src/index.ts`:

- `createIdentity`, `createEnhancedIdentity`
- `createDID`, `createDIDDocument`, `parseDID`, `isValidDID`
- `resolveDID`, `resolveDIDWithMetadata`
- `DIDResolver` interfaces

## Notes

- Security levels are metadata (`standard`, `enhanced`, `military`).
- `resolveDID` expects a resolver implementation; no network resolver ships in this repo.

## References

- `docs/specs/identity-core.md`
- `docs/specs/security-framework.md`
