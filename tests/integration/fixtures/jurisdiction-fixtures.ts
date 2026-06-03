/**
 * Jurisdiction config fixtures for the 5 imminent engagement target states.
 *
 * **These are integration-test fixtures, not production regulator-grade
 * configs.** Country-specific public facts (ISO codes, language families,
 * currency, region, timezone, mining regulator name, known mobile money
 * brands) are accurate to the best of public sources. All other fields —
 * royalty rates, license codes, deployment targets, hardware brands, GCI
 * weights — are placeholder defaults shaped to satisfy
 * `JurisdictionConfigSchema`. Real production configs require sign-off from
 * each jurisdiction's team and the local regulator.
 *
 * Used by `tests/integration/jurisdictions.test.ts` to prove the foundation
 * crypto and verification surface is jurisdiction-agnostic.
 */

import type { JurisdictionConfig } from '@gtcx/jurisdiction-config';

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

function merge<T extends object>(base: T, overrides: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(overrides)) {
    if (
      v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === 'object' &&
      !Array.isArray(out[k])
    ) {
      out[k] = merge(out[k] as object, v as DeepPartial<object>);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}

function baseConfig(): JurisdictionConfig {
  return {
    identity: {
      countryCode: 'XX',
      countryCode3: 'XXX',
      name: { official: 'PLACEHOLDER', common: 'PLACEHOLDER', local: { en: 'PLACEHOLDER' } },
      timezone: 'UTC',
      region: 'southern_africa',
    },
    regulatory: {
      primaryAuthority: { name: 'PLACEHOLDER', abbreviation: 'PLC' },
      licensing: {
        producerLicenses: [
          { type: 'producer', code: 'PROD-TBD', renewalYears: 1, requiredForGTCX: true },
        ],
        buyerLicenses: [{ type: 'buyer', code: 'BUY-TBD', requiredForGTCX: true }],
        exportLicenses: [{ type: 'export', code: 'EXP-TBD', requiredForGTCX: true }],
      },
      compliance: {
        mercuryRestrictions: 'restricted',
        communityConsentRequired: true,
        childLaborProhibition: true,
        royaltyRate: 0.05,
        exportDutyRate: 0.03,
        chainOfCustodyRequired: true,
        assayRequiredForExport: true,
      },
      dataSovereignty: { dataResidencyRequired: true, governmentDataAccess: 'audit_only' },
    },
    commodities: [
      {
        type: 'gold',
        enabled: true,
        config: {
          weightUnit: 'gram',
          purityStandard: 'fineness',
          minimumPurityForExport: 0.995,
          pricingReference: 'lbma',
          localPremiumPercent: 0.5,
        },
      },
    ],
    localization: {
      officialLanguages: ['en'],
      supportedLanguages: [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          rtl: false,
          channels: { app: true, ussd: true, sms: true, voice: true },
        },
      ],
      defaultLanguage: 'en',
      numberFormat: { decimalSeparator: '.', thousandsSeparator: ',' },
      dateFormat: { short: 'DD/MM/YYYY', long: 'D MMMM YYYY', time: '24h' },
    },
    financial: {
      currency: { code: 'USD', symbol: '$', name: 'PLACEHOLDER', decimalPlaces: 2 },
      mobileMoneyProviders: [],
      limits: { maxCashTransactionUSD: 10000, mobileMoneyDailyLimitUSD: 1000 },
    },
    telecom: {
      operators: [],
      connectivity: { smartphonePenetration: 0.5, internetPenetration: 0.4 },
    },
    tradePass: {
      nationalId: { systemName: 'PLACEHOLDER', format: 'TBD', apiAvailable: false },
      card: {
        branding: { sovereignLogoRequired: true, primaryLanguage: 'en' },
        numbering: { prefix: 'XX', sequenceLength: 10 },
      },
      biometrics: { fingerprintRequired: true, templateStorageLocation: 'device_only' },
      kycTiers: { tier1LimitUSD: 500, tier2LimitUSD: 5000 },
    },
    hardware: {
      certifiedDevices: [],
      scales: { certificationRequired: true, recertificationMonths: 12, approvedBrands: [] },
      seals: { prefix: 'XX', supplier: 'sicpa' },
    },
    geoTag: {
      accuracyMeters: 10,
      spoofDetection: 'enhanced',
      satelliteProvider: 'none',
      droneOperationsPermitted: false,
    },
    custody: {
      seals: { required: true, prefix: 'XX', maxValidityDays: 30 },
      chain: { minimumCheckpoints: 3, maxHoursBetweenCheckpoints: 48 },
    },
    support: {
      channels: {
        ussdCode: '*000#',
        smsShortcode: '00000',
        whatsappNumber: 'TBD',
        voiceNumber: 'TBD',
      },
      hours: { businessStart: '08:00', businessEnd: '18:00', emergency24x7: false },
      rco: { location: 'PLACEHOLDER', minimumStaff: 1 },
      peerRewards: { currency: 'USD', answerAccepted: 1, articleContribution: 5 },
    },
    gci: {
      weights: {
        identity: 0.2,
        location: 0.15,
        documentation: 0.15,
        environmental: 0.1,
        labor: 0.15,
        financial: 0.15,
        traceability: 0.1,
      },
      thresholds: { minimumForTrading: 0.6, minimumForExport: 0.75, minimumForPremium: 0.9 },
    },
    deployment: {
      status: 'engaged',
      targets: { month3Users: 100, month6Users: 1000, year1Users: 10000, buyingStations: 5 },
      readiness: {
        regulatoryApproval: false,
        partnerContracts: false,
        rcoEstablished: false,
        hardwareOrdered: false,
      },
    },
  };
}

/** Zimbabwe — Reserve Bank of Zimbabwe + Ministry of Mines and Mining Development */
export function zimbabweFixture(): JurisdictionConfig {
  return merge(baseConfig(), {
    identity: {
      countryCode: 'ZW',
      countryCode3: 'ZWE',
      name: {
        official: 'Republic of Zimbabwe',
        common: 'Zimbabwe',
        local: { en: 'Zimbabwe', sn: 'Zimbabwe', nd: 'iZimbabwe' },
      },
      timezone: 'Africa/Harare',
      region: 'southern_africa',
    },
    regulatory: {
      primaryAuthority: {
        name: 'Ministry of Mines and Mining Development',
        abbreviation: 'MMMD',
      },
    },
    localization: {
      officialLanguages: ['en', 'sn', 'nd'],
      defaultLanguage: 'en',
    },
    financial: {
      currency: { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwe Dollar', decimalPlaces: 2 },
    },
    tradePass: { card: { numbering: { prefix: 'ZW', sequenceLength: 10 } } },
    custody: { seals: { prefix: 'ZW', maxValidityDays: 30 } },
    hardware: { seals: { prefix: 'ZW', supplier: 'sicpa' } },
    zkp: {
      defaultProfileId: 'zw-diamond-origin',
      packs: [
        {
          profileId: 'zw-diamond-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'clarity-and-centi-carats',
        },
      ],
    },
  });
}

/** Ghana — Bank of Ghana + Minerals Commission */
export function ghanaFixture(): JurisdictionConfig {
  return merge(baseConfig(), {
    identity: {
      countryCode: 'GH',
      countryCode3: 'GHA',
      name: {
        official: 'Republic of Ghana',
        common: 'Ghana',
        local: { en: 'Ghana', tw: 'Gaana' },
      },
      timezone: 'Africa/Accra',
      region: 'west_africa',
    },
    regulatory: {
      primaryAuthority: { name: 'Minerals Commission', abbreviation: 'MinComm' },
    },
    localization: {
      officialLanguages: ['en'],
      defaultLanguage: 'en',
    },
    financial: {
      currency: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', decimalPlaces: 2 },
    },
    tradePass: { card: { numbering: { prefix: 'GH', sequenceLength: 10 } } },
    custody: { seals: { prefix: 'GH', maxValidityDays: 30 } },
    hardware: { seals: { prefix: 'GH', supplier: 'sicpa' } },
    zkp: {
      defaultProfileId: 'gh-gold-origin',
      packs: [
        {
          profileId: 'gh-gold-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'purity-basis-points-and-grams',
        },
        {
          profileId: 'gh-cocoa-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'grade-and-grams',
        },
      ],
    },
  });
}

/** Namibia — Bank of Namibia + Ministry of Mines and Energy */
export function namibiaFixture(): JurisdictionConfig {
  return merge(baseConfig(), {
    identity: {
      countryCode: 'NA',
      countryCode3: 'NAM',
      name: {
        official: 'Republic of Namibia',
        common: 'Namibia',
        local: { en: 'Namibia', af: 'Namibië' },
      },
      timezone: 'Africa/Windhoek',
      region: 'southern_africa',
    },
    regulatory: {
      primaryAuthority: { name: 'Ministry of Mines and Energy', abbreviation: 'MME' },
    },
    localization: {
      officialLanguages: ['en'],
      defaultLanguage: 'en',
    },
    financial: {
      currency: { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar', decimalPlaces: 2 },
    },
    tradePass: { card: { numbering: { prefix: 'NA', sequenceLength: 10 } } },
    custody: { seals: { prefix: 'NA', maxValidityDays: 30 } },
    hardware: { seals: { prefix: 'NA', supplier: 'sicpa' } },
    zkp: {
      defaultProfileId: 'commodity-origin',
      packs: [
        {
          profileId: 'commodity-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'purity-basis-points-and-grams',
          labGeneric: true,
        },
      ],
    },
  });
}

/** Botswana — Bank of Botswana + Department of Mines */
export function botswanaFixture(): JurisdictionConfig {
  return merge(baseConfig(), {
    identity: {
      countryCode: 'BW',
      countryCode3: 'BWA',
      name: {
        official: 'Republic of Botswana',
        common: 'Botswana',
        local: { en: 'Botswana', tn: 'Botswana' },
      },
      timezone: 'Africa/Gaborone',
      region: 'southern_africa',
    },
    regulatory: {
      primaryAuthority: { name: 'Department of Mines', abbreviation: 'DoM' },
    },
    localization: {
      officialLanguages: ['en', 'tn'],
      defaultLanguage: 'en',
    },
    financial: {
      currency: { code: 'BWP', symbol: 'P', name: 'Botswana Pula', decimalPlaces: 2 },
    },
    tradePass: { card: { numbering: { prefix: 'BW', sequenceLength: 10 } } },
    custody: { seals: { prefix: 'BW', maxValidityDays: 30 } },
    hardware: { seals: { prefix: 'BW', supplier: 'sicpa' } },
    zkp: {
      defaultProfileId: 'commodity-origin',
      packs: [
        {
          profileId: 'commodity-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'purity-basis-points-and-grams',
          labGeneric: true,
        },
      ],
    },
  });
}

/** DR Congo — Banque Centrale du Congo + Cadastre Minier (CAMI) */
export function drcFixture(): JurisdictionConfig {
  return merge(baseConfig(), {
    identity: {
      countryCode: 'CD',
      countryCode3: 'COD',
      name: {
        official: 'République Démocratique du Congo',
        common: 'DR Congo',
        local: { fr: 'République Démocratique du Congo', en: 'Democratic Republic of the Congo' },
      },
      timezone: 'Africa/Kinshasa',
      region: 'central_africa',
    },
    regulatory: {
      primaryAuthority: { name: 'Cadastre Minier', abbreviation: 'CAMI' },
    },
    localization: {
      officialLanguages: ['fr'],
      supportedLanguages: [
        {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          rtl: false,
          channels: { app: true, ussd: true, sms: true, voice: true },
        },
      ],
      defaultLanguage: 'fr',
    },
    financial: {
      currency: { code: 'CDF', symbol: 'FC', name: 'Congolese Franc', decimalPlaces: 2 },
    },
    tradePass: { card: { numbering: { prefix: 'CD', sequenceLength: 10 } } },
    custody: { seals: { prefix: 'CD', maxValidityDays: 30 } },
    hardware: { seals: { prefix: 'CD', supplier: 'sicpa' } },
    zkp: {
      defaultProfileId: 'commodity-origin',
      packs: [
        {
          profileId: 'commodity-origin',
          underlyingCircuit: 'CommodityOrigin',
          metricSemantics: 'purity-basis-points-and-grams',
          labGeneric: true,
        },
      ],
    },
  });
}

export const ENGAGEMENT_JURISDICTIONS = [
  { code: 'ZW', name: 'Zimbabwe', fixture: zimbabweFixture },
  { code: 'GH', name: 'Ghana', fixture: ghanaFixture },
  { code: 'NA', name: 'Namibia', fixture: namibiaFixture },
  { code: 'BW', name: 'Botswana', fixture: botswanaFixture },
  { code: 'CD', name: 'DR Congo', fixture: drcFixture },
] as const;
