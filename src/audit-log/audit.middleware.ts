import { Prisma, PrismaClient } from '@prisma/client';

// Middleware function to log audit data
export function auditMiddleware(prisma: PrismaClient): Prisma.Middleware {
    return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
        const result = await next(params);

        const actionsToLog = ['create', 'update', 'delete'];
        if (actionsToLog.includes(params.action)) {
            const auditEntry = {
                entityType: params.model,
                entityId: result.id || params.args.where?.id,
                action: params.action.toUpperCase(),
                changes: params.args.data,
                userId: 'system', // Replace this with actual user ID logic
                companyId: result.companyId || null,
                createdAt: new Date(),
            };

            await prisma.auditLog.create({ data: auditEntry });
        }

        return result;
    };
}
