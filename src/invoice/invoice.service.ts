import { Injectable } from '@nestjs/common';
import { get } from 'http';
import { AccountsService } from 'src/accounts/accounts.service';
import { ClientsService } from 'src/clients/clients.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly journalService: JournalEntryService,
    private readonly employeeService: EmployeesService,
    private readonly productsService: ProductService,
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
  ) {}
  private async getNextInvoiceNumber() {
    const lastInvoice = await this.prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
      select: { invoiceNumber: true },
    });

    return (lastInvoice?.invoiceNumber || 0) + 1;
  }

  async getInvoiceData() {
    const [clients, accountManagers, products, invoiceNumber] =
      await Promise.all([
        this.clientsService.getClients(),
        this.employeeService.getAccountManagers(),
        this.productsService.getProducts(),
        this.getNextInvoiceNumber(),
      ]);

    return { clients, products, accountManagers, invoiceNumber };
  }

  async createInvoice(data: any) {
    const customer = await this.clientsService.ensureCustomerExists(
      data.clientId,
      data.clientName,
    );
    const criticalAccounts = await this.accountsService.getCriticalAccounts([
      '4.1',
      '2.1.2',
      '5.5',
      '1.1.4',
    ]);
    const salesRevenue = criticalAccounts['4.1'];
    const salesTax = criticalAccounts['2.1.2'];
    const cogs = criticalAccounts['5.5'];
    const inventoryAccount = criticalAccounts['1.1.4'];

    const totalCOGS = await this.productsService.validateAndUpdateStock(
      data.invoiceItems,
    );

    await this.journalService.createInvoiceJournalEntry(data, {
      salesRevenue,
      salesTax,
      cogs,
      inventoryAccount,
      totalCOGS,
    });

    return this.prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        customer: { connect: { id: customer.id } },
        date: new Date(data.date),
        total: data.total,
        taxAmount: data.taxAmount,
        grandTotal: data.grandTotal,
      },
    });
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

  
  async getInvoicesDetails() {
    // Fetch all invoices
    const invoices = await this.prisma.invoice.findMany();

    // Loop through each invoice to fetch the customer details
    const invoicesWithCustomer = [];

    for (const invoice of invoices) {
      // Fetch the customer (client) details using the customerId from the invoice
      const customer = await this.prisma.customer.findUnique({
        where: { id: invoice.customerId },
      });

      // Create a new object with customer added to invoice data
      const invoiceWithCustomer = {
        ...invoice, // spread the invoice properties
        customer: customer, // add customer data
      };

      invoicesWithCustomer.push(invoiceWithCustomer);
    }

    return invoicesWithCustomer; // Return the invoices with customer details added
  }
}
