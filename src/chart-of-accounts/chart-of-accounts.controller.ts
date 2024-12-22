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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chart-of-accounts')
export class ChartOfAccountsController {
  constructor(
    private readonly chartOfAccountsService: ChartOfAccountsService,
  ) { }




  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllAccounts(@Req() req: any) {
    const companyId = req.user.companyId;
    console.log(companyId)

    return this.chartOfAccountsService.getAllAccounts(companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('reconsole')
  async reconsole(@Req() req: any) {
    const companyId = req.user.companyId;
    console.log(companyId)

    return this.chartOfAccountsService.reconsole(companyId);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccountById(@Req() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.getAccountById(id, companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccount(
    @Req() req: any,
    @Body() accountData: Prisma.AccountCreateInput,
  ) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.createAccount2(accountData, companyId);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAccount(@Req() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;

    return this.chartOfAccountsService.deleteAccount(id, companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  async initialize(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.chartOfAccountsService.initializeChartOfAccounts(companyId);
  }
}
