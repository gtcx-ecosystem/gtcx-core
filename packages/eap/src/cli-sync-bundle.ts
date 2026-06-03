#!/usr/bin/env node
/**
 * EAP Intelligence Bundle Sync CLI
 *
 * Rebuilds the intelligence auth-keys bundle from all EAP client secrets
 * stored in AWS Secrets Manager.
 *
 * Usage:
 *   EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 node --import tsx src/cli-sync-bundle.ts
 */

import { rebuildIntelligenceBundleFromEapSecrets } from './sync-intelligence.js';

const environment = (process.env['EAP_ENVIRONMENT'] ?? 'staging') as
  | 'staging'
  | 'production'
  | 'sandbox';

const region = process.env['AWS_REGION'] ?? 'us-east-1';

console.error(`Rebuilding intelligence bundle for environment=${environment} region=${region}...`);

try {
  const result = await rebuildIntelligenceBundleFromEapSecrets({
    environment,
    region,
  });

  console.log(
    JSON.stringify(
      {
        secret_name: result.secretName,
        keys_found: result.keysFound,
        keys_skipped: result.keysSkipped,
        auth_api_keys_count: result.bundle.AUTH_API_KEYS.split(',').filter(Boolean).length,
        auth_key_roles_count: result.bundle.AUTH_KEY_ROLES.split(',').filter(Boolean).length,
        ok: true,
      },
      null,
      2
    )
  );
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to rebuild bundle: ${message}`);
  process.exit(1);
}
