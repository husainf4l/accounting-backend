import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client'; // Import Prisma enums

@Injectable()
export class FinancialService {
    constructor(private prisma: PrismaService) { }

    async getCategoryDetails(categories: AccountType[], startDate: Date, endDate: Date) {
        const details = [];
        let totalNetBalance = 0;

        for (const category of categories) {
            const { _sum: debitSum } = await this.prisma.transaction.aggregate({
                where: {
                    account: { accountType: category },
                    journalEntry: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                _sum: { debit: true },
            });

            const { _sum: creditSum } = await this.prisma.transaction.aggregate({
                where: {
                    account: { accountType: category },
                    journalEntry: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                _sum: { credit: true },
            });

            const totalDebit = debitSum.debit || 0;
            const totalCredit = creditSum.credit || 0;
            const netBalance = totalCredit - totalDebit;

            details.push({
                category,
                totalDebit,
                totalCredit,
                netBalance: category === AccountType.REVENUE ? netBalance : Math.abs(netBalance),
            });

            totalNetBalance += netBalance;
        }

        return { details, totalNetBalance };
    }

    /**
     * Generate a detailed income statement.
     */
    async getIncomeStatement(startDate: Date, endDate: Date) {
        const revenueCategories = [AccountType.REVENUE];
        const cogsCategories = [AccountType.TRADEEXPENSES];
        const operatingExpenseCategories = [AccountType.EXPENSE];
        const nonOperatingCategories = [AccountType.EXPENSE];

        // Fetch details for each section
        const revenueDetails = await this.getCategoryDetails(revenueCategories, startDate, endDate);
        const cogsDetails = await this.getCategoryDetails(cogsCategories, startDate, endDate);
        const operatingExpensesDetails = await this.getCategoryDetails(
            operatingExpenseCategories,
            startDate,
            endDate,
        );
        const nonOperatingDetails = await this.getCategoryDetails(nonOperatingCategories, startDate, endDate);

        // Adjust values for calculations
        const totalRevenue = revenueDetails.totalNetBalance;
        const totalCOGS = Math.abs(cogsDetails.totalNetBalance); // Ensure COGS is positive
        const grossProfit = totalRevenue - totalCOGS;

        const totalOperatingExpenses = Math.abs(operatingExpensesDetails.totalNetBalance);
        const operatingProfit = grossProfit - totalOperatingExpenses;

        const totalNonOperating = nonOperatingDetails.totalNetBalance;
        const netProfitOrLoss = operatingProfit + totalNonOperating;

        // Return a detailed income statement
        return {
            totalRevenue,
            totalCOGS,
            grossProfit,
            totalOperatingExpenses,
            operatingProfit,
            totalNonOperating,
            netProfitOrLoss,
            breakdown: {
                revenues: revenueDetails.details,
                costOfGoodsSold: cogsDetails.details,
                operatingExpenses: operatingExpensesDetails.details,
                nonOperatingItems: nonOperatingDetails.details,
            },
        };
    }
}
