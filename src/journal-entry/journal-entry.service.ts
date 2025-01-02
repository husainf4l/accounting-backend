import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateJournalDto } from './dto/create-journal.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class JournalEntryService {
  constructor(
    private readonly prisma: PrismaService,
    private accountsService: AccountsService,
  ) {}

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
        customerId?: string;
      }[];
    },
  ) {
    const { date, transactions } = data;
    const isoDate = new Date(date).toISOString();
    const number = await this.generateJournalNumber(companyId, date);

    const transactionData = transactions.map((transaction) => ({
      companyId,
      accountId: transaction.accountId,
      debit: transaction.debit ?? null,
      credit: transaction.credit ?? null,
      currency: transaction.currency || 'JO',
      notes: transaction.notes || null,
      customerId: transaction.customerId || null,
    }));

    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        date: isoDate,
        companyId,
        number,
        transactions: {
          create: transactionData,
        },
      },
      include: { transactions: true },
    });

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

  async generateJournalNumber(companyId: string, date: Date): Promise<string> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    const lastJournal = await this.prisma.journalEntry.findFirst({
      where: {
        companyId,
        number: { startsWith: prefix },
      },
      orderBy: { number: 'desc' },
    });

    const nextSequence = lastJournal
      ? parseInt(lastJournal.number.split('/')[1]) + 1
      : 1;

    return `${prefix}/${String(nextSequence).padStart(3, '0')}`;
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

    const codes = [
      ...new Set(entries.map((entry) => entry.code).filter((code) => code)),
    ];

    const accounts = await this.prisma.account.findMany({
      where: {
        code: { in: codes },
        companyId,
      },
    });

    const accountMap = accounts.reduce(
      (map, account) => {
        map[account.code] = account.id;
        return map;
      },
      {} as Record<string, string>,
    );

    for (const entry of entries) {
      const accountId = accountMap[entry.code];
      if (!accountId) {
        throw new BadRequestException(
          `Account not found for code: ${entry.code} and companyId: ${companyId}`,
        );
      }

      const number = await this.generateJournalNumber(companyId, new Date());

      await this.prisma.journalEntry.create({
        data: {
          companyId,
          number,
          transactions: {
            create: [
              {
                accountId,
                debit: entry.debit ?? 0,
                credit: entry.credit ?? 0,
                companyId,
                notes: entry.notes,
              },
            ],
          },
        },
      });
    }

    return { message: 'Bulk journal entries created successfully.' };
  }



  async backfillJournalNumbersForCompany(companyId: string, batchSize = 100) {
    let offset = 0;
    let hasMore = true;
    let sequenceNumber = 0;

    while (hasMore) {
      const journalEntries = await this.prisma.journalEntry.findMany({
        where: { companyId },
        orderBy: { date: 'asc' },
        skip: offset,
        take: batchSize,
      });

      if (journalEntries.length === 0) {
        hasMore = false;
        break;
      }

      const updates = journalEntries.map((entry) => {
        sequenceNumber++;
        const year = entry.date.getFullYear();
        const month = String(entry.date.getMonth() + 1).padStart(2, '0');
        const prefix = `${year}-${month}`;
        const number = `${prefix}/${String(sequenceNumber).padStart(3, '0')}`;

        return this.prisma.journalEntry.update({
          where: { id: entry.id },
          data: { number },
        });
      });

      await Promise.all(updates);
      console.log(
        `Processed batch for company ${companyId}: ${offset + 1} to ${
          offset + journalEntries.length
        }`,
      );

      offset += batchSize;
    }

    console.log(`Journal numbers backfilled for company ${companyId}`);
  }

  async createInvoiceJournalEntry(data: any, accounts: any, companyId: string) {
  
    // Validate the accounts
    if (!accounts['Sales Revenue'] || !accounts['Sales Revenue'].id) {
      throw new Error('Sales Revenue account is missing or invalid.');
    }
    if (!accounts['COGS (Cost of Goods Sold)'] || !accounts['COGS (Cost of Goods Sold)'].id) {
      throw new Error('COGS account is missing or invalid.');
    }
    if (!accounts['Inventory'] || !accounts['Inventory'].id) {
      throw new Error('Inventory account is missing or invalid.');
    }
    if (!accounts['Sales Tax'] || !accounts['Sales Tax'].id) {
      throw new Error('Sales Tax account is missing or invalid.');
    }
  
    // Prepare transactions based on invoice type
    const transactions =
      data.InvoiceTypeCodeName === '021'
        ? [
            {
              accountId: data.clientId,
              debit: data.taxInclusiveAmount,
              credit: null,
              currency: 'JO',
              notes: 'Invoice payment received',
              companyId,
            },
            {
              accountId: accounts['Sales Tax'].id,
              debit: null,
              credit: data.taxAmount,
              currency: 'JO',
              notes: 'Sales tax recorded',
              companyId,
            },
            {
              accountId: accounts['Sales Revenue'].id,
              debit: null,
              credit: data.taxExclusiveAmount,
              currency: 'JO',
              notes: 'Revenue recognized',
              companyId,
            },
            {
              accountId: accounts['COGS (Cost of Goods Sold)'].id,
              debit: accounts.totalCOGS,
              credit: null,
              currency: 'JO',
              notes: 'Cost of goods sold recorded',
              companyId,
            },
            {
              accountId: accounts['Inventory'].id,
              debit: null,
              credit: accounts.totalCOGS,
              currency: 'JO',
              notes: 'Inventory reduced for sold items',
              companyId,
            },
          ]
        : [
            {
              accountId: data.cashAccountId,
              debit: data.taxInclusiveAmount,
              credit: null,
              currency: 'JO',
              notes: 'Invoice payment received',
              companyId,
            },
            {
              accountId: accounts['Sales Tax'].id,
              debit: null,
              credit: data.taxAmount,
              currency: 'JO',
              notes: 'Sales tax recorded',
              companyId,
            },
            {
              accountId: accounts['Sales Revenue'].id,
              debit: null,
              credit: data.taxExclusiveAmount,
              currency: 'JO',
              notes: 'Revenue recognized',
              companyId,
            },
            {
              accountId: accounts['COGS (Cost of Goods Sold)'].id,
              debit: accounts.totalCOGS,
              credit: null,
              currency: 'JO',
              notes: 'Cost of goods sold recorded',
              companyId,
            },
            {
              accountId: accounts['Inventory'].id,
              debit: null,
              credit: accounts.totalCOGS,
              currency: 'JO',
              notes: 'Inventory reduced for sold items',
              companyId,
            },
          ];
  
  
    // Use the provided date or default to the current date
    const date = data.date ? new Date(data.date) : new Date();
  
    // Generate a unique journal number
    const number = await this.generateJournalNumber(companyId, date);
  
    // Create the journal entry
    const journalEntry = await this.prisma.journalEntry.create({
      data: {
        date,
        companyId,
        transactions: {
          create: transactions,
        },
        number,
      },
      include: { transactions: true },
    });
  
  
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
