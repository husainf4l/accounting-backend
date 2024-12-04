import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralLedgerService {
    constructor(private prisma: PrismaService) { }



    @Cron('0 * * * *')
    async handleCron() {
        console.log('Running scheduled ledger update...');
        await this.updateGeneralLedger();
    }
    async updateGeneralLedger(): Promise<void> {
        const accounts = await this.prisma.account.findMany({
            include: { children: true }, // Fetch child accounts
            orderBy: { hierarchyCode: 'desc' }, // Start with the deepest level first
        });

        // Map to store account balances
        const accountBalances = new Map<string, number>();

        for (const account of accounts) {
            const balance = await this.calculateAccountBalance(account, accountBalances);

            // Update the balance map
            accountBalances.set(account.id, balance);

            // Update the account in the database
            await this.prisma.account.update({
                where: { id: account.id },
                data: { currentBalance: balance },
            });
        }
        console.log('General ledger updated successfully')
    }

    private async calculateAccountBalance(account: any, accountBalances: Map<string, number>): Promise<number> {
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
                const childBalance = await this.calculateAccountBalance(child, accountBalances);
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
        return directBalance + childBalances.reduce((sum, balance) => sum + balance, 0);
    }



    async getStoredBalance(accountId: string): Promise<number> {
        const ledgerEntry = await this.prisma.generalLedger.findUnique({
            where: { accountId },
        });
        return ledgerEntry?.balance || 0;
    }


}
