import { Test, TestingModule } from '@nestjs/testing';
import { TenantPrismaServiceController } from './tenant-prisma-service.controller';
import { TenantPrismaServiceService } from './tenant-prisma-service.service';

describe('TenantPrismaServiceController', () => {
  let controller: TenantPrismaServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantPrismaServiceController],
      providers: [TenantPrismaServiceService],
    }).compile();

    controller = module.get<TenantPrismaServiceController>(TenantPrismaServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
