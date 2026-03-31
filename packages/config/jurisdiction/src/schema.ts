import { z } from 'zod';

// ============================================================
// SECTION 1: IDENTITY
// ============================================================
const IdentitySchema = z.object({
  countryCode: z.string().length(2),
  countryCode3: z.string().length(3),
  name: z.object({
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
const RegulatorySchema = z.object({
  primaryAuthority: z.object({
    name: z.string(),
    abbreviation: z.string(),
    website: z.string().url().optional(),
  }),

  licensing: z.object({
    producerLicenses: z.array(
      z.object({
        type: z.string(),
        code: z.string(),
        renewalYears: z.number(),
        requiredForGTCX: z.boolean(),
      })
    ),
    buyerLicenses: z.array(
      z.object({
        type: z.string(),
        code: z.string(),
        requiredForGTCX: z.boolean(),
      })
    ),
    exportLicenses: z.array(
      z.object({
        type: z.string(),
        code: z.string(),
        requiredForGTCX: z.boolean(),
      })
    ),
  }),

  compliance: z.object({
    mercuryRestrictions: z.enum(['banned', 'restricted', 'permitted', 'unregulated']),
    communityConsentRequired: z.boolean(),
    childLaborProhibition: z.boolean(),
    royaltyRate: z.number(),
    exportDutyRate: z.number(),
    chainOfCustodyRequired: z.boolean(),
    assayRequiredForExport: z.boolean(),
  }),

  dataSovereignty: z.object({
    dataResidencyRequired: z.boolean(),
    governmentDataAccess: z.enum(['realtime', 'on_request', 'audit_only', 'none']),
  }),
});

// ============================================================
// SECTION 3: COMMODITIES
// ============================================================
const CommoditySchema = z.object({
  type: z.enum(['gold', 'diamond', 'coltan', 'cobalt', 'cocoa', 'coffee', 'cashew', 'shea']),
  enabled: z.boolean(),
  config: z.object({
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
const LocalizationSchema = z.object({
  officialLanguages: z.array(z.string()),
  supportedLanguages: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      nativeName: z.string(),
      rtl: z.boolean(),
      channels: z.object({
        app: z.boolean(),
        ussd: z.boolean(),
        sms: z.boolean(),
        voice: z.boolean(),
      }),
    })
  ),
  defaultLanguage: z.string(),
  numberFormat: z.object({
    decimalSeparator: z.enum(['.', ',']),
    thousandsSeparator: z.enum([',', '.', ' ', '']),
  }),
  dateFormat: z.object({
    short: z.string(),
    long: z.string(),
    time: z.enum(['12h', '24h']),
  }),
});

// ============================================================
// SECTION 5: FINANCIAL
// ============================================================
const FinancialSchema = z.object({
  currency: z.object({
    code: z.string().length(3),
    symbol: z.string(),
    name: z.string(),
    decimalPlaces: z.number(),
  }),
  mobileMoneyProviders: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
      ussdCode: z.string(),
      apiAvailable: z.boolean(),
      marketSharePercent: z.number(),
    })
  ),
  limits: z.object({
    maxCashTransactionUSD: z.number(),
    mobileMoneyDailyLimitUSD: z.number(),
  }),
});

// ============================================================
// SECTION 6: TELECOM
// ============================================================
const TelecomSchema = z.object({
  operators: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
      marketSharePercent: z.number(),
      coverage: z.object({
        population2G: z.number(),
        population4G: z.number(),
      }),
      ussdPartnership: z.object({
        available: z.boolean(),
        shortCode: z.string().optional(),
      }),
    })
  ),
  connectivity: z.object({
    smartphonePenetration: z.number(),
    internetPenetration: z.number(),
  }),
});

// ============================================================
// SECTION 7: IDENTITY VERIFICATION
// ============================================================
const IdentityVerificationSchema = z.object({
  nationalId: z.object({
    systemName: z.string(),
    format: z.string(),
    apiAvailable: z.boolean(),
  }),
  card: z.object({
    branding: z.object({
      sovereignLogoRequired: z.boolean(),
      primaryLanguage: z.string(),
    }),
    numbering: z.object({
      prefix: z.string(),
      sequenceLength: z.number(),
    }),
  }),
  biometrics: z.object({
    fingerprintRequired: z.boolean(),
    templateStorageLocation: z.enum(['device_only', 'card', 'central']),
  }),
  kycTiers: z.object({
    tier1LimitUSD: z.number(),
    tier2LimitUSD: z.number(),
  }),
});

// ============================================================
// SECTION 8: HARDWARE
// ============================================================
const HardwareSchema = z.object({
  certifiedDevices: z.array(
    z.object({
      manufacturer: z.string(),
      model: z.string(),
      certificationLevel: z.enum(['compatible', 'certified', 'verified']),
      retailPriceUSD: z.number(),
    })
  ),
  scales: z.object({
    certificationRequired: z.boolean(),
    recertificationMonths: z.number(),
    approvedBrands: z.array(z.string()),
  }),
  seals: z.object({
    prefix: z.string(),
    supplier: z.enum(['sicpa', '3m', 'local', 'multi']),
  }),
});

// ============================================================
// SECTION 9: GEOTAG
// ============================================================
const GeoTagSchema = z.object({
  accuracyMeters: z.number(),
  spoofDetection: z.enum(['basic', 'enhanced', 'strict']),
  satelliteProvider: z.enum(['planet', 'maxar', 'airbus', 'sovereign', 'none']),
  droneOperationsPermitted: z.boolean(),
});

// ============================================================
// SECTION 10: CUSTODY
// ============================================================
const CustodySchema = z.object({
  seals: z.object({
    required: z.boolean(),
    prefix: z.string(),
    maxValidityDays: z.number(),
  }),
  chain: z.object({
    minimumCheckpoints: z.number(),
    maxHoursBetweenCheckpoints: z.number(),
  }),
});

// ============================================================
// SECTION 11: SUPPORT
// ============================================================
const SupportSchema = z.object({
  channels: z.object({
    ussdCode: z.string(),
    smsShortcode: z.string(),
    whatsappNumber: z.string(),
    voiceNumber: z.string(),
  }),
  hours: z.object({
    businessStart: z.string(),
    businessEnd: z.string(),
    emergency24x7: z.boolean(),
  }),
  rco: z.object({
    location: z.string(),
    minimumStaff: z.number(),
  }),
  peerRewards: z.object({
    currency: z.string(),
    answerAccepted: z.number(),
    articleContribution: z.number(),
  }),
});

// ============================================================
// SECTION 12: GCI SCORING
// ============================================================
const GciSchema = z.object({
  weights: z.object({
    identity: z.number(),
    location: z.number(),
    documentation: z.number(),
    environmental: z.number(),
    labor: z.number(),
    financial: z.number(),
    traceability: z.number(),
  }),
  thresholds: z.object({
    minimumForTrading: z.number(),
    minimumForExport: z.number(),
    minimumForPremium: z.number(),
  }),
});

// ============================================================
// SECTION 13: DEPLOYMENT
// ============================================================
const DeploymentSchema = z.object({
  status: z.enum([
    'prospect',
    'engaged',
    'mou_signed',
    'pilot_preparing',
    'pilot_active',
    'scaling',
    'production',
  ]),
  targets: z.object({
    month3Users: z.number(),
    month6Users: z.number(),
    year1Users: z.number(),
    buyingStations: z.number(),
  }),
  readiness: z.object({
    regulatoryApproval: z.boolean(),
    partnerContracts: z.boolean(),
    rcoEstablished: z.boolean(),
    hardwareOrdered: z.boolean(),
  }),
});

// ============================================================
// COMBINED SCHEMA
// ============================================================
export const JurisdictionConfigSchema = z.object({
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
});

export type JurisdictionConfig = z.infer<typeof JurisdictionConfigSchema>;

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
};
