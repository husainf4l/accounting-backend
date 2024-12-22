import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CreateJournalDto } from './dto/create-journal.dto';

@Controller('journal-entry')
export class JournalEntryController {
  constructor(private readonly journalEntryService: JournalEntryService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createJournalEntry(
    @Req() req: any,
    @Body()
    body: {
      date: Date;
      transactions: {
        accountId: string;
        debit: number;
        credit: number;
        currency?: string;
        notes?: string;
      }[];
    },
  ) {
    const { date, transactions } = body;
    const companyId = req.user.companyId;

    // Validate input
    if (!date || !transactions || transactions.length === 0) {
      throw new Error('Date and transactions are required.');
    }

    // Calculate total debit and credit
    const totalDebit = transactions.reduce(
      (sum, t) => sum + (t.debit || 0),
      0,
    );
    const totalCredit = transactions.reduce(
      (sum, t) => sum + (t.credit || 0),
      0,
    );

    // Check if debits and credits are balanced
    if (totalDebit !== totalCredit) {
      throw new Error(
        'Transactions are unbalanced. Debit and Credit totals must match.',
      );
    }

    // Transform transactions to match the expected structure
    const transformedTransactions = transactions.map((t) => ({
      accountId: t.accountId,
      debit: t.debit || null, // Use provided debit or null
      credit: t.credit || null, // Use provided credit or null
      currency: t.currency || 'JOD', // Default to JOD
      notes: t.notes || null,
      companyId: companyId, // Include company ID
    }));

    // Log for debugging
    console.log('Transformed Transactions:', transformedTransactions);

    // Pass data to the service
    return this.journalEntryService.createJournalEntry(companyId, {
      date,
      transactions: transformedTransactions,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllJournalEntries(@Req() req: any) {
    const companyId = req.user.companyId;

    return this.journalEntryService.getAllJournalEntries(companyId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getJournalEntryById(@Param('id') id: string) {
    return this.journalEntryService.getJournalEntryById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('bulk')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBulk(@Req() req: any, @Body() entries: CreateJournalDto[]) {
    const companyId = req.user.companyId;

    if (!companyId) {
      throw new BadRequestException('Company ID is missing from the user payload.');
    }

    return this.journalEntryService.createBulk(entries, companyId);
  }


}
