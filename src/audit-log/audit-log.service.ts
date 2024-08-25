import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.auditLog.findMany();
    }

    async findOne(id: string) {
        return this.prisma.auditLog.findUnique({
            where: { id },
        });
    }

    async findByEntityType(entityType: string) {
        return this.prisma.auditLog.findMany({
            where: { entityType },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.auditLog.findMany({
            where: { userId },
        });
    }
}
