import { Controller, Get, Param, Post } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';

@Controller('general-ledger')
export class GeneralLedgerController {
    constructor(private generalLedgerService: GeneralLedgerService) { }

    @Get('accounts/:id/balance')
    async getAccountBalance(@Param('id') accountId: string) {
        const balance = await this.generalLedgerService.getAccountBalance(accountId);
        return { accountId, balance };
    }

    @Post('update-balances')
    async updateBalances() {
        await this.generalLedgerService.updateGeneralLedger();
        return { message: 'General ledger updated successfully!' };
    }

}
