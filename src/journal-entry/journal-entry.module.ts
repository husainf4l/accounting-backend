import { Module } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { JournalEntryController } from './journal-entry.controller';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [AccountsModule],
  providers: [JournalEntryService],
  controllers: [JournalEntryController],
  exports: [JournalEntryService],
})
export class JournalEntryModule {}
