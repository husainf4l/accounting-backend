import { Injectable, NotFoundException } from '@nestjs/common';
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
    companyId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const offset = (page - 1) * limit;
    const startDateISO = startDate ? formatISO(parseISO(startDate)) : undefined;
    const endDateISO = endDate ? formatISO(parseISO(endDate)) : undefined;

    const accountDetails = await this.prisma.account.findUnique({
      where: { id: accountId, companyId },
    });

    if (!accountDetails)
      throw new NotFoundException(`Account with ID ${accountId} not found`);

    let openingBalance = accountDetails.openingBalance || 0;
    if (startDateISO) {
      const priorEntries = await this.prisma.generalLedger.findMany({
        where: {
          accountId,
          date: { lt: new Date(startDateISO) },
          companyId,
        },
      });
      openingBalance += priorEntries.reduce(
        (balance, entry) => balance + (entry.debit || 0) - (entry.credit || 0),
        0,
      );
    }

    const ledgerFilters: any = { accountId, companyId };
    if (startDateISO) ledgerFilters.date = { gte: new Date(startDateISO) };
    if (endDateISO)
      ledgerFilters.date = { ...ledgerFilters.date, lte: new Date(endDateISO) };

    const ledgerEntries = await this.prisma.generalLedger.findMany({
      where: ledgerFilters,
      orderBy: { date: 'asc' },
      skip: offset,
      take: limit,
    });

    const totalEntries = await this.prisma.generalLedger.count({
      where: ledgerFilters,
    });
    const totalPages = Math.ceil(totalEntries / limit);

    let runningBalance = openingBalance;
    const entriesWithBalance = ledgerEntries.map((entry) => {
      runningBalance += entry.debit || 0;
      runningBalance -= entry.credit || 0;
      return { ...entry, runningBalance };
    });

    return {
      accountDetails: { ...accountDetails, openingBalance },
      transactions: entriesWithBalance,
      pagination: { totalRecords: totalEntries, currentPage: page, totalPages },
      filters: { startDate: startDate || null, endDate: endDate || null },
      message: totalEntries === 0 ? 'No transactions found' : null,
    };
  }

  async getCriticalAccounts(companyId: string, codes: string | string[] = []) {
    const codeArray = Array.isArray(codes) ? codes : [codes];

    const accounts = await Promise.all(
      codeArray.map((code) => this.findAccountByCode(code, companyId)),
    );

    if (Array.isArray(codes)) {
      return accounts.reduce((acc, account, idx) => {
        acc[codeArray[idx]] = account;
        return acc;
      }, {});
    }
    return accounts[0];
  }

  async getAccountsUnderCode(code: string, companyId: string) {
    const mainAccount = await this.findAccountByCode(code, companyId);

    if (!mainAccount) {
      throw new Error(
        `Main account with hierarchy code ${code} not found for company ID ${companyId}`,
      );
    }

    return this.prisma.account.findMany({
      where: { parentAccountId: mainAccount.id },
    });
  }

  async getMainAccount(companyId: string) {
    return await this.prisma.account.findMany({
      where: {
        mainAccount: true,
        companyId: companyId,
      },
    });
  }

  async findAccountByCode(code: string, companyId: string) {
    const account = await this.prisma.account.findFirst({
      where: { code: code, companyId: companyId },
    });

    if (!account) {
      throw new Error(
        `Account with hierarchy code ${code} and companyId: ${companyId} not found`,
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
      parentAccountId: string; // The parent account must be passed for hierarchy
    },
  ) {
    const parentAccount = await this.prisma.account.findUnique({
      where: { id: data.parentAccountId },
    });

    if (!parentAccount) {
      throw new Error(
        `Parent account with ID ${data.parentAccountId} not found`,
      );
    }

    // Generate the new account code dynamically based on the parent account
    const maxSubAccount = await this.prisma.account.findFirst({
      where: { companyId, parentAccountId: data.parentAccountId },
      orderBy: { code: 'desc' },
    });

    const subCode = maxSubAccount
      ? (
          parseInt(maxSubAccount.code.split('.').pop() || '0', 10) + 1
        ).toString()
      : '1';

    const code = `${parentAccount.code}.${subCode}`;

    const accountData = {
      name: data.name,
      accountType: data.accountType,
      openingBalance: data.openingBalance || 0,
      currentBalance: data.openingBalance || 0,
      code,
      companyId,
      parentAccountId: data.parentAccountId,
    };

    return await this.prisma.account.create({
      data: accountData,
    });
  }

  async bulkCreate(createAccountDtos: CreateAccountDto[], companyId: string) {
    const results: any[] = [];

    createAccountDtos.sort((a, b) => a.code.length - b.code.length);

    await this.prisma.$transaction(async (prisma) => {
      for (const accountDto of createAccountDtos) {
        // Find or create parent account if parentAccountId is provided
        let parentAccount = null;

        if (accountDto.parentCode) {
          parentAccount = await prisma.account.findUnique({
            where: {
              code_companyId: {
                code: accountDto.parentCode,
                companyId: companyId,
              },
            },
          });

          if (!parentAccount) {
            // Throw an error if parentAccountId is invalid
            throw new Error(
              `Parent account with Code ${accountDto.parentCode} and companyId ${companyId} does not exist.`,
            );
          }
        }

        // Create the account
        const account = await prisma.account.create({
          data: {
            code: accountDto.code,
            parentAccountId: parentAccount ? parentAccount.id : null,
            mainAccount: accountDto.mainAccount,
            name: accountDto.name,
            nameAr: accountDto.nameAr,
            level: accountDto.level,
            accountType: accountDto.accountType,
            companyId: companyId,
          },
        });

        results.push(account);
      }
    });

    return results;
  }

  async delete(accountId: string, companyId: string) {
    await this.prisma.account.delete({
      where: { companyId: companyId, id: accountId },
    });
  }

  async updateCurrentBalance(
    accountId: string,
    debit: number,
    credit: number,
    companyId: string,
  ) {
    const netChange = (debit || 0) - (credit || 0);

    // Update the current account's balance
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        currentBalance: {
          increment: netChange,
        },
      },
    });

    // Propagate changes up the hierarchy
    let parentAccountId = (
      await this.prisma.account.findUnique({
        where: { id: accountId },
        select: { parentAccountId: true },
      })
    )?.parentAccountId;

    while (parentAccountId) {
      await this.prisma.account.update({
        where: { id: parentAccountId },
        data: {
          currentBalance: {
            increment: netChange,
          },
        },
      });

      parentAccountId = (
        await this.prisma.account.findUnique({
          where: { id: parentAccountId },
          select: { parentAccountId: true },
        })
      )?.parentAccountId;
    }
  }

  async getAllAccounts(companyId: string) {
    return this.prisma.account.findMany({ where: { companyId: companyId } });
  }

  async getLinkedAccounts(companyId: string, roles: string[]): Promise<any> {
    const linkedAccounts = await this.prisma.linkedAccount.findMany({
      where: {
        companyId: companyId,
        role: { in: roles }, // Ensure roles are correctly matched
      },
      include: { account: true }, // Include the associated account details
    });

    // Log the linked accounts to ensure the accounts are returned correctly
    console.log('Fetched linked accounts:', linkedAccounts);

    // Return the accounts as a map by role name
    const accountMap = linkedAccounts.reduce((acc, linkedAccount) => {
      acc[linkedAccount.role] = linkedAccount.account; // Map role to account
      return acc;
    }, {});

    return accountMap;
  }
}
