import { Controller, Get, Post, Body, Query, Param, Req, UseGuards } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('general-ledger')
export class GeneralLedgerController {
  constructor(private readonly generalLedgerService: GeneralLedgerService) { }

  @Post('create')
  async createEntry(@Body() entryData: any) {
    return this.generalLedgerService.createEntry(entryData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getLedgerEntries(
    @Req() req: any,
    @Query('accountId') accountId?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const companyId = req.user.companyId;
    return this.generalLedgerService.getLedgerEntries(companyId, {
      accountId,
      customerId,
      dateRange: startDate && endDate ? { start: new Date(startDate), end: new Date(endDate) } : undefined,
    });
  }
}
