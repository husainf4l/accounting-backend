import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('general-ledger')
export class GeneralLedgerController {
  constructor(private generalLedgerService: GeneralLedgerService) { }

  @Get('accounts/:id/balance')
  async getAccountBalance(@Param('id') accountId: string) {
    const balance = await this.generalLedgerService.getAccountBalance(accountId);
    return { accountId, balance };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-balances')
  async updateBalances(@Req() req: any,) {
    const companyId = req.user.companyId;
    await this.generalLedgerService.updateGeneralLedger(companyId);
    return { message: 'General ledger updated successfully!' };
  }
}
