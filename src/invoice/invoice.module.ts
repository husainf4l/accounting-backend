import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { ClientsModule } from 'src/clients/clients.module';
import { JournalEntryModule } from 'src/journal-entry/journal-entry.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ProductModule } from 'src/product/product.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule,
    JournalEntryModule,
    EmployeesModule,
    ProductModule,
    AccountsModule,
    HttpModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule { }
