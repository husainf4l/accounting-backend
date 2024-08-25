import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            include: { companies: true }, // Including related companies
        });
    }

    async findOne(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: { companies: true },
        });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async remove(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async assignCompany(createUserCompanyDto: CreateUserCompanyDto) {
        return this.prisma.userCompany.create({
            data: createUserCompanyDto,
        });
    }

    async findUserCompanies(userId: string) {
        return this.prisma.userCompany.findMany({
            where: { userId },
            include: { company: true },
        });
    }
}
