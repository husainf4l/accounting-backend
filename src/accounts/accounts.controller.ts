import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAccountDto } from './dto/CreateAccountDto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

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
      companyId,
      startDate,
      endDate,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAccount(@Body() accountData: any, @Req() req: any) {
    const companyId = req.user.companyId;

    return this.accountsService.createAccount(companyId, accountData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('main')
  async getMainAccounts(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.accountsService.getMainAccount(companyId);
  }


  @Post('bulk')
  async bulkUpload(@Body('data') createAccountDtos: CreateAccountDto[]) {
    return this.accountsService.bulkCreate(createAccountDtos);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async Delete(@Req() req: any, @Param('accountId') accountId: string) {
    const companyId = req.user.companyId;

    return this.accountsService.delete(companyId, accountId);
  }
}
