import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('chart-of-accounts')
export class ChartOfAccountsController {
  constructor(
    private readonly chartOfAccountsService: ChartOfAccountsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllAccounts(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.getAllAccounts(companyId);
  }

  // Get an account by ID
  @Get(':id')
  async getAccountById(@Req() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.getAccountById(id, companyId);
  }

  // Create a new account
  @Post()
  async createAccount(
    @Req() req: any,
    @Body() accountData: Prisma.AccountCreateInput,
  ) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.createAccount2(accountData, companyId);
  }

  // Update an account
  @Patch(':id')
  async updateAccount(
    @Req() req: any,
    @Param('id') id: string,
    @Body() accountData: Prisma.AccountUpdateInput,
  ) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.updateAccount(
      id,
      accountData,
      companyId,
    );
  }

  // Delete an account
  @Delete(':id')
  async deleteAccount(@Req() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.deleteAccount(id, companyId);
  }

  @Post('initialize')
  async initialize(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.chartOfAccountsService.initializeChartOfAccounts(companyId);
  }
}
