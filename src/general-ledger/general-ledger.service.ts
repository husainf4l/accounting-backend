import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeneralLedgerService {
  constructor(private readonly prisma: PrismaService) { }

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
    const { accountId, customerId, supplierId, bankId, expenseId, debit, credit, companyId, notes, date } = data;

    if (!accountId && !customerId && !supplierId && !bankId && !expenseId) {
      throw new Error('At least one entity (account, customer, supplier, bank, or expense) must be specified.');
    }

    // Create a General Ledger entry
    const ledgerEntry = await this.prisma.generalLedger.create({
      data: {
        accountId,
        customerId,
        supplierId,
        bankId,
        expenseId,
        debit,
        credit,
        companyId,
        balance: 0, // Temporary, updated after creation
        notes: notes || '',
        date: date || new Date(),
      },
    });

    // Update balances
    if (accountId) await this.updateAccountBalance(accountId, companyId, debit, credit);
    if (customerId) await this.updateCustomerBalance(customerId, debit, credit);

    // Update the ledger entry with the correct running balance
    const runningBalance = await this.calculateRunningBalance(companyId, ledgerEntry.accountId, ledgerEntry.customerId);
    await this.prisma.generalLedger.update({
      where: { id: ledgerEntry.id },
      data: { balance: runningBalance },
    });

    return ledgerEntry;
  }

  /**
   * Get General Ledger entries with pagination for scalability.
   */
  async getLedgerEntries(
    companyId: string,
    filter?: { accountId?: string; customerId?: string; dateRange?: { start: Date; end: Date }; page?: number; limit?: number }
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
    const limit = filter?.limit || 100;

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

  /**
   * Update the balance for a customer in the General Ledger.
   */
  private async updateCustomerBalance(customerId: string, debit: number, credit: number): Promise<void> {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Update the customer's current balance
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { currentBalance: customer.currentBalance + debit - credit },
    });
  }

  /**
   * Calculate the running balance for a specific account or customer.
   */
  private async calculateRunningBalance(companyId: string, accountId?: string, customerId?: string): Promise<number> {
    const filter: any = { companyId };

    if (accountId) filter.accountId = accountId;
    if (customerId) filter.customerId = customerId;

    const result = await this.prisma.generalLedger.aggregate({
      where: filter,
      _sum: {
        debit: true,
        credit: true,
      },
    });

    return (result._sum.debit || 0) - (result._sum.credit || 0);
  }

  /**
 * Update the balance for an account in the General Ledger.
 */
  private async updateAccountBalance(accountId: string, companyId: string, debit: number, credit: number): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Update the account's current balance
    await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: account.currentBalance + debit - credit },
    });
  }


  /**
 * Update parent account balances for Accounts Receivable, Bank Accounts, and Accounts Payable.
 */
  async updateParentAccountBalances(companyId: string): Promise<void> {
    const parentAccounts = [
      { code: '1.1.3', entity: 'customerId' }, // Accounts Receivable
      { code: '1.1.4', entity: 'bankId' },    // Bank Accounts
      { code: '2.1.1', entity: 'supplierId' }, // Accounts Payable
    ];

    for (const { code, entity } of parentAccounts) {
      const parentAccount = await this.prisma.account.findFirst({ where: { companyId, code } });
      if (!parentAccount) continue;

      const entityTotal = await this.getAggregatedBalances(companyId, { [entity]: { not: null } });

      const totalBalance = (entityTotal._sum.debit || 0) - (entityTotal._sum.credit || 0);

      await this.prisma.account.update({
        where: { id: parentAccount.id },
        data: { currentBalance: totalBalance },
      });
    }
  }


  async getAggregatedBalances(companyId: string, filters: { accountId?: string; customerId?: string; supplierId?: string; bankId?: string; expenseId?: string; }) {
    return this.prisma.generalLedger.aggregate({
      where: {
        companyId,
        ...filters,
      },
      _sum: {
        debit: true,
        credit: true,
      },
    });
  }


}
