import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Get(':accountId/statement')
    async getAccountStatement(
        @Param('accountId') accountId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.accountsService.getAccountStatement(accountId, +page, +limit, startDate, endDate);
    }

    @Post()
    async createAccount(@Body() accountData: any) {
        return this.accountsService.createAccount(accountData);
    }

    @Get('main')
    async getMainAccounts() {
        return this.accountsService.getMainAccount();
    }

}
