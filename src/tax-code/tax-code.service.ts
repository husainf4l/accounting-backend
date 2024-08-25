import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxCodeDto } from './dto/create-tax-code.dto';
import { UpdateTaxCodeDto } from './dto/update-tax-code.dto';

@Injectable()
export class TaxCodeService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createTaxCodeDto: CreateTaxCodeDto) {
        const { companyId, ...rest } = createTaxCodeDto;

        return this.prisma.taxCode.create({
            data: {
                ...rest,
                company: { connect: { id: companyId } },
            },
        });
    }

    async findAll() {
        return this.prisma.taxCode.findMany({
            include: {
                company: true,
            },
        });
    }

    async findOne(id: string) {
        const taxCode = await this.prisma.taxCode.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });

        if (!taxCode) {
            throw new NotFoundException('Tax code not found');
        }

        return taxCode;
    }

    async update(id: string, updateTaxCodeDto: UpdateTaxCodeDto) {
        const taxCode = await this.prisma.taxCode.findUnique({
            where: { id },
        });

        if (!taxCode) {
            throw new NotFoundException('Tax code not found');
        }

        const { companyId, ...rest } = updateTaxCodeDto;

        return this.prisma.taxCode.update({
            where: { id },
            data: {
                ...rest,
                ...(companyId ? { company: { connect: { id: companyId } } } : {}),
            },
        });
    }

    async remove(id: string) {
        const taxCode = await this.prisma.taxCode.findUnique({
            where: { id },
        });

        if (!taxCode) {
            throw new NotFoundException('Tax code not found');
        }

        return this.prisma.taxCode.delete({
            where: { id },
        });
    }
}
