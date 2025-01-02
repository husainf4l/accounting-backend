import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { GeneralLedgerModule } from 'src/general-ledger/general-ledger.module';
import { JournalEntryModule } from 'src/journal-entry/journal-entry.module';

@Module({
  imports: [GeneralLedgerModule],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
