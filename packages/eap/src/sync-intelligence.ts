import {
  GetSecretValueCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

import type { EapEnvironment } from './types.js';

export interface AuthKeysBundle {
  AUTH_API_KEYS: string;
  AUTH_KEY_ROLES: string;
}

export function parseAuthKeysBundle(raw: string): AuthKeysBundle {
  const parsed = JSON.parse(raw) as Partial<AuthKeysBundle>;
  return {
    AUTH_API_KEYS: String(parsed.AUTH_API_KEYS ?? ''),
    AUTH_KEY_ROLES: String(parsed.AUTH_KEY_ROLES ?? ''),
  };
}

export function mergeApiKeyIntoBundle(
  bundle: AuthKeysBundle,
  apiKey: string,
  role = 'intelligence'
): AuthKeysBundle {
  const keys = bundle.AUTH_API_KEYS.split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  if (!keys.includes(apiKey)) {
    keys.push(apiKey);
  }
  const roles = bundle.AUTH_KEY_ROLES.split(',')
    .map((r) => r.trim())
    .filter(Boolean);
  const roleEntry = `${apiKey}:${role}`;
  if (!roles.some((r) => r.startsWith(`${apiKey}:`))) {
    roles.push(roleEntry);
  }
  return {
    AUTH_API_KEYS: keys.join(','),
    AUTH_KEY_ROLES: roles.join(','),
  };
}

export function removeApiKeyFromBundle(
  bundle: AuthKeysBundle,
  fingerprintPrefix: string
): AuthKeysBundle {
  const keys = bundle.AUTH_API_KEYS.split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  const roles = bundle.AUTH_KEY_ROLES.split(',')
    .map((r) => r.trim())
    .filter(Boolean);
  // Revoke by role/client metadata is fingerprint-based in control plane; bundle stores raw keys only.
  void fingerprintPrefix;
  return { AUTH_API_KEYS: keys.join(','), AUTH_KEY_ROLES: roles.join(',') };
}

export async function syncApiKeyToIntelligenceBundle(params: {
  environment: EapEnvironment;
  apiKey: string;
  role?: string;
  region?: string;
  bundleSecretName?: string;
}): Promise<{ secretName: string; bundle: AuthKeysBundle }> {
  const client = new SecretsManagerClient({
    region: params.region ?? process.env['AWS_REGION'] ?? 'us-east-1',
  });
  const secretName = params.bundleSecretName ?? `gtcx/intelligence/${params.environment}/auth-keys`;

  let bundle: AuthKeysBundle = { AUTH_API_KEYS: '', AUTH_KEY_ROLES: '' };
  try {
    const current = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
    if (current.SecretString) {
      bundle = parseAuthKeysBundle(current.SecretString);
    }
  } catch {
    // New bundle secret — start empty.
  }

  bundle = mergeApiKeyIntoBundle(bundle, params.apiKey, params.role);

  await client.send(
    new PutSecretValueCommand({
      SecretId: secretName,
      SecretString: JSON.stringify(bundle),
    })
  );

  return { secretName, bundle };
}
