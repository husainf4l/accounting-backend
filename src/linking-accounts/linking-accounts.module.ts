import { Module } from '@nestjs/common';
import { LinkingAccountsService } from './linking-accounts.service';
import { LinkingAccountsController } from './linking-accounts.controller';

@Module({
  controllers: [LinkingAccountsController],
  providers: [LinkingAccountsService],
})
export class LinkingAccountsModule {}
