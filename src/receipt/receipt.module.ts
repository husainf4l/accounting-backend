import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { JournalEntryModule } from 'src/journal-entry/journal-entry.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProductModule } from 'src/product/product.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    ClientsModule,
    JournalEntryModule,
    EmployeesModule,
    ProductModule,
    AccountsModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptModule { }
