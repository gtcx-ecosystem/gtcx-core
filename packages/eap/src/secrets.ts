import type { EapEnvironment } from './types.js';

export interface SecretWriter {
  writeClientSecret(params: {
    environment: EapEnvironment;
    clientId: string;
    secret: string;
    fingerprint: string;
  }): Promise<{ arn: string }>;
}

/** Phase B stub — logs intent; replace with AWS SDK in EAP-03. */
export class StubSecretWriter implements SecretWriter {
  readonly writes: Array<{
    environment: EapEnvironment;
    clientId: string;
    fingerprint: string;
  }> = [];

  async writeClientSecret(params: {
    environment: EapEnvironment;
    clientId: string;
    secret: string;
    fingerprint: string;
  }): Promise<{ arn: string }> {
    this.writes.push({
      environment: params.environment,
      clientId: params.clientId,
      fingerprint: params.fingerprint,
    });
    const arn = `arn:aws:secretsmanager:REGION:ACCOUNT:secret:gtcx-eap/${params.environment}/clients/${params.clientId}`;
    return { arn };
  }
}
