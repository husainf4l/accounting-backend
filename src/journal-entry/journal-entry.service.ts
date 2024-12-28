import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateJournalDto } from './dto/create-journal.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class JournalEntryService {
  constructor(private readonly prisma: PrismaService, private accountsService: AccountsService) { }

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

    // Create the journal entry with all transactions
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        date: isoDate,
        companyId: companyId,
        transactions: {
          create: transactionData,
        },
      },
      include: { transactions: true }, // Include transactions for further processing
    });

    // Update the current balance for each transaction's account
    for (const transaction of journalEntry.transactions) {
      await this.accountsService.updateCurrentBalance(
        transaction.accountId,
        transaction.debit || 0,
        transaction.credit || 0,
        companyId,
      );
    }

    return journalEntry;
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





  async createBulk(entries: CreateJournalDto[], companyId: string) {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new BadRequestException('Entries must be a non-empty array.');
    }

    // Extract unique hierarchy codes
    const codes = [
      ...new Set(entries.map((entry) => entry.code).filter((code) => code)),
    ];

    // Fetch all accounts matching hierarchy codes and companyId in one query
    const accounts = await this.prisma.account.findMany({
      where: {
        code: { in: codes },
        companyId,
      },
    });

    // Create a map of code -> accountId
    const accountMap = accounts.reduce((map, account) => {
      map[account.code] = account.id;
      return map;
    }, {} as Record<string, string>);

    const transactions = [];

    // Process each entry and map to accountId
    for (const entry of entries) {
      const accountId = accountMap[entry.code];

      if (!accountId) {
        throw new BadRequestException(
          `Account not found for code: ${entry.code} and companyId: ${companyId}`,
        );
      }

      transactions.push({
        accountId,
        debit: entry.debit ?? 0,
        credit: entry.credit ?? 0,
        companyId,
        notes: entry.notes
      });
    }

    // Create a new journal entry
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        companyId,
      },
    });

    // Link all transactions to the journal entry
    await this.prisma.transaction.createMany({
      data: transactions.map((transaction) => ({
        ...transaction,
        journalEntryId: journalEntry.id,
      })),
    });

    return {
      journalEntryId: journalEntry.id,
      transactionsCount: transactions.length,
    };
  }


  async createInvoiceJournalEntry(data: any, accounts: any, companyId: string) {
    // Validate accounts

    if (!accounts.salesRevenue || !accounts.salesRevenue.id) {
      throw new Error('Sales Revenue account is missing or invalid.');
    }
    if (!accounts.cogs || !accounts.cogs.id) {
      throw new Error('COGS account is missing or invalid.');
    }
    if (!accounts.inventoryAccount || !accounts.inventoryAccount.id) {
      throw new Error('Inventory account is missing or invalid.');
    }
    if (!accounts.salesTax || !accounts.salesTax.id) {
      throw new Error('Sales Tax account is missing or invalid.');
    }

    const transactions = data.InvoiceTypeCodeName === '021'
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

    console.log('Creating journal entry with transactions:', transactions);

    // Create journal entry
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        date: new Date(),
        companyId: companyId,
        transactions: {
          create: transactions,
        },
      },
      include: { transactions: true },
    });

    console.log('Journal entry created:', journalEntry);

    // Update account balances
    for (const transaction of transactions) {
      await this.accountsService.updateCurrentBalance(
        transaction.accountId,
        transaction.debit || 0,
        transaction.credit || 0,
        companyId,
      );
    }

    return journalEntry;
  }


}
