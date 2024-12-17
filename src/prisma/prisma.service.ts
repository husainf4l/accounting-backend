import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ['error'], // Enable query logging
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('Database connected successfully.');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Database disconnected.');
    }
}
