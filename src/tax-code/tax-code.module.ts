import { Module } from '@nestjs/common';
import { TaxCodeService } from './tax-code.service';
import { TaxCodeController } from './tax-code.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [TaxCodeController],
    providers: [TaxCodeService, PrismaService],
})
export class TaxCodeModule { }
