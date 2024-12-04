import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ChartOfAccountsModule } from './chart-of-accounts/chart-of-accounts.module';
import { PrismaModule } from './prisma/prisma.module';
import { JournalEntryModule } from './journal-entry/journal-entry.module';
import { GeneralLedgerService } from './general-ledger/general-ledger.service';
import { GeneralLedgerController } from './general-ledger/general-ledger.controller';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupModule } from './backup/backup.module';
import { FirebaseModule } from './Firebase/firebase/firebase.module';
import { AccountsModule } from './accounts/accounts.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InitiateModule } from './initiate/initiate.module';
import { InvoiceModule } from './invoice/invoice.module';
import { EmployeesModule } from './employees/employees.module';




@Module({
  imports: [ChartOfAccountsModule, PrismaModule, JournalEntryModule, GeneralLedgerModule, ScheduleModule.forRoot(), BackupModule,
    AuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),
     FirebaseModule, AccountsModule, ProductModule, UploadModule, ClientsModule, InitiateModule, InvoiceModule, EmployeesModule],
  controllers: [AppController, GeneralLedgerController],
  providers: [AppService, PrismaService, GeneralLedgerService],

})
export class AppModule { }
