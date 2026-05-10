/**
 * Default secret redaction (defense-in-depth).
 *
 * Applied as the default sanitizer in `traced()` when `logInput` or
 * `logOutput` is true and no explicit sanitizer is provided. Prevents
 * accidental leakage of cryptographic material through traced operations.
 *
 * Override behavior is surfaced via the `sanitizer_override` telemetry
 * event — a misconfigured downstream consumer can ship
 * `sanitizeInput: (x) => x` and silently disable redaction; the override
 * event makes that visible at deployment time.
 */

/**
 * Keys whose values are automatically redacted when logged.
 * Matched case-insensitively as substrings.
 */
const REDACTED_KEY_PATTERNS = [
  'privatekey',
  'private_key',
  'secret',
  'seed',
  'mnemonic',
  'password',
  'token',
  'apikey',
  'api_key',
  'randomness',
];

/**
 * Recursively redact values of any field whose key matches a sensitive
 * pattern. Non-object inputs pass through unchanged.
 */
export function redactSecrets(value: unknown): unknown {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSecrets(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (REDACTED_KEY_PATTERNS.some((p) => key.toLowerCase().includes(p))) {
      result[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      result[key] = redactSecrets(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}
