import type { ClientCredentialRecord, TenantRecord } from './types.js';

export class InMemoryEapRegistry {
  private tenants = new Map<string, TenantRecord>();
  private credentials = new Map<string, ClientCredentialRecord>();

  private key(tenantId: string, clientId: string): string {
    return `${tenantId}:${clientId}`;
  }

  upsertTenant(tenant: TenantRecord): void {
    this.tenants.set(tenant.tenantId, tenant);
  }

  getTenant(tenantId: string): TenantRecord | undefined {
    return this.tenants.get(tenantId);
  }

  saveCredential(record: ClientCredentialRecord): void {
    this.credentials.set(this.key(record.tenantId, record.clientId), record);
  }

  getCredential(tenantId: string, clientId: string): ClientCredentialRecord | undefined {
    return this.credentials.get(this.key(tenantId, clientId));
  }

  listCredentials(tenantId?: string): ClientCredentialRecord[] {
    return [...this.credentials.values()].filter((c) => !tenantId || c.tenantId === tenantId);
  }
}
