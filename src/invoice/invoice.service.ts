import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) { }

    async getInvoiceData() {
        // Use Promise.all to run both calls concurrently and await their results
        const [clients, products, accountManager, invoiceNumber] = await Promise.all([
            this.getInvoiceClients(),
            this.getInvoiceProducts(),
            this.getAccountManager(),
            this.getInvoiceNumber(),

        ]);

        return { clients, products, accountManager, invoiceNumber };
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
                displayName: true
            },
        });
    }


    async getInvoiceNumber() {
        const lastInvoice = await this.prisma.invoice.findFirst({
            orderBy: {
                invoiceNumber: 'desc'
            },
            select: { invoiceNumber: true }
        });

        const lastInvoiceNumber = lastInvoice?.invoiceNumber || 0;
        const newNumber = lastInvoiceNumber + 1

        return newNumber
    }


    async createInvoice(data: any) {
        if (!Array.isArray(data.invoiceItems)) {
            throw new Error('invoiceItems must be a valid array');
        }

        // Ensure the customer exists or create one if not
        let customer = await this.prisma.customer.findUnique({
            where: {
                accountId: data.clientId,
            },
        });

        if (!customer) {
            customer = await this.prisma.customer.create({
                data: {
                    name: data.clientName,
                    accountId: data.clientId,
                },
            });
        }

        const SalesRevenue = await this.prisma.account.findUnique({
            where: { hierarchyCode: "4.1" },
        });

        const SalesTax = await this.prisma.account.findUnique({
            where: { hierarchyCode: "2.1.2" },
        });

        const COGS = await this.prisma.account.findUnique({
            where: { hierarchyCode: "5.5" }, // Adjust to match your COGS account
        });

        const InventoryAccount = await this.prisma.account.findUnique({
            where: { hierarchyCode: "1.1.4" }, // Adjust to match your inventory account
        });

        // Calculate COGS and update stock
        let totalCOGS = 0;

        for (const item of data.invoiceItems) {
            const inventoryItem = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!inventoryItem || inventoryItem.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ID: ${item.productId}`);
            }

            const itemCOGS = inventoryItem.costPrice * item.quantity;
            totalCOGS += itemCOGS;

            // Decrease stock
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { stock: inventoryItem.stock - item.quantity },
            });
        }

        // Record Journal Entry
        const invoiceEntry = await this.prisma.journalEntry.create({
            data: {
                date: new Date(),
                transactions: {
                    create: [
                        {
                            accountId: data.clientId,
                            debit: data.grandTotal,
                            credit: null,
                            currency: 'JOD',
                            notes: 'Invoice payment received',
                        },
                        {
                            accountId: SalesTax.id,
                            debit: null,
                            credit: data.taxAmount,
                            currency: 'JOD',
                            notes: 'Sales tax recorded',
                        },
                        {
                            accountId: SalesRevenue.id,
                            debit: null,
                            credit: data.total,
                            currency: 'JOD',
                            notes: 'Revenue recognized',
                        },
                        {
                            accountId: COGS.id,
                            debit: totalCOGS,
                            credit: null,
                            currency: 'JOD',
                            notes: 'Cost of goods sold recorded',
                        },
                        {
                            accountId: InventoryAccount.id,
                            debit: null,
                            credit: totalCOGS,
                            currency: 'JOD',
                            notes: 'Inventory reduced for sold items',
                        },
                    ],
                },
            },
            include: {
                transactions: true,
            },
        });

        // Create Invoice
        return await this.prisma.invoice.create({
            data: {
                invoiceNumber: data.invoiceNumber,
                customer: {
                    connect: {
                        id: customer.id,
                    },
                },
                accountManager: data.accountManagerId
                    ? { connect: { id: data.accountManagerId } }
                    : undefined,
                date: new Date(data.date),
                total: data.total,
                taxType: data.taxType,
                taxAmount: data.taxAmount,
                grandTotal: data.grandTotal,
                paymentMode: data.paymentMode,
                vendorName: data.vendorName || null,
                invoiceItems: {
                    create: data.invoiceItems.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        taxAmount: item.taxAmount,
                        totalAmount: item.totalAmount,
                    })),
                },
            },
            include: {
                invoiceItems: true,
            },
        });
    }



}
