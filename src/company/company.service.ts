import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) { }

    async create(createCompanyDto: CreateCompanyDto) {
        return this.prisma.company.create({
            data: {
                name: createCompanyDto.name,
                address: createCompanyDto.address,
                phone: createCompanyDto.phone,
                email: createCompanyDto.email,
                taxId: createCompanyDto.taxId,
                fiscalYearStart: createCompanyDto.fiscalYearStart,
                fiscalYearEnd: createCompanyDto.fiscalYearEnd,
                currency: createCompanyDto.currency,
            },
        });
    }


    async findAll() {
        return this.prisma.company.findMany();
    }

    async findOne(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new NotFoundException('Company not found');
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new NotFoundException('Company not found');
        }
        return this.prisma.company.update({
            where: { id },
            data: {
                ...updateCompanyDto
            },
        });
    }

    async remove(id: string) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            throw new NotFoundException('Company not found');
        }
        return this.prisma.company.delete({
            where: { id },
        });
    }
}
