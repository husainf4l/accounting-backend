import { Test, TestingModule } from '@nestjs/testing';
import { TaxCodeController } from './tax-code.controller';

describe('TaxCodeController', () => {
  let controller: TaxCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxCodeController],
    }).compile();

    controller = module.get<TaxCodeController>(TaxCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
