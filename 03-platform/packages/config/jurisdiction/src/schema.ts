import { z } from 'zod';

import { strictObject } from './schema-strict';

// ============================================================
// SECTION 1: IDENTITY
// ============================================================
const IdentitySchema = strictObject({
  countryCode: z.string().length(2),
  countryCode3: z.string().length(3),
  name: strictObject({
    official: z.string(),
    common: z.string(),
    local: z.record(z.string(), z.string()),
  }),
  timezone: z.string(),
  region: z.enum([
    'west_africa',
    'east_africa',
    'central_africa',
    'southern_africa',
    'north_africa',
    'latin_america',
    'south_asia',
    'southeast_asia',
  ]),
});

// ============================================================
// SECTION 2: REGULATORY
// ============================================================
const RegulatorySchema = strictObject({
  primaryAuthority: strictObject({
    name: z.string(),
    abbreviation: z.string(),
    website: z.string().url().optional(),
  }),

  licensing: strictObject({
    producerLicenses: z.array(
      strictObject({
        type: z.string(),
        code: z.string(),
        renewalYears: z.number(),
        requiredForGTCX: z.boolean(),
      })
    ),
    buyerLicenses: z.array(
      strictObject({
        type: z.string(),
        code: z.string(),
        requiredForGTCX: z.boolean(),
      })
    ),
    exportLicenses: z.array(
      strictObject({
        type: z.string(),
        code: z.string(),
        requiredForGTCX: z.boolean(),
      })
    ),
  }),

  compliance: strictObject({
    mercuryRestrictions: z.enum(['banned', 'restricted', 'permitted', 'unregulated']),
    communityConsentRequired: z.boolean(),
    childLaborProhibition: z.boolean(),
    royaltyRate: z.number(),
    exportDutyRate: z.number(),
    chainOfCustodyRequired: z.boolean(),
    assayRequiredForExport: z.boolean(),
  }),

  dataSovereignty: strictObject({
    dataResidencyRequired: z.boolean(),
    governmentDataAccess: z.enum(['realtime', 'on_request', 'audit_only', 'none']),
  }),
});

// ============================================================
// SECTION 3: COMMODITIES
// ============================================================
const CommoditySchema = strictObject({
  type: z.enum(['gold', 'diamond', 'coltan', 'cobalt', 'cocoa', 'coffee', 'cashew', 'shea']),
  enabled: z.boolean(),
  config: strictObject({
    weightUnit: z.enum(['gram', 'kilogram', 'ounce', 'troy_ounce']),
    purityStandard: z.enum(['fineness', 'karat', 'percentage']).optional(),
    minimumPurityForExport: z.number().optional(),
    pricingReference: z.enum(['lbma', 'comex', 'local_exchange', 'government_rate']),
    localPremiumPercent: z.number(),
  }),
});

const CommoditiesSchema = z.array(CommoditySchema);

// ============================================================
// SECTION 4: LOCALIZATION
// ============================================================
const LocalizationSchema = strictObject({
  officialLanguages: z.array(z.string()),
  supportedLanguages: z.array(
    strictObject({
      code: z.string(),
      name: z.string(),
      nativeName: z.string(),
      rtl: z.boolean(),
      channels: strictObject({
        app: z.boolean(),
        ussd: z.boolean(),
        sms: z.boolean(),
        voice: z.boolean(),
      }),
    })
  ),
  defaultLanguage: z.string(),
  numberFormat: strictObject({
    decimalSeparator: z.enum(['.', ',']),
    thousandsSeparator: z.enum([',', '.', ' ', '']),
  }),
  dateFormat: strictObject({
    short: z.string(),
    long: z.string(),
    time: z.enum(['12h', '24h']),
  }),
});

// ============================================================
// SECTION 5: FINANCIAL
// ============================================================
const FinancialSchema = strictObject({
  currency: strictObject({
    code: z.string().length(3),
    symbol: z.string(),
    name: z.string(),
    decimalPlaces: z.number(),
  }),
  mobileMoneyProviders: z.array(
    strictObject({
      name: z.string(),
      code: z.string(),
      ussdCode: z.string(),
      apiAvailable: z.boolean(),
      marketSharePercent: z.number(),
    })
  ),
  limits: strictObject({
    maxCashTransactionUSD: z.number(),
    mobileMoneyDailyLimitUSD: z.number(),
  }),
});

// ============================================================
// SECTION 6: TELECOM
// ============================================================
const TelecomSchema = strictObject({
  operators: z.array(
    strictObject({
      name: z.string(),
      code: z.string(),
      marketSharePercent: z.number(),
      coverage: strictObject({
        population2G: z.number(),
        population4G: z.number(),
      }),
      ussdPartnership: strictObject({
        available: z.boolean(),
        shortCode: z.string().optional(),
      }),
    })
  ),
  connectivity: strictObject({
    smartphonePenetration: z.number(),
    internetPenetration: z.number(),
  }),
});

// ============================================================
// SECTION 7: IDENTITY VERIFICATION
// ============================================================
const IdentityVerificationSchema = strictObject({
  nationalId: strictObject({
    systemName: z.string(),
    format: z.string(),
    apiAvailable: z.boolean(),
  }),
  card: strictObject({
    branding: strictObject({
      sovereignLogoRequired: z.boolean(),
      primaryLanguage: z.string(),
    }),
    numbering: strictObject({
      prefix: z.string(),
      sequenceLength: z.number(),
    }),
  }),
  biometrics: strictObject({
    fingerprintRequired: z.boolean(),
    templateStorageLocation: z.enum(['device_only', 'card', 'central']),
  }),
  kycTiers: strictObject({
    tier1LimitUSD: z.number(),
    tier2LimitUSD: z.number(),
  }),
});

// ============================================================
// SECTION 8: HARDWARE
// ============================================================
const HardwareSchema = strictObject({
  certifiedDevices: z.array(
    strictObject({
      manufacturer: z.string(),
      model: z.string(),
      certificationLevel: z.enum(['compatible', 'certified', 'verified']),
      retailPriceUSD: z.number(),
    })
  ),
  scales: strictObject({
    certificationRequired: z.boolean(),
    recertificationMonths: z.number(),
    approvedBrands: z.array(z.string()),
  }),
  seals: strictObject({
    prefix: z.string(),
    supplier: z.enum(['sicpa', '3m', 'local', 'multi']),
  }),
});

// ============================================================
// SECTION 9: GEOTAG
// ============================================================
const GeoTagSchema = strictObject({
  accuracyMeters: z.number(),
  spoofDetection: z.enum(['basic', 'enhanced', 'strict']),
  satelliteProvider: z.enum(['planet', 'maxar', 'airbus', 'sovereign', 'none']),
  droneOperationsPermitted: z.boolean(),
});

// ============================================================
// SECTION 10: CUSTODY
// ============================================================
const CustodySchema = strictObject({
  seals: strictObject({
    required: z.boolean(),
    prefix: z.string(),
    maxValidityDays: z.number(),
  }),
  chain: strictObject({
    minimumCheckpoints: z.number(),
    maxHoursBetweenCheckpoints: z.number(),
  }),
});

// ============================================================
// SECTION 11: SUPPORT
// ============================================================
const SupportSchema = strictObject({
  channels: strictObject({
    ussdCode: z.string(),
    smsShortcode: z.string(),
    whatsappNumber: z.string(),
    voiceNumber: z.string(),
  }),
  hours: strictObject({
    businessStart: z.string(),
    businessEnd: z.string(),
    emergency24x7: z.boolean(),
  }),
  rco: strictObject({
    location: z.string(),
    minimumStaff: z.number(),
  }),
  peerRewards: strictObject({
    currency: z.string(),
    answerAccepted: z.number(),
    articleContribution: z.number(),
  }),
});

// ============================================================
// SECTION 12: GCI SCORING
// ============================================================
const GciSchema = strictObject({
  weights: strictObject({
    identity: z.number(),
    location: z.number(),
    documentation: z.number(),
    environmental: z.number(),
    labor: z.number(),
    financial: z.number(),
    traceability: z.number(),
  }),
  thresholds: strictObject({
    minimumForTrading: z.number(),
    minimumForExport: z.number(),
    minimumForPremium: z.number(),
  }),
});

// ============================================================
// SECTION 13: DEPLOYMENT
// ============================================================
const DeploymentSchema = strictObject({
  status: z.enum([
    'prospect',
    'engaged',
    'mou_signed',
    'pilot_preparing',
    'pilot_active',
    'scaling',
    'production',
  ]),
  targets: strictObject({
    month3Users: z.number(),
    month6Users: z.number(),
    year1Users: z.number(),
    buyingStations: z.number(),
  }),
  readiness: strictObject({
    regulatoryApproval: z.boolean(),
    partnerContracts: z.boolean(),
    rcoEstablished: z.boolean(),
    hardwareOrdered: z.boolean(),
  }),
});

// ============================================================
// SECTION 14: ZKP (Tier 5 policy packs on CommodityOrigin R1CS)
// ============================================================
export const CircuitProfileIdSchema = z.enum([
  'gh-gold-origin',
  'gh-cocoa-origin',
  'zw-diamond-origin',
  'commodity-origin',
]);

export const ProfileMetricSemanticsSchema = z.enum([
  'purity-basis-points-and-grams',
  'clarity-and-centi-carats',
  'grade-and-grams',
]);

const ZkpPolicyPackSchema = strictObject({
  profileId: CircuitProfileIdSchema,
  underlyingCircuit: z.literal('CommodityOrigin'),
  metricSemantics: ProfileMetricSemanticsSchema,
  /** Lab-only generic pack until a named sovereign profile ships (NA/BW/CD). */
  labGeneric: z.boolean().optional(),
});

const ZkpSchema = strictObject({
  defaultProfileId: CircuitProfileIdSchema,
  packs: z.array(ZkpPolicyPackSchema).min(1),
});

// ============================================================
// COMBINED SCHEMA
// ============================================================
export const JurisdictionConfigSchema = strictObject({
  identity: IdentitySchema,
  regulatory: RegulatorySchema,
  commodities: CommoditiesSchema,
  localization: LocalizationSchema,
  financial: FinancialSchema,
  telecom: TelecomSchema,
  tradePass: IdentityVerificationSchema,
  hardware: HardwareSchema,
  geoTag: GeoTagSchema,
  custody: CustodySchema,
  support: SupportSchema,
  gci: GciSchema,
  deployment: DeploymentSchema,
  /** Tier 5 circuit registry linkage — required for engagement jurisdiction packs. */
  zkp: ZkpSchema.optional(),
});

/** Engagement targets (ZW, GH, NA, BW, CD) must include `zkp` and pass strict parsing. */
export const EngagementJurisdictionPackSchema = JurisdictionConfigSchema.extend({
  zkp: ZkpSchema,
});

export type JurisdictionConfig = z.infer<typeof JurisdictionConfigSchema>;
export type EngagementJurisdictionPack = z.infer<typeof EngagementJurisdictionPackSchema>;

export {
  IdentitySchema,
  RegulatorySchema,
  CommoditySchema,
  CommoditiesSchema,
  LocalizationSchema,
  FinancialSchema,
  TelecomSchema,
  IdentityVerificationSchema,
  HardwareSchema,
  GeoTagSchema,
  CustodySchema,
  SupportSchema,
  GciSchema,
  DeploymentSchema,
  ZkpSchema,
  ZkpPolicyPackSchema,
};
