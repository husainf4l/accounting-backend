import { Module } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { JournalEntryController } from './journal-entry.controller';

@Module({
  providers: [JournalEntryService],
  controllers: [JournalEntryController]
})
export class JournalEntryModule {}
