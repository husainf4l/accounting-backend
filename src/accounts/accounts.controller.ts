import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':accountId/statement')
  async getAccountStatement(
    @Req() req: any,
    @Param('accountId') accountId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const companyId = req.user.companyId;

    return this.accountsService.getAccountStatement(
      accountId,
      +page,
      +limit,
      startDate,
      endDate,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAccount(@Body() accountData: any, @Req() req: any) {
    const companyId = req.user.companyId;

    return this.accountsService.createAccount(accountData);
  }

  @Get('main')
  async getMainAccounts() {
    return this.accountsService.getMainAccount();
  }
}
