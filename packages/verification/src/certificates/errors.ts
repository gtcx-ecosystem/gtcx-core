// ============================================================================
// VERIFICATION ERROR CLASSES
// ============================================================================

export class VerificationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'VerificationError';
  }
}
