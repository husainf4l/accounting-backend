import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, AccountType, Prisma } from '@prisma/client';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';

@Injectable()
export class ChartOfAccountsService {
    constructor(private prisma: PrismaService, private generalLedger: GeneralLedgerService) { }

    // Get all accounts
    async getAllAccounts(): Promise<Account[]> {
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
    async getAccountById(id: string): Promise<Account | null> {
        return this.prisma.account.findUnique({
            where: { id },
            include: {
                parentAccount: true,
                children: true,
            },
        });
    }

    async createAccount2(data: Prisma.AccountCreateInput): Promise<Account> {
        return this.prisma.account.create({
            data,
        });
    }

    // Update an account
    async updateAccount(
        id: string,
        data: Prisma.AccountUpdateInput,
    ): Promise<Account> {
        return this.prisma.account.update({
            where: { id },
            data,
        });
    }

    // Delete an account
    async deleteAccount(id: string): Promise<Account> {
        return this.prisma.account.delete({
            where: { id },
        });
    }

    async initializeChartOfAccounts(): Promise<string> {
        const existingAccounts = await this.prisma.account.findMany();
        if (existingAccounts.length > 0) {
            console.log('Chart of Accounts already initialized.');
            return 'Chart of Accounts already initialized.';
        }

        // Predefined chart of accounts data
        const accounts = [
            // Top-level accounts
            { hierarchyCode: '1', name: 'Assets', accountType: AccountType.ASSET, mainAccount: true, parentHierarchyCode: null },
            { hierarchyCode: '2', name: 'Liabilities', accountType: AccountType.LIABILITY, mainAccount: true, parentHierarchyCode: null },
            { hierarchyCode: '3', name: 'Equity', accountType: AccountType.EQUITY, mainAccount: true, parentHierarchyCode: null },
            { hierarchyCode: '4', name: 'Revenue', accountType: AccountType.REVENUE, mainAccount: true, parentHierarchyCode: null },
            { hierarchyCode: '5', name: 'Expenses', accountType: AccountType.EXPENSE, mainAccount: true, parentHierarchyCode: null },

            // Level 2 accounts under Assets
            { hierarchyCode: '1.1', name: 'Current Assets', accountType: AccountType.ASSET, mainAccount: true, parentHierarchyCode: '1' },
            { hierarchyCode: '1.2', name: 'Fixed Assets', accountType: AccountType.ASSET, mainAccount: true, parentHierarchyCode: '1' },

            // Level 3 accounts under Current Assets
            { hierarchyCode: '1.1.1', name: 'Cash', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1' },
            { hierarchyCode: '1.1.2', name: 'Bank Accounts', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1' },
            { hierarchyCode: '1.1.3', name: 'Accounts Receivable', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1' },
            { hierarchyCode: '1.1.4', name: 'Stock', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1' },

            // Level 3 accounts under Fixed Assets
            { hierarchyCode: '1.2.1', name: 'Land', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.2' },
            { hierarchyCode: '1.2.2', name: 'Buildings', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.2' },

            // Level 2 accounts under Liabilities
            { hierarchyCode: '2.1', name: 'Current Liabilities', accountType: AccountType.LIABILITY, mainAccount: true, parentHierarchyCode: '2' },
            { hierarchyCode: '2.2', name: 'Long-Term Liabilities', accountType: AccountType.LIABILITY, mainAccount: true, parentHierarchyCode: '2' },

            // Level 3 accounts under Current Liabilities
            { hierarchyCode: '2.1.1', name: 'Accounts Payable', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.1' },
            { hierarchyCode: '2.1.2', name: 'Sales Tax Payable', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.1' },
            { hierarchyCode: '2.1.3', name: 'Employees', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.1' },


            // Level 3 accounts under Long-Term Liabilities
            { hierarchyCode: '2.2.1', name: 'Loans Payable', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.2' },

            // Level 2 accounts under Equity
            { hierarchyCode: '3.1', name: 'Retained Earnings', accountType: AccountType.EQUITY, mainAccount: true, parentHierarchyCode: '3' },
            { hierarchyCode: '3.2', name: 'Capital Stock', accountType: AccountType.EQUITY, mainAccount: true, parentHierarchyCode: '3' },

            // Level 2 accounts under Revenue
            { hierarchyCode: '4.1', name: 'Sales Revenue', accountType: AccountType.REVENUE, mainAccount: false, parentHierarchyCode: '4' },
            { hierarchyCode: '4.2', name: 'Service Revenue', accountType: AccountType.REVENUE, mainAccount: false, parentHierarchyCode: '4' },

            // Level 2 accounts under Expenses
            { hierarchyCode: '5.1', name: 'Operating Expenses', accountType: AccountType.EXPENSE, mainAccount: false, parentHierarchyCode: '5' },
            { hierarchyCode: '5.2', name: 'Non-Operating Expenses', accountType: AccountType.EXPENSE, mainAccount: false, parentHierarchyCode: '5' },

            // Clients (sub-account of Accounts Receivable)
            { hierarchyCode: '1.1.3.1', name: 'Client A', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1.3' },
            { hierarchyCode: '1.1.3.2', name: 'Client B', accountType: AccountType.ASSET, mainAccount: false, parentHierarchyCode: '1.1.3' },

            // Suppliers (sub-account of Accounts Payable)
            { hierarchyCode: '2.1.1.1', name: 'Supplier A', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.1.1' },
            { hierarchyCode: '2.1.1.2', name: 'Supplier B', accountType: AccountType.LIABILITY, mainAccount: false, parentHierarchyCode: '2.1.1' },
        ];

        // Step 2: Create all accounts
        for (const account of accounts) {
            const parentAccount = accounts.find((acc) => acc.hierarchyCode === account.parentHierarchyCode);

            await this.prisma.account.create({
                data: {
                    hierarchyCode: account.hierarchyCode,
                    name: account.name,
                    accountType: account.accountType,
                    mainAccount: account.mainAccount,
                    parentAccountId: parentAccount ? (await this.prisma.account.findUnique({ where: { hierarchyCode: parentAccount.hierarchyCode } }))?.id : null,
                    currentBalance: 0,
                },
            });
        }

        return 'Chart of Accounts Initialized Successfully with Stock, Clients, and Suppliers';
    }


}
