import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createInvoiceDto: CreateInvoiceDto) {
        const { lineItems, taxes, ...rest } = createInvoiceDto;

        return this.prisma.invoice.create({
            data: {
                ...rest,
                lineItems: {
                    create: lineItems,
                },
                taxes: {
                    create: taxes,
                },
            },
            include: {
                lineItems: true,
                taxes: true,
            },
        });
    }

    async findAll() {
        return this.prisma.invoice.findMany({
            include: {
                lineItems: true,
                taxes: true,
            },
        });
    }

    async findOne(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                lineItems: true,
                taxes: true,
            },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }

    async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
        const { lineItems, taxes, ...rest } = updateInvoiceDto;

        const existingInvoice = await this.prisma.invoice.findUnique({
            where: { id },
        });

        if (!existingInvoice) {
            throw new NotFoundException('Invoice not found');
        }

        return this.prisma.invoice.update({
            where: { id },
            data: {
                ...rest,
                lineItems: {
                    deleteMany: {}, // Delete existing line items
                    create: lineItems, // Add new line items
                },
                taxes: {
                    deleteMany: {}, // Delete existing taxes
                    create: taxes, // Add new taxes
                },
            },
            include: {
                lineItems: true,
                taxes: true,
            },
        });
    }

    async remove(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return this.prisma.invoice.delete({
            where: { id },
        });
    }
}
