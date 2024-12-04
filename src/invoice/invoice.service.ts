import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) { }

    async getInvoiceData() {
        // Use Promise.all to run both calls concurrently and await their results
        const [clients, products, accountManager , invoiceNumber] = await Promise.all([
            this.getInvoiceClients(),
            this.getInvoiceProducts(),
            this.getAccountManager(),
            this.getInvoiceNumber(),

        ]);

        return { clients, products, accountManager , invoiceNumber };
    }

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

    async getInvoiceProducts() {
        return await this.prisma.product.findMany({
            select: {
                id: true,
                barcode: true,
                name: true,
                salesPrice: true,
            },
        });
    }


    async getAccountManager() {
        return await this.prisma.employee.findMany({
            select: {
                id: true,
                displayName:true
            },
        });
    }
    

    async getInvoiceNumber(){
        const lastInvoice =  await this.prisma.invoice.findFirst({
           orderBy:{
            invoiceNumber:'desc'
           },
           select:{invoiceNumber:true}
        });

        const lastInvoiceNumber = lastInvoice?.invoiceNumber || 0;
        const newNumber = lastInvoiceNumber + 1

        return newNumber
    }
}
