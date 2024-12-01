import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ChartOfAccountsModule } from './chart-of-accounts/chart-of-accounts.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [ChartOfAccountsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],

})
export class AppModule { }
