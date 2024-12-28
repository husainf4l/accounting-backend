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

  private async getNextInvoiceNumber(companyId: string): Promise<number> {
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    return (lastInvoice?.number || 0) + 1;
  }

  async getInvoiceData(companyId: string) {
    const [clients, accountManagers, products, number, cashAccounts] = await Promise.all([
      this.clientsService.getClients(companyId),
      this.employeeService.getAccountManagers(companyId),
      this.productsService.getProducts(companyId),
      this.getNextInvoiceNumber(companyId),
      this.accountsService.getAccountsUnderCode('1.1.1', companyId), // Cash accounts
    ]);

    return { clients, products, accountManagers, number, cashAccounts };
  }

  private async getCriticalAccounts(companyId: string, codes: string[]) {
    const accounts = await this.accountsService.getCriticalAccounts(companyId, codes);
    if (!accounts || Object.keys(accounts).length !== codes.length) {
      throw new Error(`Critical accounts missing for companyId: ${companyId}`);
    }
    return accounts;
  }

  private prepareInvoiceItems(items: any[], companyId: string) {
    return items.map((item) => ({
      Product: item.productId ? { connect: { id: item.productId } } : undefined,
      name: item.name || 'Default Item Name',
      companyId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountAmount: item.discount || 0.0,
      lineExtensionAmount: item.quantity * item.unitPrice - (item.discount || 0.0),
      taxAmount: item.taxAmount || 0.0,
      taxCategory: item.taxCategory || 'S',
      taxPercent: item.taxPercent || 16.0,
    }));
  }



  private validateInvoiceData(data: any): void {
    if (!data.number || !data.items || !data.clientId || !data.taxExclusiveAmount) {
      throw new Error('Invalid invoice data.');
    }
  }


  async getInvoiceDetails(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { customer: true, items: true },
    });
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found.`);
    }
    return invoice;
  }

  /**
   * Retrieve all invoices for a given company.
   */
  async getInvoicesDetails(companyId: string) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
    });
  }


  async createInvoice(data: any, companyId: string) {
    // Validate incoming invoice data
    this.validateInvoiceData(data);

    // Ensure the customer exists or create one
    const customer = await this.clientsService.ensureCustomerExists(
      data.clientId,
      data.clientName,
      companyId,
    );

    if (!customer) {
      throw new Error(`Failed to ensure customer for ID: ${data.clientId}`);
    }

    // Ensure the invoice number is unique for the company
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: { companyId, number: data.number },
    });
    if (existingInvoice) {
      throw new Error(`Invoice number ${data.number} already exists for this company.`);
    }

    // Validate and update product stock
    let totalCOGS = 0;
    try {
      totalCOGS = await this.productsService.validateAndUpdateStock(data.items);
    } catch (error) {
      throw new Error(`Error validating stock: ${error.message}`);
    }

    // Fetch critical accounts
    const criticalAccounts = await this.getCriticalAccounts(companyId, [
      '4.1', // Sales Revenue
      '2.1.3', // Sales Tax
      '5.1', // COGS
      '1.1.4', // Inventory
    ]);

    // Normalize the accounts for easier access
    const normalizedAccounts = {
      salesRevenue: criticalAccounts['4.1'],
      salesTax: criticalAccounts['2.1.3'],
      cogs: criticalAccounts['5.1'],
      inventoryAccount: criticalAccounts['1.1.4'],
      totalCOGS,
    };

    // Validate that all critical accounts exist
    const missingAccounts = [];
    if (!normalizedAccounts.salesRevenue || !normalizedAccounts.salesRevenue.id) {
      missingAccounts.push('Sales Revenue');
    }
    if (!normalizedAccounts.salesTax || !normalizedAccounts.salesTax.id) {
      missingAccounts.push('Sales Tax');
    }
    if (!normalizedAccounts.cogs || !normalizedAccounts.cogs.id) {
      missingAccounts.push('COGS');
    }
    if (!normalizedAccounts.inventoryAccount || !normalizedAccounts.inventoryAccount.id) {
      missingAccounts.push('Inventory');
    }
    if (missingAccounts.length > 0) {
      throw new Error(`The following critical accounts are missing or invalid: ${missingAccounts.join(', ')}`);
    }

    // Create journal entries for the invoice
    try {
      await this.journalService.createInvoiceJournalEntry(data, normalizedAccounts, companyId);
    } catch (error) {
      throw new Error(`Error creating journal entries: ${error.message}`);
    }

    // Create the invoice in the database
    const invoice = await this.prisma.invoice.create({
      data: {
        number: data.number, // Provided from the frontend
        issueDate: new Date(data.issueDate || Date.now()),
        invoiceTypeCode: data.invoiceTypeCode || '388',
        InvoiceTypeCodeName: data.InvoiceTypeCodeName || '012',
        note: data.note || null,
        documentCurrency: data.documentCurrency || 'JOD',
        taxCurrency: data.taxCurrency || 'JOD',
        taxExclusiveAmount: data.taxExclusiveAmount || 0.0,
        taxInclusiveAmount: data.taxInclusiveAmount || 0.0,
        allowanceTotalAmount: data.allowanceTotalAmount || null,
        payableAmount: data.payableAmount || 0.0,
        isSubmitted: data.isSubmitted || false,
        company: { connect: { id: companyId } },
        customer: { connect: { id: customer.id } },
        items: { create: this.prepareInvoiceItems(data.items, companyId) },
      },
      include: { items: true, customer: true },
    });

    return invoice;
  }

}
