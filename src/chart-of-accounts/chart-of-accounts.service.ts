import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust based on your project structure
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class ChartOfAccountsService {
    constructor(private prisma: PrismaService) { }

    // Get all accounts
    async getAllAccounts(): Promise<Account[]> {
        return this.prisma.account.findMany({
            include: {
                parentAccount: true,
                children: true,
            },
            orderBy: [
                {
                    accountNumber: 'asc'
                },
                {
                    name: 'asc'
                }
            ]
        });
    }

    // Get a single account by ID
    async getAccountById(id: string): Promise<Account | null> {
        return this.prisma.account.findUnique({
            where: { id },
            include: {
                parentAccount: true,
                children: true,
            },
        });
    }

    // Create a new account
    async createAccount(data: Prisma.AccountCreateInput): Promise<Account> {
        return this.prisma.account.create({
            data,
        });
    }

    // Update an account
    async updateAccount(
        id: string,
        data: Prisma.AccountUpdateInput,
    ): Promise<Account> {
        return this.prisma.account.update({
            where: { id },
            data,
        });
    }

    // Delete an account
    async deleteAccount(id: string): Promise<Account> {
        return this.prisma.account.delete({
            where: { id },
        });
    }
}
