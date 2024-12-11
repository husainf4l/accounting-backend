import { Injectable } from '@nestjs/common';
import { get } from 'http';
import { AccountsService } from 'src/accounts/accounts.service';
import { ClientsService } from 'src/clients/clients.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly journalService: JournalEntryService,
    private readonly employeeService: EmployeesService,
    private readonly productsService: ProductService,
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,

  ) { }
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

    console.log(data)
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

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        customer: { connect: { id: customer.id } },
        date: new Date(data.date),
        total: data.total,
        taxAmount: data.taxAmount,
        grandTotal: data.grandTotal,
      },
    });

    // console.log(invoice)
    // this.sendInvoiceToExternalServer(invoice)

    return invoice


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


  async sendInvoiceToExternalServer(invoice: any): Promise<AxiosResponse> {
    try {
      const xmlData = this.convertToUbl(invoice); // Convert the invoice data to XML format
      const response = await this.httpService
        .post('http://localhost:3001/api/xml-receiver/receive', xmlData, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
        .toPromise();

      console.log('Invoice sent to external server:', response.data);
      return response;
    } catch (error) {
      console.error('Error sending invoice to external server:', error);
      throw error;
    }
  }

  convertToUbl(invoice: any): string {
    return `
      <?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
        <cbc:CustomizationID>urn:customization</cbc:CustomizationID>
        <cbc:ProfileID>urn:profile</cbc:ProfileID>
        <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
        <cbc:IssueDate>${invoice.date}</cbc:IssueDate>
        <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:PartyName>
              <cbc:Name>${invoice.supplierName}</cbc:Name>
            </cbc:PartyName>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:PartyName>
              <cbc:Name>${invoice.customerName}</cbc:Name>
            </cbc:PartyName>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:TaxExclusiveAmount currencyID="${invoice.currency}">${invoice.total}</cbc:TaxExclusiveAmount>
          <cbc:TaxInclusiveAmount currencyID="${invoice.currency}">${invoice.grandTotal}</cbc:TaxInclusiveAmount>
        </cac:LegalMonetaryTotal>
        <cac:TaxTotal>
          <cbc:TaxAmount currencyID="${invoice.currency}">${invoice.taxAmount}</cbc:TaxAmount>
        </cac:TaxTotal>
        <cac:InvoiceLine>
          ${invoice.lines.map((line: any) => `
            <cac:Item>
              <cbc:Name>${line.description}</cbc:Name>
            </cac:Item>
            <cac:Price>
              <cbc:PriceAmount currencyID="${invoice.currency}">${line.price}</cbc:PriceAmount>
            </cac:Price>
          `).join('')}
        </cac:InvoiceLine>
      </Invoice>
    `;
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
