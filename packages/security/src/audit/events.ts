/**
 * @gtcx/security - Security Event Types & Logging
 *
 * Structured security event logging for observability.
 * Implements P12 (Observability) and P5 (AI-Native).
 */

// =============================================================================
// EVENT TYPES
// =============================================================================

/**
 * Security event categories
 */
export type SecurityEventType =
  // Authentication
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE'
  | 'AUTH_LOCKOUT'
  | 'AUTH_UNLOCK'
  | 'AUTH_TOKEN_ISSUED'
  | 'AUTH_TOKEN_REVOKED'
  | 'AUTH_SESSION_CREATED'
  | 'AUTH_SESSION_EXPIRED'

  // Authorization
  | 'ACCESS_GRANTED'
  | 'ACCESS_DENIED'
  | 'PERMISSION_CHANGED'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REVOKED'

  // Validation
  | 'VALIDATION_SUCCESS'
  | 'VALIDATION_FAILURE'
  | 'SANITIZATION_APPLIED'

  // Cryptographic
  | 'CRYPTO_SIGN'
  | 'CRYPTO_VERIFY'
  | 'CRYPTO_VERIFY_FAILED'
  | 'CRYPTO_ENCRYPT'
  | 'CRYPTO_DECRYPT'
  | 'CRYPTO_DECRYPT_FAILED'

  // Key lifecycle
  | 'KEY_GENERATED'
  | 'KEY_IMPORTED'
  | 'KEY_EXPORTED'
  | 'KEY_ROTATED'
  | 'KEY_REVOKED'
  | 'KEY_EXPIRED'

  // Offline (P8)
  | 'OFFLINE_SYNC_START'
  | 'OFFLINE_SYNC_COMPLETE'
  | 'OFFLINE_SYNC_FAILED'
  | 'OFFLINE_CACHE_HIT'
  | 'OFFLINE_CACHE_MISS'
  | 'OFFLINE_CACHE_EXPIRED'
  | 'OFFLINE_CREDENTIAL_CACHED'
  | 'OFFLINE_CREDENTIAL_USED'

  // Integrity
  | 'TAMPER_DETECTED'
  | 'INTEGRITY_CHECK_PASSED'
  | 'INTEGRITY_CHECK_FAILED'

  // Data
  | 'DATA_ACCESSED'
  | 'DATA_MODIFIED'
  | 'DATA_DELETED'
  | 'DATA_EXPORTED'

  // System
  | 'SECURITY_CONFIG_CHANGED'
  | 'AUDIT_LOG_ACCESSED'
  | 'SECURITY_ALERT';

/**
 * Event severity levels
 */
export type SecuritySeverity = 'INFO' | 'WARN' | 'HIGH' | 'CRITICAL';

/**
 * Event outcome
 */
export type SecurityOutcome = 'SUCCESS' | 'FAILURE' | 'BLOCKED';

// =============================================================================
// EVENT STRUCTURE
// =============================================================================

/**
 * Security event structure
 *
 * Designed for:
 * - Structured logging (P12)
 * - AI analysis (P5)
 * - Compliance audit trails
 * - Anomaly detection
 */
export interface SecurityEvent {
  /** ISO 8601 timestamp */
  timestamp: string;

  /** Event type */
  eventType: SecurityEventType;

  /** Severity level */
  severity: SecuritySeverity;

  /** Event outcome */
  outcome: SecurityOutcome;

  /** Who performed the action (user ID, service name, etc.) */
  actor?: string;

  /** What was accessed/modified (resource identifier) */
  resource?: string;

  /** What action was taken */
  action?: string;

  /** Reason for outcome (especially for failures) */
  reason?: string;

  /** Correlation ID for distributed tracing */
  traceId?: string;

  /** Session ID */
  sessionId?: string;

  /** Request ID */
  requestId?: string;

  /** Client IP address (if applicable) */
  ip?: string;

  /** User agent (if applicable) */
  userAgent?: string;

  /** Geographic context */
  geo?: {
    country?: string;
    region?: string;
    city?: string;
  };

  /** Protocol context (which GTCX protocol) */
  protocol?: 'tradepass' | 'geotag' | 'vaultmark' | 'pvp' | 'gci' | 'panx';

  /** Additional structured metadata */
  metadata?: Record<string, unknown>;
}

// =============================================================================
// EVENT BUILDER
// =============================================================================

/**
 * Build a security event with defaults
 */
export function createSecurityEvent(
  eventType: SecurityEventType,
  outcome: SecurityOutcome,
  options: Partial<Omit<SecurityEvent, 'timestamp' | 'eventType' | 'outcome'>> = {}
): SecurityEvent {
  return {
    timestamp: new Date().toISOString(),
    eventType,
    outcome,
    severity: options.severity ?? inferSeverity(eventType, outcome),
    ...options,
  };
}

/**
 * Infer severity from event type and outcome
 */
function inferSeverity(eventType: SecurityEventType, outcome: SecurityOutcome): SecuritySeverity {
  // Critical events
  if (eventType === 'TAMPER_DETECTED') return 'CRITICAL';
  if (eventType === 'KEY_REVOKED' && outcome === 'SUCCESS') return 'HIGH';
  if (eventType === 'AUTH_LOCKOUT') return 'HIGH';

  // Failures are generally warnings
  if (outcome === 'FAILURE' || outcome === 'BLOCKED') {
    if (eventType.includes('AUTH_')) return 'WARN';
    if (eventType.includes('CRYPTO_')) return 'WARN';
    if (eventType === 'INTEGRITY_CHECK_FAILED') return 'HIGH';
    return 'WARN';
  }

  // Success events are info
  return 'INFO';
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

export type SecurityEventHandler = (event: SecurityEvent) => Promise<void>;

const handlers: SecurityEventHandler[] = [];

/**
 * Register a handler for security events
 *
 * @example
 * registerSecurityHandler(async (event) => {
 *   await analyticsService.track(event);
 *   if (event.severity === 'CRITICAL') {
 *     await alertService.notify(event);
 *   }
 * });
 */
export function registerSecurityHandler(handler: SecurityEventHandler): void {
  handlers.push(handler);
}

/**
 * Remove a handler
 */
export function removeSecurityHandler(handler: SecurityEventHandler): void {
  const index = handlers.indexOf(handler);
  if (index !== -1) {
    handlers.splice(index, 1);
  }
}

/**
 * Clear all handlers (useful for testing)
 */
export function clearSecurityHandlers(): void {
  handlers.length = 0;
}

/**
 * Log a security event
 *
 * Sends event to all registered handlers.
 * Also logs to console in development.
 */
export async function logSecurityEvent(
  eventOrType: SecurityEvent | SecurityEventType,
  options?: Partial<Omit<SecurityEvent, 'timestamp' | 'eventType'>>
): Promise<void> {
  const event: SecurityEvent =
    typeof eventOrType === 'string'
      ? createSecurityEvent(eventOrType, options?.outcome ?? 'SUCCESS', options)
      : eventOrType;

  // Log to console in development
  if (process.env['NODE_ENV'] === 'development') {
    const color = severityColor(event.severity);
    // eslint-disable-next-line no-console
    console.log(
      `${color}[SECURITY:${event.severity}]`,
      event.eventType,
      event.outcome,
      event.actor ? `actor=${event.actor}` : '',
      event.resource ? `resource=${event.resource}` : '',
      event.reason ? `reason=${event.reason}` : '',
      '\x1b[0m'
    );
  }

  // Send to all handlers
  await Promise.all(
    handlers.map((handler) =>
      handler(event).catch((err) => {
        console.error('[gtcx/security] handler dispatch failed:', err);
      })
    )
  );
}

function severityColor(severity: SecuritySeverity): string {
  switch (severity) {
    case 'CRITICAL':
      return '\x1b[31m'; // Red
    case 'HIGH':
      return '\x1b[33m'; // Yellow
    case 'WARN':
      return '\x1b[35m'; // Magenta
    case 'INFO':
      return '\x1b[36m'; // Cyan
  }
}

// =============================================================================
// AUDIT TRAIL
// =============================================================================

/**
 * Create an audit trail for a multi-step operation
 *
 * @example
 * const audit = createAuditTrail('custody_transfer');
 * audit.record('initiated', { from: vaultA, to: vaultB });
 * audit.record('verified', { inspector: inspectorId });
 * audit.record('completed', { timestamp: Date.now() });
 * await audit.finalize();
 */
export interface AuditTrail {
  readonly operationId: string;
  readonly operationType: string;
  readonly startedAt: string;

  record(step: string, metadata?: Record<string, unknown>): void;
  finalize(outcome?: SecurityOutcome, reason?: string): Promise<void>;
}

export function createAuditTrail(
  operationType: string,
  context?: { actor?: string; resource?: string; traceId?: string }
): AuditTrail {
  const operationId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  const steps: Array<{ step: string; timestamp: string; metadata?: Record<string, unknown> }> = [];

  return {
    operationId,
    operationType,
    startedAt,

    record(step: string, metadata?: Record<string, unknown>) {
      steps.push({
        step,
        timestamp: new Date().toISOString(),
        metadata,
      });
    },

    async finalize(outcome: SecurityOutcome = 'SUCCESS', reason?: string) {
      await logSecurityEvent({
        timestamp: new Date().toISOString(),
        eventType: 'DATA_MODIFIED',
        severity: outcome === 'SUCCESS' ? 'INFO' : 'WARN',
        outcome,
        reason,
        actor: context?.actor,
        resource: context?.resource,
        traceId: context?.traceId,
        metadata: {
          operationId,
          operationType,
          startedAt,
          completedAt: new Date().toISOString(),
          steps,
        },
      });
    },
  };
}
