import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { Prisma } from '@prisma/client';

@Controller('journal-entry')
export class JournalEntryController {
    constructor(private readonly journalEntryService: JournalEntryService) { }

    @Post()
    async createJournalEntry(
        @Req() req: any,
        @Body()
        body: {
            date: Date;
            transactions: { accountId: string; amount: number; currency?: string; notes?: string }[];
        }
    ) {
        const { date, transactions } = body;
        const companyId = req.user.companyId;

        if (!date || !transactions || transactions.length === 0) {
            throw new Error('Date and transactions are required.');
        }

        const totalDebit = transactions.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0);
        const totalCredit = transactions.reduce((sum, t) => (t.amount < 0 ? sum + Math.abs(t.amount) : sum), 0);

        if (totalDebit !== totalCredit) {
            throw new Error('Transactions are unbalanced. Debit and Credit totals must match.');
        }

        // Transform transactions to match the expected structure
        const transformedTransactions = transactions.map((t) => ({
            accountId: t.accountId,
            debit: t.amount > 0 ? t.amount : null,
            credit: t.amount < 0 ? Math.abs(t.amount) : null,
            currency: t.currency || 'JO',
            notes: t.notes || null,
            companyId: companyId, // Include the company ID
        }));

        return this.journalEntryService.createJournalEntry(companyId, {
            date,
            transactions: transformedTransactions, // Use the transformed structure
        });
    }





    @Get()
    async getAllJournalEntries() {
        return this.journalEntryService.getAllJournalEntries();
    }

    @Get(':id')
    async getJournalEntryById(@Param('id') id: string) {
        return this.journalEntryService.getJournalEntryById(id);
    }
}
