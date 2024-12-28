import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLinkingAccountDto } from './dto/create-linking-account.dto';
import { UpdateLinkingAccountDto } from './dto/update-linking-account.dto';

@Injectable()
export class LinkingAccountsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(companyId: string, dto: CreateLinkingAccountDto) {
        // Ensure the account exists
        const account = await this.prisma.account.findUnique({
            where: { id: dto.accountId },
        });
        if (!account) throw new NotFoundException('Account not found');

        // Create the linking account
        return this.prisma.linkedAccount.create({
            data: {
                role: dto.role,
                accountId: dto.accountId,
                companyId,
                description: dto.description || null,
            },
        });
    }

    async findAll(companyId: string) {
        return this.prisma.linkedAccount.findMany({
            where: { companyId },
            include: { account: true },
        });
    }

    async findOne(id: string, companyId: string) {
        const linkingAccount = await this.prisma.linkedAccount.findFirst({
            where: { id, companyId },
            include: { account: true },
        });
        if (!linkingAccount) throw new NotFoundException('Linking Account not found');
        return linkingAccount;
    }

    async update(id: string, companyId: string, dto: UpdateLinkingAccountDto) {
        // Ensure the linking account exists
        const linkingAccount = await this.findOne(id, companyId);

        // Update the linking account
        return this.prisma.linkedAccount.update({
            where: { id },
            data: {
                role: dto.role || linkingAccount.role,
                accountId: dto.accountId || linkingAccount.accountId,
                description: dto.description || linkingAccount.description,
            },
        });
    }

    async remove(id: string, companyId: string) {
        const linkingAccount = await this.findOne(id, companyId);
        return this.prisma.linkedAccount.delete({ where: { id: linkingAccount.id } });
    }
}
