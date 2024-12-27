import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Creates a new client and associates it with Accounts Receivable.
   */
  async createClient(companyId: string, data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    openingBalance?: number;
  }): Promise<any> {
    console.log('Starting createClient function');

    // Fetch Accounts Receivable account
    const accountsReceivable = await this.prisma.account.findFirst({
      where: {
        companyId,
        code: '1.1.3', // Accounts Receivable code
      },
      select: { id: true },
    });

    if (!accountsReceivable) {
      console.error('Accounts Receivable account not found');
      throw new Error('Accounts Receivable account not found');
    }

    // Set default opening balance if not provided
    const openingBalance = data.openingBalance || 0.0;

    try {
      // Create the client record
      const clientDetails = await this.prisma.customer.create({
        data: {
          companyId,
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          openingBalance,
          currentBalance: openingBalance,
        },
      });

      // Record the opening balance as a transaction in Accounts Receivable
      if (openingBalance !== 0) {
        // Determine if the opening balance is a debit or a credit
        const isDebit = openingBalance > 0;
        const absoluteOpeningBalance = Math.abs(openingBalance); // Always use a positive value

        // Create a Journal Entry for the opening balance
        const journalEntry = await this.prisma.journalEntry.create({
          data: {
            companyId,
            date: new Date(), // Use the current date or a provided one
            transactions: {
              create: [
                {
                  account: { connect: { id: accountsReceivable.id } }, // Link to Accounts Receivable
                  customer: { connect: { id: clientDetails.id } },     // Link to the Customer
                  debit: isDebit ? absoluteOpeningBalance : 0.0,       // Debit if opening balance is positive
                  credit: isDebit ? 0.0 : absoluteOpeningBalance,      // Credit if opening balance is negative
                  companyId,
                  notes: `Opening balance for client ${data.name}`,     // Add clear notes for traceability
                },
              ],
            },
          },
        });

        console.log('Journal Entry Created:', journalEntry);
      }



      return {
        customer: clientDetails,
        accountsReceivable,
      };
    } catch (error) {
      console.error('Error during client creation:', error.message);
      throw error;
    }
  }


  async getClients(companyId: string) {
    console.log('Fetching clients for company');
    return this.prisma.customer.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        name: true,
        currentBalance: true,
        openingBalance: true,
        phone: true,
        email: true,
        address: true,
      },
    });
  }

  async ensureCustomerExists(clientId: string, clientName: string, companyId: string) {
    console.log('Checking if customer exists');
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id: clientId },
    });

    if (existingCustomer) {
      console.log('Customer exists:', existingCustomer);
      return existingCustomer;
    }

    console.log('Customer does not exist, creating a new one');
    return this.prisma.customer.create({
      data: {
        name: clientName,
        companyId,
        openingBalance: 0.0,
        currentBalance: 0.0,
      },
    });
  }
}
