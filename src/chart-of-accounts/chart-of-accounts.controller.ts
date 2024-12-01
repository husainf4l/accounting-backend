import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { Prisma } from '@prisma/client';

@Controller('chart-of-accounts')
export class ChartOfAccountsController {
    constructor(private readonly chartOfAccountsService: ChartOfAccountsService) { }

    // Get all accounts
    @Get()
    async getAllAccounts() {
        return this.chartOfAccountsService.getAllAccounts();
    }

    // Get an account by ID
    @Get(':id')
    async getAccountById(@Param('id') id: string) {
        return this.chartOfAccountsService.getAccountById(id);
    }

    // Create a new account
    @Post()
    async createAccount(@Body() accountData: Prisma.AccountCreateInput) {
        return this.chartOfAccountsService.createAccount(accountData);
    }

    // Update an account
    @Patch(':id')
    async updateAccount(
        @Param('id') id: string,
        @Body() accountData: Prisma.AccountUpdateInput,
    ) {
        return this.chartOfAccountsService.updateAccount(id, accountData);
    }

    // Delete an account
    @Delete(':id')
    async deleteAccount(@Param('id') id: string) {
        return this.chartOfAccountsService.deleteAccount(id);
    }
}
