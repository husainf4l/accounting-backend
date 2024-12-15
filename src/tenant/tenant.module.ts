import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantPrismaService } from 'src/tenant-prisma-service/tenant-prisma-service.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TenantPrismaServiceModule } from 'src/tenant-prisma-service/tenant-prisma-service.module';

@Module({
  imports: [PrismaModule, TenantPrismaServiceModule],

  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
