import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) { }

    async create(createTransactionDto: CreateTransactionDto) {
        const transaction = await this.prisma.transaction.create({
            data: {
                description: createTransactionDto.description,
                date: createTransactionDto.date,
                totalAmount: createTransactionDto.totalAmount,
                currency: createTransactionDto.currency,
                accountId: createTransactionDto.accountId,
                companyId: createTransactionDto.companyId,
                createdBy: createTransactionDto.createdBy,
                updatedBy: createTransactionDto.updatedBy,
                lineItems: {  // Correct relation name
                    create: createTransactionDto.lineItems.map(item => ({
                        description: item.description,
                        amount: item.amount,
                        debit: item.debit,
                        accountId: item.accountId,
                    })),
                },
                taxes: {  // Correct relation name
                    create: createTransactionDto.taxes.map(tax => ({
                        amount: tax.amount,
                        taxCodeId: tax.taxCodeId,
                    })),
                },
                exchangeRateId: createTransactionDto.exchangeRateId,
            },
            include: {
                lineItems: true,  // Correct relation name
                taxes: true,      // Correct relation name
            },
        });

        return transaction;
    }



    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                lineItems: true,  // Correct relation name
                taxes: true,      // Correct relation name
            },
        });
    }

    async findOne(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                lineItems: true,  // Correct relation name
                taxes: true,      // Correct relation name
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }


    async update(id: string, updateTransactionDto: CreateTransactionDto) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        const updatedTransaction = await this.prisma.transaction.update({
            where: { id },
            data: {
                description: updateTransactionDto.description,
                date: updateTransactionDto.date,
                totalAmount: updateTransactionDto.totalAmount,
                currency: updateTransactionDto.currency,
                accountId: updateTransactionDto.accountId,
                companyId: updateTransactionDto.companyId,
                updatedBy: updateTransactionDto.updatedBy,
                lineItems: {  // Correct relation name
                    deleteMany: {}, // Clear existing line items
                    create: updateTransactionDto.lineItems.map(item => ({
                        description: item.description,
                        amount: item.amount,
                        debit: item.debit,
                        accountId: item.accountId,
                    })),
                },
                taxes: {  // Correct relation name
                    deleteMany: {}, // Clear existing taxes
                    create: updateTransactionDto.taxes.map(tax => ({
                        amount: tax.amount,
                        taxCodeId: tax.taxCodeId,
                    })),
                },
                exchangeRateId: updateTransactionDto.exchangeRateId,
            },
            include: {
                lineItems: true,  // Correct relation name
                taxes: true,      // Correct relation name
            },
        });

        return updatedTransaction;
    }


    async remove(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                lineItems: true,  // Correct relation name
                taxes: true,      // Correct relation name
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return this.prisma.transaction.delete({
            where: { id },
        });
    }

}
