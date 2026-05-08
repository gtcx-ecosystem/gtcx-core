/**
 * Verification analytics.
 */

export interface VerificationSummary {
  totalOperations: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageLatencyMs: number;
  operationsByType: Record<string, number>;
  errorsByType: Record<string, number>;
}

export interface VerificationOperationLog<TInput = unknown, TOutput = unknown> {
  operationName: string;
  type: string;
  category?: string;
  input?: TInput;
  output?: TOutput;
  duration?: number;
  durationMs?: number | null;
  timestamp: number;
  success?: boolean;
  error?: { name: string; message: string; stack?: string };
  metadata?: Record<string, unknown>;
}

export function computeVerificationSummary(logs: VerificationOperationLog[]): VerificationSummary {
  const verificationLogs = logs.filter((l) => l.category === 'verification');

  const durations = verificationLogs
    .map((l) => l.durationMs)
    .filter((d): d is number => typeof d === 'number');

  const operationsByType: Record<string, number> = {};
  const errorsByType: Record<string, number> = {};

  verificationLogs.forEach((log) => {
    const type = log.type.split('.').pop() || 'unknown';
    operationsByType[type] = (operationsByType[type] || 0) + 1;

    if (!log.success && log.error) {
      const errorType = log.error.name;
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    }
  });

  return {
    totalOperations: verificationLogs.length,
    successfulVerifications: verificationLogs.filter((l) => l.success).length,
    failedVerifications: verificationLogs.filter((l) => !l.success).length,
    averageLatencyMs:
      durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
    operationsByType,
    errorsByType,
  };
}
