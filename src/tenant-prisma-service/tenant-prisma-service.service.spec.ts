import { Test, TestingModule } from '@nestjs/testing';
import { TenantPrismaServiceService } from './tenant-prisma-service.service';

describe('TenantPrismaServiceService', () => {
  let service: TenantPrismaServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantPrismaServiceService],
    }).compile();

    service = module.get<TenantPrismaServiceService>(TenantPrismaServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
