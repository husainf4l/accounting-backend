import { Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { ClientsService } from 'src/clients/clients.service';
import { EmployeesService } from 'src/employees/employees.service';
import { JournalEntryService } from 'src/journal-entry/journal-entry.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReceiptService {

    constructor(
        private readonly clientsService: ClientsService,
        private readonly journalService: JournalEntryService,
        private readonly employeeService: EmployeesService,
        private readonly accountsService: AccountsService,
        private readonly prisma: PrismaService,

    ) { }


    async getReceiptData() {
        const [clients, accountManagers, receiptNumber] = await Promise.all([
            this.clientsService.getClients(),
            this.employeeService.getAccountManagers(),
            this.getNextReceiptNumber()

        ]);

        return { clients, accountManagers, receiptNumber };
    }


    private async getNextReceiptNumber() {
        const lastReceipt = await this.prisma.receipt.findFirst({
            orderBy: { receiptNumber: 'desc' },
            select: { receiptNumber: true },
        });

        return (lastReceipt?.receiptNumber || 0) + 1;
    }


}
