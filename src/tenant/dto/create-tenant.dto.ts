// tenant/dto/create-tenant.dto.ts
export class CreateTenantDto {
  name: string; // Company name
  databaseName: string; // Tenant database name
  region?: string; // Optional region information
  databaseUrl: string;
}
