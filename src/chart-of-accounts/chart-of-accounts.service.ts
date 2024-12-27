import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, AccountType, Prisma } from '@prisma/client';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    private prisma: PrismaService,
    private generalLedger: GeneralLedgerService,
  ) { }

  // // Get all accounts
  // async getAllAccounts22(companyId: string): Promise<any[]> {
  //   await this.generalLedger.updateGeneralLedger(companyId);
  //   return this.prisma.account.findMany({
  //     where: { companyId: companyId },
  //     select: {
  //       id: true,
  //       name: true,
  //       accountType: true,
  //       code: true,
  //       currentBalance: true,
  //       mainAccount: true,
  //       openingBalance: true,
  //       transactions: true,
  //     },
  //     orderBy: [
  //       {
  //         code: 'asc',
  //       },
  //       {
  //         name: 'asc',
  //       },
  //     ],
  //   });
  // }

  // async reconsole(companyId: string): Promise<any[]> {
  //   await this.generalLedger.reconcileGeneralLedger(companyId);
  //   return this.getAllAccounts(companyId);
  // }

  async getAllAccounts(companyId: string): Promise<any[]> {
    const accounts = await this.prisma.account.findMany({
      where: { companyId: companyId },
      select: {
        id: true,
        name: true,
        accountType: true,
        code: true,
        openingBalance: true,
        currentBalance: true,
        mainAccount: true,
        parentAccount: { select: { code: true } },
      },
      orderBy: [
        {
          code: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    // Step 2: Fetch transactions and calculate totals
    const accountIds = accounts.map((account) => account.id);
    const transactions = await this.prisma.transaction.groupBy({
      by: ['accountId'],
      where: {
        accountId: { in: accountIds },
      },
      _sum: {
        debit: true,
        credit: true,
      },
    });

    // Step 3: Map transaction totals to accounts
    const transactionMap = new Map<
      string,
      { totalDebit: number; totalCredit: number }
    >();
    transactions.forEach((tx) => {
      transactionMap.set(tx.accountId, {
        totalDebit: tx._sum.debit || 0,
        totalCredit: tx._sum.credit || 0,
      });
    });

    // Step 4: Calculate current balance for each account
    const result = accounts.map((account) => {
      const totals = transactionMap.get(account.id) || {
        totalDebit: 0,
        totalCredit: 0,
      };

      return {
        id: account.id,
        name: account.name,
        accountType: account.accountType,
        code: account.code,
        openingBalance: account.openingBalance,
        totalDebit: totals.totalDebit,
        totalCredit: totals.totalCredit,
        currentBalance: account.currentBalance,
        mainAccount: account.mainAccount,
        parentAccountNumber: account.parentAccount?.code,
      };
    });

    return result;
  }

  // Get a single account by ID
  async getAccountById(id: string, companyId: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        companyId: companyId,
        id: id,
      },
      include: {
        parentAccount: true,
        children: true,
      },
    });
  }

  async createAccount2(
    data: Prisma.AccountCreateInput,
    companyId: string,
  ): Promise<Account> {
    return this.prisma.account.create({
      data,
    });
  }

  // Update an account
  async updateAccount(
    id: string,
    data: Prisma.AccountUpdateInput,
    companyId: string,
  ): Promise<Account> {
    return this.prisma.account.update({
      where: { companyId: companyId, id: id },
      data,
    });
  }

  // Delete an account
  async deleteAccount(id: string, companyId: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { companyId: companyId, id: id },
    });
  }

  async initializeChartOfAccounts(companyId: string): Promise<string> {
    const existingAccounts = await this.prisma.account.findMany({
      where: { companyId: companyId },
    });
    if (existingAccounts.length > 0) {
      console.log('Chart of Accounts already initialized.');
      return 'Chart of Accounts already initialized.';
    }

    const accounts = [
      {
        code: '1',
        name: 'Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '1.1',
        name: 'Current Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentCode: '1',
        companyId: companyId,
      },
      {
        code: '1.1.1',
        name: 'Cash',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentCode: '1.1',
        companyId: companyId,
      },
      {
        code: '1.1.1.1',
        name: 'Cash Aramex',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentCode: '1.1.1',
        companyId: companyId,
      },
      {
        code: '1.1.1.2',
        name: 'Office Cash',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentCode: '1.1.1',
        companyId: companyId,
      },
      {
        code: '1.1.3',
        name: 'Accounts Receivable',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentCode: '1.1',
        companyId: companyId,
      },
      {
        code: '1.1.4',
        name: 'Stock',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentCode: '1.1',
        companyId: companyId,
      },
      {
        code: '1.1.5',
        name: 'Long-Term Cheques',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentCode: '1.1',
        companyId: companyId,
      },
      {
        code: '1.2',
        name: 'Fixed Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentCode: '1',
        companyId: companyId,
      },
      {
        code: '2',
        name: 'Liabilities',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '2.1.1.2',
        name: 'Supplier B',
        accountType: AccountType.LIABILITY,
        mainAccount: false,
        parentCode: '2.1.1',
        companyId: companyId,
      },
      {
        code: '2.2',
        name: 'Long-Term Liabilities',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentCode: '2',
        companyId: companyId,
      },
      {
        code: '2.3',
        name: 'Income Tax Payable',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentCode: '2',
        companyId: companyId,
      },
      {
        code: '2.1.2',
        name: 'Sales Tax Payable',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentCode: '2',
        companyId: companyId,
      },
      {
        code: '3',
        name: 'Equity',
        accountType: AccountType.EQUITY,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '3.1',
        name: 'Retained Earnings',
        accountType: AccountType.EQUITY,
        mainAccount: true,
        parentCode: '3',
        companyId: companyId,
      },
      {
        code: '3.2',
        name: 'Share Capital',
        accountType: AccountType.EQUITY,
        mainAccount: true,
        parentCode: '3',
        companyId: companyId,
      },
      {
        code: '3.3',
        name: 'Reserves',
        accountType: AccountType.EQUITY,
        mainAccount: true,
        parentCode: '3',
        companyId: companyId,
      },
      {
        code: '4',
        name: 'Revenue',
        accountType: AccountType.REVENUE,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '5',
        name: 'TRADE EXPENSES',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '5.1',
        name: 'Purchases',
        accountType: AccountType.EXPENSE,
        mainAccount: false,
        parentCode: '5',
        companyId: companyId,
      },
      {
        code: '5.5',
        name: 'Cost of Goods Sold (COGS)',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '5',
        companyId: companyId,
      },
      {
        code: '5.3',
        name: 'Initial Stock',
        accountType: AccountType.EXPENSE,
        mainAccount: false,
        parentCode: '5',
        companyId: companyId,
      },
      {
        code: '6',
        name: 'Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: null,
        companyId: companyId,
      },
      {
        code: '6.1',
        name: 'Administrative Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.2',
        name: 'Marketing Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.3',
        name: 'Depreciation',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.4',
        name: 'Amortization',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.5',
        name: 'Insurance Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.6',
        name: 'Travel Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.7',
        name: 'Utilities',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.8',
        name: 'Repairs and Maintenance',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
      {
        code: '6.9',
        name: 'Bad Debts',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentCode: '6',
        companyId: companyId,
      },
    ];

    // Step 2: Create all accounts
    for (const account of accounts) {
      const parentAccount = accounts.find(
        (acc) => acc.code === account.parentCode,
      );

      await this.prisma.account.create({
        data: {
          code: account.code,
          name: account.name,
          companyId: companyId,
          accountType: account.accountType,
          mainAccount: account.mainAccount,
          parentAccountId: parentAccount
            ? (
              await this.prisma.account.findFirst({
                where: {
                  companyId: companyId,
                  code: parentAccount.code,
                },
              })
            )?.id
            : null,
          currentBalance: 0,
        },
      });
    }

    return 'Chart of Accounts Initialized Successfully with Stock, Clients, and Suppliers';
  }
}
