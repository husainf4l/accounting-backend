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

  // Get all accounts
  async getAllAccounts(companyId: string): Promise<Account[]> {
    await this.generalLedger.updateGeneralLedger();
    return this.prisma.account.findMany({
      include: {
        parentAccount: true,
        children: true,
      },
      orderBy: [
        {
          hierarchyCode: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  // Get a single account by ID
  async getAccountById(id: string, companyId: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id },
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
      where: { id },
      data,
    });
  }

  // Delete an account
  async deleteAccount(id: string, companyId: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { id },
    });
  }

  async initializeChartOfAccounts(companyId: string): Promise<string> {
    const existingAccounts = await this.prisma.account.findMany();
    if (existingAccounts.length > 0) {
      console.log('Chart of Accounts already initialized.');
      return 'Chart of Accounts already initialized.';
    }

    const accounts = [
      {
        hierarchyCode: '1',
        name: 'Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentHierarchyCode: null,
      },
      {
        hierarchyCode: '1.2',
        name: 'Fixed Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentHierarchyCode: '1',
      },
      {
        hierarchyCode: '1.1',
        name: 'Current Assets',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentHierarchyCode: '1',
      },
      {
        hierarchyCode: '1.1.5',
        name: 'long term Cheques',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1',
      },
      {
        hierarchyCode: '1.1.4',
        name: 'Stock',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1',
      },
      {
        hierarchyCode: '1.1.3',
        name: 'Accounts Receivable',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentHierarchyCode: '1.1',
      },
      {
        hierarchyCode: '1.1.3.9',
        name: 'maria fatol',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.12',
        name: 'Majd Chuck',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.11',
        name: 'zxsd',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.10',
        name: 'sdsadsa',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.1',
        name: 'Client A',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.8',
        name: 'al-hussein qasem-abdullah',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.7',
        name: 'Maria Fatol',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.6',
        name: 'ssss',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.5',
        name: 'Maria Fatol',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.4',
        name: 'alhussein',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.3',
        name: 'cashmer',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.3.2',
        name: 'Client B',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.3',
      },
      {
        hierarchyCode: '1.1.1',
        name: 'Cash',
        accountType: AccountType.ASSET,
        mainAccount: true,
        parentHierarchyCode: '1.1',
      },
      {
        hierarchyCode: '1.1.1.2',
        name: 'Office Cash',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.1',
      },
      {
        hierarchyCode: '1.1.1.1',
        name: 'Cash Aramex',
        accountType: AccountType.ASSET,
        mainAccount: false,
        parentHierarchyCode: '1.1.1',
      },
      {
        hierarchyCode: '2',
        name: 'Liabilities',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentHierarchyCode: null,
      },
      {
        hierarchyCode: '2.1.1.2',
        name: 'Supplier B',
        accountType: AccountType.LIABILITY,
        mainAccount: false,
        parentHierarchyCode: '2.1.1',
      },
      {
        hierarchyCode: '2.2',
        name: 'Long-Term Liabilities',
        accountType: AccountType.LIABILITY,
        mainAccount: true,
        parentHierarchyCode: '2',
      },
      {
        hierarchyCode: '3',
        name: 'Equity',
        accountType: AccountType.EQUITY,
        mainAccount: true,
        parentHierarchyCode: null,
      },
      {
        hierarchyCode: '4',
        name: 'Revenue',
        accountType: AccountType.REVENUE,
        mainAccount: true,
        parentHierarchyCode: null,
      },
      {
        hierarchyCode: '5',
        name: 'TRADE EXPENSES',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentHierarchyCode: null,
      },
      {
        hierarchyCode: '6',
        name: 'Expenses',
        accountType: AccountType.EXPENSE,
        mainAccount: true,
        parentHierarchyCode: null,
      },
    ];

    // Step 2: Create all accounts
    for (const account of accounts) {
      const parentAccount = accounts.find(
        (acc) => acc.hierarchyCode === account.parentHierarchyCode,
      );

      await this.prisma.account.create({
        data: {
          hierarchyCode: account.hierarchyCode,
          name: account.name,
          companyId: companyId,
          accountType: account.accountType,
          mainAccount: account.mainAccount,
          parentAccountId: parentAccount
            ? (
              await this.prisma.account.findUnique({
                where: { hierarchyCode: parentAccount.hierarchyCode },
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
