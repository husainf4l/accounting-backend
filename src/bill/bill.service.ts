import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createBillDto: CreateBillDto) {
        return this.prisma.bill.create({
            data: {
                billNumber: createBillDto.billNumber,
                amount: createBillDto.amount,
                dueDate: createBillDto.dueDate,
                paid: createBillDto.paid || false,
                currency: createBillDto.currency,
                vendor: {
                    connect: { id: createBillDto.vendorId }, // Connect to existing vendor
                },
                company: {
                    connect: { id: createBillDto.companyId }, // Connect to existing company
                },
                lineItems: {
                    create: createBillDto.lineItems.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        itemId: item.itemId,
                        amount: item.amount,
                    })),
                },
            },
            include: {
                lineItems: true,
            },
        });
    }

    async findAll() {
        return this.prisma.bill.findMany({
            include: {
                lineItems: true, // Include line items in the response
                vendor: true, // Include related vendor data
                company: true, // Include related company data
            },
        });
    }

    async findOne(id: string) {
        const bill = await this.prisma.bill.findUnique({
            where: { id },
            include: {
                lineItems: true, // Include line items in the response
                vendor: true, // Include related vendor data
                company: true, // Include related company data
            },
        });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return bill;
    }

    async update(id: string, updateBillDto: UpdateBillDto) {
        const bill = await this.prisma.bill.findUnique({
            where: { id },
        });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return this.prisma.bill.update({
            where: { id },
            data: {
                billNumber: updateBillDto.billNumber,
                amount: updateBillDto.amount,
                dueDate: updateBillDto.dueDate,
                paid: updateBillDto.paid,
                currency: updateBillDto.currency,
                vendor: updateBillDto.vendorId ? { connect: { id: updateBillDto.vendorId } } : undefined,
                company: updateBillDto.companyId ? { connect: { id: updateBillDto.companyId } } : undefined,
                lineItems: {
                    deleteMany: {}, // Remove existing line items
                    create: updateBillDto.lineItems?.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        itemId: item.itemId,
                        amount: item.amount,
                    })),
                },
            },
            include: {
                lineItems: true,
            },
        });
    }


    async remove(id: string) {
        const bill = await this.prisma.bill.findUnique({
            where: { id },
        });

        if (!bill) {
            throw new NotFoundException('Bill not found');
        }

        return this.prisma.bill.delete({
            where: { id },
        });
    }
}
