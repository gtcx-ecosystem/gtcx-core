export class WitnessBuildError extends Error {
  readonly code: WitnessBuildErrorCode;

  constructor(code: WitnessBuildErrorCode, message: string) {
    super(message);
    this.name = 'WitnessBuildError';
    this.code = code;
  }
}

export type WitnessBuildErrorCode =
  | 'MISSING_PRODUCTION_CLAIM'
  | 'MISSING_GPS'
  | 'MISSING_SITE_ID'
  | 'INVALID_QUANTITY'
  | 'INVALID_CLAIM_VALUE';
