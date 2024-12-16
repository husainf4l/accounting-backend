import { Module } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';

@Module({
  providers: [ChartOfAccountsService, GeneralLedgerService],
  controllers: [ChartOfAccountsController],
})
export class ChartOfAccountsModule {}
