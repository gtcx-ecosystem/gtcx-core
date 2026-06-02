#!/usr/bin/env node
import { createEapAdminService } from './admin.js';
import { AwsSecretsManagerWriter } from './aws-secrets.js';
import { startEapAdminServer } from './server.js';

const environment = (process.env['EAP_ENVIRONMENT'] ?? 'staging') as
  | 'staging'
  | 'production'
  | 'sandbox';

const serviceOptions: Parameters<typeof createEapAdminService>[0] = { environment };
if (process.env['EAP_USE_STUB'] !== '1') {
  serviceOptions.secretWriter = new AwsSecretsManagerWriter({ environment });
}

const service = createEapAdminService(serviceOptions);

await startEapAdminServer({ service });
