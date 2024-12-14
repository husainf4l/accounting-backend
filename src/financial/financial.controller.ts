import { Controller, Get, Query } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('financials')
export class FinancialController {
  constructor(private financialService: FinancialService) { }

  @Get('income-statement')
  async getIncomeStatement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.financialService.getIncomeStatement(start, end);
  }
}
