import { Controller } from '@nestjs/common';
import { TenantPrismaService } from './tenant-prisma-service.service';

@Controller('tenant-prisma-service')
export class TenantPrismaServiceController {
  constructor(
    private readonly tenantPrismaServiceService: TenantPrismaService,
  ) {}
}
