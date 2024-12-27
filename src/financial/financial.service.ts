import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client'; // Import Prisma enums
import { endOfDay } from 'date-fns';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) { }

  /**
   * Fetch aggregate details for a given set of categories within a date range.
   */
  private async fetchCategoryAggregates(
    companyId: string,
    categories: AccountType[],
    startDate: Date,
    endDate: Date,
  ) {
    const debitCreditSums = await this.prisma.transaction.groupBy({
      by: ['accountId'],
      where: {
        companyId,
        account: { accountType: { in: categories } },
        journalEntry: {
          date: {
            gte: startDate,
            lte: endOfDay(endDate),
          },
        },
      },
      _sum: {
        debit: true,
        credit: true,
      },
    });

    const totalDebit = debitCreditSums.reduce(
      (sum, entry) => sum + (entry._sum.debit || 0),
      0,
    );
    const totalCredit = debitCreditSums.reduce(
      (sum, entry) => sum + (entry._sum.credit || 0),
      0,
    );

    const details = debitCreditSums.map((entry) => {
      const accountNetBalance =
        (entry._sum.credit || 0) - (entry._sum.debit || 0);
      return {
        accountId: entry.accountId,
        totalDebit: entry._sum.debit || 0,
        totalCredit: entry._sum.credit || 0,
        netBalance: accountNetBalance,
      };
    });

    return {
      details,
      totalDebit,
      totalCredit,
      totalNetBalance: totalCredit - totalDebit,
    };
  }

  /**
   * Fetch category details and summarize for income statement sections.
   */
  private async getCategoryDetails(
    companyId: string,
    categories: AccountType[],
    startDate: Date,
    endDate: Date,
    positiveBalance = false,
  ) {
    const aggregates = await this.fetchCategoryAggregates(
      companyId,
      categories,
      startDate,
      endDate,
    );

    const netBalance = positiveBalance
      ? Math.abs(aggregates.totalNetBalance)
      : aggregates.totalNetBalance;

    return {
      ...aggregates,
      totalNetBalance: netBalance,
    };
  }

  /**
   * Generate an income statement for a given company and date range.
   */
  async getIncomeStatement(companyId: string, startDate: Date, endDate: Date) {
    const revenueCategories = [AccountType.REVENUE];
    const cogsCategories = [AccountType.EXPENSE]; // Adjust to only COGS accounts if needed
    const operatingExpenseCategories = [AccountType.EXPENSE]; // Adjust to only operating accounts if needed
    const nonOperatingCategories = [AccountType.EXPENSE]; // Adjust for non-operating accounts if needed

    const [revenueDetails, cogsDetails, operatingExpensesDetails, nonOperatingDetails] =
      await Promise.all([
        this.getCategoryDetails(companyId, revenueCategories, startDate, endDate),
        this.getCategoryDetails(companyId, cogsCategories, startDate, endDate, true),
        this.getCategoryDetails(
          companyId,
          operatingExpenseCategories,
          startDate,
          endDate,
          true,
        ),
        this.getCategoryDetails(companyId, nonOperatingCategories, startDate, endDate),
      ]);

    const totalRevenue = revenueDetails.totalNetBalance;
    const totalCOGS = cogsDetails.totalNetBalance;
    const grossProfit = totalRevenue - totalCOGS;

    const totalOperatingExpenses = operatingExpensesDetails.totalNetBalance;
    const operatingProfit = grossProfit - totalOperatingExpenses;

    const totalNonOperating = nonOperatingDetails.totalNetBalance;
    const netProfitOrLoss = operatingProfit + totalNonOperating;

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
