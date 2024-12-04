import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateHierarchyCode } from '../utilties/hierarchy.util';


@Injectable()
export class ClientsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getInvoiceClients() {
        const accountsReceivable = await this.prisma.account.findUnique({
            where: { hierarchyCode: '1.1.3' },
            select: { id: true },
        });

        if (!accountsReceivable) {
            throw new Error('Accounts Receivable account not found');
        }

        return this.prisma.account.findMany({
            where: {
                parentAccountId: accountsReceivable.id,
            },
            select: {
                id: true,
                name: true,
                currentBalance: true,
                hierarchyCode: true,
            },
        });
    }


    async createClient(data: { name: string; email?: string; phone?: string; address?: string }): Promise<any> {
        const accountsReceivable = await this.prisma.account.findUnique({
            where: { hierarchyCode: '1.1.3' },
            select: { id: true },
        });

        if (!accountsReceivable) {
            throw new Error('Accounts Receivable account not found');
        }

        // Generate hierarchy code for the new client account
        const hierarchyCode = await generateHierarchyCode(this.prisma, accountsReceivable.id);

        // Create the new account for the client
        const newAccount = await this.prisma.account.create({
            data: {
                name: data.name,
                hierarchyCode,
                accountType: 'ASSET',
                openingBalance: 0.0,
                currentBalance: 0.0,
                parentAccountId: accountsReceivable.id,
            },
        });

        const clientDetails = await this.prisma.clientDetails.create({
            data: {
                accountId: newAccount.id,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        return {
            account: newAccount,
            details: clientDetails,
        };
    }




}

