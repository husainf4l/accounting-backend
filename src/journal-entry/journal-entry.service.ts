import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JournalEntryService {
    constructor(private readonly prisma: PrismaService) { }






    async createJournalEntry(data: {
        date: Date;
        transactions: { accountId: string; debit?: number; credit?: number; currency?: string; notes?: string }[];
    }) {
        const { date, transactions } = data;

        // Ensure date is in ISO-8601 format
        const isoDate = new Date(date).toISOString();

        // Calculate total debit and credit
        const totalDebit = transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
        const totalCredit = transactions.reduce((sum, t) => sum + (t.credit || 0), 0);

        // Check if debits and credits are balanced
        if (totalDebit !== totalCredit) {
            throw new BadRequestException('Total debit and credit must be equal!');
        }

        // Prepare transaction data
        const transactionData = transactions.map((transaction) => ({
            accountId: transaction.accountId,
            debit: transaction.debit ?? null, // Use `null` if `undefined`
            credit: transaction.credit ?? null, // Use `null` if `undefined`
            currency: transaction.currency || 'JOD',
            notes: transaction.notes || null,
        }));

        // Create the journal entry
        return this.prisma.journalEntry.create({
            data: {
                date: isoDate, // Pass the ISO-formatted date
                transactions: {
                    create: transactionData, // Attach the prepared transaction data
                },
            },
        });
    }




    async getAllJournalEntries() {
        return this.prisma.journalEntry.findMany({
            include: {
                transactions: {
                    include: {
                        account: true,
                    },
                },
            },
        });
    }

    async getJournalEntryById(id: string) {
        return this.prisma.journalEntry.findUnique({
            where: { id },
            include: {
                transactions: {
                    include: {
                        account: true,
                    },
                },
            },
        });
    }
}
