import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { Prisma } from '@prisma/client';

@Controller('journal-entry')
export class JournalEntryController {
    constructor(private readonly journalEntryService: JournalEntryService) { }

    @Post()
    async createJournalEntry(@Body() body: {
        date: Date;
        transactions: { accountId: string; amount: number; currency?: string; notes?: string }[];
    }) {
        const { date, transactions } = body;

        if (!date || !transactions || transactions.length === 0) {
            throw new Error('Date and transactions are required.');
        }

        const totalDebit = transactions.reduce((sum, t) => (t.amount > 0 ? sum + t.amount : sum), 0);
        const totalCredit = transactions.reduce((sum, t) => (t.amount < 0 ? sum + Math.abs(t.amount) : sum), 0);

        if (totalDebit !== totalCredit) {
            throw new Error('Transactions are unbalanced. Debit and Credit totals must match.');
        }

        return this.journalEntryService.createJournalEntry(body);
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
