import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JournalEntryService {
  constructor(private readonly prisma: PrismaService) {}

  async createJournalEntry(
    companyId: string,
    data: {
      date: Date;
      transactions: {
        accountId: string;
        debit?: number;
        credit?: number;
        currency?: string;
        notes?: string;
        companyId?: string;
      }[];
    },
  ) {
    const { date, transactions } = data;

    // Ensure date is in ISO-8601 format
    const isoDate = new Date(date).toISOString();

    // Prepare transaction data
    const transactionData = transactions.map((transaction) => ({
      companyId: companyId,
      accountId: transaction.accountId,
      debit: transaction.debit ?? null,
      credit: transaction.credit ?? null,
      currency: transaction.currency || 'JO',
      notes: transaction.notes || null,
    }));

    console.log('Transaction Data:', transactionData);

    // Create the journal entry
    return this.prisma.journalEntry.create({
      data: {
        date: isoDate,
        companyId: companyId,
        transactions: {
          create: transactionData,
        },
      },
    });
  }

  async getAllJournalEntries(companyId: string) {
    return this.prisma.journalEntry.findMany({
      where: { companyId: companyId },
      include: {
        transactions: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async getJournalEntryById(id: string) {
    return this.prisma.journalEntry.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async createInvoiceJournalEntry(data: any, accounts: any, companyId: string) {
    const InvoiceTypeCodeName = data.InvoiceTypeCodeName;

    const transaction =
      InvoiceTypeCodeName == '021'
        ? [
            {
              accountId: data.clientId,
              debit: data.taxInclusiveAmount,
              credit: null,
              currency: 'JO',
              notes: 'Invoice payment received',
              companyId: companyId,
            },
            {
              accountId: accounts.salesTax.id,
              debit: null,
              credit: data.taxAmount,
              currency: 'JO',
              notes: 'Sales tax recorded',
              companyId: companyId,
            },
            {
              accountId: accounts.salesRevenue.id,
              debit: null,
              credit: data.taxExclusiveAmount,
              currency: 'JO',
              notes: 'Revenue recognized',
              companyId: companyId,
            },
            {
              accountId: accounts.cogs.id,
              debit: accounts.totalCOGS,
              credit: null,
              currency: 'JO',
              notes: 'Cost of goods sold recorded',
              companyId: companyId,
            },
            {
              accountId: accounts.inventoryAccount.id,
              debit: null,
              credit: accounts.totalCOGS,
              currency: 'JO',
              notes: 'Inventory reduced for sold items',
              companyId: companyId,
            },
          ]
        : [
            {
              accountId: data.cashAccountId,
              debit: data.taxInclusiveAmount,
              credit: null,
              currency: 'JO',
              notes: 'Invoice payment received',
              companyId: companyId,
            },
            {
              accountId: accounts.salesTax.id,
              debit: null,
              credit: data.taxAmount,
              currency: 'JO',
              notes: 'Sales tax recorded',
              companyId: companyId,
            },
            {
              accountId: accounts.salesRevenue.id,
              debit: null,
              credit: data.taxExclusiveAmount,
              currency: 'JO',
              notes: 'Revenue recognized',
              companyId: companyId,
            },
            {
              accountId: accounts.cogs.id,
              debit: accounts.totalCOGS,
              credit: null,
              currency: 'JO',
              notes: 'Cost of goods sold recorded',
              companyId: companyId,
            },
            {
              accountId: accounts.inventoryAccount.id,
              debit: null,
              credit: accounts.totalCOGS,
              currency: 'JO',
              notes: 'Inventory reduced for sold items',
              companyId: companyId,
            },
          ];

    return this.prisma.journalEntry.create({
      data: {
        date: new Date(),
        companyId: companyId,
        transactions: {
          create: transaction,
        },
      },
      include: { transactions: true },
    });
  }
}
