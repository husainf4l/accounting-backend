import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createCustomerDto: CreateCustomerDto) {
        const { companyId, ...rest } = createCustomerDto;

        return this.prisma.customer.create({
            data: {
                ...rest,
                company: { connect: { id: companyId } },
            },
        });
    }

    async findAll() {
        return this.prisma.customer.findMany({
            include: {
                company: true,
                invoices: true,
                Contract: true,
            },
        });
    }

    async findOne(id: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                company: true,
                invoices: true,
                Contract: true,
            },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        return customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const { companyId, ...rest } = updateCustomerDto;

        return this.prisma.customer.update({
            where: { id },
            data: {
                ...rest,
                ...(companyId ? { company: { connect: { id: companyId } } } : {}),
            },
        });
    }

    async remove(id: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        return this.prisma.customer.delete({
            where: { id },
        });
    }
}
