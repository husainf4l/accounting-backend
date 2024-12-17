import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateHierarchyCode } from '../utilties/hierarchy.util';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) { }

  async createClient(companyId: string, data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<any> {
    console.log('Starting createClient function');

    // Fetch Accounts Receivable account
    const accountsReceivable = await this.prisma.account.findFirst({
      where: {
        companyId,
        hierarchyCode: '1.1.3'
      },
      select: { id: true },
    });
    console.log('Accounts Receivable:', accountsReceivable);

    if (!accountsReceivable) {
      console.error('Accounts Receivable account not found');
      throw new Error('Accounts Receivable account not found');
    }

    // Generate hierarchy code for the new client account
    console.log('Generating hierarchy code');
    const hierarchyCode = await generateHierarchyCode(
      this.prisma,
      accountsReceivable.id,
      companyId
    );
    console.log('Generated hierarchy code:', hierarchyCode);

    try {
      // Create the new account for the client
      console.log('Creating new account for the client');
      const newAccount = await this.prisma.account.create({
        data: {
          name: data.name,
          companyId: companyId,
          hierarchyCode,
          accountType: 'ASSET',
          openingBalance: 0.0,
          currentBalance: 0.0,
          parentAccountId: accountsReceivable.id,
        },
      });
      console.log('New Account:', newAccount);

      console.log('Creating client details');
      const clientDetails = await this.prisma.customer.create({
        data: {
          companyId: companyId,
          accountId: newAccount.id,
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
        },
      });
      console.log('Client Details:', clientDetails);

      return {
        account: newAccount,
        details: clientDetails,
      };
    } catch (error) {
      console.error('Error during client creation:', error.message);
      throw error;
    }
  }


  async getClients(companyId: string) {
    const accountsReceivable = await this.prisma.account.findFirst({
      where: {
        companyId,
        hierarchyCode: '1.1.3'
      },
    });

    if (!accountsReceivable) {
      throw new Error('Accounts Receivable account not found');
    }

    return this.prisma.account.findMany({
      where: {
        companyId: companyId,
        parentAccountId: accountsReceivable.id,
      },
      select: {
        id: true,
        name: true,
        currentBalance: true,
        hierarchyCode: true,
        companyId: true,
      },
    });
  }

  async ensureCustomerExists(clientId: string, clientName: string, companyId: string) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { accountId: clientId },
    });

    if (existingCustomer) return existingCustomer;

    return this.prisma.customer.create({
      data: { name: clientName, accountId: clientId, companyId },
    });
  }
}
