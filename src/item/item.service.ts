import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createItemDto: CreateItemDto) {
        const { companyId, ...rest } = createItemDto;

        return this.prisma.item.create({
            data: {
                ...rest,
                company: { connect: { id: companyId } },
            },
        });
    }

    async findAll() {
        return this.prisma.item.findMany({
            include: {
                company: true,
            },
        });
    }

    async findOne(id: string) {
        const item = await this.prisma.item.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });

        if (!item) {
            throw new NotFoundException('Item not found');
        }

        return item;
    }

    async update(id: string, updateItemDto: UpdateItemDto) {
        const { companyId, ...rest } = updateItemDto;

        return this.prisma.item.update({
            where: { id },
            data: {
                ...rest,
                ...(companyId ? { company: { connect: { id: companyId } } } : {}),
            },
        });
    }

    async remove(id: string) {
        const item = await this.prisma.item.findUnique({
            where: { id },
        });

        if (!item) {
            throw new NotFoundException('Item not found');
        }

        return this.prisma.item.delete({
            where: { id },
        });
    }
}
