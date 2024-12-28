import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { JournalEntryModule } from 'src/journal-entry/journal-entry.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProductModule } from 'src/product/product.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { XmlReceiverModule } from 'src/xml-receiver/xml-receiver.module';

@Module({
  imports: [
    ClientsModule,
    JournalEntryModule,
    EmployeesModule,
    ProductModule,
    AccountsModule,
    XmlReceiverModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule { }
