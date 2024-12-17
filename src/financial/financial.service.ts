import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client'; // Import Prisma enums
import { endOfDay } from 'date-fns';


@Injectable()
export class FinancialService {
    constructor(private prisma: PrismaService) { }

    async getCategoryDetails(companyId: string, categories: AccountType[], startDate: Date, endDate: Date) {
        const details = [];
        let totalNetBalance = 0;

        for (const category of categories) {
            const { _sum: debitSum } = await this.prisma.transaction.aggregate({
                where: {
                    companyId: companyId,
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
                    companyId: companyId,
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


    async getIncomeStatement(companyId: string, startDate: Date, endDate: Date) {
        const adjustedEndDate = endOfDay(endDate);
        const revenueCategories = [AccountType.REVENUE];
        const cogsCategories = [AccountType.TRADEEXPENSES];
        const operatingExpenseCategories = [AccountType.EXPENSE];
        const nonOperatingCategories = [AccountType.EXPENSE];

        // Fetch details for each section
        const revenueDetails = await this.getCategoryDetails(companyId, revenueCategories, startDate, adjustedEndDate);
        const cogsDetails = await this.getCategoryDetails(companyId, cogsCategories, startDate, adjustedEndDate);
        const operatingExpensesDetails = await this.getCategoryDetails(
            companyId,
            operatingExpenseCategories,
            startDate,
            adjustedEndDate,
        );
        const nonOperatingDetails = await this.getCategoryDetails(companyId, nonOperatingCategories, startDate, adjustedEndDate);

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
