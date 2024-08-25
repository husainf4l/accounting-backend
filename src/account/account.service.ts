import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) { }

    async create(createAccountDto: CreateAccountDto) {
        return this.prisma.account.create({
            data: {
                name: createAccountDto.name,
                type: createAccountDto.type,
                number: createAccountDto.number,
                balance: createAccountDto.balance,
                openingBalance: createAccountDto.openingBalance ?? 0, // Default to 0 if not provided
                currency: createAccountDto.currency,
                subtype: createAccountDto.subtype, // Can be undefined if not provided
                parentId: createAccountDto.parentId, // Can be undefined if not provided
                companyId: createAccountDto.companyId,
            },
        });
    }

    async findAll() {
        return this.prisma.account.findMany();
    }

    async findOne(id: string) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }

    async update(id: string, updateAccountDto: UpdateAccountDto) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return this.prisma.account.update({
            where: { id },
            data: {
                ...updateAccountDto, // Spread the fields from the update DTO
            },
        });
    }

    async remove(id: string) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return this.prisma.account.delete({
            where: { id },
        });
    }
}
