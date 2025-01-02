import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly journalService: JournalEntryService,
    private readonly employeeService: EmployeesService,
    private readonly productsService: ProductService,
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
  ) {}

  async getPurchaseInvoiceDetails(purchaseInvoiceId: string) {
    const purchaseInvoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id: purchaseInvoiceId },
      include: {
        items: true,
      },
    });

    if (!purchaseInvoice) {
      throw new Error(
        `Purchase Invoice with ID ${purchaseInvoiceId} not found`,
      );
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

  async createPurchaseInvoice(data: any, companyId: string) {
    // Fetch critical accounts
    const criticalAccounts = await this.accountsService.getCriticalAccounts(
      companyId,
      [
        '2.1.1', // Accounts Payable
        '5.1', // Purchase Expense
        '1.1.4', // Inventory
        '2.1.2', // Purchase Tax
      ],
    );

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
        },
        {
          accountId: purchaseExpense.id,
          debit: data.taxExclusiveAmount,
        },
        {
          accountId: purchaseTax.id,
          debit: data.taxAmount,
        },
        {
          accountId: inventoryAccount.id,
          debit: totalCost,
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
}
