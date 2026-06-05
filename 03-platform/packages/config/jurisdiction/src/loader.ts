import {
  type EngagementJurisdictionPack,
  type JurisdictionConfig,
  EngagementJurisdictionPackSchema,
  JurisdictionConfigSchema,
} from './schema';

export interface LoadResult {
  success: true;
  config: JurisdictionConfig;
}

export interface LoadError {
  success: false;
  errors: string[];
}

export type LoadOutcome = LoadResult | LoadError;

export function loadJurisdictionConfig(raw: unknown): LoadOutcome {
  const result = JurisdictionConfigSchema.safeParse(raw);

  if (result.success) {
    return { success: true, config: result.data };
  }

  const errors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

  return { success: false, errors };
}

export function validateJurisdictionConfig(raw: unknown): raw is JurisdictionConfig {
  return JurisdictionConfigSchema.safeParse(raw).success;
}

export function loadEngagementJurisdictionPack(raw: unknown): LoadOutcome {
  const result = EngagementJurisdictionPackSchema.safeParse(raw);

  if (result.success) {
    return { success: true, config: result.data };
  }

  const errors = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

  return { success: false, errors };
}

export function validateEngagementJurisdictionPack(
  raw: unknown
): raw is EngagementJurisdictionPack {
  return EngagementJurisdictionPackSchema.safeParse(raw).success;
}
