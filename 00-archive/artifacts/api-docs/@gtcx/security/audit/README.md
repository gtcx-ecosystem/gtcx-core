[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / audit

# audit

@gtcx/security/audit

Security event logging and audit trails.
Implements P12 (Observability) and P5 (AI-Native).

## Classes

- [SecurityLogger](classes/SecurityLogger.md)
- [SecurityLoggerError](classes/SecurityLoggerError.md)

## Interfaces

- [AuditTrail](interfaces/AuditTrail.md)
- [SecurityEvent](interfaces/SecurityEvent.md)
- [SecurityLoggerConfig](interfaces/SecurityLoggerConfig.md)

## Type Aliases

- [SecurityBatchLogHandler](type-aliases/SecurityBatchLogHandler.md)
- [SecurityEventHandler](type-aliases/SecurityEventHandler.md)
- [SecurityEventType](type-aliases/SecurityEventType.md)
- [SecurityLogHandler](type-aliases/SecurityLogHandler.md)
- [SecurityOutcome](type-aliases/SecurityOutcome.md)
- [SecuritySeverity](type-aliases/SecuritySeverity.md)

## Variables

- [DEFAULT\_LOGGER\_CONFIG](variables/DEFAULT_LOGGER_CONFIG.md)

## Functions

- [clearSecurityHandlers](functions/clearSecurityHandlers.md)
- [consoleLogHandler](functions/consoleLogHandler.md)
- [createAuditTrail](functions/createAuditTrail.md)
- [createSecurityEvent](functions/createSecurityEvent.md)
- [jsonLogHandler](functions/jsonLogHandler.md)
- [logSecurityEvent](functions/logSecurityEvent.md)
- [registerSecurityHandler](functions/registerSecurityHandler.md)
- [removeSecurityHandler](functions/removeSecurityHandler.md)
