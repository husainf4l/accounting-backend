import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeneralLedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntry(data: {
    accountId?: string;
    customerId?: string;
    supplierId?: string;
    bankId?: string;
    expenseId?: string;
    debit: number;
    credit: number;
    companyId: string;
    notes?: string;
    date?: Date;
  }): Promise<any> {
    // Create a journal entry
    const ledgerEntry = await this.prisma.generalLedger.create({
      data: {
        accountId: data.accountId,
        customerId: data.customerId,
        supplierId: data.supplierId,
        bankId: data.bankId,
        expenseId: data.expenseId,
        debit: data.debit,
        credit: data.credit,
        companyId: data.companyId,
        balance: 0, // Placeholder balance
        notes: data.notes || '',
        date: data.date || new Date(),
      },
    });

    // Update the general ledger entry with its running balance
    const runningBalance = await this.calculateRunningBalance(
      data.companyId,
      data.accountId,
      data.customerId,
    );

    await this.prisma.generalLedger.update({
      where: { id: ledgerEntry.id },
      data: { balance: runningBalance }, // Update running balance
    });

    // Update the account balance automatically after the journal entry
    await this.updateAccountBalance(
      data.accountId,
      data.companyId,
      data.debit,
      data.credit,
    );

    return ledgerEntry;
  }

  async reconcileAllAccounts(companyId: string): Promise<void> {
    // Fetch all accounts for the company
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
    });

    for (const account of accounts) {
      // Fetch all journal entries for the account
      const { _sum: totals } = await this.prisma.transaction.aggregate({
        where: {
          companyId,
          accountId: account.id,
        },
        _sum: {
          debit: true,
          credit: true,
        },
      });

      // Sum of debits and credits
      const totalDebit = totals.debit || 0;
      const totalCredit = totals.credit || 0;

      // Calculate the new balance
      const newBalance = account.openingBalance + totalDebit - totalCredit;

      // Update the account's current balance
      await this.prisma.account.update({
        where: { id: account.id },
        data: { currentBalance: newBalance },
      });
    }
  }

  async getLedgerEntries(
    companyId: string,
    filter?: {
      accountId?: string;
      customerId?: string;
      dateRange?: { start: Date; end: Date };
      page?: number;
      limit?: number;
    },
  ) {
    const where: any = { companyId };

    if (filter?.accountId) where.accountId = filter.accountId;
    if (filter?.customerId) where.customerId = filter.customerId;
    if (filter?.dateRange) {
      where.date = {
        gte: filter.dateRange.start,
        lte: filter.dateRange.end,
      };
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 50; // Default limit for better performance

    return this.prisma.generalLedger.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        account: true,
        customer: true,
        supplier: true,
        bank: true,
        expense: true,
      },
    });
  }

  async reconcileAccount(accountId: string, companyId: string): Promise<void> {
    const { _sum: totals } = await this.prisma.generalLedger.aggregate({
      where: { companyId, accountId },
      _sum: {
        debit: true,
        credit: true,
      },
    });

    const totalDebit = totals.debit || 0;
    const totalCredit = totals.credit || 0;

    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    const newBalance = account.openingBalance + totalDebit - totalCredit;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: newBalance },
    });
  }

  private async updateCustomerBalance(
    customerId: string,
    debit: number,
    credit: number,
  ): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    await this.prisma.customer.update({
      where: { id: customerId },
      data: { currentBalance: customer.currentBalance + debit - credit },
    });
  }

  async calculateRunningBalance(
    companyId: string,
    accountId?: string,
    customerId?: string,
  ): Promise<number> {
    const filter: any = { companyId };

    if (accountId) filter.accountId = accountId;
    if (customerId) filter.customerId = customerId;

    const result = await this.prisma.generalLedger.aggregate({
      where: filter,
      _sum: { debit: true, credit: true },
    });

    return (result._sum.debit || 0) - (result._sum.credit || 0);
  }

  private async updateAccountBalance(
    accountId: string,
    companyId: string,
    debit: number,
    credit: number,
  ): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error(`Account with ID ${accountId} not found.`);
    }

    await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: account.currentBalance + debit - credit },
    });
  }

  async updateParentAccountBalances(companyId: string): Promise<void> {
    const parentAccounts = [
      { code: '1.1.3', entity: 'customerId' }, // Accounts Receivable
      { code: '1.1.4', entity: 'bankId' }, // Bank Accounts
      { code: '2.1.1', entity: 'supplierId' }, // Accounts Payable
    ];

    for (const { code, entity } of parentAccounts) {
      const parentAccount = await this.prisma.account.findFirst({
        where: { companyId, code },
      });
      if (!parentAccount) continue;

      const entityTotal = await this.getAggregatedBalances(companyId, {
        [entity]: { not: null },
      });

      const totalBalance =
        (entityTotal._sum.debit || 0) - (entityTotal._sum.credit || 0);

      await this.prisma.account.update({
        where: { id: parentAccount.id },
        data: { currentBalance: totalBalance },
      });
    }
  }

  async getAggregatedBalances(companyId: string, filters: Record<string, any>) {
    return this.prisma.generalLedger.aggregate({
      where: { companyId, ...filters },
      _sum: { debit: true, credit: true },
    });
  }
}
