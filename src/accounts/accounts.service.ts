import { Injectable } from '@nestjs/common';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, formatISO } from 'date-fns';
import { $Enums, AccountType } from '@prisma/client';
import { CreateAccountDto } from './dto/CreateAccountDto';

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
    const balance =
      await this.generalLedgerService.getAccountBalance(accountId);
    console.log(balance);
    const offset = (page - 1) * limit;

    const startDateISO = startDate ? formatISO(parseISO(startDate)) : undefined;
    const endDateISO = endDate ? formatISO(parseISO(endDate)) : undefined;

    // Fetch account details
    const accountDetails = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { transactions: true },
    });

    if (!accountDetails) {
      throw new Error(`Account with ID ${accountId} not found`);
    }

    let openingBalance = accountDetails.openingBalance || 0;
    let balanceO = balance +accountDetails.openingBalance

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
      balanceO,
      transactions: transactionsWithBalance,

      pagination: {
        totalRecords: totalTransactions,
        currentPage: page,
        totalPages,
      },
    };
  }

  async getCriticalAccounts(companyId: string, codes: string | string[] = []) {
    const codeArray = Array.isArray(codes) ? codes : [codes];

    const accounts = await Promise.all(
      codeArray.map((code) => this.findAccountByHierarchyCode(code, companyId)),
    );

    if (Array.isArray(codes)) {
      return accounts.reduce((acc, account, idx) => {
        acc[codeArray[idx]] = account;
        return acc;
      }, {});
    }
    return accounts[0];
  }

  async getAccountsUnderCode(hierarchyCode: string, companyId: string) {
    const mainAccount = await this.findAccountByHierarchyCode(
      hierarchyCode,
      companyId,
    );

    if (!mainAccount) {
      throw new Error(
        `Main account with hierarchy code ${hierarchyCode} not found for company ID ${companyId}`,
      );
    }

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

  async findAccountByHierarchyCode(hierarchyCode: string, companyId: string) {
    const account = await this.prisma.account.findFirst({
      where: { hierarchyCode: hierarchyCode, companyId: companyId },
    });

    if (!account) {
      throw new Error(
        `Account with hierarchy code ${hierarchyCode} and companyId: ${companyId} not found`,
      );
    }

    return account;
  }

  async createAccount(
    companyId: string,
    data: {
      name: string;
      accountType: $Enums.AccountType;
      openingBalance?: number;
      parentAccountId?: string | null;
      mainAccount: boolean;
    },
  ) {
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
        where: {
          companyId: companyId,
          mainAccount: true,
        },
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
        where: { companyId: companyId, parentAccountId },
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
      companyId: companyId,
    };

    if (!mainAccount) {
      accountData.parentAccountId = parentAccountId || null;
    }

    const newAccount = await this.prisma.account.create({
      data: accountData,
    });

    return newAccount;
  }

  async bulkCreate(createAccountDtos: CreateAccountDto[]) {
    // Store the results
    const results: any[] = [];

    // Sort accounts by hierarchyCode length to ensure parents are created first
    createAccountDtos.sort(
      (a, b) => a.hierarchyCode.length - b.hierarchyCode.length,
    );

    // Use a transaction for atomicity
    await this.prisma.$transaction(async (prisma) => {
      for (const accountDto of createAccountDtos) {
        // Find or create parent account if parentAccountId is provided
        let parentAccount = null;

        if (accountDto.parentAccountId) {
          parentAccount = await prisma.account.findUnique({
            where: {
              hierarchyCode_companyId: {
                hierarchyCode: accountDto.parentAccountId,
                companyId: accountDto.companyId,
              },
            },
          });

          if (!parentAccount) {
            // Throw an error if parentAccountId is invalid
            throw new Error(
              `Parent account with hierarchyCode ${accountDto.parentAccountId} and companyId ${accountDto.companyId} does not exist.`,
            );
          }
        }

        // Create the account
        const account = await prisma.account.create({
          data: {
            hierarchyCode: accountDto.hierarchyCode,
            companyId: accountDto.companyId,
            name: accountDto.name,
            accountType: accountDto.accountType,
            parentAccountId: parentAccount ? parentAccount.id : null,
            openingBalance: accountDto.openingBalance || 0,
            currentBalance: accountDto.currentBalance,
            mainAccount: accountDto.mainAccount,
          },
        });

        // Handle BankDetails creation if provided
        if (accountDto.bankDetails) {
          await prisma.bankDetails.create({
            data: {
              ...accountDto.bankDetails,
              accountId: account.id,
              companyId: account.companyId,
            },
          });
        }

        if (accountDto.customerDetails) {
          await prisma.customer.create({
            data: {
              ...accountDto.customerDetails,
              accountId: account.id,
              companyId: account.companyId,
            },
          });
        }

        // Store the created account in results
        results.push(account);
      }
    });

    return results;
  }
}
