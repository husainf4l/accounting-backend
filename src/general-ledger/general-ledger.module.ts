import { Module } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { GeneralLedgerController } from './general-ledger.controller';

@Module({
    providers: [GeneralLedgerService],
    controllers: [GeneralLedgerController],
    exports: [GeneralLedgerService],

}) export class GeneralLedgerModule { }
