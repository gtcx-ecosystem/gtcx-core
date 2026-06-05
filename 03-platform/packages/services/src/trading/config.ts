/**
 * Trading service configuration.
 */

export interface TradingConfig {
  /** Default currency for trades */
  defaultCurrency: string;
  /** Default price spread percentage */
  defaultSpread: number;
  /** Default seller markup percentage */
  sellerMarkup: number;
  /** High value transaction threshold (requires enhanced KYC) */
  highValueThreshold: number;
  /** Maximum transaction value allowed */
  maxTransactionValue?: number | undefined;
  /** Allowed payment methods */
  allowedPaymentMethods?: string[] | undefined;
  /** Market data sources */
  marketSources?: string[] | undefined;
}

export const DEFAULT_CONFIG: TradingConfig = {
  defaultCurrency: 'USD',
  defaultSpread: 2.5,
  sellerMarkup: 5,
  highValueThreshold: 10000,
};
