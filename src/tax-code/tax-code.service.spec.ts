import { Test, TestingModule } from '@nestjs/testing';
import { TaxCodeService } from './tax-code.service';

describe('TaxCodeService', () => {
  let service: TaxCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxCodeService],
    }).compile();

    service = module.get<TaxCodeService>(TaxCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
