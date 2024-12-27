import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { ClientsService } from 'src/clients/clients.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { XmlReceiverService } from 'src/xml-receiver/xml-receiver.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly journalService: JournalEntryService,
    private readonly employeeService: EmployeesService,
    private readonly productsService: ProductService,
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
    private readonly xmlReceiverService: XmlReceiverService,
  ) { }

  private async getNextInvoiceNumber(companyId: string) {
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    return (lastInvoice?.number || 0) + 1;
  }

  async getInvoiceData(companyId: string) {
    const [clients, accountManagers, products, number, cashAccounts] =
      await Promise.all([
        this.clientsService.getClients(companyId),
        this.employeeService.getAccountManagers(companyId),
        this.productsService.getProducts(companyId),
        this.getNextInvoiceNumber(companyId),
        this.accountsService.getAccountsUnderCode('1.1.1', companyId), // Cash accounts
      ]);

    return { clients, products, accountManagers, number, cashAccounts };
  }

  async createInvoice(data: any, companyId: string) {
    const customer = await this.clientsService.ensureCustomerExists(
      companyId,
      data.clientId,
      data.clientName,
    );

    // Fetch critical accounts
    const criticalAccounts = await this.accountsService.getCriticalAccounts(companyId, [
      '4.1', // Sales Revenue
      '2.1.2', // Sales Tax
      '5.5', // COGS
      '1.1.4', // Inventory
    ]);

    const salesRevenue = criticalAccounts['4.1'];
    const salesTax = criticalAccounts['2.1.2'];
    const cogs = criticalAccounts['5.5'];
    const inventoryAccount = criticalAccounts['1.1.4'];

    // Validate and update product stock
    const totalCOGS = await this.productsService.validateAndUpdateStock(data.items);

    // Create a journal entry for the invoice
    await this.journalService.createInvoiceJournalEntry(
      data,
      { salesRevenue, salesTax, cogs, inventoryAccount, totalCOGS },
      companyId,
    );

    // Create the invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        number: data.number,
        issueDate: new Date(data.issueDate),
        invoiceTypeCode: data.invoiceTypeCode || '388',
        InvoiceTypeCodeName: data.InvoiceTypeCodeName || '011',
        note: data.note || null,
        documentCurrency: data.documentCurrency || 'JO',
        taxCurrency: data.taxCurrency || 'JO',
        customer: {
          connect: {
            id: customer.id,
          },
        },
        employee: {
          connect: {
            id: data.accountManagerId,
          },
        },
        taxExclusiveAmount: data.taxExclusiveAmount || 0.0,
        company: {
          connect: {
            id: companyId,
          },
        },
        taxInclusiveAmount: data.taxInclusiveAmount || 0.0,
        allowanceTotalAmount: data.allowanceTotalAmount || null,
        payableAmount: data.payableAmount || 0.0,
        isSubmitted: data.isSubmitted || false,
        items: {
          create: data.items.map((item: any) => ({
            Product: item.productId
              ? { connect: { id: item.productId } }
              : undefined,
            name: item.name || 'Default Item Name',
            companyId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discount || 0.0,
            lineExtensionAmount:
              item.quantity * item.unitPrice - (item.discount || 0.0),
            taxAmount: item.taxAmount,
            taxCategory: item.taxCategory || 'S',
            taxPercent: item.taxPercent || 16.0,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Send invoice to XML receiver (e.g., Jofotara)
    this.xmlReceiverService.sendInvoiceTojofotara(invoice);

    return invoice;
  }

  async getInvoiceDetails(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        employee: true,
        items: true,
      },
    });

    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    return invoice;
  }

  async getInvoicesDetails(companyId: string) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      include: {
        customer: true,
        employee: true,
        items: true,
      },
    });
  }

  async createPurchaseInvoice(data: any, companyId: string) {
    // Fetch critical accounts
    const criticalAccounts = await this.accountsService.getCriticalAccounts(companyId, [
      '2.1.1', // Accounts Payable
      '5.1', // Purchase Expense
      '1.1.4', // Inventory
      '2.1.2', // Purchase Tax
    ]);

    const accountsPayable = criticalAccounts['2.1.1'];
    const purchaseExpense = criticalAccounts['5.1'];
    const inventoryAccount = criticalAccounts['1.1.4'];
    const purchaseTax = criticalAccounts['2.1.2'];

    // Update inventory and calculate total cost
    let totalCost = 0;
    await Promise.all(
      data.items.map(async (item: any) => {
        const product = await this.productsService.validateAndUpdateStock(item);
        totalCost += item.unitPrice * item.quantity;
      }),
    );

    // Create journal entry
    await this.journalService.createJournalEntry(companyId, {
      date: new Date(),
      transactions: [
        {
          accountId: accountsPayable.id,
          credit: data.taxInclusiveAmount,
          companyId,
        },
        {
          accountId: purchaseExpense.id,
          debit: data.taxExclusiveAmount,
          companyId,
        },
        {
          accountId: purchaseTax.id,
          debit: data.taxAmount,
          companyId,
        },
        {
          accountId: inventoryAccount.id,
          debit: totalCost,
          companyId,
        },
      ],
    });

    // Create purchase invoice
    return this.prisma.purchaseInvoice.create({
      data: {
        number: data.number,
        issueDate: new Date(data.issueDate),
        note: data.note || null,
        documentCurrency: data.documentCurrency || 'JOD',
        taxCurrency: data.taxCurrency || 'JOD',
        taxExclusiveAmount: data.taxExclusiveAmount || 0.0,
        taxInclusiveAmount: data.taxInclusiveAmount || 0.0,
        allowanceTotalAmount: data.allowanceTotalAmount || null,
        payableAmount: data.payableAmount || 0.0,
        isSubmitted: data.isSubmitted || false,
        companyId,
        supplierId: data.supplierId,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            companyId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount || 0.0,
            lineExtensionAmount:
              item.quantity * item.unitPrice - (item.discountAmount || 0.0),
            taxAmount: item.taxAmount,
            taxCategory: item.taxCategory || 'S',
            taxPercent: item.taxPercent || 16.0,
          })),
        },
      },
    });
  }

  async getPurchaseInvoiceDetails(purchaseInvoiceId: string) {
    const purchaseInvoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id: purchaseInvoiceId },
      include: {
        items: true,
      },
    });

    if (!purchaseInvoice) {
      throw new Error(`Purchase Invoice with ID ${purchaseInvoiceId} not found`);
    }

    return purchaseInvoice;
  }

  private async getNextPurchaseNumber(companyId: string) {
    const lastInvoice = await this.prisma.purchaseInvoice.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    return (lastInvoice?.number || 0) + 1;
  }

  async getPurchaseData(companyId: string) {
    const [accountManagers, products, number] = await Promise.all([
      this.employeeService.getAccountManagers(companyId),
      this.productsService.getProducts(companyId),
      this.getNextPurchaseNumber(companyId),
    ]);

    return { products, accountManagers, number };
  }
}
