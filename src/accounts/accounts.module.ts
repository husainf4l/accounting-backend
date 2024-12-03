import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { GeneralLedgerModule } from 'src/general-ledger/general-ledger.module';

@Module({
  imports: [GeneralLedgerModule],
  providers: [AccountsService],
  controllers: [AccountsController]
})
export class AccountsModule { }
