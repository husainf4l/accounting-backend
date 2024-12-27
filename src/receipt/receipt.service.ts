import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { ClientsService } from 'src/clients/clients.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReceiptDto } from './dto/CreateReceiptDto';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly journalService: JournalEntryService,
    private readonly employeeService: EmployeesService,
    private readonly accountsService: AccountsService,
    private readonly prisma: PrismaService,
  ) { }

  async getReceiptData(companyId: string) {
    const [
      clients,
      accountManagers,
      cashAccounts,
      chequeAccounts,
      receiptNumber,
    ] = await Promise.all([
      this.clientsService.getClients(companyId),
      this.employeeService.getAccountManagers(companyId),
      this.accountsService.getAccountsUnderCode('1.1.1', companyId),
      this.accountsService.getAccountsUnderCode('1.1.5', companyId),

      this.getNextReceiptNumber(),
    ]);

    return {
      clients,
      accountManagers,
      cashAccounts,
      chequeAccounts,
      receiptNumber,
    };
  }

  private async getNextReceiptNumber() {
    const lastReceipt = await this.prisma.receipt.findFirst({
      orderBy: { receiptNumber: 'desc' },
      select: { receiptNumber: true },
    });

    return (lastReceipt?.receiptNumber || 0) + 1;
  }

  async createReceipt(createReceiptDto: CreateReceiptDto, companyId: string) {
    const {
      cheques,
      clientId,
      accountManagerId,
      TransactionAccountId,
      ...receiptData
    } = createReceiptDto;

    console.log(createReceiptDto);

    const customer = await this.prisma.customer.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Fetch the last receipt number and increment it
    const lastReceipt = await this.prisma.receipt.findFirst({
      orderBy: { receiptNumber: 'desc' },
      select: { receiptNumber: true },
    });

    const nextReceiptNumber = lastReceipt ? lastReceipt.receiptNumber + 1 : 1;

    const receipt = await this.prisma.receipt.create({
      data: {
        ...receiptData,
        companyId: companyId,
        accountId: clientId,
        customerId: customer.id,
        accountManagerId: accountManagerId || null, // Optional, can be null
        TransactionAccountId: TransactionAccountId || null, // Optional, can be null
        receiptNumber: nextReceiptNumber, // Use the incremented receipt number
        chequeDetails: {
          create: cheques.map((cheque) => ({
            companyId: companyId,
            chequeNumber: cheque.chequeNumber,
            bankName: cheque.bankName,
            amount: cheque.amount,
            date: new Date(cheque.date),
          })),
        },
      },
      include: {
        chequeDetails: true,
        customer: true,
        accountManager: true,
      },
    });
    // Prepare transaction data for the journal entry
    const transactions = [
      {
        accountId: TransactionAccountId, // Debit Cash Account
        debit: receipt.totalAmount, // Debit the total amount
        credit: null,
        currency: 'JO',
        notes: `Receipt payment for client ${clientId}`,
        companyId: companyId,
      },
      {
        accountId: clientId, // Credit Client Account
        debit: null,
        credit: receipt.totalAmount, // Credit the total amount
        currency: 'JO',
        notes: `Payment received from client ${clientId}`,
        companyId: companyId,
      },
    ];

    const journalEntry = await this.journalService.createJournalEntry(
      companyId,
      {
        date: new Date(),
        transactions: transactions,
      },
    );

    return receipt;
  }

  async getReceiptList(companyId) {
    return this.prisma.receipt.findMany({
      where: { companyId },
      include: { customer: true },
    });
  }
}
