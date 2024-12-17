import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('financials')
export class FinancialController {
  constructor(private financialService: FinancialService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('income-statement')
  async getIncomeStatement(
    @Req() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {

    const companyId = req.user.companyId;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.financialService.getIncomeStatement(companyId, start, end);
  }
}
