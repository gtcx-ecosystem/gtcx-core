import { createHash, randomBytes } from 'node:crypto';

export function generateApiKeySecret(): string {
  return `gtcx_${randomBytes(24).toString('base64url')}`;
}

export function fingerprintSecret(secret: string): string {
  const hash = createHash('sha256').update(secret, 'utf8').digest('hex');
  return `sha256:${hash}`;
}

export function secretStorageArn(environment: string, clientId: string): string {
  return `arn:aws:secretsmanager:REGION:ACCOUNT:secret:gtcx-eap/${environment}/clients/${clientId}`;
}
