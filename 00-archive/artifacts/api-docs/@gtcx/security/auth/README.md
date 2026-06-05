[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / auth

# auth

@gtcx/security/auth

Authentication and authorization utilities.
Implements P9 (Security by Design).

## Interfaces

- [SessionConfig](interfaces/SessionConfig.md)
- [SessionValidationResult](interfaces/SessionValidationResult.md)
- [Token](interfaces/Token.md)
- [TokenOptions](interfaces/TokenOptions.md)
- [TokenValidationResult](interfaces/TokenValidationResult.md)

## Type Aliases

- [GTCXTokenClaims](type-aliases/GTCXTokenClaims.md)
- [JWTClaims](type-aliases/JWTClaims.md)
- [JWTHeader](type-aliases/JWTHeader.md)
- [Session](type-aliases/Session.md)
- [SessionState](type-aliases/SessionState.md)

## Variables

- [DEFAULT\_SESSION\_CONFIG](variables/DEFAULT_SESSION_CONFIG.md)
- [GTCXTokenClaimsSchema](variables/GTCXTokenClaimsSchema.md)
- [JWTClaimsSchema](variables/JWTClaimsSchema.md)
- [JWTHeaderSchema](variables/JWTHeaderSchema.md)
- [SessionSchema](variables/SessionSchema.md)
- [SessionStateSchema](variables/SessionStateSchema.md)

## Functions

- [assembleToken](functions/assembleToken.md)
- [createTokenPayload](functions/createTokenPayload.md)
- [decodeToken](functions/decodeToken.md)
- [isSessionValid](functions/isSessionValid.md)
- [isSessionValidOffline](functions/isSessionValidOffline.md)
- [isTokenTemporallyValid](functions/isTokenTemporallyValid.md)
- [isTokenValidOffline](functions/isTokenValidOffline.md)
- [prepareSessionForOffline](functions/prepareSessionForOffline.md)
- [recordFailedAttempt](functions/recordFailedAttempt.md)
- [resetFailedAttempts](functions/resetFailedAttempts.md)
- [sessionNeedsRotation](functions/sessionNeedsRotation.md)
- [syncSessionOnline](functions/syncSessionOnline.md)
- [verifyTokenSignature](functions/verifyTokenSignature.md)

## References

### expandPermissions

Re-exports [expandPermissions](../functions/expandPermissions.md)

***

### hasPermission

Re-exports [hasPermission](../functions/hasPermission.md)

***

### Permission

Re-exports [Permission](../type-aliases/Permission.md)

***

### PermissionContext

Re-exports [PermissionContext](../interfaces/PermissionContext.md)

***

### Permissions

Re-exports [Permissions](../variables/Permissions.md)

***

### RoleName

Re-exports [RoleName](../type-aliases/RoleName.md)

***

### Roles

Re-exports [Roles](../variables/Roles.md)

***

### validatePermission

Re-exports [validatePermission](../functions/validatePermission.md)
