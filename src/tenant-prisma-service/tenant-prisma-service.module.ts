import { Module } from '@nestjs/common';
import { TenantPrismaServiceController } from './tenant-prisma-service.controller';
import { TenantPrismaService } from './tenant-prisma-service.service';

@Module({
  providers: [TenantPrismaService],
  exports: [TenantPrismaService],
})
export class TenantPrismaServiceModule {}
