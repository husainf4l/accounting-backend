import { Injectable } from '@nestjs/common';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, formatISO } from 'date-fns';
import { $Enums, AccountType } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly generalLedgerService: GeneralLedgerService,
  ) {}

  async getAccountStatement(
    accountId: string,
    page = 1,
    limit = 10,
    startDate?: string,
    endDate?: string,
  ) {
    const offset = (page - 1) * limit;

    const startDateISO = startDate ? formatISO(parseISO(startDate)) : undefined;
    const endDateISO = endDate ? formatISO(parseISO(endDate)) : undefined;

    // Fetch account details
    const accountDetails = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!accountDetails) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    let openingBalance = accountDetails.openingBalance || 0;

    if (startDateISO) {
      const priorTransactions = await this.prisma.transaction.findMany({
        where: {
          accountId,
          createdAt: { lt: new Date(startDateISO) }, // Transactions before the startDate
        },
      });

      openingBalance += priorTransactions.reduce(
        (balance, transaction) =>
          balance + (transaction.debit || 0) - (transaction.credit || 0),
        0,
      );
    }

    // Fetch transactions within the date range
    const transactionFilters: any = { accountId };
    if (startDateISO)
      transactionFilters.createdAt = { gte: new Date(startDateISO) };
    if (endDateISO)
      transactionFilters.createdAt = {
        ...transactionFilters.createdAt,
        lte: new Date(endDateISO),
      };

    const transactions = await this.prisma.transaction.findMany({
      where: transactionFilters,
      include: { journalEntry: true },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit,
    });

    const totalTransactions = await this.prisma.transaction.count({
      where: transactionFilters,
    });

    const totalPages = Math.ceil(totalTransactions / limit);

    // Fetch invoices (if applicable)
    const invoices = await this.prisma.invoice.findMany({
      where: { customerId: accountId },
    });

    // Calculate running balances
    let runningBalance = openingBalance;
    const transactionsWithBalance = transactions.map((transaction) => {
      const { debit, credit } = transaction;
      runningBalance += debit || 0;
      runningBalance -= credit || 0;
      return { ...transaction, runningBalance };
    });

    return {
      accountDetails,
      openingBalance,
      transactions: transactionsWithBalance,
      invoices,
      summary: {
        totalDebits: transactions.reduce((sum, t) => sum + (t.debit || 0), 0),
        totalCredits: transactions.reduce((sum, t) => sum + (t.credit || 0), 0),
        finalBalance: runningBalance,
      },
      pagination: {
        totalRecords: totalTransactions,
        currentPage: page,
        totalPages,
      },
    };
  }

  async getCriticalAccounts(codes: string | string[] = []) {
    const codeArray = Array.isArray(codes) ? codes : [codes];

    const accounts = await Promise.all(
      codeArray.map((code) => this.findAccountByHierarchyCode(code)),
    );

    if (Array.isArray(codes)) {
      return accounts.reduce((acc, account, idx) => {
        acc[codeArray[idx]] = account;
        return acc;
      }, {});
    }
    return accounts[0];
  }

  async getAccountsUnderCode(hierarchyCode: string) {
    const mainAccount = await this.findAccountByHierarchyCode(hierarchyCode);

    return this.prisma.account.findMany({
      where: { parentAccountId: mainAccount.id },
    });
  }

  async getMainAccount() {
    return await this.prisma.account.findMany({
      where: {
        mainAccount: true,
      },
    });
  }

  async findAccountByHierarchyCode(hierarchyCode: string) {
    const account = await this.prisma.account.findUnique({
      where: { hierarchyCode },
    });

    if (!account) {
      throw new Error(`Account with hierarchy code ${hierarchyCode} not found`);
    }

    return account;
  }

  async createAccount(data: {
    name: string;
    accountType: $Enums.AccountType;
    openingBalance?: number;
    parentAccountId?: string | null;
    mainAccount: boolean;
  }) {
    const {
      name,
      accountType,
      openingBalance = 0,
      parentAccountId,
      mainAccount,
    } = data;

    let hierarchyCode: string;

    if (mainAccount) {
      // Fetch the maximum hierarchyCode for main accounts
      const maxMainAccount = await this.prisma.account.findFirst({
        where: { mainAccount: true },
        orderBy: { hierarchyCode: 'desc' },
      });

      // Generate the next hierarchy code for the main account
      hierarchyCode = maxMainAccount
        ? (parseInt(maxMainAccount.hierarchyCode) + 1).toString()
        : '1';
    } else {
      // Fetch the parent account's hierarchyCode
      const parentAccount = await this.prisma.account.findUnique({
        where: { id: parentAccountId },
      });

      if (!parentAccount) {
        throw new Error(`Parent account with ID ${parentAccountId} not found`);
      }

      // Generate the next sub-hierarchy code
      const maxSubAccount = await this.prisma.account.findFirst({
        where: { parentAccountId },
        orderBy: { hierarchyCode: 'desc' },
      });

      hierarchyCode = maxSubAccount
        ? (
            parseInt(maxSubAccount.hierarchyCode.split('.').pop() || '0') + 1
          ).toString()
        : '1';

      hierarchyCode = `${parentAccount.hierarchyCode}.${hierarchyCode}`;
    }

    // Create the account data
    const accountData: any = {
      name,
      accountType,
      openingBalance,
      currentBalance: openingBalance,
      mainAccount,
      hierarchyCode,
    };

    if (!mainAccount) {
      accountData.parentAccountId = parentAccountId || null;
    }

    const newAccount = await this.prisma.account.create({
      data: accountData,
    });

    return newAccount;
  }
}
