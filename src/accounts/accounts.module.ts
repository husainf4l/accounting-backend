import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { GeneralLedgerModule } from 'src/general-ledger/general-ledger.module';
import { ClientsService } from 'src/clients/clients.service';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [GeneralLedgerModule, ClientsModule],
  providers: [AccountsService, ClientsService],
  controllers: [AccountsController],
  exports: [AccountsService]
})
export class AccountsModule { }
