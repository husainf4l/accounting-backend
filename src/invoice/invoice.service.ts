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
  ) {}

  private async getNextInvoiceNumber() {
    const lastInvoice = await this.prisma.invoice.findFirst({
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    return (lastInvoice?.number || 0) + 1;
  }

  async getInvoiceData() {
    const [clients, accountManagers, products, number, cashAccounts] =
      await Promise.all([
        this.clientsService.getClients(),
        this.employeeService.getAccountManagers(),
        this.productsService.getProducts(),
        this.getNextInvoiceNumber(),
        this.accountsService.getAccountsUnderCode('1.1.1'),
      ]);

    return { clients, products, accountManagers, number, cashAccounts };
  }

  async createInvoice(data: any) {
    console.log('Data on post :', data);

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

    console.log('Data after some transactions 0:', data);

    const totalCOGS = await this.productsService.validateAndUpdateStock(
      data.items,
    );
    console.log('Data after some transactions 1:', data);

    await this.journalService.createInvoiceJournalEntry(data, {
      salesRevenue,
      salesTax,
      cogs,
      inventoryAccount,
      totalCOGS,
    });

    console.log('Data after some transactions :', data);

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
        taxInclusiveAmount: data.taxInclusiveAmount || 0.0,
        allowanceTotalAmount: data.allowanceTotalAmount || null,
        payableAmount: data.payableAmount || 0.0,
        isSubmitted: data.isSubmitted || false,
        items: {
          create: data.items.map((item: any) => ({
            Product: item.productId
              ? { connect: { id: item.productId } }
              : undefined, // Use connect for related Product
            name: item.name || 'Default Item Name', // Ensure name is provided
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discount || 0.0,
            lineExtensionAmount:
              item.quantity * item.unitPrice - (item.discount || 0.0), // Use lineExtensionAmount
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

    console.log(invoice);

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

  async getInvoicesDetails() {
    // Fetch all invoices
    const invoices = await this.prisma.invoice.findMany({
      include: {
        customer: true,
        employee: true,
        items: true,
      },
    });

    return invoices; // Return the invoices with customer details added
  }
}
