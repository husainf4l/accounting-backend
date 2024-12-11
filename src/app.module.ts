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
import { FirebaseModule } from './Firebase/firebase/firebase.module';
import { AccountsModule } from './accounts/accounts.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { InitiateModule } from './initiate/initiate.module';
import { InvoiceModule } from './invoice/invoice.module';
import { EmployeesModule } from './employees/employees.module';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { ProductModule } from './product/product.module';
import { BackupModule } from './backup/backup.module';
import { ReceiptModule } from './receipt/receipt.module';
import { XmlReceiverModule } from './xml-receiver/xml-receiver.module';
import { SettingsModule } from './settings/settings.module';




@Module({
  imports: [ChartOfAccountsModule, PrismaModule, JournalEntryModule, ScheduleModule.forRoot(),
    AuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule, AccountsModule, ClientsModule, InitiateModule, InvoiceModule, EmployeesModule, GeneralLedgerModule, UploadModule, ProductModule, BackupModule, ReceiptModule, XmlReceiverModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UploadService],

})
export class AppModule { }
