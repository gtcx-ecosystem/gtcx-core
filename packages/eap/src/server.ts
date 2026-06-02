import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import type { EapAdminService } from './admin.js';
import type { IssueApiKeyInput, RevokeInput } from './types.js';

export interface EapAdminServerOptions {
  service: EapAdminService;
  port?: number;
  host?: string;
  adminToken?: string;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(body));
}

function authorize(req: IncomingMessage, token?: string): boolean {
  if (!token) return true;
  const header = req.headers.authorization ?? '';
  return header === `Bearer ${token}`;
}

export function createEapAdminServer(options: EapAdminServerOptions) {
  const { service, adminToken = process.env['EAP_ADMIN_TOKEN'] } = options;

  return createServer(async (req, res) => {
    if (!authorize(req, adminToken)) {
      sendJson(res, 401, { error: 'unauthorized' });
      return;
    }

    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const method = req.method ?? 'GET';

    try {
      if (method === 'GET' && url.pathname === '/v1/admin/credentials') {
        const tenantId = url.searchParams.get('tenant_id') ?? undefined;
        sendJson(res, 200, service.listFingerprints(tenantId));
        return;
      }

      if (method === 'POST' && url.pathname === '/v1/admin/credentials/issue') {
        const body = JSON.parse(await readBody(req)) as IssueApiKeyInput;
        const issued = await service.issueApiKey(body);
        sendJson(res, 201, {
          ...issued,
          secret: undefined,
          secret_redacted: true,
          note: 'Secret returned only in issue response body when EAP_RETURN_SECRET=1',
          ...(process.env['EAP_RETURN_SECRET'] === '1' ? { secret: issued.secret } : {}),
        });
        return;
      }

      if (method === 'POST' && url.pathname === '/v1/admin/credentials/revoke') {
        const body = JSON.parse(await readBody(req)) as RevokeInput;
        const revoked = await service.revoke(body);
        sendJson(res, 200, revoked);
        return;
      }

      if (method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { ok: true, service: 'eap-admin' });
        return;
      }

      sendJson(res, 404, { error: 'not_found' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(res, 400, { error: message });
    }
  });
}

export function startEapAdminServer(options: EapAdminServerOptions): Promise<void> {
  const port = options.port ?? Number(process.env['EAP_ADMIN_PORT'] ?? 4070);
  const host = options.host ?? '127.0.0.1';
  const server = createEapAdminServer(options);

  return new Promise((resolve) => {
    server.listen(port, host, () => {
      console.log(`EAP admin listening on http://${host}:${port}`);
      resolve();
    });
  });
}
