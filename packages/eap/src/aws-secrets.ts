import {
  CreateSecretCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

import type { SecretWriter } from './secrets.js';
import type { EapEnvironment } from './types.js';

export interface AwsSecretsManagerWriterOptions {
  environment: EapEnvironment;
  region?: string;
  client?: SecretsManagerClient;
}

export class AwsSecretsManagerWriter implements SecretWriter {
  private readonly client: SecretsManagerClient;
  private readonly environment: EapEnvironment;

  constructor(options: AwsSecretsManagerWriterOptions) {
    this.environment = options.environment;
    this.client =
      options.client ??
      new SecretsManagerClient({
        region: options.region ?? process.env['AWS_REGION'] ?? 'us-east-1',
      });
  }

  secretName(clientId: string): string {
    return `gtcx/eap/${this.environment}/clients/${clientId}`;
  }

  async writeClientSecret(params: {
    environment: EapEnvironment;
    clientId: string;
    secret: string;
    fingerprint: string;
    tenantId?: string;
    tier?: string;
  }): Promise<{ arn: string }> {
    const name = this.secretName(params.clientId);
    const secretString = JSON.stringify({
      api_key: params.secret,
      fingerprint: params.fingerprint,
      tenant_id: params.tenantId ?? null,
      tier: params.tier ?? null,
      issued_at: new Date().toISOString(),
    });

    try {
      const created = await this.client.send(
        new CreateSecretCommand({
          Name: name,
          Description: `EAP client credential (${params.clientId})`,
          SecretString: secretString,
          Tags: [
            { Key: 'gtcx:service', Value: 'eap' },
            { Key: 'gtcx:environment', Value: this.environment },
            { Key: 'gtcx:client_id', Value: params.clientId },
          ],
        })
      );
      return { arn: created.ARN ?? name };
    } catch (error: unknown) {
      const err = error as { name?: string };
      if (err.name !== 'ResourceExistsException') {
        throw error;
      }
      await this.client.send(
        new PutSecretValueCommand({
          SecretId: name,
          SecretString: secretString,
        })
      );
      return { arn: name };
    }
  }
}
