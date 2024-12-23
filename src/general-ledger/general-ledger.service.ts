import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralLedgerService {
  constructor(private prisma: PrismaService) {}

  async updateGeneralLedger(companyId: string): Promise<void> {
    console.log('Started updating general ledger');

    // Step 1: Fetch the last update time from GeneralLedger
    const lastUpdate = await this.prisma.generalLedger.findFirst({
      where: { companyId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    const lastUpdatedAt = lastUpdate?.updatedAt || new Date(0); // Default to epoch if no updates exist

    // Step 2: Fetch accounts with transactions since the last update
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
      select: {
        id: true,
        parentAccountId: true,
        openingBalance: true,
        transactions: {
          where: {
            createdAt: {
              gt: lastUpdatedAt, // Filter only transactions created after the last update
            },
          },
          select: {
            debit: true,
            credit: true,
          },
        },
      },
      orderBy: { hierarchyCode: 'asc' }, // Ensure hierarchy order
    });

    console.log(`Fetched ${accounts.length} accounts with transactions`);

    // Step 3: Calculate balances
    const accountBalances = new Map<string, number>();
    accounts.forEach((account) => {
      const openingBalance = account.openingBalance || 0;
      const transactionBalance = account.transactions.reduce(
        (sum, tx) => sum + (tx.debit || 0) - (tx.credit || 0),
        0,
      );
      accountBalances.set(account.id, openingBalance + transactionBalance);
    });

    // Step 4: Propagate balances to parent accounts
    accounts.reverse(); // Process child accounts first
    accounts.forEach((account) => {
      const childBalance = accountBalances.get(account.id) || 0;
      if (account.parentAccountId) {
        const parentBalance = accountBalances.get(account.parentAccountId) || 0;
        accountBalances.set(
          account.parentAccountId,
          parentBalance + childBalance,
        );
      }
    });

    console.log('Balances calculated and propagated');

    // Step 5: Prepare bulk upserts for GeneralLedger
    const updates = Array.from(accountBalances.entries()).map(
      ([accountId, balance]) =>
        this.prisma.generalLedger.upsert({
          where: { accountId },
          update: { balance, updatedAt: new Date() },
          create: { accountId, balance, companyId },
        }),
    );

    // Step 6: Perform updates in batches
    const batchSize = 50;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      await this.prisma.$transaction(batch);
    }

    console.log('General ledger updated successfully.');
  }

  async reconcileGeneralLedger(companyId: string): Promise<void> {
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
      select: { id: true, openingBalance: true, parentAccountId: true },
    });

    const transactions = await this.prisma.transaction.groupBy({
      by: ['accountId'],
      where: { companyId },
      _sum: { debit: true, credit: true },
    });

    const transactionMap = new Map<string, { debit: number; credit: number }>();
    transactions.forEach((tx) => {
      transactionMap.set(tx.accountId, {
        debit: tx._sum.debit || 0,
        credit: tx._sum.credit || 0,
      });
    });

    const accountBalances = new Map<string, number>();
    accounts.forEach((account) => {
      const openingBalance = account.openingBalance || 0;
      const transactionBalance =
        (transactionMap.get(account.id)?.debit || 0) -
        (transactionMap.get(account.id)?.credit || 0);
      accountBalances.set(account.id, openingBalance + transactionBalance);
    });

    accounts.reverse(); // Propagate balances
    accounts.forEach((account) => {
      const childBalance = accountBalances.get(account.id) || 0;
      if (account.parentAccountId) {
        const parentBalance = accountBalances.get(account.parentAccountId) || 0;
        accountBalances.set(
          account.parentAccountId,
          parentBalance + childBalance,
        );
      }
    });

    const updates = Array.from(accountBalances.entries()).map(
      ([accountId, balance]) =>
        this.prisma.generalLedger.upsert({
          where: { accountId },
          update: { balance, updatedAt: new Date() },
          create: { accountId, balance, companyId },
        }),
    );

    const updateAccounts = Array.from(accountBalances.entries()).map(
      ([accountId, balance]) =>
        this.prisma.account.update({
          where: { id: accountId },
          data: {
            currentBalance: balance,
            updatedAt: new Date(),
          },
        }),
    );

    await Promise.all(updateAccounts);

    const batchSize = 50;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      await this.prisma.$transaction(batch);
    }
  }

  async updateGeneralLedger44(companyId: string): Promise<void> {
    console.log('Started updating general ledger');

    // Step 1: Fetch accounts and their hierarchies
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
      select: {
        id: true,
        parentAccountId: true,
        openingBalance: true,
      },
      orderBy: { hierarchyCode: 'asc' }, // Ensure proper hierarchy processing
    });

    // Step 2: Aggregate transactions in the database
    const transactions = await this.prisma.$queryRaw<
      { accountId: string; totalDebit: number; totalCredit: number }[]
    >`
      SELECT 
        "accountId", 
        COALESCE(SUM("debit"), 0) AS "totalDebit", 
        COALESCE(SUM("credit"), 0) AS "totalCredit"
      FROM "Transaction"
      WHERE "companyId" = ${companyId}
      GROUP BY "accountId"
    `;

    console.log(`Fetched ${transactions.length} transaction groups`);

    // Step 3: Map transaction balances to account balances
    const transactionBalances = new Map<string, number>();
    transactions.forEach((tx) => {
      const debit = tx.totalDebit || 0;
      const credit = tx.totalCredit || 0;
      transactionBalances.set(tx.accountId, debit - credit);
    });

    // Step 4: Compute balances for all accounts
    const accountBalances = new Map<string, number>();
    accounts.forEach((account) => {
      const openingBalance = account.openingBalance || 0;
      const transactionBalance = transactionBalances.get(account.id) || 0;
      accountBalances.set(account.id, openingBalance + transactionBalance);
    });

    // Step 5: Propagate balances to parent accounts
    accounts.reverse(); // Start with leaf nodes to propagate upwards
    accounts.forEach((account) => {
      const childBalance = accountBalances.get(account.id) || 0;
      if (account.parentAccountId) {
        const parentBalance = accountBalances.get(account.parentAccountId) || 0;
        accountBalances.set(
          account.parentAccountId,
          parentBalance + childBalance,
        );
      }
    });

    console.log('Computed balances for all accounts');

    // Step 6: Prepare bulk upsert queries for the GeneralLedger table
    const updates = Array.from(accountBalances.entries()).map(
      ([accountId, balance]) =>
        this.prisma.generalLedger.upsert({
          where: { accountId },
          update: { balance, updatedAt: new Date() },
          create: { accountId, balance, companyId },
        }),
    );

    // Step 7: Perform updates in a transaction
    const batchSize = 50;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      await this.prisma.$transaction(batch);
    }

    console.log('General ledger updated successfully.');
  }

  async updateGeneralLedger3(companyId: string): Promise<void> {
    console.log('Started');

    const affectedTransactions = await this.prisma.transaction.groupBy({
      by: ['accountId'],
      where: { companyId },
      _sum: { debit: true, credit: true },
    });

    if (affectedTransactions.length === 0) {
      console.log('No transactions to process.');
      return;
    }

    // Step 2: Map account balances
    const accountBalances = new Map<string, number>();
    for (const tx of affectedTransactions) {
      const debit = tx._sum.debit || 0;
      const credit = tx._sum.credit || 0;
      const currentBalance = debit - credit;

      accountBalances.set(tx.accountId, currentBalance);
    }

    // Step 3: Fetch and propagate balances for parent accounts
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
      select: { id: true, parentAccountId: true },
    });

    accounts.forEach((account) => {
      const childBalance = accountBalances.get(account.id) || 0;
      if (account.parentAccountId) {
        const parentBalance = accountBalances.get(account.parentAccountId) || 0;
        accountBalances.set(
          account.parentAccountId,
          parentBalance + childBalance,
        );
      }
    });

    // Step 4: Update GeneralLedger table
    const updates = Array.from(accountBalances.entries()).map(
      ([accountId, balance]) =>
        this.prisma.generalLedger.upsert({
          where: { accountId },
          update: { balance, updatedAt: new Date() },
          create: { accountId, balance, companyId },
        }),
    );

    await this.prisma.$transaction(updates);

    console.log('General ledger updated successfully.');
  }

  async updateGeneralLedger2(companyId: string): Promise<void> {
    const accounts = await this.prisma.account.findMany({
      where: { companyId },
      select: { id: true, parentAccountId: true, openingBalance: true },
      orderBy: { hierarchyCode: 'desc' },
    });

    const accountIds = accounts.map((account) => account.id);

    // Aggregate transactions in the database
    const transactions = await this.prisma.transaction.groupBy({
      by: ['accountId'],
      _sum: { debit: true, credit: true },
      where: { accountId: { in: accountIds } },
    });

    // Map transactions to accounts
    const transactionMap = new Map<string, number>();
    for (const tx of transactions) {
      const debit = tx._sum.debit || 0;
      const credit = tx._sum.credit || 0;
      transactionMap.set(tx.accountId, debit - credit);
    }

    // Calculate balances
    const accountBalances = new Map<string, number>();
    for (const account of accounts) {
      const openingBalance = account.openingBalance || 0;
      const transactionBalance = transactionMap.get(account.id) || 0;
      accountBalances.set(account.id, openingBalance + transactionBalance);
    }

    // Propagate balances up the hierarchy
    for (const account of accounts) {
      if (account.parentAccountId) {
        const childBalance = accountBalances.get(account.id) || 0;
        accountBalances.set(
          account.parentAccountId,
          (accountBalances.get(account.parentAccountId) || 0) + childBalance,
        );
      }
    }

    // Bulk update balances
    const updates = Array.from(accountBalances.entries()).map(([id, balance]) =>
      this.prisma.account.update({
        where: { id },
        data: { currentBalance: balance },
      }),
    );

    await this.prisma.$transaction(updates);

    console.log('General ledger updated successfully');
  }

  private async calculateAccountBalance(
    account: any,
    accountBalances: Map<string, number>,
  ): Promise<number> {
    // Check if the balance is already calculated
    if (accountBalances.has(account.id)) {
      return accountBalances.get(account.id)!;
    }

    // Get all transactions for this account
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId: account.id },
    });

    // Calculate the balance based on transactions
    let balance = transactions.reduce((sum, transaction) => {
      return sum + (transaction.debit || 0) - (transaction.credit || 0);
    }, account.openingBalance || 0);

    // Add balances of all child accounts
    if (account.children && account.children.length > 0) {
      for (const child of account.children) {
        const childBalance = await this.calculateAccountBalance(
          child,
          accountBalances,
        );
        balance += childBalance;
      }
    }

    return balance;
  }

  // Calculate balance dynamically
  async getAccountBalance(accountId: string): Promise<number> {
    // Get all transactions for the account
    const accountTransactions = await this.prisma.transaction.findMany({
      where: { accountId },
    });

    // Calculate the direct balance
    const directBalance = accountTransactions.reduce(
      (sum, t) => sum + (t.debit || 0) - (t.credit || 0),
      0,
    );

    // Fetch child accounts
    const childAccounts = await this.prisma.account.findMany({
      where: { parentAccountId: accountId },
    });

    // Recursively calculate balances for child accounts
    const childBalances = await Promise.all(
      childAccounts.map((child) => this.getAccountBalance(child.id)),
    );

    // Return total balance (direct + child)
    return (
      directBalance + childBalances.reduce((sum, balance) => sum + balance, 0)
    );
  }

  async getStoredBalance(accountId: string): Promise<number> {
    const ledgerEntry = await this.prisma.generalLedger.findUnique({
      where: { accountId },
    });
    return ledgerEntry?.balance || 0;
  }
}
