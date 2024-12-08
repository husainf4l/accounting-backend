import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Fetches the data required to create an invoice.
     */
    async getInvoiceData() {
        const [clients, products, accountManagers, invoiceNumber] = await Promise.all([
            this.getInvoiceClients(),
            this.getInvoiceProducts(),
            this.getAccountManagers(),
            this.getNextInvoiceNumber(),
        ]);

        return { clients, products, accountManagers, invoiceNumber };
    }

    /**
     * Fetches all accounts receivable clients.
     */
    private async getInvoiceClients() {
        const accountsReceivable = await this.findAccountByHierarchyCode('1.1.3');

        return this.prisma.account.findMany({
            where: { parentAccountId: accountsReceivable.id },
            select: { id: true, name: true, currentBalance: true, hierarchyCode: true },
        });
    }

    /**
     * Fetches all available products for invoicing.
     */
    private async getInvoiceProducts() {
        return this.prisma.product.findMany({
            select: { id: true, barcode: true, name: true, salesPrice: true },
        });
    }

    /**
     * Fetches all account managers.
     */
    private async getAccountManagers() {
        return this.prisma.employee.findMany({
            select: { id: true, displayName: true },
        });
    }

    /**
     * Generates the next invoice number.
     */
    private async getNextInvoiceNumber() {
        const lastInvoice = await this.prisma.invoice.findFirst({
            orderBy: { invoiceNumber: 'desc' },
            select: { invoiceNumber: true },
        });

        return (lastInvoice?.invoiceNumber || 0) + 1;
    }

    /**
     * Ensures the customer exists, creating it if necessary.
     */
    private async ensureCustomerExists(clientId: string, clientName: string) {
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { accountId: clientId },
        });

        if (existingCustomer) return existingCustomer;

        return this.prisma.customer.create({
            data: { name: clientName, accountId: clientId },
        });
    }

    /**
     * Validates and updates product stock, calculating total COGS.
     */
    private async validateAndUpdateStock(invoiceItems: any[]) {
        let totalCOGS = 0;

        await Promise.all(
            invoiceItems.map(async (item) => {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Product with ID ${item.productId} does not exist`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(
                        `Insufficient stock for product ID: ${item.productId} (Available: ${product.stock}, Required: ${item.quantity})`
                    );
                }

                totalCOGS += product.costPrice * item.quantity;

                // Update stock
                await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity },
                });
            })
        );

        return totalCOGS;
    }

    /**
     * Fetches critical accounts (Sales, Tax, COGS, Inventory).
     */
    private async getCriticalAccounts() {
        const requiredAccounts = ['4.1', '2.1.2', '5.5', '1.1.4'];
        const accounts = await Promise.all(
            requiredAccounts.map((code) => this.findAccountByHierarchyCode(code))
        );

        return {
            salesRevenue: accounts[0],
            salesTax: accounts[1],
            cogs: accounts[2],
            inventoryAccount: accounts[3],
        };
    }

    /**
     * Helper function to fetch an account by its hierarchy code.
     */
    private async findAccountByHierarchyCode(hierarchyCode: string) {
        const account = await this.prisma.account.findUnique({
            where: { hierarchyCode },
        });

        if (!account) {
            throw new Error(`Account with hierarchy code ${hierarchyCode} not found`);
        }

        return account;
    }

    /**
     * Records a journal entry for the invoice.
     */
    private async createJournalEntry(data: any, accounts: any) {
        return this.prisma.journalEntry.create({
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
                            accountId: accounts.salesTax.id,
                            debit: null,
                            credit: data.taxAmount,
                            currency: 'JOD',
                            notes: 'Sales tax recorded',
                        },
                        {
                            accountId: accounts.salesRevenue.id,
                            debit: null,
                            credit: data.total,
                            currency: 'JOD',
                            notes: 'Revenue recognized',
                        },
                        {
                            accountId: accounts.cogs.id,
                            debit: accounts.totalCOGS,
                            credit: null,
                            currency: 'JOD',
                            notes: 'Cost of goods sold recorded',
                        },
                        {
                            accountId: accounts.inventoryAccount.id,
                            debit: null,
                            credit: accounts.totalCOGS,
                            currency: 'JOD',
                            notes: 'Inventory reduced for sold items',
                        },
                    ],
                },
            },
            include: { transactions: true },
        });
    }

    /**
     * Creates an invoice and generates a QR code.
     */
    async createInvoice(data: any) {
        if (!Array.isArray(data.invoiceItems) || data.invoiceItems.length === 0) {
            throw new Error('Invoice items must be a non-empty array');
        }

        const customer = await this.ensureCustomerExists(data.clientId, data.clientName);
        const { salesRevenue, salesTax, cogs, inventoryAccount } = await this.getCriticalAccounts();
        const totalCOGS = await this.validateAndUpdateStock(data.invoiceItems);

        await this.createJournalEntry(data, { salesRevenue, salesTax, cogs, inventoryAccount, totalCOGS });

        const invoice = await this.prisma.invoice.create({
            data: {
                invoiceNumber: data.invoiceNumber,
                customer: { connect: { id: customer.id } },
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
                    create: data.invoiceItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        taxAmount: item.taxAmount,
                        totalAmount: item.totalAmount,
                    })),
                },
            },
            include: { invoiceItems: true },
        });


        return { ...invoice, };
    }



    async getInvoiceDetails(invoiceId: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                customer: true, // Include customer details
                accountManager: true, // Include account manager details
                invoiceItems: {
                    include: {
                        product: true, // Include product details for each invoice item
                    },
                },
            },
        });

        if (!invoice) {
            throw new Error(`Invoice with ID ${invoiceId} not found`);
        }

        return invoice;
    }


}
