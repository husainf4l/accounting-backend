import { Injectable } from '@nestjs/common';
import { GeneralLedgerService } from 'src/general-ledger/general-ledger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseISO, formatISO } from 'date-fns';


@Injectable()
export class AccountsService {
    constructor(private readonly prisma: PrismaService, private readonly generalLedgerService: GeneralLedgerService) { }

    async getAccountStatement(accountId: string, page = 1, limit = 10, startDate?: string, endDate?: string) {
        const offset = (page - 1) * limit;

        // Parse dates
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
                (balance, transaction) => balance + (transaction.debit || 0) - (transaction.credit || 0),
                0
            );
        }

        // Fetch transactions within the date range
        const transactionFilters: any = { accountId };
        if (startDateISO) transactionFilters.createdAt = { gte: new Date(startDateISO) };
        if (endDateISO) transactionFilters.createdAt = { ...transactionFilters.createdAt, lte: new Date(endDateISO) };

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
}

