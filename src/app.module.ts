import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { BillModule } from './bill/bill.module';
import { CustomerModule } from './customer/customer.module';
import { ItemModule } from './item/item.module';
import { TaxCodeModule } from './tax-code/tax-code.module';
import { CompanyModule } from './company/company.module'; // Importing company module
import { UserModule } from './users/user.module'; // Importing user module
import { AccountModule } from './account/account.module'; // Importing account module
import { TransactionModule } from './transaction/transaction.module'; // Importing transaction module
import { InvoiceModule } from './invoice/invoice.module'; // Importing invoice module
import { VendorModule } from './vendor/vendor.module'; // Importing vendor module
import { PayrollModule } from './payroll/payroll.module'; // Importing payroll module
import { EmployeeModule } from './employee/employee.module'; // Importing employee module

@Module({
  imports: [
    AuditLogModule,
    BillModule,
    CustomerModule,
    ItemModule,
    TaxCodeModule,
    CompanyModule,
    UserModule,
    AccountModule,
    TransactionModule,
    InvoiceModule,
    VendorModule,
    PayrollModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
